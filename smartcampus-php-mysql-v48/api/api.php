<?php
$cookieLifetime = 60 * 60 * 24 * 7;
$appBasePath = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
if ($appBasePath === '') { $appBasePath = '/'; }
session_name('SMARTCAMPUS_V48_SESSION');
session_set_cookie_params([
    'lifetime' => $cookieLifetime,
    'path' => $appBasePath,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';

function json_response($payload, $status = 200) {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json() {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function fetch_all($sql, $params = []) {
    $pdo = get_pdo();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function fetch_one($sql, $params = []) {
    $pdo = get_pdo();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetch();
}

function execute_sql($sql, $params = []) {
    $pdo = get_pdo();
    $stmt = $pdo->prepare($sql);
    return $stmt->execute($params);
}

function normalize_grade_status($status) {
    if ($status === null) return 'Pas terminé';

    $status = trim((string)$status);

    if ($status === 'Validée') return 'Validé';
    if ($status === '' || in_array($status, ['En cours', 'Pas validée', 'Non validée'], true)) return 'Pas terminé';

    $allowed = ['Pas terminé', 'Validé', 'Compensé', 'Rattrapage', 'Non validé'];
    return in_array($status, $allowed, true) ? $status : 'Pas terminé';
}

function is_final_grade_status($status) {
    return in_array(normalize_grade_status($status), ['Validé', 'Compensé', 'Rattrapage', 'Non validé'], true);
}

function session_time_to_minutes($time) {
    $time = trim((string)$time);
    $parts = explode(':', $time);
    $hour = isset($parts[0]) && is_numeric($parts[0]) ? (int)$parts[0] : 0;
    $minute = isset($parts[1]) && is_numeric($parts[1]) ? (int)$parts[1] : 0;
    return ($hour * 60) + $minute;
}

function sessions_overlap_payload($a, $b) {
    if (($a['date'] ?? '') !== ($b['date'] ?? '')) return false;
    $aStart = session_time_to_minutes($a['time'] ?? '00:00');
    $aEnd = session_time_to_minutes($a['endTime'] ?? '00:00');
    $bStart = session_time_to_minutes($b['time'] ?? '00:00');
    $bEnd = session_time_to_minutes($b['endTime'] ?? '00:00');
    return $aStart < $bEnd && $bStart < $aEnd;
}

function session_payload_label($session) {
    $course = $session['courseName'] ?? ('cours #' . ($session['courseId'] ?? '?'));
    $date = $session['date'] ?? '';
    $start = substr((string)($session['time'] ?? ''), 0, 5);
    $end = substr((string)($session['endTime'] ?? ''), 0, 5);
    $room = $session['salle'] ?? '';
    return trim($course . ' ' . $date . ' ' . $start . '-' . $end . ' salle ' . $room);
}

function allowed_semesters_for_level($level) {
    $map = [
        'ING1' => ['S1', 'S2'],
        'ING2' => ['S3', 'S4'],
        'ING3' => ['S5', 'S6'],
        'ING4' => ['S7', 'S8'],
        'ING5' => ['S9', 'S10'],
    ];
    return $map[(string)$level] ?? [];
}

function is_semester_allowed_for_level($level, $semester) {
    if ($level === '' || $semester === '') return true;
    return in_array((string)$semester, allowed_semesters_for_level((string)$level), true);
}

function level_from_class_name($className) {
    $parts = explode('-', (string)$className);
    return $parts[0] ?? '';
}

function validate_schedule_constraints($data) {
    $sessions = array_values($data['courseSessions'] ?? []);

    foreach ($sessions as $session) {
        if (session_time_to_minutes($session['endTime'] ?? '00:00') <= session_time_to_minutes($session['time'] ?? '00:00')) {
            throw new Exception("Conflit horaire : l'heure de fin doit être après l'heure de début pour " . session_payload_label($session) . '.');
        }
    }

    for ($i = 0; $i < count($sessions); $i++) {
        for ($j = $i + 1; $j < count($sessions); $j++) {
            $a = $sessions[$i];
            $b = $sessions[$j];
            $sameRoom = strtolower(trim((string)($a['salle'] ?? ''))) === strtolower(trim((string)($b['salle'] ?? '')));
            if ($sameRoom && sessions_overlap_payload($a, $b)) {
                throw new Exception('Conflit salle : ' . ($a['salle'] ?? '') . ' est déjà occupée entre ' . session_payload_label($a) . ' et ' . session_payload_label($b) . '.');
            }
        }
    }

    $moduleCourseIds = [];
    foreach (($data['modules'] ?? []) as $module) {
        $moduleId = (string)($module['id'] ?? '');
        $moduleCourseIds[$moduleId] = array_values(array_unique(array_map('intval', $module['courseIds'] ?? [])));
    }

    $coursesById = [];
    foreach (($data['courses'] ?? []) as $course) {
        $courseId = (int)($course['id'] ?? 0);
        if ($courseId > 0) $coursesById[$courseId] = $course;
    }

    $modulesById = [];
    foreach (($data['modules'] ?? []) as $module) {
        $moduleId = (string)($module['id'] ?? '');
        if ($moduleId !== '') $modulesById[$moduleId] = $module;
        foreach (($module['courseIds'] ?? []) as $courseId) {
            $course = $coursesById[(int)$courseId] ?? null;
            if ($course && (string)($course['semestre'] ?? '') !== (string)($module['semestre'] ?? '')) {
                throw new Exception('Module invalide : le cours ' . ($course['nom'] ?? '') . ' doit avoir le même semestre que le module ' . ($module['nom'] ?? '') . '.');
            }
        }
    }

    $classCourseIds = [];
    foreach (($data['classEnrollments'] ?? []) as $enrollment) {
        $className = (string)($enrollment['classe'] ?? '');
        $moduleId = (string)($enrollment['moduleId'] ?? '');
        if ($className === '') continue;

        $module = $modulesById[$moduleId] ?? null;
        if ($module && !is_semester_allowed_for_level(level_from_class_name($className), (string)($module['semestre'] ?? ''))) {
            throw new Exception('Inscription module refusée : ' . $className . ' ne peut pas être inscrit à un module du semestre ' . ($module['semestre'] ?? '') . '.');
        }
        if (!isset($classCourseIds[$className])) $classCourseIds[$className] = [];
        $classCourseIds[$className] = array_values(array_unique(array_merge($classCourseIds[$className], $moduleCourseIds[$moduleId] ?? [])));
    }

    foreach ($classCourseIds as $className => $courseIds) {
        $classSessions = array_values(array_filter($sessions, function ($session) use ($courseIds) {
            return in_array((int)($session['courseId'] ?? 0), $courseIds, true);
        }));

        for ($i = 0; $i < count($classSessions); $i++) {
            for ($j = $i + 1; $j < count($classSessions); $j++) {
                $a = $classSessions[$i];
                $b = $classSessions[$j];
                if (sessions_overlap_payload($a, $b)) {
                    throw new Exception('Conflit classe : ' . $className . ' a deux cours en même temps (' . session_payload_label($a) . ' / ' . session_payload_label($b) . ').');
                }
            }
        }
    }

    $eventsById = [];
    foreach (($data['events'] ?? []) as $event) {
        $eventId = (int)($event['id'] ?? 0);
        if ($eventId <= 0) continue;

        if (session_time_to_minutes($event['endTime'] ?? '00:00') <= session_time_to_minutes($event['startTime'] ?? '00:00')) {
            throw new Exception("Conflit événement : l'heure de fin doit être après l'heure de début pour " . ($event['title'] ?? 'événement') . '.');
        }

        if ((int)($event['capacity'] ?? 0) <= 0) {
            throw new Exception('Événement invalide : la capacité doit être supérieure à 0.');
        }

        $eventsById[$eventId] = $event;
    }

    $studentsById = [];
    foreach (($data['students'] ?? []) as $student) {
        $studentId = (int)($student['id'] ?? 0);
        if ($studentId <= 0) continue;
        $studentsById[$studentId] = $student;
    }

    $registrationCounts = [];
    $seenEventRegistrations = [];

    foreach (($data['eventRegistrations'] ?? []) as $registration) {
        $eventId = (int)($registration['eventId'] ?? 0);
        $studentId = (int)($registration['studentId'] ?? 0);
        $key = $eventId . ':' . $studentId;

        if (isset($seenEventRegistrations[$key])) {
            throw new Exception('Inscription événement refusée : double inscription détectée.');
        }
        $seenEventRegistrations[$key] = true;

        $event = $eventsById[$eventId] ?? null;
        $student = $studentsById[$studentId] ?? null;
        if (!$event || !$student) continue;

        $registrationCounts[$eventId] = ($registrationCounts[$eventId] ?? 0) + 1;

        $levels = $event['eligibleLevels'] ?? [];
        if (!is_array($levels)) {
            $levels = array_values(array_filter(array_map('trim', explode(',', (string)$levels))));
        }

        if (count($levels) > 0 && !in_array((string)($student['niveau'] ?? ''), $levels, true)) {
            throw new Exception('Inscription événement refusée : ' . ($student['nom'] ?? 'étudiant') . ' n’a pas la qualification demandée.');
        }

        $className = trim((string)($student['niveau'] ?? '') . '-' . (string)($student['groupe'] ?? ''), '-');
        $studentCourseIds = $classCourseIds[$className] ?? array_values(array_unique(array_map('intval', $student['courseIds'] ?? [])));

        if (!empty($event['courseId']) && !in_array((int)$event['courseId'], $studentCourseIds, true)) {
            throw new Exception('Inscription événement refusée : ' . ($student['nom'] ?? 'étudiant') . ' n’est pas inscrit au cours lié.');
        }

        $eventSlot = [
            'courseName' => $event['title'] ?? 'Événement',
            'date' => $event['date'] ?? '',
            'time' => $event['startTime'] ?? '00:00',
            'endTime' => $event['endTime'] ?? '00:00',
            'salle' => $event['lieu'] ?? ''
        ];

        foreach ($sessions as $session) {
            if (!in_array((int)($session['courseId'] ?? 0), $studentCourseIds, true)) continue;
            if (sessions_overlap_payload($session, $eventSlot)) {
                throw new Exception('Conflit horaire : ' . ($student['nom'] ?? 'étudiant') . ' a cours en même temps que l’événement ' . ($event['title'] ?? '') . '.');
            }
        }
    }

    foreach ($registrationCounts as $eventId => $count) {
        $capacity = (int)($eventsById[$eventId]['capacity'] ?? 0);
        if ($capacity > 0 && $count > $capacity) {
            throw new Exception('Inscription événement refusée : capacité maximale dépassée pour ' . ($eventsById[$eventId]['title'] ?? 'événement') . '.');
        }
    }
}


function repair_user_links() {
    execute_sql("
        CREATE TABLE IF NOT EXISTS absence_justifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_name VARCHAR(120) NOT NULL,
          course_name VARCHAR(160) NOT NULL,
          absence_date DATE NOT NULL,
          requested_by VARCHAR(120) NOT NULL,
          reason TEXT NULL,
          status ENUM('Demandée','Envoyée','Validée','Refusée') NOT NULL DEFAULT 'Demandée',
          justification TEXT NULL,
          submitted_at DATE NULL,
          attachment_name VARCHAR(255) NULL,
          attachment_type VARCHAR(120) NULL,
          attachment_data LONGTEXT NULL,
          admin_reply TEXT NULL,
          reviewed_by VARCHAR(120) NULL,
          reviewed_at DATE NULL,
          conversation LONGTEXT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    try { execute_sql("ALTER TABLE absence_justifications ADD COLUMN attachment_name VARCHAR(255) NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE absence_justifications ADD COLUMN attachment_type VARCHAR(120) NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE absence_justifications ADD COLUMN attachment_data LONGTEXT NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE absence_justifications ADD COLUMN admin_reply TEXT NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE absence_justifications ADD COLUMN reviewed_by VARCHAR(120) NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE absence_justifications ADD COLUMN reviewed_at DATE NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE absence_justifications ADD COLUMN conversation LONGTEXT NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE absence_justifications MODIFY COLUMN status ENUM('Demandée','Envoyée','En discussion','Validée','Refusée') NOT NULL DEFAULT 'Demandée'"); } catch (Exception $e) {}

    try { execute_sql("ALTER TABLE messages ADD COLUMN attachment_name VARCHAR(255) NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE messages ADD COLUMN attachment_type VARCHAR(120) NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE messages ADD COLUMN attachment_data LONGTEXT NULL"); } catch (Exception $e) {}

    try { execute_sql("ALTER TABLE grades ADD COLUMN grade_status VARCHAR(30) NOT NULL DEFAULT 'Pas terminé'"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE grades ADD COLUMN grade_locked TINYINT(1) NOT NULL DEFAULT 0"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE grades ADD COLUMN suivi_weight DECIMAL(5,2) NOT NULL DEFAULT 20"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE grades ADD COLUMN ds_weight DECIMAL(5,2) NOT NULL DEFAULT 40"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE grades ADD COLUMN projet_weight DECIMAL(5,2) NOT NULL DEFAULT 40"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE modules ADD COLUMN coefficient DECIMAL(5,2) NOT NULL DEFAULT 1"); } catch (Exception $e) {}
    try { execute_sql("UPDATE grades SET grade_status = 'Validé' WHERE (grade_status = '' OR grade_status IS NULL OR grade_status = 'Pas terminé') AND validated = 1"); } catch (Exception $e) {}
    try { execute_sql("UPDATE grades SET grade_status = 'Pas terminé' WHERE grade_status = '' OR grade_status IS NULL OR grade_status IN ('En cours','Pas validée','Non validée')"); } catch (Exception $e) {}
    try { execute_sql("UPDATE grades SET grade_locked = CASE WHEN grade_status IN ('Validé','Compensé','Rattrapage','Non validé') THEN 1 ELSE 0 END"); } catch (Exception $e) {}

    execute_sql("
        CREATE TABLE IF NOT EXISTS grade_components (
          id INT AUTO_INCREMENT PRIMARY KEY,
          grade_id INT NOT NULL,
          category ENUM('Suivi','DS','Projet') NOT NULL,
          label VARCHAR(160) NOT NULL,
          score DECIMAL(5,2) NOT NULL DEFAULT 0,
          weight_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_grade_components_grade (grade_id),
          FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
          CONSTRAINT chk_grade_component_score CHECK (score >= 0 AND score <= 20),
          CONSTRAINT chk_grade_component_weight CHECK (weight_percent >= 0 AND weight_percent <= 100)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    execute_sql("
        CREATE TABLE IF NOT EXISTS course_sessions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          course_id INT NOT NULL,
          course_name VARCHAR(160) NOT NULL,
          session_date DATE NOT NULL,
          session_time TIME NOT NULL,
          session_end_time TIME NOT NULL,
          room VARCHAR(60) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    try { execute_sql("ALTER TABLE course_sessions ADD COLUMN session_end_time TIME NULL AFTER session_time"); } catch (Exception $e) {}
    try { execute_sql("UPDATE course_sessions SET session_end_time = ADDTIME(CAST(session_time AS TIME), '02:00:00') WHERE session_end_time IS NULL"); } catch (Exception $e) {}

    execute_sql("
        CREATE TABLE IF NOT EXISTS modules (
          id INT AUTO_INCREMENT PRIMARY KEY,
          code VARCHAR(40) NOT NULL UNIQUE,
          name VARCHAR(160) NOT NULL,
          semester VARCHAR(40) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    execute_sql("
        CREATE TABLE IF NOT EXISTS module_courses (
          module_id INT NOT NULL,
          course_id INT NOT NULL,
          PRIMARY KEY (module_id, course_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    execute_sql("
        CREATE TABLE IF NOT EXISTS class_module_enrollments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          class_name VARCHAR(80) NOT NULL,
          module_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_class_module (class_name, module_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    execute_sql("
        CREATE TABLE IF NOT EXISTS events (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(160) NOT NULL,
          event_date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          location VARCHAR(160) NOT NULL,
          capacity INT NOT NULL DEFAULT 30,
          eligible_levels VARCHAR(255) NOT NULL DEFAULT '',
          course_id INT NULL,
          description TEXT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    execute_sql("
        CREATE TABLE IF NOT EXISTS event_registrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          event_id INT NOT NULL,
          student_id INT NOT NULL,
          student_name VARCHAR(120) NOT NULL,
          registered_by VARCHAR(120) NOT NULL,
          registered_at DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_event_student (event_id, student_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    try { execute_sql("ALTER TABLE attendance_sessions ADD COLUMN course_session_id INT NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE attendance_sessions ADD COLUMN session_label VARCHAR(255) NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE attendance_sessions ADD COLUMN code_enabled TINYINT(1) NOT NULL DEFAULT 1"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE attendance_sessions ADD COLUMN qr_enabled TINYINT(1) NOT NULL DEFAULT 1"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE attendances ADD COLUMN course_session_id INT NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE attendances ADD COLUMN session_label VARCHAR(255) NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE absence_justifications ADD COLUMN course_session_id INT NULL"); } catch (Exception $e) {}
    try { execute_sql("ALTER TABLE absence_justifications ADD COLUMN session_label VARCHAR(255) NULL"); } catch (Exception $e) {}

    execute_sql("
        CREATE TABLE IF NOT EXISTS notification_reads (
          user_key VARCHAR(160) PRIMARY KEY,
          reads_json LONGTEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    execute_sql("
        UPDATE students s
        JOIN users u ON s.email = u.email
        SET s.user_id = u.id
        WHERE s.user_id IS NULL
    ");

    execute_sql("
        UPDATE teachers t
        JOIN users u ON t.email = u.email
        SET t.user_id = u.id
        WHERE t.user_id IS NULL
    ");
}

function list_data() {
    repair_user_links();
    $users = fetch_all("SELECT id, name AS nom, email, password, role, status AS statut FROM users ORDER BY id");

    $students = fetch_all("SELECT id, user_id, name AS nom, email, level_name AS niveau, group_name AS groupe, average AS moyenne, absences FROM students ORDER BY id");
    $enrollments = fetch_all("SELECT student_id, course_id FROM enrollments");

    $courseMap = [];
    foreach ($enrollments as $enrollment) {
        $sid = (int)$enrollment['student_id'];
        if (!isset($courseMap[$sid])) $courseMap[$sid] = [];
        $courseMap[$sid][] = (int)$enrollment['course_id'];
    }

    foreach ($students as &$student) {
        $sid = (int)$student['id'];
        $student['id'] = $sid;
        $student['courseIds'] = $courseMap[$sid] ?? [];
        $student['moyenne'] = (float)$student['moyenne'];
        $student['absences'] = (int)$student['absences'];
    }

    $teachers = fetch_all("SELECT id, user_id, name AS nom, email, department AS departement, main_course AS cours FROM teachers ORDER BY id");
    foreach ($teachers as &$teacher) $teacher['id'] = (int)$teacher['id'];

    $courses = fetch_all("
        SELECT
            c.id,
            c.code,
            c.name AS nom,
            c.teacher_name AS enseignant,
            c.semester AS semestre,
            c.capacity AS capacite,
            COUNT(e.id) AS inscrits,
            c.room AS salle,
            c.schedule_time AS horaire
        FROM courses c
        LEFT JOIN enrollments e ON e.course_id = c.id
        GROUP BY c.id, c.code, c.name, c.teacher_name, c.semester, c.capacity, c.room, c.schedule_time
        ORDER BY c.id
    ");

    foreach ($courses as &$course) {
        $course['id'] = (int)$course['id'];
        $course['capacite'] = (int)$course['capacite'];
        $course['inscrits'] = (int)$course['inscrits'];
    }

    $courseSessions = fetch_all("
        SELECT id, course_id AS courseId, course_name AS courseName, session_date AS date,
               TIME_FORMAT(session_time, '%H:%i') AS time,
               TIME_FORMAT(session_end_time, '%H:%i') AS endTime,
               room AS salle
        FROM course_sessions
        ORDER BY session_date, session_time
    ");

    foreach ($courseSessions as &$session) {
        $session['id'] = (int)$session['id'];
        $session['courseId'] = (int)$session['courseId'];
    }

    $modules = fetch_all("SELECT id, code, name AS nom, semester AS semestre, coefficient FROM modules ORDER BY id");
    $moduleCourseRows = fetch_all("SELECT module_id, course_id FROM module_courses ORDER BY module_id, course_id");
    $moduleCourseMap = [];
    foreach ($moduleCourseRows as $row) {
        $mid = (int)$row['module_id'];
        if (!isset($moduleCourseMap[$mid])) $moduleCourseMap[$mid] = [];
        $moduleCourseMap[$mid][] = (int)$row['course_id'];
    }
    foreach ($modules as &$module) {
        $mid = (int)$module['id'];
        $module['id'] = $mid;
        $module['coefficient'] = (float)($module['coefficient'] ?? 1);
        $module['courseIds'] = $moduleCourseMap[$mid] ?? [];
    }

    $classEnrollments = fetch_all("SELECT id, class_name AS classe, module_id AS moduleId FROM class_module_enrollments ORDER BY id");
    foreach ($classEnrollments as &$enrollment) {
        $enrollment['id'] = (int)$enrollment['id'];
        $enrollment['moduleId'] = (int)$enrollment['moduleId'];
    }

    $events = fetch_all("
        SELECT id, title, event_date AS date,
               TIME_FORMAT(start_time, '%H:%i') AS startTime,
               TIME_FORMAT(end_time, '%H:%i') AS endTime,
               location AS lieu, capacity, eligible_levels AS eligibleLevels, course_id AS courseId, description
        FROM events
        ORDER BY event_date, start_time, id
    ");
    foreach ($events as &$event) {
        $event['id'] = (int)$event['id'];
        $event['capacity'] = (int)$event['capacity'];
        $event['courseId'] = $event['courseId'] !== null && $event['courseId'] !== '' ? (int)$event['courseId'] : '';
        $levels = array_filter(array_map('trim', explode(',', (string)$event['eligibleLevels'])));
        $event['eligibleLevels'] = array_values($levels);
        if ($event['description'] === null) $event['description'] = '';
    }

    $eventRegistrations = fetch_all("
        SELECT id, event_id AS eventId, student_id AS studentId, student_name AS studentName, registered_by AS registeredBy, registered_at AS registeredAt
        FROM event_registrations
        ORDER BY id
    ");
    foreach ($eventRegistrations as &$registration) {
        $registration['id'] = (int)$registration['id'];
        $registration['eventId'] = (int)$registration['eventId'];
        $registration['studentId'] = (int)$registration['studentId'];
    }

    $grades = fetch_all("SELECT id, student_name AS etudiant, course_name AS cours, suivi, ds, projet, grade_status AS statut, grade_locked AS locked, suivi_weight AS suiviWeight, ds_weight AS dsWeight, projet_weight AS projetWeight FROM grades ORDER BY id");
    $gradeComponentRows = fetch_all("
        SELECT id, grade_id AS gradeId, category, label, score, weight_percent AS weight
        FROM grade_components
        ORDER BY grade_id, id
    ");
    $gradeComponents = [];
    foreach ($gradeComponentRows as $component) {
        $gid = (int)$component['gradeId'];
        if (!isset($gradeComponents[$gid])) $gradeComponents[$gid] = [];
        $gradeComponents[$gid][] = [
            'id' => (int)$component['id'],
            'category' => $component['category'],
            'label' => $component['label'],
            'score' => (float)$component['score'],
            'weight' => (float)$component['weight'],
        ];
    }

    foreach ($grades as &$grade) {
        $grade['id'] = (int)$grade['id'];
        $grade['suivi'] = (float)$grade['suivi'];
        $grade['ds'] = (float)$grade['ds'];
        $grade['projet'] = (float)$grade['projet'];
        $grade['suiviWeight'] = (float)($grade['suiviWeight'] ?? 20);
        $grade['dsWeight'] = (float)($grade['dsWeight'] ?? 40);
        $grade['projetWeight'] = (float)($grade['projetWeight'] ?? 40);
        $grade['categoryWeights'] = [
            'Suivi' => $grade['suiviWeight'],
            'DS' => $grade['dsWeight'],
            'Projet' => $grade['projetWeight'],
        ];
        $grade['statut'] = normalize_grade_status($grade['statut']);
        $grade['locked'] = is_final_grade_status($grade['statut']);
        $grade['grade_locked'] = $grade['locked'] ? 1 : 0;
        $grade['valide'] = in_array($grade['statut'], ['Validé', 'Compensé'], true);
        $grade['components'] = $gradeComponents[$grade['id']] ?? [];
    }

    $messages = fetch_all("
        SELECT id, from_name AS `from`, to_name AS `to`, subject AS sujet, content AS contenu,
               attachment_name AS attachmentName,
               attachment_type AS attachmentType,
               attachment_data AS attachmentData
        FROM messages
        ORDER BY id
    ");

    foreach ($messages as &$message) {
        $message['id'] = (int)$message['id'];
        if ($message['attachmentName'] === null) $message['attachmentName'] = "";
        if ($message['attachmentType'] === null) $message['attachmentType'] = "";
        if ($message['attachmentData'] === null) $message['attachmentData'] = "";
    }

    $attendanceSessions = fetch_all("
        SELECT id, code, course_session_id AS sessionId, session_label AS seance,
               course_name AS cours, teacher_name AS enseignant, session_date AS date, active AS actif,
               code_enabled AS codeEnabled, qr_enabled AS qrEnabled
        FROM attendance_sessions
        ORDER BY id
    ");
    foreach ($attendanceSessions as &$session) {
        $session['id'] = (int)$session['id'];
        $session['sessionId'] = $session['sessionId'] !== null ? (int)$session['sessionId'] : "";
        $session['actif'] = (bool)$session['actif'];
        $session['codeEnabled'] = isset($session['codeEnabled']) ? (bool)$session['codeEnabled'] : true;
        $session['qrEnabled'] = isset($session['qrEnabled']) ? (bool)$session['qrEnabled'] : true;
        if ($session['seance'] === null) $session['seance'] = "";
    }

    $attendances = fetch_all("
        SELECT id, course_session_id AS sessionId, session_label AS seance,
               student_name AS etudiant, course_name AS cours, attendance_date AS date,
               status AS statut, method AS methode
        FROM attendances
        ORDER BY id
    ");
    foreach ($attendances as &$attendance) {
        $attendance['id'] = (int)$attendance['id'];
        $attendance['sessionId'] = $attendance['sessionId'] !== null ? (int)$attendance['sessionId'] : "";
        if ($attendance['seance'] === null) $attendance['seance'] = "";
    }

    $absenceJustifications = fetch_all("
        SELECT id, course_session_id AS sessionId, session_label AS seance,
               student_name AS etudiant, course_name AS cours, absence_date AS date,
               requested_by AS requestedBy, reason AS motif, status AS statut,
               justification, submitted_at AS submittedAt,
               attachment_name AS attachmentName,
               attachment_type AS attachmentType,
               attachment_data AS attachmentData,
               admin_reply AS adminReply,
               reviewed_by AS reviewedBy,
               reviewed_at AS reviewedAt,
               conversation
        FROM absence_justifications
        ORDER BY id
    ");
    foreach ($absenceJustifications as &$request) {
        $request['id'] = (int)$request['id'];
        $request['sessionId'] = $request['sessionId'] !== null ? (int)$request['sessionId'] : "";
        if ($request['seance'] === null) $request['seance'] = "";
        if ($request['submittedAt'] === null) $request['submittedAt'] = "";
        if ($request['reviewedAt'] === null) $request['reviewedAt'] = "";
        if ($request['adminReply'] === null) $request['adminReply'] = "";
        if ($request['reviewedBy'] === null) $request['reviewedBy'] = "";
        if ($request['attachmentName'] === null) $request['attachmentName'] = "";
        if ($request['attachmentType'] === null) $request['attachmentType'] = "";
        if ($request['attachmentData'] === null) $request['attachmentData'] = "";
        $decodedConversation = [];
        if (!empty($request['conversation'])) {
            $decodedConversation = json_decode($request['conversation'], true);
            if (!is_array($decodedConversation)) $decodedConversation = [];
        }
        $request['conversation'] = $decodedConversation;
    }

    foreach ($users as &$user) $user['id'] = (int)$user['id'];

    return [
        'users' => $users,
        'students' => $students,
        'teachers' => $teachers,
        'courses' => $courses,
        'courseSessions' => $courseSessions,
        'modules' => $modules,
        'classEnrollments' => $classEnrollments,
        'grades' => $grades,
        'messages' => $messages,
        'attendanceSessions' => $attendanceSessions,
        'attendances' => $attendances,
        'absenceJustifications' => $absenceJustifications,
        'events' => $events,
        'eventRegistrations' => $eventRegistrations,
    ];
}

function save_all($data) {
    validate_schedule_constraints($data);
    repair_user_links();
    // Le statut reste modifiable. Les notes ne sont protégées que si l'ancien ET le nouveau statut sont finaux.
    // Repasser le statut à « Pas terminé » déverrouille la ligne.
    $existingGradeRows = fetch_all("SELECT id, suivi, ds, projet, grade_status, suivi_weight AS suiviWeight, ds_weight AS dsWeight, projet_weight AS projetWeight FROM grades");
    $existingGrades = [];
    foreach ($existingGradeRows as $existingGrade) {
        $existingGrades[(string)$existingGrade['id']] = $existingGrade;
    }

    $existingComponentRows = fetch_all("SELECT id, grade_id AS gradeId, category, label, score, weight_percent AS weight FROM grade_components ORDER BY grade_id, id");
    $existingComponents = [];
    foreach ($existingComponentRows as $component) {
        $gid = (string)$component['gradeId'];
        if (!isset($existingComponents[$gid])) $existingComponents[$gid] = [];
        $existingComponents[$gid][] = [
            'id' => (int)$component['id'],
            'category' => $component['category'],
            'label' => $component['label'],
            'score' => (float)$component['score'],
            'weight' => (float)$component['weight'],
        ];
    }

    $pdo = get_pdo();
    $pdo->beginTransaction();

    try {
        $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
        foreach (['event_registrations','events','class_module_enrollments','module_courses','enrollments','course_sessions','absence_justifications','attendances','attendance_sessions','messages','grade_components','grades','modules','courses','teachers','students','users'] as $table) {
            $pdo->exec("DELETE FROM `$table`");
        }

        foreach (($data['users'] ?? []) as $user) {
            execute_sql("INSERT INTO users (id, name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)", [
                $user['id'] ?? null,
                $user['nom'] ?? '',
                $user['email'] ?? '',
                $user['password'] ?? '1234',
                $user['role'] ?? 'Étudiant',
                $user['statut'] ?? 'Actif',
            ]);
        }

        foreach (($data['students'] ?? []) as $student) {
            execute_sql("INSERT INTO students (id, user_id, name, email, level_name, group_name, average, absences) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
                $student['id'] ?? null,
                $student['user_id'] ?? (fetch_one("SELECT id FROM users WHERE email = ? LIMIT 1", [$student['email'] ?? ''])['id'] ?? null),
                $student['nom'] ?? '',
                $student['email'] ?? '',
                $student['niveau'] ?? '',
                $student['groupe'] ?? '',
                $student['moyenne'] ?? 0,
                $student['absences'] ?? 0,
            ]);

            foreach (($student['courseIds'] ?? []) as $courseId) {
                execute_sql("INSERT IGNORE INTO enrollments (student_id, course_id) VALUES (?, ?)", [$student['id'], $courseId]);
            }
        }

        foreach (($data['teachers'] ?? []) as $teacher) {
            execute_sql("INSERT INTO teachers (id, user_id, name, email, department, main_course) VALUES (?, ?, ?, ?, ?, ?)", [
                $teacher['id'] ?? null,
                $teacher['user_id'] ?? (fetch_one("SELECT id FROM users WHERE email = ? LIMIT 1", [$teacher['email'] ?? ''])['id'] ?? null),
                $teacher['nom'] ?? '',
                $teacher['email'] ?? '',
                $teacher['departement'] ?? '',
                $teacher['cours'] ?? '',
            ]);
        }

        foreach (($data['courses'] ?? []) as $course) {
            execute_sql("INSERT INTO courses (id, code, name, teacher_name, semester, capacity, registered, room, schedule_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                $course['id'] ?? null,
                $course['code'] ?? '',
                $course['nom'] ?? '',
                $course['enseignant'] ?? '',
                $course['semestre'] ?? '',
                $course['capacite'] ?? 0,
                0,
                $course['salle'] ?? '',
                $course['horaire'] ?? '',
            ]);
        }

        foreach (($data['modules'] ?? []) as $module) {
            execute_sql("INSERT INTO modules (id, code, name, semester, coefficient) VALUES (?, ?, ?, ?, ?)", [
                $module['id'] ?? null,
                $module['code'] ?? '',
                $module['nom'] ?? '',
                $module['semestre'] ?? '',
                max(0, (float)($module['coefficient'] ?? 1)),
            ]);

            foreach (($module['courseIds'] ?? []) as $courseId) {
                execute_sql("INSERT IGNORE INTO module_courses (module_id, course_id) VALUES (?, ?)", [$module['id'], $courseId]);
            }
        }

        foreach (($data['classEnrollments'] ?? []) as $enrollment) {
            execute_sql("INSERT INTO class_module_enrollments (id, class_name, module_id) VALUES (?, ?, ?)", [
                $enrollment['id'] ?? null,
                $enrollment['classe'] ?? '',
                $enrollment['moduleId'] ?? 0,
            ]);
        }

        foreach (($data['events'] ?? []) as $event) {
            $levels = $event['eligibleLevels'] ?? [];
            if (is_array($levels)) {
                $levels = implode(',', array_filter(array_map('trim', $levels)));
            }

            execute_sql("
                INSERT INTO events (id, title, event_date, start_time, end_time, location, capacity, eligible_levels, course_id, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ", [
                $event['id'] ?? null,
                $event['title'] ?? '',
                $event['date'] ?? date('Y-m-d'),
                $event['startTime'] ?? '09:00',
                $event['endTime'] ?? '11:00',
                $event['lieu'] ?? '',
                $event['capacity'] ?? 0,
                $levels,
                !empty($event['courseId']) ? $event['courseId'] : null,
                $event['description'] ?? '',
            ]);
        }

        foreach (($data['eventRegistrations'] ?? []) as $registration) {
            execute_sql("
                INSERT IGNORE INTO event_registrations (id, event_id, student_id, student_name, registered_by, registered_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ", [
                $registration['id'] ?? null,
                $registration['eventId'] ?? 0,
                $registration['studentId'] ?? 0,
                $registration['studentName'] ?? '',
                $registration['registeredBy'] ?? 'Administration',
                $registration['registeredAt'] ?? date('Y-m-d'),
            ]);
        }

        foreach (($data['courseSessions'] ?? []) as $session) {
            execute_sql("
                INSERT INTO course_sessions (id, course_id, course_name, session_date, session_time, session_end_time, room)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ", [
                $session['id'] ?? null,
                $session['courseId'] ?? 0,
                $session['courseName'] ?? '',
                $session['date'] ?? date('Y-m-d'),
                $session['time'] ?? '09:00',
                $session['endTime'] ?? '11:00',
                $session['salle'] ?? '',
            ]);
        }

        foreach (($data['grades'] ?? []) as $grade) {
            $gradeId = (string)($grade['id'] ?? '');
            $status = normalize_grade_status($grade['statut'] ?? 'Pas terminé');
            $locked = is_final_grade_status($status) ? 1 : 0;
            $existingGrade = $existingGrades[$gradeId] ?? null;

            $suivi = $grade['suivi'] ?? 0;
            $ds = $grade['ds'] ?? 0;
            $projet = $grade['projet'] ?? 0;
            $categoryWeights = is_array($grade['categoryWeights'] ?? null) ? $grade['categoryWeights'] : [];
            $suiviWeight = max(0, min(100, (float)($grade['suiviWeight'] ?? ($categoryWeights['Suivi'] ?? 20))));
            $dsWeight = max(0, min(100, (float)($grade['dsWeight'] ?? ($categoryWeights['DS'] ?? 40))));
            $projetWeight = max(0, min(100, (float)($grade['projetWeight'] ?? ($categoryWeights['Projet'] ?? 40))));
            $components = is_array($grade['components'] ?? null) ? $grade['components'] : [];

            if ($existingGrade && is_final_grade_status($existingGrade['grade_status']) && is_final_grade_status($status)) {
                $suivi = $existingGrade['suivi'];
                $ds = $existingGrade['ds'];
                $projet = $existingGrade['projet'];
                $suiviWeight = $existingGrade['suiviWeight'] ?? $suiviWeight;
                $dsWeight = $existingGrade['dsWeight'] ?? $dsWeight;
                $projetWeight = $existingGrade['projetWeight'] ?? $projetWeight;
                $components = $existingComponents[$gradeId] ?? [];
            }

            execute_sql("INSERT INTO grades (id, student_name, course_name, suivi, ds, projet, grade_status, grade_locked, suivi_weight, ds_weight, projet_weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                $grade['id'] ?? null,
                $grade['etudiant'] ?? '',
                $grade['cours'] ?? '',
                $suivi,
                $ds,
                $projet,
                $status,
                $locked,
                $suiviWeight,
                $dsWeight,
                $projetWeight,
            ]);

            foreach ($components as $component) {
                $category = $component['category'] ?? 'Suivi';
                if (!in_array($category, ['Suivi', 'DS', 'Projet'], true)) $category = 'Suivi';
                execute_sql("
                    INSERT INTO grade_components (grade_id, category, label, score, weight_percent)
                    VALUES (?, ?, ?, ?, ?)
                ", [
                    $grade['id'] ?? null,
                    $category,
                    $component['label'] ?? '',
                    max(0, min(20, (float)($component['score'] ?? 0))),
                    max(0, min(100, (float)($component['weight'] ?? 0))),
                ]);
            }
        }

        foreach (($data['messages'] ?? []) as $message) {
            execute_sql("
                INSERT INTO messages
                (id, from_name, to_name, subject, content, attachment_name, attachment_type, attachment_data)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ", [
                $message['id'] ?? null,
                $message['from'] ?? '',
                $message['to'] ?? '',
                $message['sujet'] ?? '',
                $message['contenu'] ?? '',
                $message['attachmentName'] ?? '',
                $message['attachmentType'] ?? '',
                $message['attachmentData'] ?? '',
            ]);
        }

        foreach (($data['attendanceSessions'] ?? []) as $session) {
            execute_sql("
                INSERT INTO attendance_sessions
                (id, code, course_session_id, session_label, course_name, teacher_name, session_date, active, code_enabled, qr_enabled)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ", [
                $session['id'] ?? null,
                $session['code'] ?? '',
                !empty($session['sessionId']) ? $session['sessionId'] : null,
                $session['seance'] ?? '',
                $session['cours'] ?? '',
                $session['enseignant'] ?? '',
                $session['date'] ?? date('Y-m-d'),
                !empty($session['actif']) ? 1 : 0,
                array_key_exists('codeEnabled', $session) ? (!empty($session['codeEnabled']) ? 1 : 0) : 1,
                array_key_exists('qrEnabled', $session) ? (!empty($session['qrEnabled']) ? 1 : 0) : 1,
            ]);
        }

        execute_sql("
            UPDATE courses c
            SET registered = (
                SELECT COUNT(*)
                FROM enrollments e
                WHERE e.course_id = c.id
            )
        ");

        foreach (($data['attendances'] ?? []) as $attendance) {
            execute_sql("
                INSERT INTO attendances
                (id, course_session_id, session_label, student_name, course_name, attendance_date, status, method)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ", [
                $attendance['id'] ?? null,
                !empty($attendance['sessionId']) ? $attendance['sessionId'] : null,
                $attendance['seance'] ?? '',
                $attendance['etudiant'] ?? '',
                $attendance['cours'] ?? '',
                $attendance['date'] ?? date('Y-m-d'),
                $attendance['statut'] ?? 'Présent',
                $attendance['methode'] ?? 'Manuel',
            ]);
        }

        foreach (($data['absenceJustifications'] ?? []) as $request) {
            execute_sql("
                INSERT INTO absence_justifications
                (id, course_session_id, session_label, student_name, course_name, absence_date, requested_by, reason, status, justification, submitted_at, attachment_name, attachment_type, attachment_data, admin_reply, reviewed_by, reviewed_at, conversation)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ", [
                $request['id'] ?? null,
                !empty($request['sessionId']) ? $request['sessionId'] : null,
                $request['seance'] ?? '',
                $request['etudiant'] ?? '',
                $request['cours'] ?? '',
                $request['date'] ?? date('Y-m-d'),
                $request['requestedBy'] ?? 'Administration',
                $request['motif'] ?? '',
                $request['statut'] ?? 'Demandée',
                $request['justification'] ?? '',
                !empty($request['submittedAt']) ? $request['submittedAt'] : null,
                $request['attachmentName'] ?? '',
                $request['attachmentType'] ?? '',
                $request['attachmentData'] ?? '',
                $request['adminReply'] ?? '',
                $request['reviewedBy'] ?? '',
                !empty($request['reviewedAt']) ? $request['reviewedAt'] : null,
                json_encode($request['conversation'] ?? [], JSON_UNESCAPED_UNICODE),
            ]);
        }

        $pdo->exec("SET FOREIGN_KEY_CHECKS=1");
        if ($pdo->inTransaction()) { $pdo->commit(); }
    } catch (Exception $e) {
        if ($pdo->inTransaction()) { $pdo->rollBack(); }
        throw $e;
    }
}


function get_session_user() {
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $user = fetch_one("SELECT id, name AS nom, email, role, status AS statut FROM users WHERE id = ? LIMIT 1", [$_SESSION['user_id']]);

    if (!$user || $user['statut'] !== 'Actif') {
        unset($_SESSION['user_id']);
        return null;
    }

    $user['id'] = (int)$user['id'];
    return $user;
}

try {
    $action = $_GET['action'] ?? '';

    if ($action === 'list_data') {
        json_response(['ok' => true, 'data' => list_data()]);
    }

    if ($action === 'current_user') {
        json_response(['ok' => true, 'user' => get_session_user()]);
    }

    if ($action === 'login') {
        $input = read_json();
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        $user = fetch_one("SELECT id, name AS nom, email, password, role, status AS statut FROM users WHERE email = ? LIMIT 1", [$email]);

        if (!$user || $user['statut'] !== 'Actif' || $user['password'] !== $password) {
            json_response(['ok' => false, 'error' => 'Email ou mot de passe incorrect.'], 401);
        }

        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        unset($user['password']);
        $user['id'] = (int)$user['id'];
        json_response(['ok' => true, 'user' => $user]);
    }

    if ($action === 'logout') {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', $params['secure'] ?? false, $params['httponly'] ?? true);
        }
        session_destroy();
        json_response(['ok' => true]);
    }

    if ($action === 'get_notification_reads') {
        $userKey = $_GET['userKey'] ?? '';

        if ($userKey === '') {
            json_response([
                'ok' => false,
                'error' => 'userKey manquant.'
            ], 400);
        }

        $row = fetch_one("SELECT reads_json FROM notification_reads WHERE user_key = ? LIMIT 1", [$userKey]);
        $reads = ['messages' => new stdClass(), 'justifications' => new stdClass()];

        if ($row && !empty($row['reads_json'])) {
            $decoded = json_decode($row['reads_json'], true);
            if (is_array($decoded)) {
                $reads = $decoded;
            }
        }

        json_response([
            'ok' => true,
            'reads' => $reads
        ]);
    }

    if ($action === 'save_notification_reads') {
        $input = read_json();
        $userKey = $input['userKey'] ?? '';
        $reads = $input['reads'] ?? [];

        if ($userKey === '') {
            json_response([
                'ok' => false,
                'error' => 'userKey manquant.'
            ], 400);
        }

        execute_sql("
            INSERT INTO notification_reads (user_key, reads_json)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE reads_json = VALUES(reads_json)
        ", [
            $userKey,
            json_encode($reads, JSON_UNESCAPED_UNICODE)
        ]);

        json_response([
            'ok' => true
        ]);
    }

    if ($action === 'save_all') {
        $input = read_json();
        $data = $input['data'] ?? null;

        if (!is_array($data)) json_response(['ok' => false, 'error' => 'Données invalides.'], 400);

        save_all($data);
        json_response(['ok' => true, 'data' => list_data()]);
    }

    json_response(['ok' => false, 'error' => 'Action API inconnue.'], 404);

} catch (PDOException $e) {
    json_response(['ok' => false, 'error' => 'Erreur MySQL : ' . $e->getMessage()], 500);
} catch (Exception $e) {
    json_response(['ok' => false, 'error' => 'Erreur serveur : ' . $e->getMessage()], 500);
}
?>
