CREATE DATABASE IF NOT EXISTS smartcampus_v48
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE smartcampus_v48;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notification_reads;
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS class_module_enrollments;
DROP TABLE IF EXISTS module_courses;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS absence_justifications;
DROP TABLE IF EXISTS attendances;
DROP TABLE IF EXISTS attendance_sessions;
DROP TABLE IF EXISTS course_sessions;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS grade_components;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Administrateur','Étudiant','Enseignant') NOT NULL,
  status ENUM('Actif','Inactif') NOT NULL DEFAULT 'Actif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  level_name VARCHAR(50) NOT NULL,
  group_name VARCHAR(50) NOT NULL,
  average DECIMAL(5,2) DEFAULT 0,
  absences INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  department VARCHAR(120) NOT NULL,
  main_course VARCHAR(120) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) NOT NULL,
  name VARCHAR(160) NOT NULL,
  teacher_name VARCHAR(120) NOT NULL,
  semester VARCHAR(40) NOT NULL,
  capacity INT NOT NULL,
  registered INT NOT NULL DEFAULT 0,
  room VARCHAR(60) NOT NULL DEFAULT 'Voir séances',
  schedule_time VARCHAR(120) NOT NULL DEFAULT 'Voir séances'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  semester VARCHAR(40) NOT NULL,
  coefficient DECIMAL(5,2) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE module_courses (
  module_id INT NOT NULL,
  course_id INT NOT NULL,
  PRIMARY KEY (module_id, course_id),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE class_module_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_name VARCHAR(80) NOT NULL,
  module_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_class_module (class_name, module_id),
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE events (
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE event_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  student_id INT NOT NULL,
  student_name VARCHAR(120) NOT NULL,
  registered_by VARCHAR(120) NOT NULL,
  registered_at DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_event_student (event_id, student_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE course_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  course_name VARCHAR(160) NOT NULL,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  session_end_time TIME NOT NULL,
  room VARCHAR(60) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_course_sessions_course (course_id),
  INDEX idx_course_sessions_slot (session_date, session_time, session_end_time, room),
  CONSTRAINT chk_session_end_after_start CHECK (session_end_time > session_time),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(120) NOT NULL,
  course_name VARCHAR(160) NOT NULL,
  suivi DECIMAL(5,2) NOT NULL DEFAULT 0,
  ds DECIMAL(5,2) NOT NULL DEFAULT 0,
  projet DECIMAL(5,2) NOT NULL DEFAULT 0,
  grade_status VARCHAR(30) NOT NULL DEFAULT 'Pas terminé',
  grade_locked TINYINT(1) NOT NULL DEFAULT 0,
  suivi_weight DECIMAL(5,2) NOT NULL DEFAULT 20,
  ds_weight DECIMAL(5,2) NOT NULL DEFAULT 40,
  projet_weight DECIMAL(5,2) NOT NULL DEFAULT 40,
  CONSTRAINT chk_suivi_0_20 CHECK (suivi >= 0 AND suivi <= 20),
  CONSTRAINT chk_ds_0_20 CHECK (ds >= 0 AND ds <= 20),
  CONSTRAINT chk_projet_0_20 CHECK (projet >= 0 AND projet <= 20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE grade_components (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_name VARCHAR(120) NOT NULL,
  to_name VARCHAR(120) NOT NULL,
  subject VARCHAR(160) NOT NULL,
  content TEXT NOT NULL,
  attachment_name VARCHAR(255) NULL,
  attachment_type VARCHAR(120) NULL,
  attachment_data LONGTEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE attendance_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL DEFAULT '',
  course_session_id INT NULL,
  session_label VARCHAR(255) NULL,
  course_name VARCHAR(160) NOT NULL,
  teacher_name VARCHAR(120) NOT NULL,
  session_date DATE NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  code_enabled TINYINT(1) NOT NULL DEFAULT 1,
  qr_enabled TINYINT(1) NOT NULL DEFAULT 1,
  INDEX idx_attendance_sessions_course_session (course_session_id),
  FOREIGN KEY (course_session_id) REFERENCES course_sessions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE attendances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_session_id INT NULL,
  session_label VARCHAR(255) NULL,
  student_name VARCHAR(120) NOT NULL,
  course_name VARCHAR(160) NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Présent','Absent','Retard','Justifiée') NOT NULL DEFAULT 'Présent',
  method VARCHAR(80) NOT NULL,
  UNIQUE KEY unique_student_session (course_session_id, student_name),
  INDEX idx_attendances_course_session (course_session_id),
  FOREIGN KEY (course_session_id) REFERENCES course_sessions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE absence_justifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_session_id INT NULL,
  session_label VARCHAR(255) NULL,
  student_name VARCHAR(120) NOT NULL,
  course_name VARCHAR(160) NOT NULL,
  absence_date DATE NOT NULL,
  requested_by VARCHAR(120) NOT NULL,
  reason TEXT NULL,
  status ENUM('Demandée','Envoyée','En discussion','Validée','Refusée') NOT NULL DEFAULT 'Demandée',
  justification TEXT NULL,
  submitted_at DATE NULL,
  attachment_name VARCHAR(255) NULL,
  attachment_type VARCHAR(120) NULL,
  attachment_data LONGTEXT NULL,
  admin_reply TEXT NULL,
  reviewed_by VARCHAR(120) NULL,
  reviewed_at DATE NULL,
  conversation LONGTEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_absence_course_session (course_session_id),
  FOREIGN KEY (course_session_id) REFERENCES course_sessions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notification_reads (
  user_key VARCHAR(160) PRIMARY KEY,
  reads_json LONGTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (id, name, email, password, role, status) VALUES
(1, 'Administrateur', 'admin', '0000', 'Administrateur', 'Actif'),
(2, 'Emma Martin', 'emma@ece.fr', '1234', 'Étudiant', 'Actif'),
(3, 'Adam Benali', 'adam@ece.fr', '1234', 'Étudiant', 'Actif'),
(4, 'Dr. Mohamed Ali', 'mohamed.ali@ece.fr', '1234', 'Enseignant', 'Actif'),
(5, 'Mme Sarah Nadi', 'sarah.nadi@ece.fr', '1234', 'Enseignant', 'Actif'),
(6, 'M. Karim Haddad', 'karim.haddad@ece.fr', '1234', 'Enseignant', 'Actif');

INSERT INTO students (id, user_id, name, email, level_name, group_name, average, absences) VALUES
(1, 2, 'Emma Martin', 'emma@ece.fr', 'ING2', 'A', 14.80, 2),
(2, 3, 'Adam Benali', 'adam@ece.fr', 'ING2', 'B', 12.60, 5);

INSERT INTO teachers (id, user_id, name, email, department, main_course) VALUES
(1, 4, 'Dr. Mohamed Ali', 'mohamed.ali@ece.fr', 'Informatique', 'Développement Web'),
(2, 5, 'Mme Sarah Nadi', 'sarah.nadi@ece.fr', 'Mathématiques', 'Statistiques'),
(3, 6, 'M. Karim Haddad', 'karim.haddad@ece.fr', 'Informatique', 'Bases de données');

INSERT INTO courses (id, code, name, teacher_name, semester, capacity, registered, room, schedule_time) VALUES
(1, 'WEB201', 'Développement Web', 'Dr. Mohamed Ali', 'S4', 30, 0, 'Voir séances', 'Voir séances'),
(2, 'MATH204', 'Statistiques', 'Mme Sarah Nadi', 'S4', 28, 0, 'Voir séances', 'Voir séances'),
(3, 'BDD202', 'Bases de données', 'M. Karim Haddad', 'S4', 32, 0, 'Voir séances', 'Voir séances');

INSERT INTO modules (id, code, name, semester, coefficient) VALUES
(1, 'MOD-WEB-BDD', 'Module Web & Bases de données', 'S4', 6),
(2, 'MOD-MATH', 'Module Mathématiques appliquées', 'S4', 4);

INSERT INTO module_courses (module_id, course_id) VALUES
(1, 1),
(1, 3),
(2, 2);

INSERT INTO class_module_enrollments (id, class_name, module_id) VALUES
(1, 'ING2-A', 1),
(2, 'ING2-B', 2);

INSERT INTO events (id, title, event_date, start_time, end_time, location, capacity, eligible_levels, course_id, description) VALUES
(1, 'Forum entreprises', '2026-06-05', '09:00:00', '12:00:00', 'Amphi ECE', 60, 'ING2,ING3,ING4,ING5', NULL, ''),
(2, 'Atelier Projet Web', '2026-06-08', '14:00:00', '16:00:00', 'Salle A203', 30, 'ING2', 1, '');

INSERT INTO event_registrations (id, event_id, student_id, student_name, registered_by, registered_at) VALUES
(1, 1, 1, 'Emma Martin', 'Emma Martin', '2026-05-31');

INSERT INTO enrollments (student_id, course_id) VALUES
(1, 1),
(1, 3),
(2, 2);

INSERT INTO course_sessions (id, course_id, course_name, session_date, session_time, session_end_time, room) VALUES
(1, 1, 'Développement Web', '2026-06-01', '14:00:00', '16:00:00', 'A203'),
(2, 1, 'Développement Web', '2026-06-03', '16:00:00', '18:00:00', 'A203'),
(3, 1, 'Développement Web', '2026-06-10', '16:00:00', '18:00:00', 'A203'),
(4, 2, 'Statistiques', '2026-06-02', '10:30:00', '12:00:00', 'B102'),
(5, 3, 'Bases de données', '2026-06-01', '16:00:00', '18:00:00', 'C104');

INSERT INTO grades (id, student_name, course_name, suivi, ds, projet, grade_status, grade_locked, suivi_weight, ds_weight, projet_weight) VALUES
(1, 'Emma Martin', 'Développement Web', 15, 14, 17, 'Pas terminé', 0, 20, 40, 40),
(2, 'Emma Martin', 'Bases de données', 14, 15, 16, 'Pas terminé', 0, 20, 40, 40),
(3, 'Adam Benali', 'Statistiques', 12, 13, 11, 'Pas terminé', 0, 20, 40, 40);

INSERT INTO grade_components (id, grade_id, category, label, score, weight_percent) VALUES
(1, 1, 'Suivi', 'Contrôle continu', 15, 100),
(2, 1, 'DS', 'DS principal', 14, 100),
(3, 1, 'Projet', 'Projet final', 17, 100),
(4, 2, 'Suivi', 'TP SQL', 14, 100),
(5, 2, 'DS', 'DS normalisation', 15, 100),
(6, 2, 'Projet', 'Mini-projet BDD', 16, 100),
(7, 3, 'Suivi', 'Quiz', 12, 100),
(8, 3, 'DS', 'DS probabilités', 13, 100),
(9, 3, 'Projet', 'Étude statistique', 11, 100);

INSERT INTO messages (id, from_name, to_name, subject, content, attachment_name, attachment_type, attachment_data) VALUES
(1, 'Administration', 'Tous', 'Bienvenue sur SmartCampus', 'La plateforme est ouverte pour la démonstration.', '', '', ''),
(2, 'Dr. Mohamed Ali', 'Emma Martin', 'Projet Web', 'Pensez à valider votre rendu GitHub.', '', '', '');

INSERT INTO attendance_sessions (id, code, course_session_id, session_label, course_name, teacher_name, session_date, active, code_enabled, qr_enabled) VALUES
(1, '12345', 1, 'lundi 01 juin 2026 14h00 - 16h00 — Salle A203', 'Développement Web', 'Dr. Mohamed Ali', '2026-06-01', 1, 1, 1);

INSERT INTO attendances (id, course_session_id, session_label, student_name, course_name, attendance_date, status, method) VALUES
(1, 1, 'lundi 01 juin 2026 14h00 - 16h00 — Salle A203', 'Emma Martin', 'Développement Web', '2026-06-01', 'Présent', 'Code QR'),
(2, 4, 'mardi 02 juin 2026 10h30 - 12h00 — Salle B102', 'Adam Benali', 'Statistiques', '2026-06-02', 'Absent', 'Manuel');

INSERT INTO absence_justifications
(id, course_session_id, session_label, student_name, course_name, absence_date, requested_by, reason, status, justification, submitted_at,
 attachment_name, attachment_type, attachment_data, admin_reply, reviewed_by, reviewed_at, conversation)
VALUES
(1, 4, 'mardi 02 juin 2026 10h30 - 12h00 — Salle B102', 'Adam Benali', 'Statistiques', '2026-06-02', 'Administration',
 'Absence non justifiée à régulariser.', 'Demandée', '', NULL,
 '', '', '', '', '', NULL,
 '[{"from":"Administration","role":"Admin","text":"Veuillez justifier votre absence pour la séance : mardi 02 juin 2026 10h30 - 12h00 — Salle B102","date":"2026-06-02"}]');

INSERT INTO notification_reads (user_key, reads_json) VALUES
('admin', '{"messages":{},"justifications":{}}'),
('emma@ece.fr', '{"messages":{},"justifications":{}}'),
('adam@ece.fr', '{"messages":{},"justifications":{}}'),
('mohamed.ali@ece.fr', '{"messages":{},"justifications":{}}'),
('sarah.nadi@ece.fr', '{"messages":{},"justifications":{}}'),
('karim.haddad@ece.fr', '{"messages":{},"justifications":{}}');

DELIMITER $$

CREATE TRIGGER trg_enrollments_after_insert
AFTER INSERT ON enrollments
FOR EACH ROW
BEGIN
  UPDATE courses
  SET registered = (
    SELECT COUNT(*)
    FROM enrollments
    WHERE course_id = NEW.course_id
  )
  WHERE id = NEW.course_id;
END$$

CREATE TRIGGER trg_enrollments_after_delete
AFTER DELETE ON enrollments
FOR EACH ROW
BEGIN
  UPDATE courses
  SET registered = (
    SELECT COUNT(*)
    FROM enrollments
    WHERE course_id = OLD.course_id
  )
  WHERE id = OLD.course_id;
END$$

CREATE TRIGGER trg_course_sessions_no_room_overlap_insert
BEFORE INSERT ON course_sessions
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1
    FROM course_sessions cs
    WHERE cs.session_date = NEW.session_date
      AND LOWER(TRIM(cs.room)) = LOWER(TRIM(NEW.room))
      AND NEW.session_time < cs.session_end_time
      AND cs.session_time < NEW.session_end_time
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Conflit salle : la salle est déjà occupée sur ce créneau';
  END IF;
END$$

CREATE TRIGGER trg_course_sessions_no_room_overlap_update
BEFORE UPDATE ON course_sessions
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1
    FROM course_sessions cs
    WHERE cs.id <> OLD.id
      AND cs.session_date = NEW.session_date
      AND LOWER(TRIM(cs.room)) = LOWER(TRIM(NEW.room))
      AND NEW.session_time < cs.session_end_time
      AND cs.session_time < NEW.session_end_time
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Conflit salle : la salle est déjà occupée sur ce créneau';
  END IF;
END$$

CREATE TRIGGER trg_course_sessions_no_class_overlap_insert
BEFORE INSERT ON course_sessions
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1
    FROM class_module_enrollments cme_new
    JOIN module_courses mc_new
      ON mc_new.module_id = cme_new.module_id
     AND mc_new.course_id = NEW.course_id
    JOIN class_module_enrollments cme_existing
      ON cme_existing.class_name = cme_new.class_name
    JOIN module_courses mc_existing
      ON mc_existing.module_id = cme_existing.module_id
    JOIN course_sessions cs
      ON cs.course_id = mc_existing.course_id
    WHERE cs.session_date = NEW.session_date
      AND NEW.session_time < cs.session_end_time
      AND cs.session_time < NEW.session_end_time
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Conflit classe : une classe ne peut pas avoir deux cours en même temps';
  END IF;
END$$

CREATE TRIGGER trg_course_sessions_no_class_overlap_update
BEFORE UPDATE ON course_sessions
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1
    FROM class_module_enrollments cme_new
    JOIN module_courses mc_new
      ON mc_new.module_id = cme_new.module_id
     AND mc_new.course_id = NEW.course_id
    JOIN class_module_enrollments cme_existing
      ON cme_existing.class_name = cme_new.class_name
    JOIN module_courses mc_existing
      ON mc_existing.module_id = cme_existing.module_id
    JOIN course_sessions cs
      ON cs.course_id = mc_existing.course_id
    WHERE cs.id <> OLD.id
      AND cs.session_date = NEW.session_date
      AND NEW.session_time < cs.session_end_time
      AND cs.session_time < NEW.session_end_time
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Conflit classe : une classe ne peut pas avoir deux cours en même temps';
  END IF;
END$$

DELIMITER ;

UPDATE courses c
SET registered = (
  SELECT COUNT(*)
  FROM enrollments e
  WHERE e.course_id = c.id
);
