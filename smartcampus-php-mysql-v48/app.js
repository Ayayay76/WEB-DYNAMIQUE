const API_URL = "api/api.php";

const apiRequest = async (action, payload = null) => {
  const options = payload
    ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      }
    : { method: "GET", credentials: "include" };

  const response = await fetch(`${API_URL}?action=${action}`, options);
  const result = await response.json();

  if (!response.ok || result.ok === false) {
    throw new Error(result.error || "Erreur API");
  }

  return result;
};

const STORAGE_KEY = "smartcampus_demo_data_v48";

const defaultData = {
  users: [
    { id: 1, nom: "Administrateur", email: "admin", password: "0000", role: "Administrateur", statut: "Actif" },
    { id: 2, nom: "Emma Martin", email: "emma@ece.fr", password: "1234", role: "Étudiant", statut: "Actif" },
    { id: 3, nom: "Adam Benali", email: "adam@ece.fr", password: "1234", role: "Étudiant", statut: "Actif" },
    { id: 4, nom: "Dr. Mohamed Ali", email: "mohamed.ali@ece.fr", password: "1234", role: "Enseignant", statut: "Actif" },
    { id: 5, nom: "Mme Sarah Nadi", email: "sarah.nadi@ece.fr", password: "1234", role: "Enseignant", statut: "Actif" },
    { id: 6, nom: "M. Karim Haddad", email: "karim.haddad@ece.fr", password: "1234", role: "Enseignant", statut: "Actif" }
  ],
  students: [
    { id: 1, nom: "Emma Martin", email: "emma@ece.fr", niveau: "ING2", groupe: "A", moyenne: 14.8, absences: 2, courseIds:[1,3] },
    { id: 2, nom: "Adam Benali", email: "adam@ece.fr", niveau: "ING2", groupe: "B", moyenne: 12.6, absences: 5, courseIds:[2] }
  ],
  teachers: [
    { id: 1, nom: "Dr. Mohamed Ali", email: "mohamed.ali@ece.fr", departement: "Informatique", cours: "Développement Web" },
    { id: 2, nom: "Mme Sarah Nadi", email: "sarah.nadi@ece.fr", departement: "Mathématiques", cours: "Statistiques" },
    { id: 3, nom: "M. Karim Haddad", email: "karim.haddad@ece.fr", departement: "Informatique", cours: "Bases de données" }
  ],
  courses: [
    { id: 1, code: "WEB201", nom: "Développement Web", enseignant: "Dr. Mohamed Ali", semestre: "S4", capacite: 30, inscrits: 24, salle: "A203", horaire: "Voir séances" },
    { id: 2, code: "MATH204", nom: "Statistiques", enseignant: "Mme Sarah Nadi", semestre: "S4", capacite: 28, inscrits: 20, salle: "B102", horaire: "Voir séances" },
    { id: 3, code: "BDD202", nom: "Bases de données", enseignant: "M. Karim Haddad", semestre: "S4", capacite: 32, inscrits: 31, salle: "C104", horaire: "Voir séances" }
  ],
  courseSessions: [
    { id: 1, courseId: 1, courseName: "Développement Web", date: "2026-06-01", time: "14:00", endTime: "16:00", salle: "A203" },
    { id: 2, courseId: 1, courseName: "Développement Web", date: "2026-06-03", time: "16:00", endTime: "18:00", salle: "A203" },
    { id: 3, courseId: 1, courseName: "Développement Web", date: "2026-06-10", time: "16:00", endTime: "18:00", salle: "A203" },
    { id: 4, courseId: 2, courseName: "Statistiques", date: "2026-06-02", time: "10:30", endTime: "12:00", salle: "B102" },
    { id: 5, courseId: 3, courseName: "Bases de données", date: "2026-06-01", time: "16:00", endTime: "18:00", salle: "C104" }
  ],
  modules: [
    { id: 1, code: "MOD-WEB-BDD", nom: "Module Web & Bases de données", semestre: "S4", coefficient: 6, courseIds: [1, 3] },
    { id: 2, code: "MOD-MATH", nom: "Module Mathématiques appliquées", semestre: "S4", coefficient: 4, courseIds: [2] }
  ],
  classEnrollments: [
    { id: 1, classe: "ING2-A", moduleId: 1 },
    { id: 2, classe: "ING2-B", moduleId: 2 }
  ],
  grades: [
    {
      id: 1,
      etudiant: "Emma Martin",
      cours: "Développement Web",
      suivi: 15,
      ds: 14,
      projet: 17,
      statut: "Pas terminé",
      locked: false,
      categoryWeights: { Suivi:20, DS:40, Projet:40 },
      components: [
        { id: 1, category: "Suivi", label: "Contrôle continu", score: 15, weight: 100 },
        { id: 2, category: "DS", label: "DS principal", score: 14, weight: 100 },
        { id: 3, category: "Projet", label: "Projet final", score: 17, weight: 100 }
      ]
    },
    {
      id: 2,
      etudiant: "Emma Martin",
      cours: "Bases de données",
      suivi: 14,
      ds: 15,
      projet: 16,
      statut: "Pas terminé",
      locked: false,
      categoryWeights: { Suivi:20, DS:40, Projet:40 },
      components: [
        { id: 4, category: "Suivi", label: "TP SQL", score: 14, weight: 100 },
        { id: 5, category: "DS", label: "DS normalisation", score: 15, weight: 100 },
        { id: 6, category: "Projet", label: "Mini-projet BDD", score: 16, weight: 100 }
      ]
    },
    {
      id: 3,
      etudiant: "Adam Benali",
      cours: "Statistiques",
      suivi: 12,
      ds: 13,
      projet: 11,
      statut: "Pas terminé",
      locked: false,
      categoryWeights: { Suivi:20, DS:40, Projet:40 },
      components: [
        { id: 7, category: "Suivi", label: "Quiz", score: 12, weight: 100 },
        { id: 8, category: "DS", label: "DS probabilités", score: 13, weight: 100 },
        { id: 9, category: "Projet", label: "Étude statistique", score: 11, weight: 100 }
      ]
    }
  ],
  messages: [
    {
      id: 1,
      from: "Administration",
      to: "Tous",
      sujet: "Bienvenue sur SmartCampus",
      contenu: "La plateforme est ouverte pour la démonstration.",
      attachmentName: "",
      attachmentType: "",
      attachmentData: ""
    },
    {
      id: 2,
      from: "Dr. Mohamed Ali",
      to: "Emma Martin",
      sujet: "Projet Web",
      contenu: "Pensez à valider votre rendu GitHub.",
      attachmentName: "",
      attachmentType: "",
      attachmentData: ""
    }
  ],
  attendanceSessions: [
    { id: 1, code: "12345", sessionId: 1, seance: "lundi 01 juin 2026 14h00 - 16h00 — Salle A203", cours: "Développement Web", enseignant: "Dr. Mohamed Ali", date: "2026-06-01", actif: true, codeEnabled: true, qrEnabled: true }
  ],
  attendances: [
    { id: 1, sessionId: 1, seance: "lundi 01 juin 2026 14h00 - 16h00 — Salle A203", etudiant: "Emma Martin", cours: "Développement Web", date: "2026-06-01", statut: "Présent", methode: "Code QR" },
    { id: 2, sessionId: 4, seance: "mardi 02 juin 2026 10h30 - 12h00 — Salle B102", etudiant: "Adam Benali", cours: "Statistiques", date: "2026-06-02", statut: "Absent", methode: "Manuel" }
  ],
  absenceJustifications: [
    {
      id: 1,
      sessionId: 4,
      seance: "mardi 02 juin 2026 10h30 - 12h00 — Salle B102",
      etudiant: "Adam Benali",
      cours: "Statistiques",
      date: "2026-06-02",
      requestedBy: "Administration",
      motif: "Absence non justifiée à régulariser.",
      statut: "Demandée",
      justification: "",
      submittedAt: "",
      attachmentName: "",
      attachmentType: "",
      attachmentData: "",
      adminReply: "",
      reviewedBy: "",
      reviewedAt: "",
      conversation: []
    }
  ],
  events: [
    { id: 1, title: "Forum entreprises", date: "2026-06-05", startTime: "09:00", endTime: "12:00", lieu: "Amphi ECE", capacity: 60, eligibleLevels: ["ING2", "ING3", "ING4", "ING5"], courseId: "", description: "" },
    { id: 2, title: "Atelier Projet Web", date: "2026-06-08", startTime: "14:00", endTime: "16:00", lieu: "Salle A203", capacity: 30, eligibleLevels: ["ING2"], courseId: 1, description: "" }
  ],
  eventRegistrations: [
    { id: 1, eventId: 1, studentId: 1, studentName: "Emma Martin", registeredBy: "Emma Martin", registeredAt: "2026-05-31" }
  ]
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const loadData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return clone(defaultData);
    }

    const parsed = JSON.parse(stored);

    return {
      users: parsed.users || defaultData.users,
      students: parsed.students || defaultData.students,
      teachers: parsed.teachers || defaultData.teachers,
      courses: parsed.courses || defaultData.courses,
      courseSessions: parsed.courseSessions || defaultData.courseSessions,
      modules: parsed.modules || defaultData.modules,
      classEnrollments: parsed.classEnrollments || defaultData.classEnrollments,
      grades: parsed.grades || defaultData.grades,
      messages: parsed.messages || defaultData.messages,
      attendanceSessions: parsed.attendanceSessions || defaultData.attendanceSessions,
      attendances: parsed.attendances || defaultData.attendances,
      absenceJustifications: parsed.absenceJustifications || defaultData.absenceJustifications,
      events: parsed.events || defaultData.events,
      eventRegistrations: parsed.eventRegistrations || defaultData.eventRegistrations
    };
  } catch (error) {
    return clone(defaultData);
  }
};

const saveData = (data) => {};

const NOTIFICATION_READS_KEY = "smartcampus_notification_reads_v48";

const getNotificationUserKey = (user) => user?.email || user?.nom || "anonymous";

const loadNotificationReads = () => {
  try {
    const stored = localStorage.getItem(NOTIFICATION_READS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
};

const saveNotificationReads = (reads) => {
  localStorage.setItem(NOTIFICATION_READS_KEY, JSON.stringify(reads));
};

const getUserReadState = (reads, user) => {
  const key = getNotificationUserKey(user);
  return reads[key] || { messages: {}, justifications: {} };
};

const getVisibleMessagesForUser = (messages, user) => {
  if (!user) return [];

  return (messages || []).filter((message) => {
    const sentByMe = message.from === user.nom || message.from === user.email;
    if (sentByMe) return false;

    if (user.role === "Administrateur") {
      return true;
    }

    return (
      message.to === "Tous" ||
      message.to === user.nom ||
      message.to === user.email
    );
  });
};

const getRelevantJustificationsForUser = (data, user) => {
  if (!user) return [];

  const isStillAbsentOrLate = (request) => {
    const attendance = (data.attendances || []).find((item) => {
      if (request.sessionId && item.sessionId) {
        return item.etudiant === request.etudiant && Number(item.sessionId) === Number(request.sessionId);
      }

      return item.etudiant === request.etudiant && item.cours === request.cours && item.date === request.date;
    });

    return !attendance || attendance.statut === "Absent" || attendance.statut === "Retard";
  };

  const requests = (data.absenceJustifications || []).filter(isStillAbsentOrLate);

  if (user.role === "Administrateur") {
    return requests;
  }

  if (user.role === "Étudiant") {
    const student = (data.students || []).find((item) => item.email === user.email);
    const studentName = student?.nom || user.nom;
    return requests.filter((request) => request.etudiant === studentName);
  }

  if (user.role === "Enseignant") {
    return [];
  }

  return [];
};

const uniqueNumbers = (items = []) => [...new Set(items.map((item) => Number(item)).filter((item) => Number.isFinite(item)))];

const getClassKey = (student = {}) => `${student.niveau || ""}-${student.groupe || ""}`.replace(/^-|-$/g, "");

const getAvailableClasses = (data) => {
  const classMap = new Map();

  (data.students || []).forEach((student) => {
    const key = getClassKey(student);
    if (!key) return;

    if (!classMap.has(key)) {
      classMap.set(key, {
        key,
        label: key,
        niveau: student.niveau || "",
        groupe: student.groupe || "",
        count: 0
      });
    }

    classMap.get(key).count += 1;
  });

  return [...classMap.values()].sort((a, b) => a.label.localeCompare(b.label));
};

const getModuleById = (data, moduleId) => (data.modules || []).find((module) => Number(module.id) === Number(moduleId));

const getModuleCourseIds = (data, moduleId) => {
  const module = getModuleById(data, moduleId);
  return uniqueNumbers(module?.courseIds || []);
};

const getCourseIdsForClass = (data, classKey) => {
  const ids = (data.classEnrollments || [])
    .filter((enrollment) => enrollment.classe === classKey)
    .flatMap((enrollment) => getModuleCourseIds(data, enrollment.moduleId));

  return uniqueNumbers(ids);
};

const getEffectiveStudentCourseIds = (data, student) => {
  const hasClassEnrollments = Array.isArray(data.classEnrollments);
  const classKey = getClassKey(student);

  if (hasClassEnrollments && classKey) {
    return getCourseIdsForClass(data, classKey);
  }

  return uniqueNumbers(student.courseIds || []);
};

const getStudentsInClass = (data, classKey) => (data.students || []).filter((student) => getClassKey(student) === classKey);

const getAvailableTeachersFromCourses = (courses = []) => [...new Set((courses || []).map((course) => course.enseignant).filter(Boolean))].sort((a, b) => a.localeCompare(b));

const getClassesForCourse = (data, courseId) => {
  const targetCourseId = Number(courseId);
  return [...new Set((data.classEnrollments || [])
    .filter((enrollment) => getModuleCourseIds(data, enrollment.moduleId).includes(targetCourseId))
    .map((enrollment) => enrollment.classe)
    .filter(Boolean))].sort((a, b) => a.localeCompare(b));
};

const countCourseRegistrations = (students, courseId) => {
  return (students || []).filter((student) =>
    (student.courseIds || []).includes(Number(courseId))
  ).length;
};

const getCourseRegisteredCount = (data, courseId) => {
  const students = (data.students || []).map((student) => ({
    ...student,
    courseIds: getEffectiveStudentCourseIds(data, student)
  }));

  return countCourseRegistrations(students, courseId);
};

const normalizeCourseRegisteredCounts = (data) => {
  const nextData = {
    ...data,
    modules: data.modules || defaultData.modules || [],
    classEnrollments: data.classEnrollments || defaultData.classEnrollments || [],
    events: data.events || defaultData.events || [],
    eventRegistrations: data.eventRegistrations || defaultData.eventRegistrations || []
  };

  const students = (nextData.students || []).map((student) => ({
    ...student,
    courseIds: getEffectiveStudentCourseIds(nextData, student)
  }));

  return {
    ...nextData,
    students,
    courses: (nextData.courses || []).map((course) => ({
      ...course,
      inscrits: countCourseRegistrations(students, course.id)
    }))
  };
};

const getMessageFingerprint = (message) =>
  [
    message.id,
    message.sujet || "",
    message.contenu || "",
    message.attachmentName || ""
  ].join("|");

const getJustificationFingerprint = (request) =>
  [
    request.id,
    request.statut || "",
    request.justification || "",
    request.attachmentName || "",
    request.adminReply || "",
    (request.conversation || []).length
  ].join("|");

const getUnreadNotificationBreakdown = (data, user, reads) => {
  const readState = getUserReadState(reads, user);

  const unreadMessages = getVisibleMessagesForUser(data.messages, user).filter((message) =>
    readState.messages?.[message.id] !== getMessageFingerprint(message)
  );

  const unreadJustifications = getRelevantJustificationsForUser(data, user).filter((request) =>
    readState.justifications?.[request.id] !== getJustificationFingerprint(request)
  );

  return {
    messages: unreadMessages.length,
    justifications: unreadJustifications.length,
    total: unreadMessages.length + unreadJustifications.length
  };
};

const nextId = (items) => {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
};

const EVENT_LEVELS = ["ING1", "ING2", "ING3", "ING4", "ING5"];
const SEMESTERS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];
const LEVEL_SEMESTERS = { ING1:["S1", "S2"], ING2:["S3", "S4"], ING3:["S5", "S6"], ING4:["S7", "S8"], ING5:["S9", "S10"] };
const isSemesterAllowedForLevel = (level, semester) => !level || !semester || (LEVEL_SEMESTERS[level] || []).includes(semester);
const getLevelFromClassKey = (classKey = "") => String(classKey).split("-")[0] || "";

const normalizeEventLevels = (levels) => {
  if (Array.isArray(levels)) return levels.filter(Boolean);
  if (typeof levels === "string") {
    return levels.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const getEventCourse = (data, event) => {
  if (!event?.courseId) return null;
  return (data.courses || []).find((course) => Number(course.id) === Number(event.courseId)) || null;
};

const getEventRegistrations = (data, eventId) => (data.eventRegistrations || [])
  .filter((registration) => Number(registration.eventId) === Number(eventId));

const getEventRegisteredCount = (data, eventId) => getEventRegistrations(data, eventId).length;

const isStudentRegisteredToEvent = (data, eventId, studentId) => getEventRegistrations(data, eventId)
  .some((registration) => Number(registration.studentId) === Number(studentId));

const isEventEligibleForStudent = (data, event, student) => {
  if (!event || !student) return false;

  const levels = normalizeEventLevels(event.eligibleLevels);
  if (levels.length && !levels.includes(student.niveau)) return false;

  if (event.courseId) {
    const courseIds = getEffectiveStudentCourseIds(data, student);
    if (!courseIds.includes(Number(event.courseId))) return false;
  }

  return true;
};

const eventToScheduleItem = (event) => ({
  id: event?.id || 0,
  date: event?.date || "",
  time: event?.startTime || "00:00",
  endTime: event?.endTime || "00:00"
});

const getStudentEventScheduleConflict = (data, event, student) => {
  if (!event || !student) return null;

  const courseIds = getEffectiveStudentCourseIds(data, student);
  const eventSlot = eventToScheduleItem(event);

  return (data.courseSessions || []).find((session) =>
    courseIds.includes(Number(session.courseId)) && sessionsOverlap(session, eventSlot)
  ) || null;
};

const getEventRegistrationBlockReason = (data, event, student, options = {}) => {
  if (!event || !student) return "Sélection invalide.";

  if (!isEventEligibleForStudent(data, event, student)) {
    return "Cet étudiant ne respecte pas les conditions d'inscription.";
  }

  if (!options.ignoreAlreadyRegistered && isStudentRegisteredToEvent(data, event.id, student.id)) {
    return "Cet étudiant est déjà inscrit à cet événement.";
  }

  if (!options.ignoreCapacity && getEventRegisteredCount(data, event.id) >= Number(event.capacity)) {
    return "Capacité maximale atteinte.";
  }

  const conflict = getStudentEventScheduleConflict(data, event, student);
  if (conflict) {
    return `Conflit horaire : ${student.nom} a déjà ${conflict.courseName} le ${formatSessionDateTime(conflict)}.`;
  }

  return "";
};

const formatEventSlot = (event) => {
  const date = event?.date || "";
  const start = (event?.startTime || "").slice(0, 5);
  const end = (event?.endTime || "").slice(0, 5);
  return [date, start && end ? `${start} - ${end}` : start].filter(Boolean).join(" ");
};

const today = () => new Date().toISOString().slice(0, 10);

const GRADE_CATEGORIES = ["Suivi", "DS", "Projet"];
const GRADE_CATEGORY_KEYS = { Suivi:"suivi", DS:"ds", Projet:"projet" };
const DEFAULT_GRADE_CATEGORY_WEIGHTS = { Suivi:20, DS:40, Projet:40 };

const getGradeComponents = (grade) => Array.isArray(grade?.components) ? grade.components : [];

const getComponentScore = (component) => Math.max(0, Math.min(20, Number(component?.score) || 0));
const getComponentWeight = (component) => Math.max(0, Math.min(100, Number(component?.weight) || 0));

const getGradeCategoryWeights = (grade) => {
  const saved = grade?.categoryWeights || {};
  const fromColumns = {
    Suivi: grade?.suiviWeight,
    DS: grade?.dsWeight,
    Projet: grade?.projetWeight
  };

  return GRADE_CATEGORIES.reduce((weights, category) => {
    const legacyTotal = getGradeComponents(grade)
      .filter((component) => component.category === category)
      .reduce((sum, component) => sum + getComponentWeight(component), 0);
    const raw = saved[category] ?? fromColumns[category] ?? (legacyTotal > 0 ? legacyTotal : DEFAULT_GRADE_CATEGORY_WEIGHTS[category]);
    weights[category] = Math.max(0, Math.min(100, Number(raw) || 0));
    return weights;
  }, {});
};

const getGradeWeightTotal = (grade) => {
  const weights = getGradeCategoryWeights(grade);
  return GRADE_CATEGORIES.reduce((sum, category) => sum + Number(weights[category] || 0), 0);
};

const categoryComponentWeightTotal = (grade, category, components = getGradeComponents(grade)) => {
  return components
    .filter((component) => component.category === category)
    .reduce((sum, component) => sum + getComponentWeight(component), 0);
};

const categoryAverageNumber = (grade, category) => {
  const components = getGradeComponents(grade).filter((component) => component.category === category);
  const fallbackKey = GRADE_CATEGORY_KEYS[category];

  if (components.length === 0) {
    return Math.max(0, Math.min(20, Number(grade?.[fallbackKey] ?? 0) || 0));
  }

  const weightTotal = components.reduce((sum, component) => sum + getComponentWeight(component), 0);

  if (weightTotal <= 0) {
    const simpleAverage = components.reduce((sum, component) => sum + getComponentScore(component), 0) / components.length;
    return Math.max(0, Math.min(20, simpleAverage));
  }

  const value = components.reduce((sum, component) => {
    return sum + (getComponentScore(component) * getComponentWeight(component) / 100);
  }, 0);

  return Math.max(0, Math.min(20, value));
};

const weightedGradeValue = (grade) => {
  const weights = getGradeCategoryWeights(grade);
  return GRADE_CATEGORIES.reduce((sum, category) => {
    return sum + (categoryAverageNumber(grade, category) * Number(weights[category] || 0) / 100);
  }, 0);
};

const moyenne = (grade) => weightedGradeValue(grade).toFixed(2);

const categoryAverage = (grade, category) => categoryAverageNumber(grade, category).toFixed(2).replace(/\.00$/, "");

const getModuleForCourse = (data, courseIdOrName) => {
  const course = typeof courseIdOrName === "number"
    ? (data.courses || []).find((item) => Number(item.id) === Number(courseIdOrName))
    : (data.courses || []).find((item) => item.nom === courseIdOrName);
  if (!course) return null;
  return (data.modules || []).find((module) => (module.courseIds || []).map(Number).includes(Number(course.id))) || null;
};

const getModuleCoefficient = (module) => Math.max(0, Number(module?.coefficient ?? module?.coeff ?? 1) || 1);

const buildGradeRowsForModule = (data, moduleId, baseGrades = data.grades || []) => {
  const module = getModuleById(data, moduleId);
  if (!module) return [];
  const classes = (data.classEnrollments || [])
    .filter((enrollment) => Number(enrollment.moduleId) === Number(module.id))
    .map((enrollment) => enrollment.classe);
  const students = (data.students || []).filter((student) => classes.includes(getClassKey(student)));
  const courses = (module.courseIds || [])
    .map((courseId) => (data.courses || []).find((course) => Number(course.id) === Number(courseId)))
    .filter(Boolean);
  const rows = [];
  let nextGradeId = nextId(baseGrades);

  students.forEach((student) => {
    courses.forEach((course) => {
      const exists = baseGrades.some((grade) => grade.etudiant === student.nom && grade.cours === course.nom);
      if (!exists) {
        rows.push({
          id: nextGradeId++,
          etudiant: student.nom,
          cours: course.nom,
          suivi: 0,
          ds: 0,
          projet: 0,
          statut: "Pas terminé",
          locked: false,
          categoryWeights: { ...DEFAULT_GRADE_CATEGORY_WEIGHTS },
          suiviWeight: DEFAULT_GRADE_CATEGORY_WEIGHTS.Suivi,
          dsWeight: DEFAULT_GRADE_CATEGORY_WEIGHTS.DS,
          projetWeight: DEFAULT_GRADE_CATEGORY_WEIGHTS.Projet,
          components: []
        });
      }
    });
  });

  return rows;
};

const ensureGradesForModule = (data, moduleId, grades = data.grades || []) => {
  const additions = buildGradeRowsForModule(data, moduleId, grades);
  return additions.length ? [...grades, ...additions] : grades;
};

const getStudentModuleAverages = (data, student) => {
  const classKey = getClassKey(student);
  const modules = (data.classEnrollments || [])
    .filter((enrollment) => enrollment.classe === classKey)
    .map((enrollment) => getModuleById(data, enrollment.moduleId))
    .filter(Boolean);

  return modules.map((module) => {
    const courseNames = (module.courseIds || [])
      .map((courseId) => (data.courses || []).find((course) => Number(course.id) === Number(courseId)))
      .filter(Boolean)
      .map((course) => course.nom);
    const grades = (data.grades || []).filter((grade) => grade.etudiant === student.nom && courseNames.includes(grade.cours));
    const average = grades.length
      ? grades.reduce((sum, grade) => sum + Number(moyenne(grade)), 0) / grades.length
      : 0;
    return { module, average, coefficient:getModuleCoefficient(module), grades };
  });
};

const getGeneralAverageForStudent = (data, student) => {
  const moduleAverages = getStudentModuleAverages(data, student).filter((item) => item.grades.length > 0);
  const coeffTotal = moduleAverages.reduce((sum, item) => sum + item.coefficient, 0);
  if (coeffTotal <= 0) return "0.00";
  const value = moduleAverages.reduce((sum, item) => sum + item.average * item.coefficient, 0) / coeffTotal;
  return value.toFixed(2);
};

const getGradeCategorySummaries = (grade, components = getGradeComponents(grade)) => {
  const withComponents = { ...grade, components };
  return {
    suivi: Number(categoryAverage(withComponents, "Suivi")) || 0,
    ds: Number(categoryAverage(withComponents, "DS")) || 0,
    projet: Number(categoryAverage(withComponents, "Projet")) || 0
  };
};

const GRADE_DRAFT_STATUS = "Pas terminé";
const GRADE_FINAL_STATUSES = ["Validé", "Compensé", "Rattrapage", "Non validé"];
const GRADE_STATUSES = [GRADE_DRAFT_STATUS, ...GRADE_FINAL_STATUSES];

const normalizeGradeStatus = (status, legacyValidated = false) => {
  if (status === "Validée") return "Validé";
  if (status === "Pas validée" || status === "Non validée" || status === "En cours" || status === "" || status == null) return GRADE_DRAFT_STATUS;
  if (GRADE_STATUSES.includes(status)) return status;
  return legacyValidated ? "Validé" : GRADE_DRAFT_STATUS;
};

const getGradeStatus = (grade) => normalizeGradeStatus(grade?.statut, grade?.valide);

const isTruthyLock = (value) => value === true || value === 1 || value === "1" || value === "true";

const isFinalGradeStatus = (status) => GRADE_FINAL_STATUSES.includes(normalizeGradeStatus(status));

const isGradeLocked = (grade) => isFinalGradeStatus(getGradeStatus(grade));

const initials = (name) =>
  name.split(" ").map((part) => part[0]).slice(0,2).join("").toUpperCase();

const generatePresenceCode = (existingCodes = []) => {
  const blockedCodes = new Set(existingCodes.map((code) => String(code)));

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const code = String(Math.floor(10000 + Math.random() * 90000));
    if (!blockedCodes.has(code)) return code;
  }

  return String(Date.now()).slice(-5).padStart(5, "0");
};

const isPresenceCodeEnabled = (session) => {
  if (!session || !session.code) return false;
  return session.codeEnabled !== false && session.codeEnabled !== 0 && session.codeEnabled !== "0";
};

const isPresenceQrEnabled = (session) => {
  if (!session || !session.code) return false;
  return session.qrEnabled !== false && session.qrEnabled !== 0 && session.qrEnabled !== "0";
};

const isStudentPresenceAccessEnabled = (session) => isPresenceCodeEnabled(session) || isPresenceQrEnabled(session);

const getAttendanceModeLabel = (session) => {
  if (!session) return "Aucun mode";
  const code = isPresenceCodeEnabled(session);
  const qr = isPresenceQrEnabled(session);
  if (code && qr) return "Code + QR code";
  if (code) return "Code uniquement";
  if (qr) return "QR code uniquement";
  return "Manuel uniquement";
};

const getCourseSessions = (data, courseId) => {
  return (data.courseSessions || []).filter((session) => Number(session.courseId) === Number(courseId));
};

const getSessionById = (data, sessionId) => {
  return (data.courseSessions || []).find((session) => Number(session.id) === Number(sessionId));
};

const getSessionCourse = (data, session) => {
  return data.courses.find((course) => Number(course.id) === Number(session?.courseId));
};

const getSessionLabelById = (data, sessionId) => {
  const session = getSessionById(data, sessionId);
  return session ? formatSessionLabel(session) : "Séance non trouvée";
};

const getAttendanceKey = (item) => {
  return item.sessionId ? `session:${item.sessionId}` : `${item.cours}|${item.date}`;
};

const sameAttendanceSession = (a, b) => {
  if (a.sessionId && b.sessionId) {
    return Number(a.sessionId) === Number(b.sessionId);
  }

  return a.cours === b.cours && a.date === b.date;
};


const timeToMinutes = (time = "00:00") => {
  const [rawHour, rawMinute] = String(time || "00:00").split(":").map((value) => Number(value));
  const hour = Number.isFinite(rawHour) ? rawHour : 0;
  const minute = Number.isFinite(rawMinute) ? rawMinute : 0;
  return hour * 60 + minute;
};

const minutesToTime = (minutes = 0) => {
  const safeMinutes = Math.max(0, Math.min(23 * 60 + 59, Number(minutes) || 0));
  const hour = Math.floor(safeMinutes / 60);
  const minute = safeMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const addMinutesToTime = (time = "00:00", minutes = 120) => minutesToTime(timeToMinutes(time) + minutes);

const normalizeSessionTime = (time = "00:00", period = "") => {
  const [rawHour, rawMinute] = String(time || "00:00").split(":").map((value) => Number(value));
  let hour = Number.isFinite(rawHour) ? rawHour : 0;
  const minute = Number.isFinite(rawMinute) ? rawMinute : 0;

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const getSessionStartTime = (session) => normalizeSessionTime(session?.time || "00:00", session?.period || "");
const getSessionEndTime = (session) => session?.endTime || addMinutesToTime(getSessionStartTime(session), 120);
const getSessionStartMinutes = (session) => timeToMinutes(getSessionStartTime(session));
const getSessionEndMinutes = (session) => timeToMinutes(getSessionEndTime(session));

const sessionsOverlap = (a, b) => {
  if (!a || !b || a.date !== b.date) return false;
  return getSessionStartMinutes(a) < getSessionEndMinutes(b) && getSessionStartMinutes(b) < getSessionEndMinutes(a);
};

const formatSessionHour = (time = "00:00") => {
  const normalized = normalizeSessionTime(time);
  const [hour, minute] = normalized.split(":");
  return `${hour}h${minute}`;
};

const formatSessionDateTime = (session) => {
  if (!session) return "Aucune séance";

  const dateObject = new Date(`${session.date}T00:00:00`);
  const dateLabel = Number.isNaN(dateObject.getTime())
    ? session.date
    : dateObject.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      });

  const endLabel = session.endTime ? ` - ${formatSessionHour(session.endTime)}` : "";
  return `${dateLabel} ${formatSessionHour(getSessionStartTime(session))}${endLabel}`;
};

const formatSessionLabel = (session) => {
  if (!session) return "Aucune séance";
  return `${formatSessionDateTime(session)} — Salle ${session.salle}`;
};

const getCourseFirstSession = (data, courseId) => getCourseSessions(data, courseId)[0];

const getCourseFirstSessionLabel = (data, courseId) => {
  const session = getCourseFirstSession(data, courseId);
  return session ? formatSessionLabel(session) : "Aucune séance";
};

const getCourseFirstSessionDateTime = (data, courseId) => {
  const session = getCourseFirstSession(data, courseId);
  return session ? formatSessionDateTime(session) : "Aucune séance";
};

const getCourseFirstSessionRoom = (data, courseId) => {
  const session = getCourseFirstSession(data, courseId);
  return session ? session.salle : "Aucune salle";
};

const getRoomConflict = (data, candidate, excludeSessionId = null) => {
  return (data.courseSessions || []).find((session) =>
    Number(session.id) !== Number(excludeSessionId) &&
    String(session.salle || "").trim().toLowerCase() === String(candidate.salle || "").trim().toLowerCase() &&
    sessionsOverlap(session, candidate)
  );
};

const CALENDAR_START_MINUTES = 8 * 60;
const CALENDAR_END_MINUTES = 20 * 60;
const CALENDAR_HOUR_HEIGHT = 64;
const CALENDAR_DAY_MINUTES = CALENDAR_END_MINUTES - CALENDAR_START_MINUTES;
const CALENDAR_HEIGHT = (CALENDAR_DAY_MINUTES / 60) * CALENDAR_HOUR_HEIGHT;
const CALENDAR_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const CALENDAR_HOURS = Array.from({ length: (CALENDAR_END_MINUTES - CALENDAR_START_MINUTES) / 60 + 1 }, (_, index) => (CALENDAR_START_MINUTES / 60) + index);

const parseISODate = (isoDate = today()) => {
  if (isoDate instanceof Date && !Number.isNaN(isoDate.getTime())) {
    return new Date(isoDate.getFullYear(), isoDate.getMonth(), isoDate.getDate());
  }

  const [rawYear, rawMonth, rawDay] = String(isoDate || today()).split("-").map((value) => Number(value));
  const fallback = new Date();
  const year = Number.isFinite(rawYear) ? rawYear : fallback.getFullYear();
  const month = Number.isFinite(rawMonth) ? rawMonth : fallback.getMonth() + 1;
  const day = Number.isFinite(rawDay) ? rawDay : fallback.getDate();
  return new Date(year, month - 1, day);
};

const formatISODate = (date) => {
  const d = date instanceof Date ? date : parseISODate(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const addDaysToDate = (date, days) => {
  const d = date instanceof Date ? date : parseISODate(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
};

const getWeekMonday = (isoDate = today()) => {
  const d = parseISODate(isoDate);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return formatISODate(addDaysToDate(d, diff));
};

const getCalendarWeekDays = (weekStartIso) => {
  const monday = parseISODate(weekStartIso);
  return CALENDAR_DAYS.map((label, index) => {
    const date = addDaysToDate(monday, index);
    return {
      label,
      iso: formatISODate(date),
      shortLabel: date.toLocaleDateString("fr-FR", { day:"2-digit", month:"2-digit" })
    };
  });
};

const getWeekRangeLabel = (weekStartIso) => {
  const start = parseISODate(weekStartIso);
  const end = addDaysToDate(start, 5);
  return `${start.toLocaleDateString("fr-FR", { day:"2-digit", month:"long" })} — ${end.toLocaleDateString("fr-FR", { day:"2-digit", month:"long", year:"numeric" })}`;
};

const isSessionInsideWeek = (session, weekStartIso) => {
  const weekStart = formatISODate(parseISODate(weekStartIso));
  const weekEnd = formatISODate(addDaysToDate(parseISODate(weekStartIso), 5));
  return session.date >= weekStart && session.date <= weekEnd;
};

const getCalendarCardStyle = (daySessions, session) => {
  const start = Math.max(CALENDAR_START_MINUTES, getSessionStartMinutes(session));
  const end = Math.min(CALENDAR_END_MINUTES, getSessionEndMinutes(session));
  const top = ((start - CALENDAR_START_MINUTES) / 60) * CALENDAR_HOUR_HEIGHT;
  const height = Math.max(34, ((end - start) / 60) * CALENDAR_HOUR_HEIGHT - 6);

  const overlaps = daySessions
    .filter((other) => sessionsOverlap(session, other))
    .sort((a, b) => getSessionStartMinutes(a) - getSessionStartMinutes(b) || Number(a.id) - Number(b.id));

  const count = Math.max(1, overlaps.length);
  const index = Math.max(0, overlaps.findIndex((other) => Number(other.id) === Number(session.id)));
  const width = 94 / count;
  const left = 3 + index * width;

  return {
    top:`${top}px`,
    height:`${height}px`,
    left:`${left}%`,
    width:`${Math.max(18, width - 1)}%`
  };
};

const getClassSessionConflict = (data, candidate, excludeSessionId = null) => {
  const candidateCourseId = Number(candidate.courseId);

  for (const enrollment of (data.classEnrollments || [])) {
    const classCourseIds = getCourseIdsForClass(data, enrollment.classe);
    if (!classCourseIds.includes(candidateCourseId)) continue;

    const conflict = (data.courseSessions || []).find((session) =>
      Number(session.id) !== Number(excludeSessionId) &&
      classCourseIds.includes(Number(session.courseId)) &&
      sessionsOverlap(session, candidate)
    );

    if (conflict) return { classe: enrollment.classe, session: conflict };
  }

  return null;
};

const hasScheduleConflict = (data, student, courseId) => {
  const targetSessions = getCourseSessions(data, courseId);
  const currentCourseIds = getEffectiveStudentCourseIds(data, student);
  const currentSessions = (data.courseSessions || []).filter((session) =>
    currentCourseIds.includes(Number(session.courseId))
  );

  return targetSessions.find((target) =>
    currentSessions.some((current) => sessionsOverlap(current, target))
  );
};

const getModuleEnrollmentConflict = (data, classKey, moduleId) => {
  const targetCourseIds = getModuleCourseIds(data, moduleId);
  const currentCourseIds = getCourseIdsForClass(data, classKey);
  const resultingCourseIds = uniqueNumbers([...currentCourseIds, ...targetCourseIds]);
  const resultingSessions = (data.courseSessions || [])
    .filter((session) => resultingCourseIds.includes(Number(session.courseId)))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)) || getSessionStartMinutes(a) - getSessionStartMinutes(b));

  for (let i = 0; i < resultingSessions.length; i += 1) {
    for (let j = i + 1; j < resultingSessions.length; j += 1) {
      const first = resultingSessions[i];
      const second = resultingSessions[j];
      if (Number(first.courseId) !== Number(second.courseId) && sessionsOverlap(first, second)) {
        return { target: second, conflict: first };
      }
    }
  }

  return null;
};


const generateCourseCode = (courses = []) => {
  let code = "";

  do {
    code = String(Math.floor(10000 + Math.random() * 90000));
  } while ((courses || []).some((course) => String(course.code) === code));

  return code;
};



const EyeOpenIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
    <path d="M9.1 5.4A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.2 4.2" />
    <path d="M6.1 6.8C3.5 8.6 2 12 2 12s3.5 7 10 7a10.7 10.7 0 0 0 5-1.2" />
  </svg>
);

const drawFallbackQR = (canvas, code) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = 230;
  const cells = 29;
  const cellSize = size / cells;
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#087b80";

  const text = String(code || "SMARTCAMPUS");
  const finder = (x, y) => {
    ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = "#087b80";
    ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  };

  finder(1, 1);
  finder(21, 1);
  finder(1, 21);

  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      const inFinder = (x >= 1 && x <= 7 && y >= 1 && y <= 7) ||
        (x >= 21 && x <= 27 && y >= 1 && y <= 7) ||
        (x >= 1 && x <= 7 && y >= 21 && y <= 27);
      if (inFinder) continue;
      const value = text.charCodeAt((x + y) % text.length) + x * 11 + y * 7;
      if (value % 3 !== 0) ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
};

const QRVisual = ({ code, enabled = true }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !code || !canvas) return;

    if (window.QRCode && typeof window.QRCode.toCanvas === "function") {
      window.QRCode.toCanvas(canvas, String(code), {
        width:230,
        margin:2,
        color:{ dark:"#087b80", light:"#ffffff" }
      }, (error) => {
        if (error) drawFallbackQR(canvas, code);
      });
    } else {
      drawFallbackQR(canvas, code);
    }
  }, [code, enabled]);

  if (!enabled) {
    return <div className="qr-placeholder">QR code désactivé pour cette séance.</div>;
  }

  if (!code) {
    return <div className="qr-placeholder">Aucun QR code généré.</div>;
  }

  return (
    <div className="qr-visual">
      <canvas ref={canvasRef} className="qr-canvas" aria-label={"QR code présence " + code}></canvas>
      <div className="qr-hint">À scanner depuis l'espace étudiant.</div>
    </div>
  );
};

const HomePage = ({ navigate }) => (
  <main className="home">
    <section className="hero">
      <div className="badge">Plateforme académique intelligente</div>

      <h1 className="title">Smart<span>Campus</span></h1>


      <div className="features">
        <div className="feature"><div className="icon">👥</div><h3>Gestion</h3></div>
        <div className="feature"><div className="icon">📚</div><h3>Cours</h3></div>
        <div className="feature"><div className="icon">📊</div><h3>Notes</h3></div>
        <div className="feature"><div className="icon">✅</div><h3>Présence</h3></div>
      </div>

      <div className="actions">
        <button onClick={() => navigate("connexion")}>Connexion</button>
        <button onClick={() => navigate("explorer")}>Explorer</button>
        <button onClick={() => navigate("contact")}>Nous contacter</button>
      </div>
    </section>
  </main>
);

const LoginPage = ({ data, setCurrentUser, showPassword, setShowPassword, navigate }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [globalError, setGlobalError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (email.trim() === "") newErrors.email = "Veuillez entrer votre email.";
    if (password.trim() === "") newErrors.password = "Veuillez entrer votre mot de passe.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setGlobalError("Email et mot de passe obligatoires pour se connecter.");
      return;
    }

    try {
      const result = await apiRequest("login", { email: email.trim(), password });
      const user = result.user;

      setGlobalError("");
      setCurrentUser(user);

      if (user.role === "Administrateur") navigate("admin");
      else if (user.role === "Enseignant") navigate("teacher");
      else navigate("student");
    } catch (error) {
      setGlobalError(error.message || "Email ou mot de passe incorrect.");
    }
  };

  return (
    <main className="login-page">
      <section className="card">
        <h2 className="card-title">PAGE CONNEXION</h2>

        {globalError !== "" && <div className="global-error">{globalError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input
              className={errors.email ? "input-error" : ""}
              type="text"
              placeholder="Votre email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value.trim() !== "") setErrors((old) => ({ ...old, email: "" }));
              }}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Mot de passe</label>

            <div className="password-container">
              <input
                className={errors.password ? "input-error" : ""}
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value.trim() !== "") setErrors((old) => ({ ...old, password: "" }));
                }}
              />

              <button
                className="password-toggle"
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>

            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <button className="full-button login-button" type="submit">Connexion</button>
          <button className="full-button forgot-button" type="button">Mot de passe oublié</button>
        </form>

        <p className="back-link">Retour à <span onClick={() => navigate("accueil")}>l'accueil</span></p>
      </section>
    </main>
  );
};

const ContactPage = ({ navigate }) => {
  const [success, setSuccess] = React.useState("");

  return (
    <main className="contact-page">
      <section className="card wide-card">
        <h2 className="card-title">CONTACTEZ-NOUS</h2>

        {success !== "" && <div className="global-success">{success}</div>}

        <form onSubmit={(e) => {
          e.preventDefault();
          setSuccess("Message préparé. Connexion PHP/MySQL à faire ensuite.");
        }}>
          <div className="form-grid">
            <div className="form-group"><label>Nom complet</label><input type="text" placeholder="Votre nom"/></div>
            <div className="form-group"><label>Email</label><input type="email" placeholder="votre.email@ece.fr"/></div>
          </div>

          <div className="form-group"><label>Message</label><textarea placeholder="Écrivez votre message..."></textarea></div>

          <button className="full-button btn-primary" type="submit">Envoyer le message</button>
        </form>

        <p className="back-link">Retour à <span onClick={() => navigate("accueil")}>l'accueil</span></p>
      </section>
    </main>
  );
};

const ExplorerPage = ({ navigate }) => (
  <main className="contact-page">
    <section className="card wide-card">
      <h2 className="card-title">EXPLORER SMARTCAMPUS</h2>

      <div className="features" style={{ gridTemplateColumns:"repeat(3, 1fr)" }}>
        <div className="feature"><div className="icon">🎓</div><h3>Espace Étudiant</h3></div>
        <div className="feature"><div className="icon">👨‍🏫</div><h3>Espace Enseignant</h3></div>
        <div className="feature"><div className="icon">🛠️</div><h3>Espace Admin</h3></div>
      </div>

      <p className="back-link">Retour à <span onClick={() => navigate("accueil")}>l'accueil</span></p>
    </section>
  </main>
);

const DashboardLayout = ({
  currentUser,
  logout,
  tab,
  setTab,
  menuItems,
  children,
  footerLabel,
  notificationCount = 0,
  notificationBreakdown = { messages:0, justifications:0, total:0 },
  onNotificationClick = null,
  onUserClick = null
}) => (
  <div className="dashboard-layout">
    <header className="dashboard-topbar">
      <div className="dashboard-left">
        <div className="dashboard-brand">
          <img src="assets/ece-logo.jpg" alt="ECE Logo"/>
          <span>SmartCampus</span>
        </div>

        <button
          className={notificationCount > 0 ? "notification-badge has-notification" : "notification-badge"}
          onClick={() => onNotificationClick ? onNotificationClick() : setTab("messages")}
          title={`Messages : ${notificationBreakdown.messages} | Justificatifs : ${notificationBreakdown.justifications}`}
        >
          🔔 <span>{notificationCount}</span>
        </button>
      </div>

      <div className="dashboard-user">
        <button
          className="dashboard-user-label profile-shortcut"
          type="button"
          onClick={() => onUserClick ? onUserClick() : setTab("profile")}
          title="Ouvrir mon profil"
        >
          {currentUser.nom}
        </button>
        <button onClick={logout}>Déconnexion</button>
      </div>
    </header>

    <div className="dashboard-body">
      <aside className="dashboard-sidebar">
        {menuItems.map(([key, icon, label]) => (
          <button key={key} className={tab === key ? "sidebar-button active" : "sidebar-button"} onClick={() => setTab(key)}>
            <span>{icon}</span><span>{label}</span>
          </button>
        ))}
      </aside>

      <main className="dashboard-content">{children}</main>
    </div>

    <footer className="dashboard-footer">{footerLabel}</footer>
  </div>
);

const MessagingPage = ({ data, updateData, currentUser }) => {
  const availableRecipients = [
    "Tous",
    ...data.users
      .filter((user) => user.nom !== currentUser.nom)
      .map((user) => user.nom)
  ];

  const [to, setTo] = React.useState(availableRecipients[0] || "Tous");
  const [subject, setSubject] = React.useState("");
  const [content, setContent] = React.useState("");
  const [attachment, setAttachment] = React.useState(null);
  const [attachmentLabel, setAttachmentLabel] = React.useState("");
  const [message, setMessage] = React.useState("");

  const canSeeMessage = (item) => {
    if (currentUser.role === "Administrateur") return true;

    return (
      item.to === "Tous" ||
      item.to === currentUser.nom ||
      item.to === currentUser.email ||
      item.from === currentUser.nom ||
      item.from === currentUser.email
    );
  };

  const visibleMessages = data.messages.filter(canSeeMessage).slice().reverse();

  const handleAttachmentChange = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Format refusé. Pièces jointes acceptées : PDF, PNG, JPG, JPEG, WEBP.");
      return;
    }

    const maxSize = 3 * 1024 * 1024;

    if (file.size > maxSize) {
      setMessage("Fichier trop lourd. Taille maximale : 3 Mo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAttachment({
        name: file.name,
        type: file.type,
        data: reader.result
      });
      setAttachmentLabel(file.name);
      setMessage("Pièce jointe ajoutée : " + file.name);
    };

    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentLabel("");
    setMessage("Pièce jointe retirée.");
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (subject.trim() === "") {
      setMessage("Sujet obligatoire.");
      return;
    }

    if (content.trim() === "" && !attachment) {
      setMessage("Écrivez un message ou ajoutez une pièce jointe.");
      return;
    }

    updateData({
      ...data,
      messages: [
        ...data.messages,
        {
          id: nextId(data.messages),
          from: currentUser.nom,
          to,
          sujet: subject.trim(),
          contenu: content.trim(),
          attachmentName: attachment?.name || "",
          attachmentType: attachment?.type || "",
          attachmentData: attachment?.data || ""
        }
      ]
    });

    setSubject("");
    setContent("");
    setAttachment(null);
    setAttachmentLabel("");
    setMessage("Message envoyé.");
  };

  const replyTo = (item) => {
    setTo(item.from);
    setSubject(item.sujet.startsWith("RE:") ? item.sujet : "RE: " + item.sujet);
    setContent("");
    setAttachment(null);
    setAttachmentLabel("");
    setMessage("Réponse préparée pour " + item.from + ".");
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Messagerie</h1>
        </div>
      </div>

      {message && (
        <div className={
          message.includes("obligatoire") ||
          message.includes("Écrivez") ||
          message.includes("refusé") ||
          message.includes("trop")
            ? "global-error"
            : "global-success"
        }>
          {message}
        </div>
      )}

      <section className="panel">
        <h2 className="panel-title">Nouveau message</h2>
        <form onSubmit={sendMessage}>
          <div className="form-grid">
            <div className="form-group">
              <label>Destinataire</label>
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                {availableRecipients.map((recipient) => (
                  <option key={recipient}>{recipient}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Sujet</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Question sur un cours, absence, note..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez votre message..."
            ></textarea>
          </div>

          <div className="form-group">
            <label>Pièce jointe</label>
            <input
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => handleAttachmentChange(e.target.files[0])}
            />

            {attachmentLabel && (
              <div className="attachment-preview">
                <span>📎 {attachmentLabel}</span>
                <button type="button" className="btn-small btn-danger" onClick={removeAttachment}>
                  Retirer
                </button>
              </div>
            )}
          </div>

          <button className="btn-primary" type="submit">Envoyer</button>
        </form>
      </section>

      <section className="panel">
        <h2 className="panel-title">Messages</h2>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>De</th>
                <th>À</th>
                <th>Sujet</th>
                <th>Message</th>
                <th>Pièce jointe</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleMessages.map((item) => (
                <tr key={item.id}>
                  <td>{item.from}</td>
                  <td>{item.to}</td>
                  <td>{item.sujet}</td>
                  <td>{item.contenu || "Pièce jointe seule"}</td>
                  <td>
                    {item.attachmentData ? (
                      <a
                        href={item.attachmentData}
                        download={item.attachmentName || "piece_jointe"}
                        target="_blank"
                      >
                        📎 {item.attachmentName || "Télécharger"}
                      </a>
                    ) : (
                      "Aucune"
                    )}
                  </td>
                  <td>
                    <button className="btn-small" onClick={() => replyTo(item)}>
                      Répondre
                    </button>
                  </td>
                </tr>
              ))}

              {visibleMessages.length === 0 && (
                <tr>
                  <td colSpan="6">Aucun message.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};


const GenericTable = ({ title, subtitle, items, columns }) => (
  <>
    <div className="page-header"><div><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}</div></div>
    <section className="panel">
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr>{columns.map(([key, label]) => <th key={key}>{label}</th>)}</tr></thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index}>
                {columns.map(([key]) => <td key={key}>{item[key]}</td>)}
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={columns.length}>Aucune donnée disponible.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  </>
);

const DashboardHome = ({ data, setAdminTab }) => (
  <>
    <div className="page-header">
      <div><h1>Tableau de bord administrateur</h1></div>
      <button className="btn-primary" onClick={() => setAdminTab("users")}>+ Créer un compte</button>
    </div>

    <section className="dashboard-grid">
      <div className="metric-card"><h3>Utilisateurs</h3><strong>{data.users.length}</strong></div>
      <div className="metric-card"><h3>Étudiants</h3><strong>{data.students.length}</strong></div>
      <div className="metric-card"><h3>Enseignants</h3><strong>{data.teachers.length}</strong></div>
      <div className="metric-card"><h3>Cours</h3><strong>{data.courses.length}</strong></div>
    </section>

    <section className="panel">
      <h2 className="panel-title">Fonctionnalités prêtes pour la démo</h2>
      <div className="features" style={{ marginBottom:0 }}>
        <div className="feature"><div className="icon">👤</div><h3>Comptes</h3></div>
        <div className="feature"><div className="icon">📚</div><h3>Inscriptions</h3></div>
        <div className="feature"><div className="icon">✅</div><h3>Présences QR</h3></div>
        <div className="feature"><div className="icon">📈</div><h3>Statistiques</h3></div>
      </div>
    </section>
  </>
);

const AccountsStudentsTeachersPage = ({
  data,
  updateData,
  currentUser,
  createStudent,
  createTeacher,
  updateStudent,
  updateTeacher,
  deleteStudent,
  deleteTeacher
}) => {
  const [section, setSection] = React.useState("accounts");

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Comptes</h1>
        </div>
      </div>

      <section className="panel admin-combined-tabs">
        <button
          className={section === "accounts" ? "btn-primary" : ""}
          onClick={() => setSection("accounts")}
        >
          👤 Comptes
        </button>

        <button
          className={section === "students" ? "btn-primary" : ""}
          onClick={() => setSection("students")}
        >
          🎓 Étudiants
        </button>

        <button
          className={section === "teachers" ? "btn-primary" : ""}
          onClick={() => setSection("teachers")}
        >
          👨‍🏫 Enseignants
        </button>
      </section>

      {section === "accounts" && (
        <UsersAdmin
          data={data}
          updateData={updateData}
          currentUser={currentUser}
        />
      )}

      {section === "students" && (
        <SimpleCrudPage
          title="Gestion des étudiants"
          subtitle=""
          type="Étudiant"
          items={data.students.map((student) => ({
            ...student,
            compte: data.users.find((user) => user.id === student.user_id)?.email || "Aucun compte lié"
          }))}
          columns={[
            {key:"nom",label:"Nom"},
            {key:"compte",label:"Compte"},
            {key:"email",label:"Email"},
            {key:"niveau",label:"Niveau"},
            {key:"groupe",label:"Groupe"},
            {key:"moyenne",label:"Moyenne"},
            {key:"absences",label:"Absences"}
          ]}
          formFields={[
            {name:"nom",label:"Nom complet",placeholder:"Nom étudiant"},
            {name:"email",label:"Email",placeholder:"email@ece.fr"},
            {name:"niveau",label:"Niveau",type:"select",options:EVENT_LEVELS},
            {name:"groupe",label:"Groupe",placeholder:"A"},
            {name:"moyenne",label:"Moyenne",placeholder:"14.5",type:"number"},
            {name:"absences",label:"Absences",placeholder:"0",type:"number"}
          ]}
          onCreate={createStudent}
          onUpdate={updateStudent}
          onDelete={deleteStudent}
        />
      )}

      {section === "teachers" && (
        <SimpleCrudPage
          title="Gestion des enseignants"
          subtitle=""
          type="Enseignant"
          items={data.teachers.map((teacher) => ({
            ...teacher,
            compte: data.users.find((user) => user.id === teacher.user_id)?.email || "Aucun compte lié"
          }))}
          columns={[
            {key:"nom",label:"Nom"},
            {key:"compte",label:"Compte"},
            {key:"email",label:"Email"},
            {key:"departement",label:"Département"},
            {key:"cours",label:"Cours associé"}
          ]}
          formFields={[
            {name:"nom",label:"Nom complet",placeholder:"Nom enseignant"},
            {name:"email",label:"Email",placeholder:"email@ece.fr"},
            {name:"departement",label:"Département",placeholder:"Informatique"},
            {name:"cours",label:"Cours associé",placeholder:"Développement Web"}
          ]}
          onCreate={createTeacher}
          onUpdate={updateTeacher}
          onDelete={deleteTeacher}
        />
      )}
    </>
  );
};

const UsersAdmin = ({ data, updateData, currentUser }) => {
  const [form, setForm] = React.useState({ nom:"", email:"", password:"", role:"Étudiant" });
  const [roleFilter, setRoleFilter] = React.useState("Tous");
  const [bulkRole, setBulkRole] = React.useState("Étudiant");
  const [bulkStatus, setBulkStatus] = React.useState("Inactif");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const createUser = (e) => {
    e.preventDefault();
    setMessage(""); setError("");

    if (!form.nom.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Nom, email et mot de passe sont obligatoires.");
      return;
    }

    if (data.users.some((user) => user.email === form.email.trim())) {
      setError("Cet email existe déjà.");
      return;
    }

    const newUser = {
      id: nextId(data.users),
      nom: form.nom.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      statut: "Actif"
    };

    const newData = { ...data, users:[...data.users, newUser] };

    if (form.role === "Étudiant") {
      newData.students = [...data.students, { id:nextId(data.students), user_id:newUser.id, nom:form.nom.trim(), email:form.email.trim(), niveau:"ING2", groupe:"Non affecté", moyenne:0, absences:0, courseIds:[] }];
    }

    if (form.role === "Enseignant") {
      newData.teachers = [...data.teachers, { id:nextId(data.teachers), user_id:newUser.id, nom:form.nom.trim(), email:form.email.trim(), departement:"Non affecté", cours:"Non affecté" }];
    }

    updateData(newData);
    setForm({ nom:"", email:"", password:"", role:"Étudiant" });
    setMessage("Compte créé correctement.");
  };

  const deleteUser = (id) => {
    const user = data.users.find((item) => item.id === id);
    if (!user) return;

    if (user.id === currentUser.id) {
      setError("Vous ne pouvez pas supprimer le compte administrateur connecté.");
      setMessage("");
      return;
    }

    updateData({
      ...data,
      users:data.users.filter((item) => item.id !== id),
      students:user.role === "Étudiant" ? data.students.filter((s) => s.email !== user.email) : data.students,
      teachers:user.role === "Enseignant" ? data.teachers.filter((t) => t.email !== user.email) : data.teachers
    });

    setMessage("Compte supprimé correctement.");
    setError("");
  };

  const changeUserStatus = (id, nextStatus) => {
    const user = data.users.find((item) => item.id === id);

    if (!user) return;

    if (user.id === currentUser.id && nextStatus === "Inactif") {
      setError("Vous ne pouvez pas désactiver le compte administrateur connecté.");
      setMessage("");
      return;
    }

    updateData({
      ...data,
      users: data.users.map((item) =>
        item.id === id ? { ...item, statut: nextStatus } : item
      )
    });

    setMessage(nextStatus === "Actif"
      ? "Compte réactivé. L'utilisateur peut accéder au site."
      : "Compte désactivé. L'utilisateur ne peut plus accéder au site."
    );
    setError("");
  };

  const applyBulkStatus = () => {
    const updatedUsers = data.users.map((user) => {
      const isCurrentAdmin = user.id === currentUser.id;
      const roleMatches = bulkRole === "Tous" || user.role === bulkRole;

      if (!roleMatches) return user;

      if (isCurrentAdmin && bulkStatus === "Inactif") {
        return user;
      }

      return { ...user, statut: bulkStatus };
    });

    const changedCount = updatedUsers.filter((user, index) =>
      user.statut !== data.users[index].statut
    ).length;

    updateData({
      ...data,
      users: updatedUsers
    });

    setMessage(
      changedCount + " compte(s) mis à jour. Le compte admin connecté est protégé."
    );
    setError("");
  };

  const filteredUsers = roleFilter === "Tous"
    ? data.users
    : data.users.filter((user) => user.role === roleFilter);

  return (
    <>
      <div className="page-header"><div><h1>Gestion des comptes</h1></div></div>

      <section className="panel">
        <h2 className="panel-title">Créer un compte</h2>
        {message && <div className="global-success">{message}</div>}
        {error && <div className="global-error">{error}</div>}

        <form onSubmit={createUser}>
          <div className="form-grid">
            <div className="form-group"><label>Nom complet</label><input value={form.nom} onChange={(e) => setForm({...form, nom:e.target.value})} placeholder="Ex : Yassine Amrani"/></div>
            <div className="form-group"><label>Email / identifiant</label><input value={form.email} onChange={(e) => setForm({...form, email:e.target.value})} placeholder="exemple@ece.fr"/></div>
            <div className="form-group"><label>Mot de passe</label><input value={form.password} onChange={(e) => setForm({...form, password:e.target.value})} placeholder="Mot de passe initial"/></div>
            <div className="form-group">
              <label>Rôle</label>
              <select value={form.role} onChange={(e) => setForm({...form, role:e.target.value})}>
                <option>Étudiant</option><option>Enseignant</option><option>Administrateur</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" type="submit">Créer le compte</button>
        </form>
      </section>

      <section className="panel">
        <h2 className="panel-title">Activation / désactivation par rôle</h2>
        <div className="bulk-status-controls">
          <div className="form-group">
            <label>Rôle</label>
            <select value={bulkRole} onChange={(e) => setBulkRole(e.target.value)}>
              <option>Étudiant</option>
              <option>Enseignant</option>
              <option>Administrateur</option>
              <option>Tous</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nouveau statut</label>
            <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>

          <button type="button" className="btn-primary" onClick={applyBulkStatus}>
            Appliquer
          </button>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Liste des comptes</h2>

        <div className="account-filter-row">
          <div className="form-group">
            <label>Trier / filtrer par rôle</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option>Tous</option>
              <option>Administrateur</option>
              <option>Étudiant</option>
              <option>Enseignant</option>
            </select>
          </div>

          <div className="filter-summary">
            {filteredUsers.length} compte(s) affiché(s)
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Action</th></tr></thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.nom}</td>
                  <td>{user.email}</td>
                  <td><span className="role-pill">{user.role}</span></td>
                  <td>
                    <select
                      className={user.statut === "Actif" ? "status-select active" : "status-select inactive"}
                      value={user.statut}
                      onChange={(e) => changeUserStatus(user.id, e.target.value)}
                    >
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-danger btn-small" onClick={() => deleteUser(user.id)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

const SimpleCrudPage = ({ title, subtitle, type, items, columns, formFields, onCreate, onUpdate, onDelete, filterFields = [] }) => {
  const initialForm = formFields.reduce((acc, field) => {
    if (field.type === "schedule") {
      return {
        ...acc,
        [field.name + "Date"]:"",
        [field.name + "Time"]:"",
        [field.name + "Period"]:"AM",
        [field.name]:""
      };
    }

    return { ...acc, [field.name]:"" };
  }, {});
  const [form, setForm] = React.useState(initialForm);
  const [editingId, setEditingId] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState(columns[0]?.key || "");
  const [filters, setFilters] = React.useState(() => filterFields.reduce((acc, field) => ({ ...acc, [field.key]:"Tous" }), {}));
  const [message, setMessage] = React.useState("");

  const filtered = items
    .filter((item) => Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase()))
    .filter((item) => filterFields.every((field) => {
      const value = filters[field.key] || "Tous";
      if (value === "Tous") return true;
      return String(item[field.key] ?? "") === String(value);
    }))
    .sort((a,b) => String(a[sortKey] || "").localeCompare(String(b[sortKey] || "")));

  const submit = (e) => {
    e.preventDefault();
    const preparedForm = { ...form };

    formFields.forEach((field) => {
      if (field.type === "schedule") {
        preparedForm[field.name] = `${form[field.name + "Date"]} ${form[field.name + "Time"]} ${form[field.name + "Period"]}`.trim();
      }
    });

    const hasEmpty = formFields.some((field) => {
      if (field.type === "schedule") {
        return (
          String(preparedForm[field.name + "Date"] || "").trim() === "" ||
          String(preparedForm[field.name + "Time"] || "").trim() === "" ||
          String(preparedForm[field.name + "Period"] || "").trim() === ""
        );
      }

      return String(preparedForm[field.name]).trim() === "";
    });
    if (hasEmpty) {
      setMessage("Tous les champs sont obligatoires.");
      return;
    }

    if (editingId) {
      onUpdate(editingId, preparedForm);
      setMessage(type + " modifié correctement.");
    } else {
      onCreate(preparedForm);
      setMessage(type + " ajouté correctement.");
    }

    setEditingId(null);
    setForm(initialForm);
  };

  const startEdit = (item) => {
    const next = {};

    formFields.forEach((field) => {
      if (field.type === "schedule") {
        const rawValue = item[field.name] || "";
        const parts = rawValue.split(" ");
        next[field.name + "Date"] = parts[0] || "";
        next[field.name + "Time"] = parts[1] || "";
        next[field.name + "Period"] = parts[2] || "AM";
        next[field.name] = rawValue;
      } else {
        next[field.name] = item[field.name] ?? "";
      }
    });

    setForm(next);
    setEditingId(item.id);
    setMessage("Mode modification activé.");
  };

  return (
    <>
      <div className="page-header"><div><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}</div></div>

      <section className="panel">
        <h2 className="panel-title">{editingId ? "Modifier" : "Ajouter"}</h2>
        {message && <div className={message.includes("obligatoires") ? "global-error" : "global-success"}>{message}</div>}

        <form onSubmit={submit}>
          <div className="form-grid">
            {formFields.map((field) => (
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>

                {field.type === "select" ? (
                  <select
                    value={form[field.name]}
                    onChange={(e) => setForm({...form, [field.name]:e.target.value})}
                  >
                    <option value="">Choisir...</option>
                    {(field.options || []).map((option) => {
                      const optionValue = typeof option === "object" ? option.value : option;
                      const optionLabel = typeof option === "object" ? option.label : option;
                      return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
                    })}
                  </select>
                ) : field.type === "schedule" ? (
                  <div className="schedule-fields">
                    <input
                      type="date"
                      value={form[field.name + "Date"] || ""}
                      onChange={(e) => setForm({...form, [field.name + "Date"]:e.target.value})}
                    />

                    <input
                      type="time"
                      value={form[field.name + "Time"] || ""}
                      onChange={(e) => setForm({...form, [field.name + "Time"]:e.target.value})}
                    />

                    <select
                      value={form[field.name + "Period"] || "AM"}
                      onChange={(e) => setForm({...form, [field.name + "Period"]:e.target.value})}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                ) : (
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={(e) => setForm({...form, [field.name]:e.target.value})}
                  />
                )}
              </div>
            ))}
          </div>

          <button className="btn-primary" type="submit">{editingId ? "Enregistrer la modification" : "Ajouter"}</button>
          {editingId && <button type="button" style={{ marginLeft:"10px" }} onClick={() => { setEditingId(null); setForm(initialForm); }}>Annuler</button>}
        </form>
      </section>

      <section className="panel">
        <h2 className="panel-title">Liste</h2>
        <div className="search-row">
          <input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}/>
          {filterFields.map((field) => (
            <select
              key={field.key}
              value={filters[field.key] || "Tous"}
              onChange={(e) => setFilters({...filters, [field.key]:e.target.value})}
            >
              <option value="Tous">{field.label} : Tous</option>
              {(field.options || []).map((option) => (
                <option key={option} value={option}>{field.label} : {option}</option>
              ))}
            </select>
          ))}
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            {columns.map((column) => <option key={column.key} value={column.key}>Trier par {column.label}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  {columns.map((column) => <td key={column.key}>{item[column.key]}</td>)}
                  <td>
                    <div className="row-actions">
                      <button className="btn-small" onClick={() => startEdit(item)}>Modifier</button>
                      <button className="btn-danger btn-small" onClick={() => onDelete(item.id)}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={columns.length + 1}>Aucun résultat.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

const CourseManagementPage = ({ data, updateData, createCourse, updateById, deleteById }) => {
  const [sessionForm, setSessionForm] = React.useState({
    courseId: data.courses[0]?.id || "",
    date: "",
    time: "",
    endTime: "",
    salle: ""
  });
  const [sessionMessage, setSessionMessage] = React.useState("");

  const addSession = (e) => {
    e.preventDefault();

    if (!sessionForm.courseId || !sessionForm.date || !sessionForm.time || !sessionForm.endTime || !sessionForm.salle) {
      setSessionMessage("Tous les champs de séance sont obligatoires.");
      return;
    }

    if (timeToMinutes(sessionForm.endTime) <= timeToMinutes(sessionForm.time)) {
      setSessionMessage("Erreur : l'heure de fin doit être après l'heure de début.");
      return;
    }

    const selectedCourse = data.courses.find((course) => course.id === Number(sessionForm.courseId));
    if (!selectedCourse) {
      setSessionMessage("Veuillez sélectionner un cours.");
      return;
    }

    const candidateSession = {
      id: 0,
      courseId: selectedCourse.id,
      courseName: selectedCourse.nom,
      date: sessionForm.date,
      time: sessionForm.time,
      endTime: sessionForm.endTime,
      salle: sessionForm.salle.trim()
    };

    const roomConflict = getRoomConflict(data, candidateSession);

    if (roomConflict) {
      setSessionMessage("Conflit salle : " + roomConflict.salle + " est déjà occupée par " + roomConflict.courseName + " le " + formatSessionDateTime(roomConflict) + ".");
      return;
    }

    const classConflict = getClassSessionConflict(data, candidateSession);

    if (classConflict) {
      setSessionMessage(
        "Conflit classe : " + classConflict.classe +
        " a déjà " + classConflict.session.courseName +
        " le " + formatSessionDateTime(classConflict.session) +
        ". Une classe ne peut pas avoir deux cours en même temps."
      );
      return;
    }

    updateData({
      ...data,
      courseSessions: [
        ...(data.courseSessions || []),
        {
          ...candidateSession,
          id: nextId(data.courseSessions || [])
        }
      ]
    });

    setSessionForm({
      courseId: data.courses[0]?.id || "",
      date: "",
      time: "",
      endTime: "",
      salle: ""
    });
    setSessionMessage("Séance ajoutée correctement.");
  };

  const deleteSession = (id) => {
    updateData({
      ...data,
      courseSessions: (data.courseSessions || []).filter((session) => session.id !== id),
      attendanceSessions: (data.attendanceSessions || []).filter((session) => Number(session.sessionId) !== Number(id)),
      attendances: (data.attendances || []).filter((attendance) => Number(attendance.sessionId) !== Number(id)),
      absenceJustifications: (data.absenceJustifications || []).filter((request) => Number(request.sessionId) !== Number(id))
    });

    setSessionMessage("Séance supprimée.");
  };

  return (
    <>
      <SimpleCrudPage
        title="Gestion des cours"
        subtitle=""
        type="Cours"
        items={data.courses.map((course) => {
          const linkedModule = (data.modules || []).find((module) =>
            (module.courseIds || []).map(Number).includes(Number(course.id))
          );
          return {
            ...course,
            moduleId: linkedModule?.id || "",
            moduleName: linkedModule?.nom || "—",
            seances: getCourseSessions(data, course.id).length
          };
        })}
        columns={[
          {key:"code",label:"Code"},
          {key:"nom",label:"Cours"},
          {key:"enseignant",label:"Enseignant"},
          {key:"moduleName",label:"Module"},
          {key:"semestre",label:"Semestre"},
          {key:"capacite",label:"Capacité"},
          {key:"inscrits",label:"Inscrits"},
          {key:"seances",label:"Séances"}
        ]}
        formFields={[
          {name:"nom",label:"Nom du cours",placeholder:"Développement Web"},
          {
            name:"enseignant",
            label:"Enseignant",
            type:"select",
            options:data.teachers.map((teacher) => teacher.nom)
          },
          {
            name:"moduleId",
            label:"Module",
            type:"select",
            options:(data.modules || []).map((module) => ({ value:String(module.id), label:`${module.code} — ${module.nom}` }))
          },
          {name:"semestre",label:"Semestre",type:"select",options:SEMESTERS},
          {name:"capacite",label:"Capacité",placeholder:"30",type:"number"}
        ]}
        onCreate={createCourse}
        onUpdate={(id, form) => {
          const existingCourse = data.courses.find((course) => course.id === id);
          const selectedModuleId = Number(form.moduleId);
          const selectedModule = (data.modules || []).find((module) => Number(module.id) === selectedModuleId);
          const { moduleId, ...courseForm } = form;

          if (selectedModule && courseForm.semestre !== selectedModule.semestre) {
            alert("Le semestre du cours doit correspondre au semestre du module choisi.");
            return;
          }

          updateData({
            ...data,
            courses:(data.courses || []).map((course) => Number(course.id) === Number(id) ? {
              ...course,
              ...courseForm,
              code: existingCourse?.code || generateCourseCode(data.courses),
              salle: "Voir séances",
              horaire: "Voir séances",
              capacite:Number(courseForm.capacite),
              inscrits: getCourseRegisteredCount(data, id)
            } : course),
            modules:(data.modules || []).map((module) => {
              const currentIds = (module.courseIds || []).map(Number).filter((courseId) => Number(courseId) !== Number(id));
              return {
                ...module,
                courseIds:Number(module.id) === selectedModuleId
                  ? Array.from(new Set([...currentIds, Number(id)]))
                  : currentIds
              };
            })
          });
        }}
        filterFields={[
          { key:"enseignant", label:"Enseignant", options:getAvailableTeachersFromCourses(data.courses) },
          { key:"moduleName", label:"Module", options:[...new Set((data.modules || []).map((module) => module.nom).filter(Boolean))].sort() },
          { key:"semestre", label:"Semestre", options:SEMESTERS }
        ]}
        onDelete={(id) => {
          updateData({
            ...data,
            courses: data.courses.filter((course) => course.id !== id),
            courseSessions: (data.courseSessions || []).filter((session) => session.courseId !== id),
            modules: (data.modules || []).map((module) => ({
              ...module,
              courseIds: (module.courseIds || []).filter((courseId) => Number(courseId) !== Number(id))
            }))
          });
        }}
      />

      <section className="panel">
        <h2 className="panel-title">Gestion des séances</h2>
        {sessionMessage && (
          <div className={sessionMessage.includes("Conflit") || sessionMessage.includes("obligatoires") || sessionMessage.includes("Erreur") ? "global-error" : "global-success"}>
            {sessionMessage}
          </div>
        )}

        <form onSubmit={addSession}>
          <div className="session-form-grid">
            <div className="form-group">
              <label>Cours</label>
              <select
                value={sessionForm.courseId}
                onChange={(e) => setSessionForm({...sessionForm, courseId:e.target.value})}
              >
                {data.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} — {course.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={sessionForm.date}
                onChange={(e) => setSessionForm({...sessionForm, date:e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Heure début</label>
              <input
                type="time"
                value={sessionForm.time}
                onChange={(e) => setSessionForm({...sessionForm, time:e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Heure fin</label>
              <input
                type="time"
                value={sessionForm.endTime}
                onChange={(e) => setSessionForm({...sessionForm, endTime:e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Salle</label>
              <input
                value={sessionForm.salle}
                onChange={(e) => setSessionForm({...sessionForm, salle:e.target.value})}
                placeholder="A203"
              />
            </div>
          </div>

          <button className="btn-primary" type="submit">Ajouter la séance</button>
        </form>
      </section>

      <section className="panel">
        <h2 className="panel-title">Liste des séances</h2>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Date</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Salle</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {(data.courseSessions || []).map((session) => (
                <tr key={session.id}>
                  <td>{session.courseName}</td>
                  <td>{session.date}</td>
                  <td>{getSessionStartTime(session)}</td>
                  <td>{getSessionEndTime(session)}</td>
                  <td>{session.salle}</td>
                  <td>
                    <button className="btn-danger btn-small" onClick={() => deleteSession(session.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}

              {(data.courseSessions || []).length === 0 && (
                <tr>
                  <td colSpan="6">Aucune séance.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

const AdminEventsPage = ({ data, updateData }) => {
  const emptyForm = {
    title: "",
    date: today(),
    startTime: "09:00",
    endTime: "11:00",
    lieu: "",
    capacity: 30,
    eligibleLevels: ["ING2"],
    courseId: "",
    description: ""
  };

  const [form, setForm] = React.useState(emptyForm);
  const [editingEventId, setEditingEventId] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [selectedEventId, setSelectedEventId] = React.useState((data.events || [])[0]?.id || "");
  const [studentSearch, setStudentSearch] = React.useState("");
  const [studentId, setStudentId] = React.useState("");

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const toggleLevel = (level) => {
    const levels = normalizeEventLevels(form.eligibleLevels);
    updateForm(
      "eligibleLevels",
      levels.includes(level) ? levels.filter((item) => item !== level) : [...levels, level]
    );
  };

  const resetEventForm = () => {
    setEditingEventId(null);
    setForm(emptyForm);
  };

  const startEditEvent = (event) => {
    setMessage("");
    setError("");
    setEditingEventId(event.id);
    setForm({
      title: event.title || "",
      date: event.date || today(),
      startTime: event.startTime || "09:00",
      endTime: event.endTime || "11:00",
      lieu: event.lieu || "",
      capacity: event.capacity || 30,
      eligibleLevels: normalizeEventLevels(event.eligibleLevels),
      courseId: event.courseId || "",
      description: event.description || ""
    });
    setSelectedEventId(event.id);
  };

  const validateEventForm = () => {
    const title = form.title.trim();
    const lieu = form.lieu.trim();
    const levels = normalizeEventLevels(form.eligibleLevels);
    const capacity = Number(form.capacity);

    if (!title || !form.date || !form.startTime || !form.endTime || !lieu) {
      return { error: "Remplissez tous les champs obligatoires." };
    }

    if (timeToMinutes(form.endTime) <= timeToMinutes(form.startTime)) {
      return { error: "L'heure de fin doit être après l'heure de début." };
    }

    if (!Number.isFinite(capacity) || capacity <= 0) {
      return { error: "La capacité doit être supérieure à 0." };
    }

    if (levels.length === 0) {
      return { error: "Sélectionnez au moins une qualification ING." };
    }

    return {
      event: {
        id: editingEventId || nextId(data.events || []),
        title,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        lieu,
        capacity,
        eligibleLevels: levels,
        courseId: form.courseId ? Number(form.courseId) : "",
        description: form.description.trim()
      }
    };
  };

  const validateExistingRegistrationsForEvent = (event) => {
    const registrations = (data.eventRegistrations || []).filter((registration) => Number(registration.eventId) === Number(event.id));

    if (registrations.length > Number(event.capacity)) {
      return "La capacité est inférieure au nombre d'inscrits actuels.";
    }

    for (const registration of registrations) {
      const student = (data.students || []).find((item) => Number(item.id) === Number(registration.studentId));
      if (!student) continue;

      const reason = getEventRegistrationBlockReason(data, event, student, { ignoreAlreadyRegistered:true, ignoreCapacity:true });
      if (reason) return reason;
    }

    return "";
  };

  const submitEvent = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const validation = validateEventForm();
    if (validation.error) {
      setError(validation.error);
      return;
    }

    const event = validation.event;

    if (editingEventId) {
      const registrationProblem = validateExistingRegistrationsForEvent(event);
      if (registrationProblem) {
        setError(registrationProblem);
        return;
      }

      updateData({
        ...data,
        events: (data.events || []).map((item) => Number(item.id) === Number(editingEventId) ? event : item)
      });
      setSelectedEventId(event.id);
      resetEventForm();
      setMessage("Événement modifié.");
      return;
    }

    updateData({ ...data, events: [...(data.events || []), event] });
    setSelectedEventId(event.id);
    setForm(emptyForm);
    setMessage("Événement créé.");
  };

  const deleteEvent = (id) => {
    updateData({
      ...data,
      events: (data.events || []).filter((event) => Number(event.id) !== Number(id)),
      eventRegistrations: (data.eventRegistrations || []).filter((registration) => Number(registration.eventId) !== Number(id))
    });
    if (Number(selectedEventId) === Number(id)) setSelectedEventId((data.events || []).find((event) => Number(event.id) !== Number(id))?.id || "");
    if (Number(editingEventId) === Number(id)) resetEventForm();
    setMessage("Événement supprimé.");
    setError("");
  };

  const selectedEvent = (data.events || []).find((event) => Number(event.id) === Number(selectedEventId)) || null;
  const filteredStudents = (data.students || []).filter((student) => {
    const query = studentSearch.trim().toLowerCase();
    const matchesQuery = !query || `${student.nom} ${student.email} ${student.niveau}-${student.groupe}`.toLowerCase().includes(query);
    return matchesQuery && (!selectedEvent || isEventEligibleForStudent(data, selectedEvent, student));
  });

  React.useEffect(() => {
    if (!studentId && filteredStudents[0]) {
      setStudentId(filteredStudents[0].id);
    }
    if (studentId && !filteredStudents.some((student) => Number(student.id) === Number(studentId))) {
      setStudentId(filteredStudents[0]?.id || "");
    }
  }, [studentSearch, selectedEventId, data.students.length, data.eventRegistrations.length]);

  const registerStudent = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedEvent) {
      setError("Sélectionnez un événement.");
      return;
    }

    const student = (data.students || []).find((item) => Number(item.id) === Number(studentId));
    if (!student) {
      setError("Sélectionnez un étudiant.");
      return;
    }

    const reason = getEventRegistrationBlockReason(data, selectedEvent, student);
    if (reason) {
      setError(reason);
      return;
    }

    updateData({
      ...data,
      eventRegistrations: [
        ...(data.eventRegistrations || []),
        {
          id: nextId(data.eventRegistrations || []),
          eventId: selectedEvent.id,
          studentId: student.id,
          studentName: student.nom,
          registeredBy: "Administration",
          registeredAt: today()
        }
      ]
    });

    setMessage("Étudiant inscrit à l'événement.");
  };

  const unregisterStudent = (id) => {
    updateData({
      ...data,
      eventRegistrations: (data.eventRegistrations || []).filter((registration) => Number(registration.id) !== Number(id))
    });
    setMessage("Inscription supprimée.");
    setError("");
  };

  const registrations = (data.eventRegistrations || []).map((registration) => {
    const event = (data.events || []).find((item) => Number(item.id) === Number(registration.eventId));
    return { ...registration, event };
  });

  return (
    <>
      <section className="panel">
        <h2 className="panel-title">{editingEventId ? "Modifier un événement" : "Créer un événement"}</h2>
        {message && <div className="global-success">{message}</div>}
        {error && <div className="global-error">{error}</div>}

        <form onSubmit={submitEvent}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nom</label>
              <input value={form.title} onChange={(e) => updateForm("title", e.target.value)} placeholder="Forum entreprises" />
            </div>
            <div className="form-group">
              <label>Lieu</label>
              <input value={form.lieu} onChange={(e) => updateForm("lieu", e.target.value)} placeholder="Amphi ECE" />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => updateForm("date", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Capacité</label>
              <input type="number" min="1" value={form.capacity} onChange={(e) => updateForm("capacity", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Début</label>
              <input type="time" value={form.startTime} onChange={(e) => updateForm("startTime", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fin</label>
              <input type="time" value={form.endTime} onChange={(e) => updateForm("endTime", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cours lié</label>
              <select value={form.courseId} onChange={(e) => updateForm("courseId", e.target.value)}>
                <option value="">Aucun</option>
                {(data.courses || []).map((course) => (
                  <option key={course.id} value={course.id}>{course.nom}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Optionnel" />
            </div>
          </div>

          <div className="form-group">
            <label>Qualifications autorisées</label>
            <div className="event-levels">
              {EVENT_LEVELS.map((level) => (
                <label key={level} className="level-check">
                  <input type="checkbox" checked={normalizeEventLevels(form.eligibleLevels).includes(level)} onChange={() => toggleLevel(level)} />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="row-actions">
            <button className="btn-primary" type="submit">{editingEventId ? "Enregistrer" : "Créer"}</button>
            {editingEventId && <button className="btn-small" type="button" onClick={resetEventForm}>Annuler</button>}
          </div>
        </form>
      </section>

      <section className="panel">
        <h2 className="panel-title">Inscrire un étudiant</h2>
        <form onSubmit={registerStudent}>
          <div className="form-grid">
            <div className="form-group">
              <label>Événement</label>
              <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
                {(data.events || []).map((event) => (
                  <option key={event.id} value={event.id}>{event.title} — {formatEventSlot(event)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Recherche étudiant</label>
              <input value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Nom, email, classe" />
            </div>
            <div className="form-group">
              <label>Étudiant</label>
              <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                {filteredStudents.map((student) => {
                  const conflict = selectedEvent ? getStudentEventScheduleConflict(data, selectedEvent, student) : null;
                  const label = `${student.nom} — ${getClassKey(student)}${conflict ? " — conflit horaire" : ""}`;
                  return <option key={student.id} value={student.id}>{label}</option>;
                })}
              </select>
            </div>
          </div>
          <button className="btn-primary" type="submit">Inscrire</button>
        </form>
      </section>

      <section className="panel">
        <h2 className="panel-title">Événements</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Événement</th><th>Date</th><th>Lieu</th><th>Qualifications</th><th>Cours lié</th><th>Inscrits</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(data.events || []).map((event) => {
                const course = getEventCourse(data, event);
                return (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{formatEventSlot(event)}</td>
                    <td>{event.lieu}</td>
                    <td>{normalizeEventLevels(event.eligibleLevels).join(", ")}</td>
                    <td>{course ? course.nom : "—"}</td>
                    <td>{getEventRegisteredCount(data, event.id)} / {event.capacity}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn-small" type="button" onClick={() => startEditEvent(event)}>Modifier</button>
                        <button className="btn-danger btn-small" type="button" onClick={() => deleteEvent(event.id)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(data.events || []).length === 0 && <tr><td colSpan="7">Aucun événement.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Inscriptions aux événements</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Étudiant</th><th>Événement</th><th>Date</th><th>Inscrit par</th><th>Action</th></tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id}>
                  <td>{registration.studentName}</td>
                  <td>{registration.event?.title || "Événement supprimé"}</td>
                  <td>{registration.event ? formatEventSlot(registration.event) : "—"}</td>
                  <td>{registration.registeredBy}</td>
                  <td><button className="btn-danger btn-small" type="button" onClick={() => unregisterStudent(registration.id)}>Désinscrire</button></td>
                </tr>
              ))}
              {registrations.length === 0 && <tr><td colSpan="5">Aucune inscription.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

const EnrollmentPage = ({ data, updateData }) => {
  const [section, setSection] = React.useState("modules");
  const classes = getAvailableClasses(data);
  const [classe, setClasse] = React.useState(classes[0]?.key || "");
  const [moduleId, setModuleId] = React.useState((data.modules || [])[0]?.id || "");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [moduleForm, setModuleForm] = React.useState({ code:"", nom:"", semestre:"S1", coefficient:"1" });
  const [moduleMessage, setModuleMessage] = React.useState("");
  const [moduleError, setModuleError] = React.useState("");

  const createModule = (e) => {
    e.preventDefault();
    setModuleMessage("");
    setModuleError("");

    const code = moduleForm.code.trim().toUpperCase();
    const nom = moduleForm.nom.trim();
    const semestre = moduleForm.semestre.trim();
    const coefficient = Number(moduleForm.coefficient);

    if (!code || !nom || !semestre || Number.isNaN(coefficient) || coefficient <= 0) {
      setModuleError("Veuillez remplir le code, le nom, le semestre et un coefficient valide.");
      return;
    }

    const duplicate = (data.modules || []).some((module) =>
      String(module.code || "").toUpperCase() === code || String(module.nom || "").toLowerCase() === nom.toLowerCase()
    );

    if (duplicate) {
      setModuleError("Ce module existe déjà.");
      return;
    }

    const newModule = {
      id: nextId(data.modules || []),
      code,
      nom,
      semestre,
      coefficient,
      courseIds: []
    };

    updateData({
      ...data,
      modules: [...(data.modules || []), newModule],
      grades: ensureGradesForModule({ ...data, modules:[...(data.modules || []), newModule] }, newModule.id, data.grades || [])
    });

    setModuleId(newModule.id);
    setModuleForm({ code:"", nom:"", semestre, coefficient:"1" });
    setModuleMessage("Module créé correctement.");
  };

  const deleteModule = (id) => {
    const module = (data.modules || []).find((item) => Number(item.id) === Number(id));
    const usedByClass = (data.classEnrollments || []).some((enrollment) => Number(enrollment.moduleId) === Number(id));
    const hasCourses = (module?.courseIds || []).length > 0;

    if (usedByClass) {
      setModuleError("Impossible de supprimer ce module : une classe y est inscrite.");
      setModuleMessage("");
      return;
    }

    if (hasCourses) {
      setModuleError("Impossible de supprimer ce module : des cours y sont encore associés.");
      setModuleMessage("");
      return;
    }

    updateData({
      ...data,
      modules: (data.modules || []).filter((module) => Number(module.id) !== Number(id))
    });
    setModuleMessage("Module supprimé.");
    setModuleError("");
  };

  const enrollClass = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const selectedModule = getModuleById(data, moduleId);
    if (!classe) {
      setError("Veuillez sélectionner une classe.");
      return;
    }

    if (!selectedModule) {
      setError("Veuillez sélectionner un module.");
      return;
    }

    const classLevel = getLevelFromClassKey(classe);
    if (!isSemesterAllowedForLevel(classLevel, selectedModule.semestre)) {
      setError(`${classLevel} ne peut pas être inscrit à un module du semestre ${selectedModule.semestre}.`);
      return;
    }

    const alreadyEnrolled = (data.classEnrollments || []).some((enrollment) =>
      enrollment.classe === classe && Number(enrollment.moduleId) === Number(selectedModule.id)
    );

    if (alreadyEnrolled) {
      setError("Double inscription bloquée : cette classe est déjà inscrite à ce module.");
      return;
    }

    const planningConflict = getModuleEnrollmentConflict(data, classe, selectedModule.id);
    if (planningConflict) {
      setError(
        "Conflit emploi du temps : " + classe +
        " aurait " + planningConflict.target.courseName +
        " en même temps que " + planningConflict.conflict.courseName +
        " le " + formatSessionDateTime(planningConflict.conflict) + "."
      );
      return;
    }

    const classStudentCount = getStudentsInClass(data, classe).length;
    const capacityIssue = (selectedModule.courseIds || [])
      .map((courseId) => data.courses.find((course) => Number(course.id) === Number(courseId)))
      .filter(Boolean)
      .find((course) => getCourseRegisteredCount(data, course.id) + classStudentCount > Number(course.capacite));

    if (capacityIssue) {
      setError("Capacité maximale atteinte pour le cours : " + capacityIssue.nom + ".");
      return;
    }

    updateData({
      ...data,
      classEnrollments: [
        ...(data.classEnrollments || []),
        {
          id: nextId(data.classEnrollments || []),
          classe,
          moduleId: selectedModule.id
        }
      ],
      grades: ensureGradesForModule({ ...data, classEnrollments:[...(data.classEnrollments || []), { id: nextId(data.classEnrollments || []), classe, moduleId: selectedModule.id }] }, selectedModule.id, data.grades || [])
    });

    setMessage("Classe inscrite au module correctement.");
  };

  const unenrollClass = (id) => {
    updateData({
      ...data,
      classEnrollments: (data.classEnrollments || []).filter((enrollment) => Number(enrollment.id) !== Number(id))
    });
    setMessage("Inscription de classe supprimée.");
    setError("");
  };

  const rows = (data.classEnrollments || []).map((enrollment) => {
    const module = getModuleById(data, enrollment.moduleId);
    const courseLabels = (module?.courseIds || [])
      .map((courseId) => data.courses.find((course) => Number(course.id) === Number(courseId)))
      .filter(Boolean)
      .map((course) => `${course.nom} — ${course.enseignant}`);

    return {
      ...enrollment,
      module,
      courseLabels,
      studentCount: getStudentsInClass(data, enrollment.classe).length
    };
  });

  return (
    <>
      <div className="page-header"><div><h1>Inscriptions</h1></div></div>
      <div className="section-tabs">
        <button className={section === "modules" ? "active" : ""} type="button" onClick={() => setSection("modules")}>Classes / modules</button>
        <button className={section === "events" ? "active" : ""} type="button" onClick={() => setSection("events")}>Événements</button>
      </div>

      {section === "events" ? (
        <AdminEventsPage data={data} updateData={updateData} />
      ) : (
        <>
          <section className="panel">
            <h2 className="panel-title">Créer un module</h2>
            {moduleMessage && <div className="global-success">{moduleMessage}</div>}
            {moduleError && <div className="global-error">{moduleError}</div>}
            <form onSubmit={createModule}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Code du module</label>
                  <input
                    value={moduleForm.code}
                    onChange={(e) => setModuleForm({...moduleForm, code:e.target.value})}
                    placeholder="MOD-INFO"
                  />
                </div>
                <div className="form-group">
                  <label>Nom du module</label>
                  <input
                    value={moduleForm.nom}
                    onChange={(e) => setModuleForm({...moduleForm, nom:e.target.value})}
                    placeholder="Module informatique"
                  />
                </div>
                <div className="form-group">
                  <label>Semestre</label>
                  <select
                    value={moduleForm.semestre}
                    onChange={(e) => setModuleForm({...moduleForm, semestre:e.target.value})}
                  >
                    {SEMESTERS.map((semester) => <option key={semester} value={semester}>{semester}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Coefficient</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={moduleForm.coefficient}
                    onChange={(e) => setModuleForm({...moduleForm, coefficient:e.target.value})}
                    placeholder="Ex : 6"
                  />
                </div>
              </div>
              <button className="btn-primary" type="submit">Créer le module</button>
            </form>
          </section>

          <section className="panel">
            <h2 className="panel-title">Modules disponibles</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Code</th><th>Module</th><th>Semestre</th><th>Coefficient</th><th>Cours associés</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {(data.modules || []).map((module) => {
                    const linkedCourses = (module.courseIds || [])
                      .map((courseId) => (data.courses || []).find((course) => Number(course.id) === Number(courseId)))
                      .filter(Boolean)
                      .map((course) => course.nom);
                    return (
                      <tr key={module.id}>
                        <td>{module.code}</td>
                        <td>{module.nom}</td>
                        <td>{module.semestre}</td>
                        <td>{getModuleCoefficient(module)}</td>
                        <td>{linkedCourses.join(", ") || "Aucun cours"}</td>
                        <td><button className="btn-danger btn-small" type="button" onClick={() => deleteModule(module.id)}>Supprimer</button></td>
                      </tr>
                    );
                  })}
                  {(data.modules || []).length === 0 && <tr><td colSpan="6">Aucun module.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-title">Inscrire une classe à un module</h2>
            {message && <div className="global-success">{message}</div>}
            {error && <div className="global-error">{error}</div>}

            <form onSubmit={enrollClass}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Classe</label>
                  <select value={classe} onChange={(e) => setClasse(e.target.value)}>
                    {classes.map((item) => (
                      <option key={item.key} value={item.key}>{item.label} — {item.count} étudiant(s)</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Module</label>
                  <select value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
                    {(data.modules || []).map((module) => (
                      <option key={module.id} value={module.id}>{module.code} — {module.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="btn-primary" type="submit">Inscrire la classe</button>
            </form>
          </section>

          <section className="panel">
            <h2 className="panel-title">Classes inscrites</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Classe</th><th>Module</th><th>Cours du module</th><th>Étudiants</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.classe}</td>
                      <td>{row.module?.nom || "Module supprimé"}</td>
                      <td>{row.courseLabels.join(", ") || "Aucun cours"}</td>
                      <td>{row.studentCount}</td>
                      <td><button className="btn-danger btn-small" type="button" onClick={() => unenrollClass(row.id)}>Désinscrire</button></td>
                    </tr>
                  ))}
                  {rows.length === 0 && <tr><td colSpan="5">Aucune classe inscrite.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
};

const GradesPage = ({ data, updateData, allowedCourses = null, title = "Gestion des notes", subtitle = "", canValidate = true }) => {
  const allowedCourseNames = allowedCourses ? new Set(allowedCourses.map((course) => course.nom)) : null;
  const gradeRows = allowedCourseNames
    ? data.grades.filter((grade) => allowedCourseNames.has(grade.cours))
    : data.grades;

  const [selectedGradeId, setSelectedGradeId] = React.useState(gradeRows[0]?.id || "");
  const [componentForm, setComponentForm] = React.useState({ category:"Suivi", label:"", score:"", weight:"" });
  const [componentMessage, setComponentMessage] = React.useState("");

  React.useEffect(() => {
    if (gradeRows.length === 0) {
      setSelectedGradeId("");
      return;
    }

    if (!gradeRows.some((grade) => Number(grade.id) === Number(selectedGradeId))) {
      setSelectedGradeId(gradeRows[0].id);
    }
  }, [gradeRows.map((grade) => grade.id).join("|"), selectedGradeId]);

  const updateGradeValue = (id, key, value) => {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) return;

    const safeValue = Math.max(0, Math.min(20, numericValue));

    updateData({
      ...data,
      grades: data.grades.map((grade) => {
        if (grade.id !== id || isGradeLocked(grade) || getGradeComponents(grade).length > 0) return grade;
        return { ...grade, [key]: safeValue };
      })
    });
  };

  const updateGradeStatus = (id, value) => {
    if (!canValidate) return;
    const nextStatus = normalizeGradeStatus(value);
    const isFinal = isFinalGradeStatus(nextStatus);

    updateData({
      ...data,
      grades: data.grades.map((grade) => {
        if (Number(grade.id) !== Number(id)) return grade;

        return {
          ...grade,
          statut: nextStatus,
          valide: nextStatus === "Validé" || nextStatus === "Compensé",
          locked: isFinal,
          grade_locked: isFinal ? 1 : 0,
          lockedAt: isFinal ? today() : ""
        };
      })
    });
  };

  const selectedGrade = gradeRows.find((grade) => Number(grade.id) === Number(selectedGradeId)) || gradeRows[0] || null;
  const selectedLocked = selectedGrade ? isGradeLocked(selectedGrade) : false;
  const selectedComponents = getGradeComponents(selectedGrade);
  const selectedCategoryWeights = selectedGrade ? getGradeCategoryWeights(selectedGrade) : DEFAULT_GRADE_CATEGORY_WEIGHTS;
  const selectedWeightTotal = selectedGrade ? getGradeWeightTotal(selectedGrade) : 0;
  const selectedCategoryComponentTotals = selectedGrade ? GRADE_CATEGORIES.reduce((totals, category) => {
    totals[category] = categoryComponentWeightTotal(selectedGrade, category);
    return totals;
  }, {}) : {};

  const updateCategoryWeight = (category, value) => {
    if (!selectedGrade || selectedLocked) return;
    const numericValue = Number(value);
    const safeValue = Number.isNaN(numericValue) ? 0 : Math.max(0, Math.min(100, numericValue));
    const nextWeights = { ...getGradeCategoryWeights(selectedGrade), [category]: safeValue };

    updateData({
      ...data,
      grades: data.grades.map((grade) => {
        if (Number(grade.id) !== Number(selectedGrade.id)) return grade;
        return {
          ...grade,
          categoryWeights: nextWeights,
          suiviWeight: nextWeights.Suivi,
          dsWeight: nextWeights.DS,
          projetWeight: nextWeights.Projet
        };
      })
    });
  };

  const addGradeComponent = (e) => {
    e.preventDefault();
    if (!selectedGrade) return;

    if (selectedLocked) {
      setComponentMessage("Les notes sont verrouillées pour cette ligne.");
      return;
    }

    const label = componentForm.label.trim();
    const score = Number(componentForm.score);
    const weight = Number(componentForm.weight);

    if (!label || Number.isNaN(score) || Number.isNaN(weight)) {
      setComponentMessage("Nom, note et pourcentage obligatoires.");
      return;
    }

    if (score < 0 || score > 20) {
      setComponentMessage("La note doit être entre 0 et 20.");
      return;
    }

    if (weight < 0 || weight > 100) {
      setComponentMessage("Le pourcentage doit être entre 0 et 100.");
      return;
    }

    const currentCategoryTotal = categoryComponentWeightTotal(selectedGrade, componentForm.category);
    if (currentCategoryTotal + weight > 100) {
      setComponentMessage(`Le total ${componentForm.category} dépasse 100%.`);
      return;
    }

    const newComponent = {
      id: nextId(selectedComponents),
      category: componentForm.category,
      label,
      score: Number(score.toFixed(2)),
      weight: Number(weight.toFixed(2))
    };

    const nextComponents = [...selectedComponents, newComponent];
    const summaries = getGradeCategorySummaries(selectedGrade, nextComponents);

    updateData({
      ...data,
      grades: data.grades.map((grade) => {
        if (Number(grade.id) !== Number(selectedGrade.id)) return grade;
        return { ...grade, components:nextComponents, ...summaries };
      })
    });

    setComponentForm({ category:"Suivi", label:"", score:"", weight:"" });
    setComponentMessage("Note ajoutée.");
  };

  const deleteGradeComponent = (componentId) => {
    if (!selectedGrade || selectedLocked) return;

    const nextComponents = selectedComponents.filter((component) => Number(component.id) !== Number(componentId));
    const summaries = getGradeCategorySummaries(selectedGrade, nextComponents);

    updateData({
      ...data,
      grades: data.grades.map((grade) => {
        if (Number(grade.id) !== Number(selectedGrade.id)) return grade;
        return { ...grade, components:nextComponents, ...summaries };
      })
    });

    setComponentMessage("Note supprimée.");
  };

  const updateGradeComponentWeight = (componentId, value) => {
    if (!selectedGrade || selectedLocked) return;

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return;

    const safeValue = Math.max(0, Math.min(100, numericValue));
    const target = selectedComponents.find((component) => Number(component.id) === Number(componentId));
    if (!target) return;

    const totalWithoutTarget = selectedComponents
      .filter((component) => component.category === target.category && Number(component.id) !== Number(componentId))
      .reduce((sum, component) => sum + getComponentWeight(component), 0);

    if (totalWithoutTarget + safeValue > 100) {
      setComponentMessage(`Le total ${target.category} dépasse 100%.`);
      return;
    }

    const nextComponents = selectedComponents.map((component) => {
      if (Number(component.id) !== Number(componentId)) return component;
      return { ...component, weight:safeValue };
    });
    const summaries = getGradeCategorySummaries(selectedGrade, nextComponents);

    updateData({
      ...data,
      grades: data.grades.map((grade) => {
        if (Number(grade.id) !== Number(selectedGrade.id)) return grade;
        return { ...grade, components:nextComponents, ...summaries };
      })
    });
  };

  const updateGradeComponentScore = (componentId, value) => {
    if (!selectedGrade || selectedLocked) return;
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return;
    const safeValue = Math.max(0, Math.min(20, numericValue));
    const nextComponents = selectedComponents.map((component) => {
      if (Number(component.id) !== Number(componentId)) return component;
      return { ...component, score:safeValue };
    });
    const summaries = getGradeCategorySummaries(selectedGrade, nextComponents);
    updateData({
      ...data,
      grades: data.grades.map((grade) => Number(grade.id) === Number(selectedGrade.id) ? { ...grade, components:nextComponents, ...summaries } : grade)
    });
  };

  const updateGradeComponentLabel = (componentId, value) => {
    if (!selectedGrade || selectedLocked) return;
    const nextComponents = selectedComponents.map((component) => {
      if (Number(component.id) !== Number(componentId)) return component;
      return { ...component, label:value };
    });
    updateData({
      ...data,
      grades: data.grades.map((grade) => Number(grade.id) === Number(selectedGrade.id) ? { ...grade, components:nextComponents } : grade)
    });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>

      <section className="panel">
        <h2 className="panel-title">Tableau général des notes</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Cours</th>
                <th>Module</th>
                <th>Coeff.</th>
                <th>Suivi</th>
                <th>DS</th>
                <th>Projet</th>
                <th>Moyenne</th>
                {canValidate && <th>Statut</th>}
                <th>Détails</th>
              </tr>
            </thead>

            <tbody>
              {gradeRows.map((grade) => {
                const locked = isGradeLocked(grade);
                const status = getGradeStatus(grade);
                const hasComponents = getGradeComponents(grade).length > 0;

                return (
                  <tr key={grade.id} className={locked ? "grade-row-locked" : ""}>
                    <td>{grade.etudiant}</td>
                    <td>{grade.cours}</td>
                    <td>{getModuleForCourse(data, grade.cours)?.nom || "—"}</td>
                    <td>{getModuleForCourse(data, grade.cours) ? getModuleCoefficient(getModuleForCourse(data, grade.cours)) : "—"}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={hasComponents ? categoryAverage(grade, "Suivi") : grade.suivi}
                        disabled={locked || hasComponents}
                        onChange={(e) => updateGradeValue(grade.id, "suivi", e.target.value)}
                        style={{ width:"80px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={hasComponents ? categoryAverage(grade, "DS") : grade.ds}
                        disabled={locked || hasComponents}
                        onChange={(e) => updateGradeValue(grade.id, "ds", e.target.value)}
                        style={{ width:"80px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={hasComponents ? categoryAverage(grade, "Projet") : grade.projet}
                        disabled={locked || hasComponents}
                        onChange={(e) => updateGradeValue(grade.id, "projet", e.target.value)}
                        style={{ width:"80px" }}
                      />
                    </td>
                    <td><strong>{moyenne(grade)}</strong></td>
                    {canValidate && (
                      <td>
                        <select
                          value={status}
                          onChange={(e) => updateGradeStatus(grade.id, e.target.value)}
                        >
                          <option value="Pas terminé">Pas terminé</option>
                          <option value="Validé">Validé</option>
                          <option value="Compensé">Compensé</option>
                          <option value="Rattrapage">Rattrapage</option>
                          <option value="Non validé">Non validé</option>
                        </select>
                        {locked && <div className="status-help">Notes verrouillées</div>}
                      </td>
                    )}
                    <td>
                      <button type="button" className="btn-small" onClick={() => setSelectedGradeId(grade.id)}>
                        Gérer
                      </button>
                    </td>
                  </tr>
                );
              })}

              {gradeRows.length === 0 && (
                <tr>
                  <td colSpan={canValidate ? 10 : 9}>Aucune note à afficher.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedGrade && (
        <section className="panel">
          <div className="grade-detail-header">
            <div>
              <h2 className="panel-title">Détail des notes</h2>
              <strong>{selectedGrade.etudiant} — {selectedGrade.cours}</strong>
            </div>
            <div className={Math.round(selectedWeightTotal) === 100 ? "weight-ok" : "weight-warning"}>
              Pondération : {selectedWeightTotal}% / 100%
            </div>
          </div>

          {componentMessage && (
            <div className={componentMessage.includes("ajoutée") || componentMessage.includes("supprimée") ? "global-success" : "global-error"}>
              {componentMessage}
            </div>
          )}

          <div className="grade-weights-grid">
            {GRADE_CATEGORIES.map((category) => (
              <div className="form-group" key={category}>
                <label>% {category} dans la moyenne finale</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={selectedCategoryWeights[category] ?? 0}
                  disabled={selectedLocked}
                  onChange={(e) => updateCategoryWeight(category, e.target.value)}
                />
                <div className="status-help">Moyenne : {categoryAverage(selectedGrade, category)}/20 · Notes : {selectedCategoryComponentTotals[category] || 0}% / 100%</div>
              </div>
            ))}
          </div>

          <form onSubmit={addGradeComponent} className="grade-component-form">
            <div className="form-group">
              <label>Type</label>
              <select value={componentForm.category} disabled={selectedLocked} onChange={(e) => setComponentForm({...componentForm, category:e.target.value})}>
                {GRADE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input value={componentForm.label} disabled={selectedLocked} onChange={(e) => setComponentForm({...componentForm, label:e.target.value})} placeholder="Ex : Quiz 1" />
            </div>
            <div className="form-group">
              <label>Note /20</label>
              <input type="number" min="0" max="20" step="0.25" value={componentForm.score} disabled={selectedLocked} onChange={(e) => setComponentForm({...componentForm, score:e.target.value})} />
            </div>
            <div className="form-group">
              <label>% dans le type</label>
              <input type="number" min="0" max="100" step="1" value={componentForm.weight} disabled={selectedLocked} onChange={(e) => setComponentForm({...componentForm, weight:e.target.value})} placeholder="Ex : 50" />
            </div>
            <button type="submit" className="btn-primary" disabled={selectedLocked}>Ajouter</button>
          </form>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Type</th><th>Nom</th><th>Note</th><th>% dans le type</th><th>Action</th></tr>
              </thead>
              <tbody>
                {selectedComponents.map((component) => (
                  <tr key={component.id}>
                    <td>{component.category}</td>
                    <td><input value={component.label} disabled={selectedLocked} onChange={(e) => updateGradeComponentLabel(component.id, e.target.value)} /></td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={getComponentScore(component)}
                        disabled={selectedLocked}
                        onChange={(e) => updateGradeComponentScore(component.id, e.target.value)}
                        style={{ width:"90px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={getComponentWeight(component)}
                        disabled={selectedLocked}
                        onChange={(e) => updateGradeComponentWeight(component.id, e.target.value)}
                        style={{ width:"90px" }}
                      />
                    </td>
                    <td>
                      <button type="button" className="btn-danger btn-small" disabled={selectedLocked} onClick={() => deleteGradeComponent(component.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {selectedComponents.length === 0 && (
                  <tr><td colSpan="5">Aucune note détaillée.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
};

const AttendanceAdminPage = ({ data, updateData, mode = "admin", currentTeacher = null }) => {
  const baseCourses = currentTeacher
    ? data.courses.filter((course) => course.enseignant === currentTeacher.nom)
    : data.courses;

  const availableClasses = getAvailableClasses(data).filter((classe) => {
    const classCourseIds = getCourseIdsForClass(data, classe.key);
    return baseCourses.some((course) => classCourseIds.includes(Number(course.id)));
  });

  const availableTeachers = getAvailableTeachersFromCourses(baseCourses);
  const initialCalendarView = availableClasses.length > 0 ? "classe" : "enseignant";
  const [calendarView, setCalendarView] = React.useState(initialCalendarView);
  const [selectedClass, setSelectedClass] = React.useState(availableClasses[0]?.key || "");
  const [selectedTeacher, setSelectedTeacher] = React.useState(currentTeacher?.nom || availableTeachers[0] || "");
  const [message, setMessage] = React.useState("");
  const [reviewTexts, setReviewTexts] = React.useState({});
  const canManageJustifications = mode === "admin";

  React.useEffect(() => {
    if (availableClasses.length > 0 && !availableClasses.some((classe) => classe.key === selectedClass)) {
      setSelectedClass(availableClasses[0].key);
    }

    if (currentTeacher?.nom && selectedTeacher !== currentTeacher.nom) {
      setSelectedTeacher(currentTeacher.nom);
      return;
    }

    if (!currentTeacher && availableTeachers.length > 0 && !availableTeachers.includes(selectedTeacher)) {
      setSelectedTeacher(availableTeachers[0]);
    }
  }, [data.students, data.classEnrollments, data.modules, data.courses, currentTeacher?.nom]);

  const selectedClassCourseIds = selectedClass ? getCourseIdsForClass(data, selectedClass) : [];
  const calendarCourses = baseCourses.filter((course) => {
    if (calendarView === "classe") {
      return selectedClassCourseIds.includes(Number(course.id));
    }

    return selectedTeacher ? course.enseignant === selectedTeacher : true;
  });

  const visibleCourseIds = calendarCourses.map((course) => Number(course.id));
  const visibleSessions = (data.courseSessions || [])
    .filter((session) => visibleCourseIds.includes(Number(session.courseId)))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)) || getSessionStartMinutes(a) - getSessionStartMinutes(b));

  const firstSessionDate = visibleSessions[0]?.date || today();
  const [weekStart, setWeekStart] = React.useState(formatISODate(getWeekMonday(firstSessionDate)));
  const weekDays = getCalendarWeekDays(weekStart);
  const weekSessions = visibleSessions.filter((session) => isSessionInsideWeek(session, weekStart));
  const [selectedSessionId, setSelectedSessionId] = React.useState(weekSessions[0]?.id || visibleSessions[0]?.id || "");

  React.useEffect(() => {
    if (visibleSessions.length === 0) {
      if (selectedSessionId !== "") setSelectedSessionId("");
      return;
    }

    const exists = visibleSessions.some((session) => Number(session.id) === Number(selectedSessionId));
    const existsInWeek = weekSessions.some((session) => Number(session.id) === Number(selectedSessionId));

    if (!exists || (!existsInWeek && weekSessions.length > 0)) {
      const nextSession = weekSessions[0] || visibleSessions[0];
      setSelectedSessionId(nextSession?.id || "");
    }
  }, [data.courseSessions, data.courses, currentTeacher?.nom, weekStart, calendarView, selectedClass, selectedTeacher]);

  const selectedSession = visibleSessions.find((session) => Number(session.id) === Number(selectedSessionId)) || weekSessions[0] || visibleSessions[0] || null;
  const selectedCourse = selectedSession ? getSessionCourse(data, selectedSession) : null;
  const enrolledStudents = selectedCourse
    ? (data.students || []).filter((student) => {
        const followsCourse = getEffectiveStudentCourseIds(data, student).includes(Number(selectedCourse.id));
        if (!followsCourse) return false;
        if (calendarView === "classe") return getClassKey(student) === selectedClass;
        return true;
      })
    : [];

  const getStudentByName = (studentName) => (data.students || []).find((student) => student.nom === studentName);
  const itemMatchesSelectedClass = (item) => {
    if (calendarView !== "classe") return true;
    const student = getStudentByName(item.etudiant);
    return student ? getClassKey(student) === selectedClass : false;
  };

  const getAttendanceForStudent = (student) => {
    if (!selectedSession) return null;

    return (data.attendances || []).find((attendance) =>
      attendance.etudiant === student.nom && Number(attendance.sessionId) === Number(selectedSession.id)
    );
  };

  const clearJustificationsFor = (requests, student, session) => {
    return (requests || []).filter((request) =>
      !(request.etudiant === student.nom && Number(request.sessionId) === Number(session.id))
    );
  };

  const updateSessionStudentStatus = (student, newStatus) => {
    if (!student || !selectedSession || !selectedCourse) {
      setMessage("Veuillez sélectionner une séance dans le calendrier.");
      return;
    }

    const existing = getAttendanceForStudent(student);

    if (newStatus === "Non saisie") {
      updateData({
        ...data,
        attendances: (data.attendances || []).filter((attendance) =>
          !(attendance.etudiant === student.nom && Number(attendance.sessionId) === Number(selectedSession.id))
        ),
        absenceJustifications: clearJustificationsFor(data.absenceJustifications || [], student, selectedSession)
      });
      setMessage("Présence remise à non saisie pour " + student.nom + ".");
      return;
    }

    const nextAttendance = {
      id: existing?.id || nextId(data.attendances || []),
      sessionId: selectedSession.id,
      seance: formatSessionLabel(selectedSession),
      etudiant: student.nom,
      cours: selectedCourse.nom,
      date: selectedSession.date,
      statut: newStatus,
      methode: mode === "admin" ? "Admin calendrier" : "Prof calendrier"
    };

    updateData({
      ...data,
      attendances: existing
        ? (data.attendances || []).map((attendance) => attendance.id === existing.id ? nextAttendance : attendance)
        : [...(data.attendances || []), nextAttendance],
      absenceJustifications: newStatus === "Présent" || newStatus === "Justifiée"
        ? clearJustificationsFor(data.absenceJustifications || [], student, selectedSession)
        : (data.absenceJustifications || [])
    });

    setMessage("Présence mise à jour pour " + student.nom + ".");
  };

  const updateWholeClassStatus = (newStatus) => {
    if (!selectedSession || !selectedCourse) {
      setMessage("Veuillez sélectionner une séance dans le calendrier.");
      return;
    }

    if (enrolledStudents.length === 0) {
      setMessage("Aucun étudiant à modifier pour cette séance.");
      return;
    }

    const names = new Set(enrolledStudents.map((student) => student.nom));

    if (newStatus === "Non saisie") {
      updateData({
        ...data,
        attendances: (data.attendances || []).filter((attendance) =>
          !(names.has(attendance.etudiant) && Number(attendance.sessionId) === Number(selectedSession.id))
        ),
        absenceJustifications: (data.absenceJustifications || []).filter((request) =>
          !(names.has(request.etudiant) && Number(request.sessionId) === Number(selectedSession.id))
        )
      });
      setMessage("Présence remise à non saisie pour toute la classe.");
      return;
    }

    const currentAttendances = data.attendances || [];
    const existingByStudent = new Map(
      currentAttendances
        .filter((attendance) => names.has(attendance.etudiant) && Number(attendance.sessionId) === Number(selectedSession.id))
        .map((attendance) => [attendance.etudiant, attendance])
    );

    let nextAttendanceId = nextId(currentAttendances);
    const updatedExisting = currentAttendances.map((attendance) => {
      if (!names.has(attendance.etudiant) || Number(attendance.sessionId) !== Number(selectedSession.id)) return attendance;
      return {
        ...attendance,
        seance:formatSessionLabel(selectedSession),
        cours:selectedCourse.nom,
        date:selectedSession.date,
        statut:newStatus,
        methode:(mode === "admin" ? "Admin" : "Prof") + " — classe complète"
      };
    });

    const additions = enrolledStudents
      .filter((student) => !existingByStudent.has(student.nom))
      .map((student) => ({
        id:nextAttendanceId++,
        sessionId:selectedSession.id,
        seance:formatSessionLabel(selectedSession),
        etudiant:student.nom,
        cours:selectedCourse.nom,
        date:selectedSession.date,
        statut:newStatus,
        methode:(mode === "admin" ? "Admin" : "Prof") + " — classe complète"
      }));

    updateData({
      ...data,
      attendances:[...updatedExisting, ...additions],
      absenceJustifications: newStatus === "Présent" || newStatus === "Justifiée"
        ? (data.absenceJustifications || []).filter((request) =>
            !(names.has(request.etudiant) && Number(request.sessionId) === Number(selectedSession.id))
          )
        : (data.absenceJustifications || [])
    });

    setMessage("Toute la classe est maintenant : " + newStatus + ".");
  };

  const requestJustification = (attendance) => {
    if (!canManageJustifications) {
      setMessage("Les justificatifs sont gérés par la scolarité.");
      return;
    }

    const allRequests = data.absenceJustifications || [];

    const existing = allRequests.find((request) =>
      request.etudiant === attendance.etudiant &&
      (
        attendance.sessionId
          ? Number(request.sessionId) === Number(attendance.sessionId)
          : request.cours === attendance.cours && request.date === attendance.date
      )
    );

    if (existing) {
      setMessage("Une demande de justification existe déjà pour cette séance.");
      return;
    }

    const requester = currentTeacher ? currentTeacher.nom : "Administration";

    updateData({
      ...data,
      absenceJustifications: [
        ...allRequests,
        {
          id: nextId(allRequests),
          sessionId: attendance.sessionId || "",
          seance: attendance.seance || "",
          etudiant: attendance.etudiant,
          cours: attendance.cours,
          date: attendance.date,
          requestedBy: requester,
          motif: "Veuillez justifier votre absence pour cette séance.",
          statut: "Demandée",
          justification: "",
          submittedAt: "",
          attachmentName: "",
          attachmentType: "",
          attachmentData: "",
          adminReply: "",
          reviewedBy: "",
          reviewedAt: "",
          conversation: [
            {
              from: requester,
              role: mode === "admin" ? "Admin" : "Professeur",
              text: "Veuillez justifier votre absence pour la séance : " + (attendance.seance || attendance.date),
              date: today()
            }
          ]
        }
      ]
    });

    setMessage("Demande de justification envoyée à l'étudiant pour cette séance.");
  };

  const sendJustificationReply = (requestId) => {
    const reply = (reviewTexts[requestId] || "").trim();

    if (reply === "") {
      setMessage("Écrivez une réponse avant de l'envoyer.");
      return;
    }

    const reviewer = currentTeacher ? currentTeacher.nom : "Administration";

    updateData({
      ...data,
      absenceJustifications: (data.absenceJustifications || []).map((request) =>
        request.id === requestId
          ? {
              ...request,
              statut: request.statut === "Demandée" ? "Demandée" : "En discussion",
              adminReply: reply,
              reviewedBy: reviewer,
              reviewedAt: today(),
              conversation: [
                ...(request.conversation || []),
                {
                  from: reviewer,
                  role: mode === "admin" ? "Admin" : "Professeur",
                  text: reply,
                  date: today()
                }
              ]
            }
          : request
      )
    });

    setReviewTexts({ ...reviewTexts, [requestId]: "" });
    setMessage("Réponse envoyée à l'étudiant. Vous pouvez décider plus tard.");
  };

  const decideJustification = (requestId, newStatus) => {
    const reviewer = currentTeacher ? currentTeacher.nom : "Administration";
    const reply = (reviewTexts[requestId] || "").trim();
    const decisionText = reply || (newStatus === "Validée" ? "Justificatif accepté." : "Justificatif refusé.");

    updateData({
      ...data,
      absenceJustifications: (data.absenceJustifications || []).map((request) =>
        request.id === requestId
          ? {
              ...request,
              statut: newStatus,
              adminReply: decisionText,
              reviewedBy: reviewer,
              reviewedAt: today(),
              conversation: [
                ...(request.conversation || []),
                {
                  from: reviewer,
                  role: mode === "admin" ? "Admin" : "Professeur",
                  text: decisionText,
                  date: today()
                }
              ]
            }
          : request
      ),
      attendances: data.attendances.map((attendance) => {
        const request = (data.absenceJustifications || []).find((item) => item.id === requestId);

        if (
          request &&
          attendance.etudiant === request.etudiant &&
          (
            request.sessionId
              ? Number(attendance.sessionId) === Number(request.sessionId)
              : attendance.cours === request.cours && attendance.date === request.date
          )
        ) {
          if (newStatus === "Validée") {
            return { ...attendance, statut: "Justifiée", methode: "Justificatif validé" };
          }

          if (newStatus === "Refusée") {
            return { ...attendance, statut: "Absent", methode: "Justificatif refusé" };
          }
        }

        return attendance;
      })
    });

    setReviewTexts({ ...reviewTexts, [requestId]: "" });
    setMessage("Décision envoyée à l'étudiant.");
  };

  const rows = (data.attendances || [])
    .filter((attendance) => calendarCourses.some((course) => course.nom === attendance.cours))
    .filter(itemMatchesSelectedClass);

  const isStillAbsentOrLate = (request) => {
    const attendance = data.attendances.find((item) =>
      item.etudiant === request.etudiant &&
      (
        request.sessionId
          ? Number(item.sessionId) === Number(request.sessionId)
          : item.cours === request.cours && item.date === request.date
      )
    );

    return !attendance || attendance.statut === "Absent" || attendance.statut === "Retard";
  };

  const requests = (data.absenceJustifications || [])
    .filter((request) => calendarCourses.some((course) => course.nom === request.cours))
    .filter(itemMatchesSelectedClass)
    .filter(isStillAbsentOrLate);

  const changeWeek = (dayOffset) => {
    setWeekStart(formatISODate(addDaysToDate(parseISODate(weekStart), dayOffset)));
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Gestion des présences</h1>
        </div>
      </div>

      {message && (
        <div className={message.includes("Écrivez") || message.includes("Veuillez") || message.includes("existe déjà") ? "global-error" : "global-success"}>
          {message}
        </div>
      )}

      <section className="panel">
        <div className="calendar-toolbar">
          <div>
            <h2 className="panel-title">Calendrier des séances</h2>
            <div className="calendar-filter-bar">
              <label>
                Vue
                <select value={calendarView} onChange={(e) => setCalendarView(e.target.value)}>
                  <option value="classe">Par classe</option>
                  <option value="enseignant">Par enseignant</option>
                </select>
              </label>

              {calendarView === "classe" ? (
                <label>
                  Classe
                  <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                    {availableClasses.map((classe) => (
                      <option key={classe.key} value={classe.key}>{classe.label}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <label>
                  Enseignant
                  <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    disabled={Boolean(currentTeacher)}
                  >
                    {availableTeachers.map((teacherName) => (
                      <option key={teacherName} value={teacherName}>{teacherName}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          </div>
          <div className="calendar-actions">
            <button className="btn-small" type="button" onClick={() => changeWeek(-7)}>Semaine précédente</button>
            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(formatISODate(getWeekMonday(e.target.value)))}
            />
            <button className="btn-small" type="button" onClick={() => changeWeek(7)}>Semaine suivante</button>
          </div>
        </div>

        <div className="hyper-calendar">
          <div className="hyper-calendar-head">
            <div className="hyper-head-cell">Heure</div>
            {weekDays.map((day) => (
              <div className="hyper-head-cell" key={day.iso}>{day.label}<br/><span>{day.shortLabel}</span></div>
            ))}
          </div>

          <div className="hyper-calendar-body">
            <div className="hyper-time-column" style={{ height:`${CALENDAR_HEIGHT}px` }}>
              {Array.from({ length: 13 }, (_, index) => 8 + index).map((hour) => (
                <div
                  className="hyper-time-label"
                  key={hour}
                  style={{ top:`${((hour * 60 - CALENDAR_START_MINUTES) / 60) * CALENDAR_HOUR_HEIGHT}px` }}
                >
                  {String(hour).padStart(2, "0")}h00
                </div>
              ))}
            </div>

            {weekDays.map((day) => {
              const daySessions = weekSessions.filter((session) => session.date === day.iso);
              return (
                <div className="hyper-day-column" key={day.iso} style={{ height:`${CALENDAR_HEIGHT}px` }}>
                  {daySessions.map((session) => {
                    const course = getSessionCourse(data, session);
                    const isSelected = selectedSession && Number(selectedSession.id) === Number(session.id);
                    return (
                      <button
                        type="button"
                        key={session.id}
                        className={isSelected ? "calendar-event selected" : "calendar-event"}
                        style={getCalendarCardStyle(daySessions, session)}
                        onClick={() => setSelectedSessionId(session.id)}
                      >
                        <strong>{session.courseName}</strong>
                        <span>{formatSessionHour(getSessionStartTime(session))} - {formatSessionHour(getSessionEndTime(session))}</span>
                        <span>{session.salle}</span>
                        <small>{course?.enseignant || ""}</small>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Présence de la séance sélectionnée</h2>
        {selectedSession && selectedCourse ? (
          <>
            <div className="mini-list selected-session-summary">
              <div className="mini-item"><strong>Cours :</strong> {selectedCourse.nom}</div>
              <div className="mini-item"><strong>Enseignant :</strong> {selectedCourse.enseignant}</div>
              <div className="mini-item"><strong>Vue :</strong> {calendarView === "classe" ? `Classe ${selectedClass || "—"}` : `Enseignant ${selectedTeacher || "—"}`}</div>
              <div className="mini-item"><strong>Séance :</strong> {formatSessionDateTime(selectedSession)}</div>
              <div className="mini-item"><strong>Salle :</strong> {selectedSession.salle}</div>
            </div>

            <div className="attendance-bulk-actions">
              <button className="btn-primary btn-small" type="button" onClick={() => updateWholeClassStatus("Présent")}>
                Mettre toute la classe présente
              </button>
              <button className="btn-small" type="button" onClick={() => updateWholeClassStatus("Absent")}>
                Mettre toute la classe absente
              </button>
              <button className="btn-small" type="button" onClick={() => updateWholeClassStatus("Retard")}>
                Mettre toute la classe en retard
              </button>
              <button className="btn-danger btn-small" type="button" onClick={() => updateWholeClassStatus("Non saisie")}>
                Réinitialiser toute la classe
              </button>
            </div>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Étudiant inscrit</th>
                    <th>Classe</th>
                    <th>Présence</th>
                    <th>Méthode</th>
                    {canManageJustifications && <th>Justificatif</th>}
                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.map((student) => {
                    const attendance = getAttendanceForStudent(student);
                    const statusValue = attendance?.statut || "Non saisie";
                    return (
                      <tr key={student.id}>
                        <td>{student.nom}</td>
                        <td>{getClassKey(student) || "—"}</td>
                        <td>
                          <select value={statusValue} onChange={(e) => updateSessionStudentStatus(student, e.target.value)}>
                            <option>Non saisie</option>
                            <option>Présent</option>
                            <option>Absent</option>
                            <option>Retard</option>
                            <option>Justifiée</option>
                          </select>
                        </td>
                        <td>{attendance?.methode || "—"}</td>
                        {canManageJustifications && (
                          <td>
                            {attendance && (attendance.statut === "Absent" || attendance.statut === "Retard") ? (
                              <button className="btn-small" type="button" onClick={() => requestJustification(attendance)}>
                                Demander justificatif
                              </button>
                            ) : (
                              <span className="muted-dash">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}

                  {enrolledStudents.length === 0 && (
                    <tr>
                      <td colSpan={canManageJustifications ? 5 : 4}>Aucun étudiant inscrit.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>Aucune séance disponible dans le planning.</p>
        )}
      </section>

      <section className="panel">
        <h2 className="panel-title">Historique des présences enregistrées</h2>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Cours</th>
                <th>Séance</th>
                <th>Statut</th>
                <th>Méthode</th>
                {canManageJustifications && <th>Justificatif</th>}
              </tr>
            </thead>

            <tbody>
              {rows.map((item) => (
                <tr key={item.id}>
                  <td>{item.etudiant}</td>
                  <td>{item.cours}</td>
                  <td>{item.seance || item.date}</td>
                  <td><span className="status-pill">{item.statut}</span></td>
                  <td>{item.methode}</td>
                  {canManageJustifications && (
                    <td>
                      {item.statut === "Absent" || item.statut === "Retard" ? (
                        <button className="btn-small" type="button" onClick={() => requestJustification(item)}>
                          Demander justificatif
                        </button>
                      ) : (
                        <span className="muted-dash">—</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={canManageJustifications ? 6 : 5}>Aucune présence enregistrée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {canManageJustifications && (
        <section className="panel">
          <h2 className="panel-title">Demandes de justification</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Cours</th>
                  <th>Séance</th>
                  <th>Statut</th>
                  <th>Discussion</th>
                  <th>Pièce jointe</th>
                  <th>Réponse</th>
                  <th>Décision</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.etudiant}</td>
                    <td>{request.cours}</td>
                    <td>{request.seance || request.date}</td>
                    <td><span className="status-pill">{request.statut}</span></td>
                    <td>
                      <div className="thread-box">
                        {(request.conversation || []).map((msg, index) => (
                          <div className="thread-message" key={index}>
                            <strong>{msg.from} ({msg.role})</strong><br/>
                            <span>{msg.text}</span><br/>
                            <small>{msg.date}</small>
                          </div>
                        ))}

                        {(!request.conversation || request.conversation.length === 0) && (
                          <span>Aucun échange.</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {request.attachmentData ? (
                        <a href={request.attachmentData} download={request.attachmentName || "justificatif"} target="_blank">
                          {request.attachmentName || "Télécharger"}
                        </a>
                      ) : (
                        "Aucune pièce jointe"
                      )}
                    </td>
                    <td>
                      <textarea
                        placeholder="Répondre à l'étudiant sans décider..."
                        value={reviewTexts[request.id] || ""}
                        onChange={(e) => setReviewTexts({ ...reviewTexts, [request.id]: e.target.value })}
                        style={{
                          width:"100%",
                          minHeight:"70px",
                          border:"2px solid var(--border)",
                          borderRadius:"10px",
                          padding:"10px"
                        }}
                      ></textarea>

                      <button className="btn-small" type="button" onClick={() => sendJustificationReply(request.id)}>
                        Envoyer réponse
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn-primary btn-small" type="button" onClick={() => decideJustification(request.id, "Validée")}>
                          Valider
                        </button>
                        <button className="btn-danger btn-small" type="button" onClick={() => decideJustification(request.id, "Refusée")}>
                          Refuser
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {requests.length === 0 && (
                  <tr>
                    <td colSpan="8">Aucune demande de justification.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
};

const TeacherQRCodePage = ({ data, updateData, teacher }) => {
  const teacherCourses = data.courses.filter((course) => course.enseignant === teacher.nom);
  const [courseId, setCourseId] = React.useState(teacherCourses[0]?.id || "");
  const sessionsForCourse = (data.courseSessions || []).filter((session) => Number(session.courseId) === Number(courseId));
  const [courseSessionId, setCourseSessionId] = React.useState(sessionsForCourse[0]?.id || "");
  const [codeEnabled, setCodeEnabled] = React.useState(true);
  const [qrEnabled, setQrEnabled] = React.useState(true);
  const [activeSessionId, setActiveSessionId] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const sessions = (data.courseSessions || []).filter((session) => Number(session.courseId) === Number(courseId));

    if (sessions.length === 0) {
      setCourseSessionId("");
      return;
    }

    if (!sessions.some((session) => Number(session.id) === Number(courseSessionId))) {
      setCourseSessionId(sessions[0].id);
    }
  }, [courseId, data.courseSessions, courseSessionId]);

  const createPresenceAccess = () => {
    const sessionInfo = getSessionById(data, courseSessionId);
    const course = getSessionCourse(data, sessionInfo);

    if (!course || !sessionInfo) {
      setMessage("Veuillez sélectionner un cours et une séance programmée.");
      return;
    }

    const existingForSession = (data.attendanceSessions || []).find((item) => Number(item.sessionId) === Number(sessionInfo.id) && item.actif);
    const shouldGenerateCode = codeEnabled || qrEnabled;
    const generatedCode = shouldGenerateCode ? generatePresenceCode((data.attendanceSessions || []).map((item) => item.code).filter(Boolean)) : "";

    if (existingForSession) {
      const updatedSession = {
        ...existingForSession,
        code: shouldGenerateCode ? (existingForSession.code || generatedCode) : "",
        seance:formatSessionLabel(sessionInfo),
        cours:course.nom,
        enseignant:teacher.nom,
        date:sessionInfo.date,
        codeEnabled:Boolean(codeEnabled),
        qrEnabled:Boolean(qrEnabled)
      };

      updateData({
        ...data,
        attendanceSessions:(data.attendanceSessions || []).map((item) => item.id === existingForSession.id ? updatedSession : item)
      });
      setActiveSessionId(updatedSession.id);
      setMessage("Mode de présence mis à jour pour " + course.nom + " — " + formatSessionLabel(sessionInfo) + " : " + getAttendanceModeLabel(updatedSession) + ".");
      return;
    }

    const session = {
      id:nextId(data.attendanceSessions || []),
      code:generatedCode,
      sessionId:sessionInfo.id,
      seance:formatSessionLabel(sessionInfo),
      cours:course.nom,
      enseignant:teacher.nom,
      date:sessionInfo.date,
      actif:true,
      codeEnabled:Boolean(codeEnabled),
      qrEnabled:Boolean(qrEnabled)
    };

    updateData({ ...data, attendanceSessions:[...(data.attendanceSessions || []), session] });
    setActiveSessionId(session.id);

    const mode = getAttendanceModeLabel(session);
    setMessage("Mode de présence créé pour " + course.nom + " — " + formatSessionLabel(sessionInfo) + " : " + mode + ".");
  };

  const activeSession = (data.attendanceSessions || []).find((s) => Number(s.id) === Number(activeSessionId)) ||
    [...(data.attendanceSessions || [])].reverse().find((s) => s.enseignant === teacher.nom) || null;

  const teacherAttendanceSessions = (data.attendanceSessions || [])
    .filter((session) => session.enseignant === teacher.nom)
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || Number(b.id) - Number(a.id));

  const showAttendanceAccess = (session) => {
    setActiveSessionId(session.id);
    setCodeEnabled(isPresenceCodeEnabled(session));
    setQrEnabled(isPresenceQrEnabled(session));

    const plannedSession = getSessionById(data, session.sessionId);
    if (plannedSession) {
      setCourseId(plannedSession.courseId);
      setCourseSessionId(plannedSession.id);
    }

    setMessage("Accès affiché : " + session.cours + " — " + (session.seance || session.date) + ".");

    window.setTimeout(() => {
      document.querySelector(".teacher-presence-access")?.scrollIntoView({ behavior:"smooth", block:"start" });
    }, 0);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Accès présence</h1>
        </div>
      </div>

      {message && (
        <div className={message.includes("Veuillez") ? "global-error" : "global-success"}>
          {message}
        </div>
      )}

      <section className="panel teacher-presence-access">
        <div className="qr-layout">
          <div>
            <QRVisual code={activeSession?.code || ""} enabled={Boolean(activeSession && isPresenceQrEnabled(activeSession))}/>
            {activeSession && isPresenceCodeEnabled(activeSession) && (
              <div className="code-display">{activeSession.code}</div>
            )}
            {activeSession && !isPresenceCodeEnabled(activeSession) && (
              <div className="code-muted">Code masqué ou désactivé</div>
            )}
          </div>

          <div>
            <h2 className="panel-title">Créer l'accès de présence d'une séance</h2>

            <div className="form-group">
              <label>Cours</label>
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                {teacherCourses.map((course) => <option key={course.id} value={course.id}>{course.nom}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Séance programmée</label>
              <select value={courseSessionId} onChange={(e) => setCourseSessionId(e.target.value)}>
                {sessionsForCourse.length === 0 && (
                  <option value="">Aucune séance programmée</option>
                )}
                {sessionsForCourse.map((sessionItem) => (
                  <option key={sessionItem.id} value={sessionItem.id}>
                    {formatSessionLabel(sessionItem)}
                  </option>
                ))}
              </select>
            </div>

            <div className="presence-mode-grid">
              <label className="check-card">
                <input type="checkbox" checked={codeEnabled} onChange={(e) => setCodeEnabled(e.target.checked)}/>
                <span><strong>Code</strong><small>Afficher un code à 5 chiffres à entrer par l'étudiant.</small></span>
              </label>
              <label className="check-card">
                <input type="checkbox" checked={qrEnabled} onChange={(e) => setQrEnabled(e.target.checked)}/>
                <span><strong>QR code</strong><small>Afficher un QR code scannable depuis la caméra de l'étudiant.</small></span>
              </label>
            </div>

            <button className="btn-primary" onClick={createPresenceAccess}>
              {codeEnabled || qrEnabled ? "Créer code / QR" : "Créer séance en mode manuel"}
            </button>

            {activeSession && (
              <div className="mini-list" style={{ marginTop:"20px" }}>
                <div className="mini-item"><strong>Cours :</strong> {activeSession.cours}</div>
                <div className="mini-item"><strong>Séance :</strong> {activeSession.seance || activeSession.date}</div>
                <div className="mini-item"><strong>Mode :</strong> {getAttendanceModeLabel(activeSession)}</div>
                <div className="mini-item"><strong>Actif :</strong> {activeSession.actif ? "Oui" : "Non"}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Accès générés</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Séance</th>
                <th>Mode</th>
                <th>Code</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teacherAttendanceSessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.cours}</td>
                  <td>{session.seance || session.date}</td>
                  <td><span className="status-pill">{getAttendanceModeLabel(session)}</span></td>
                  <td>{isPresenceCodeEnabled(session) ? session.code : "—"}</td>
                  <td><button className="btn-small" type="button" onClick={() => showAttendanceAccess(session)}>Afficher</button></td>
                </tr>
              ))}
              {teacherAttendanceSessions.length === 0 && (
                <tr><td colSpan="5">Aucun accès généré.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AttendanceAdminPage data={data} updateData={updateData} mode="teacher" currentTeacher={teacher}/>
    </>
  );
};

const StudentPresencePage = ({ data, updateData, student }) => {
  const [code, setCode] = React.useState("");
  const [codeSource, setCodeSource] = React.useState("code");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [scannerActive, setScannerActive] = React.useState(false);
  const [scannerMessage, setScannerMessage] = React.useState("");
  const videoRef = React.useRef(null);
  const scannerIntervalRef = React.useRef(null);
  const mediaStreamRef = React.useRef(null);

  const stopScanner = React.useCallback(() => {
    if (scannerIntervalRef.current) {
      clearInterval(scannerIntervalRef.current);
      scannerIntervalRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setScannerActive(false);
  }, []);

  React.useEffect(() => () => stopScanner(), [stopScanner]);

  const startQrScanner = async () => {
    setMessage("");
    setError("");
    setScannerMessage("");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Votre navigateur ne permet pas l'accès caméra. Entrez le code manuellement.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:"environment" }, audio:false });
      mediaStreamRef.current = stream;
      setScannerActive(true);
      setScannerMessage("Caméra autorisée. Placez le QR code de l'enseignant devant la caméra.");

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 0);

      if (!window.BarcodeDetector) {
        setScannerMessage("Caméra ouverte. La détection automatique QR n'est pas supportée par ce navigateur : entrez le code manuellement si le scan ne marche pas.");
        return;
      }

      const detector = new window.BarcodeDetector({ formats:["qr_code"] });
      scannerIntervalRef.current = setInterval(async () => {
        try {
          const video = videoRef.current;
          if (!video || video.readyState < 2) return;

          const barcodes = await detector.detect(video);
          if (!barcodes || barcodes.length === 0) return;

          const rawValue = String(barcodes[0].rawValue || "").trim();
          const detectedCode = (rawValue.match(/\d{5}/) || [rawValue])[0].replace(/\D/g, "").slice(0, 5);

          if (detectedCode.length === 5) {
            setCode(detectedCode);
            setCodeSource("qr");
            setScannerMessage("QR code détecté : " + detectedCode + ". Cliquez sur Valider ma présence.");
            stopScanner();
          }
        } catch (scanError) {
          // Certains navigateurs refusent parfois l'analyse d'une frame : on continue sans bloquer l'interface.
        }
      }, 700);
    } catch (cameraError) {
      setError("Accès caméra refusé ou indisponible. Autorisez la caméra puis réessayez, ou entrez le code manuellement.");
      stopScanner();
    }
  };

  const markPresent = (e) => {
    e.preventDefault();
    setMessage(""); setError("");

    const normalizedCode = code.trim();
    const session = data.attendanceSessions.find((s) => String(s.code || "") === normalizedCode && s.actif && isStudentPresenceAccessEnabled(s));

    if (!session) {
      setError("Code/QR invalide, séance inactive, ou séance configurée en mode manuel par le professeur.");
      return;
    }

    const courseSession = getSessionById(data, session.sessionId);
    const course = courseSession ? getSessionCourse(data, courseSession) : data.courses.find((c) => c.nom === session.cours);
    const myCourseIds = getEffectiveStudentCourseIds(data, student);

    if (course && !myCourseIds.includes(Number(course.id))) {
      setError("Vous n'êtes pas inscrit à ce cours.");
      return;
    }

    const already = data.attendances.find((a) =>
      a.etudiant === student.nom &&
      (
        session.sessionId
          ? Number(a.sessionId) === Number(session.sessionId)
          : a.cours === session.cours && a.date === session.date
      )
    );

    if (already) {
      setError("Présence déjà enregistrée pour cette séance.");
      return;
    }

    updateData({
      ...data,
      attendances:[
        ...data.attendances,
        {
          id:nextId(data.attendances),
          sessionId:session.sessionId || "",
          seance:session.seance || "",
          etudiant:student.nom,
          cours:session.cours,
          date:session.date,
          statut:"Présent",
          methode:codeSource === "qr" ? "QR étudiant" : "Code étudiant"
        }
      ]
    });

    setMessage("Présence enregistrée correctement pour la séance : " + (session.seance || session.date) + ".");
    setCode("");
    setCodeSource("code");
  };

  const myAttendances = data.attendances
    .filter((a) => a.etudiant === student.nom)
    .map((a) => ({ ...a, seance:a.seance || a.date }));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Valider ma présence</h1>
        </div>
      </div>

      {message && <div className="global-success">{message}</div>}
      {error && <div className="global-error">{error}</div>}

      <section className="panel">
        <h2 className="panel-title">Code / QR de séance</h2>
        

        <div className="student-scan-grid">
          <form onSubmit={markPresent} className="presence-code-form">
            <div className="form-group">
              <label>Code de présence</label>
              <input
                value={code}
                onChange={(e) => { setCodeSource("code"); setCode(e.target.value.replace(/\D/g, "").slice(0,5)); }}
                placeholder="Ex : 12345"
              />
            </div>

            <div className="row-actions">
              <button className="btn-primary" type="submit">Valider ma présence</button>
              <button className="btn-small" type="button" onClick={startQrScanner}>Scanner QR code</button>
            </div>
          </form>

          <div className="scanner-panel">
            {scannerActive ? (
              <>
                <video ref={videoRef} className="qr-video" muted playsInline></video>
                <button className="btn-danger btn-small" type="button" onClick={stopScanner}>Arrêter la caméra</button>
              </>
            ) : (
              <div className="qr-placeholder small">Caméra arrêtée.</div>
            )}
            {scannerMessage && <p className="scanner-message">{scannerMessage}</p>}
          </div>
        </div>
      </section>

      <GenericTable
        title="Mes présences"
        subtitle="Historique des présences enregistrées par séance."
        items={myAttendances}
        columns={[
          ["cours", "Cours"],
          ["seance", "Séance"],
          ["statut", "Statut"],
          ["methode", "Méthode"]
        ]}
      />
    </>
  );
};

const StatsPage = ({ data }) => {
  const totalCapacity = data.courses.reduce((sum, course) => sum + Number(course.capacite), 0);
  const totalRegistered = data.courses.reduce((sum, course) => sum + Number(course.inscrits), 0);
  const occupation = totalCapacity ? Math.round((totalRegistered / totalCapacity) * 100) : 0;
  const presents = data.attendances.filter((a) => a.statut === "Présent").length;

  return (
    <>
      <div className="page-header"><div><h1>Statistiques académiques</h1></div></div>

      <section className="dashboard-grid">
        <div className="metric-card"><h3>Total étudiants</h3><strong>{data.students.length}</strong></div>
        <div className="metric-card"><h3>Total enseignants</h3><strong>{data.teachers.length}</strong></div>
        <div className="metric-card"><h3>Taux occupation</h3><strong>{occupation}%</strong></div>
        <div className="metric-card"><h3>Présences</h3><strong>{presents}</strong></div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Graphique académique</h2>
        <div className="stats-grid">
          <div className="fake-chart">
            <div className="bar" style={{ height:"45%" }}></div><div className="bar" style={{ height:"70%" }}></div><div className="bar" style={{ height:"55%" }}></div><div className="bar" style={{ height:"88%" }}></div><div className="bar" style={{ height:"64%" }}></div>
          </div>
          <div className="info-list">
            <div className="info-item">Comptes actifs : {data.users.length}</div>
            <div className="info-item">Places disponibles : {totalCapacity - totalRegistered}</div>
            <div className="info-item">Séances QR : {data.attendanceSessions.length}</div>
          </div>
        </div>
      </section>
    </>
  );
};

const AdminApp = ({ data, updateData, currentUser, logout, notificationReads, markNotificationsRead }) => {
  const [tab, setTab] = React.useState("dashboard");
  const notificationBreakdown = getUnreadNotificationBreakdown(data, currentUser, notificationReads);

  const handleSetTab = (nextTab) => {
    setTab(nextTab);

    if (nextTab === "messages") {
      markNotificationsRead("messages");
    }

    if (nextTab === "attendance") {
      markNotificationsRead("justifications");
    }
  };

  const openNotifications = () => {
    if (notificationBreakdown.messages > 0) {
      handleSetTab("messages");
    } else if (notificationBreakdown.justifications > 0) {
      handleSetTab("attendance");
    } else {
      handleSetTab("messages");
    }
  };

  const menuItems = [
    ["dashboard", "📊", "Tableau de bord"],
    ["users", "👤", "Comptes"],
    ["courses", "📚", "Cours"],
    ["enrollments", "➕", "Inscriptions"],
    ["grades", "📝", "Notes"],
    ["attendance", "✅", "Présences"],
    ["messages", "💬", "Messagerie"]
  ];

  const deleteById = (collection, id) => {
    updateData({ ...data, [collection]:data[collection].filter((item) => item.id !== id) });
  };

  const updateById = (collection, id, form) => {
    updateData({ ...data, [collection]:data[collection].map((item) => item.id === id ? { ...item, ...form } : item) });
  };

  const createStudent = (form) => {
    const existingUser = data.users.find((user) => user.email === form.email);
    const createdUser = existingUser || {
      id: nextId(data.users),
      nom: form.nom,
      email: form.email,
      password: "1234",
      role: "Étudiant",
      statut: "Actif"
    };

    updateData({
      ...data,
      users: existingUser ? data.users : [...data.users, createdUser],
      students:[
        ...data.students,
        {
          id:nextId(data.students),
          user_id: createdUser.id,
          ...form,
          moyenne:Number(form.moyenne),
          absences:Number(form.absences),
          courseIds:[]
        }
      ]
    });
  };

  const createTeacher = (form) => {
    const existingUser = data.users.find((user) => user.email === form.email);
    const createdUser = existingUser || {
      id: nextId(data.users),
      nom: form.nom,
      email: form.email,
      password: "1234",
      role: "Enseignant",
      statut: "Actif"
    };

    updateData({
      ...data,
      users: existingUser ? data.users : [...data.users, createdUser],
      teachers:[
        ...data.teachers,
        {
          id:nextId(data.teachers),
          user_id: createdUser.id,
          ...form
        }
      ]
    });
  };

  const createCourse = (form) => {
    if (!form.enseignant) {
      alert("Veuillez choisir un enseignant dans la liste.");
      return;
    }

    if (!form.moduleId) {
      alert("Veuillez choisir le module auquel le cours appartient.");
      return;
    }

    const autoCode = generateCourseCode(data.courses);
    const newCourseId = nextId(data.courses);
    const selectedModuleId = Number(form.moduleId);
    const selectedModule = (data.modules || []).find((module) => Number(module.id) === selectedModuleId);
    const { moduleId, ...courseForm } = form;

    if (selectedModule && courseForm.semestre !== selectedModule.semestre) {
      alert("Le semestre du cours doit correspondre au semestre du module choisi.");
      return;
    }

    updateData({
      ...data,
      courses:[
        ...data.courses,
        {
          id:newCourseId,
          ...courseForm,
          code:autoCode,
          salle:"Voir séances",
          horaire:"Voir séances",
          capacite:Number(courseForm.capacite),
          inscrits:0
        }
      ],
      modules:(data.modules || []).map((module) => ({
        ...module,
        courseIds:Number(module.id) === selectedModuleId
          ? Array.from(new Set([...(module.courseIds || []).map(Number), newCourseId]))
          : (module.courseIds || [])
      })),
      grades: ensureGradesForModule({
        ...data,
        courses:[...data.courses, { id:newCourseId, ...courseForm, code:autoCode, salle:"Voir séances", horaire:"Voir séances", capacite:Number(courseForm.capacite), inscrits:0 }],
        modules:(data.modules || []).map((module) => ({
          ...module,
          courseIds:Number(module.id) === selectedModuleId
            ? Array.from(new Set([...(module.courseIds || []).map(Number), newCourseId]))
            : (module.courseIds || [])
        }))
      }, selectedModuleId, data.grades || [])
    });
  };
  return (
    <DashboardLayout
      currentUser={currentUser}
      logout={logout}
      tab={tab}
      setTab={handleSetTab}
      menuItems={menuItems}
      footerLabel="SmartCampus - Dashboard Administrateur"
      notificationCount={notificationBreakdown.total}
      notificationBreakdown={notificationBreakdown}
      onNotificationClick={openNotifications}
      onUserClick={() => handleSetTab("profile")}
    >
      {tab === "dashboard" && <DashboardHome data={data} setAdminTab={handleSetTab}/>}
      {tab === "users" && (
        <AccountsStudentsTeachersPage
          data={data}
          updateData={updateData}
          currentUser={currentUser}
          createStudent={createStudent}
          createTeacher={createTeacher}
          updateStudent={(id, form) => updateById("students", id, {...form, moyenne:Number(form.moyenne), absences:Number(form.absences)})}
          updateTeacher={(id, form) => updateById("teachers", id, form)}
          deleteStudent={(id) => deleteById("students", id)}
          deleteTeacher={(id) => deleteById("teachers", id)}
        />
      )}
      {tab === "courses" && (
        <CourseManagementPage
          data={data}
          updateData={updateData}
          createCourse={createCourse}
          updateById={updateById}
          deleteById={deleteById}
        />
      )}
      {tab === "enrollments" && <EnrollmentPage data={data} updateData={updateData}/>}
      {tab === "grades" && <GradesPage data={data} updateData={updateData}/>}
      {tab === "attendance" && <AttendanceAdminPage data={data} updateData={updateData} mode="admin"/>}
      {tab === "messages" && <MessagingPage data={data} updateData={updateData} currentUser={currentUser}/>}
      {tab === "profile" && <ProfilePanel user={currentUser} profile={currentUser}/>}
    </DashboardLayout>
  );
};

const StudentEnrollmentPage = ({ data, updateData, student }) => {
  const classKey = getClassKey(student);
  const myClassEnrollments = (data.classEnrollments || []).filter((enrollment) => enrollment.classe === classKey);
  const myModules = myClassEnrollments.map((enrollment) => getModuleById(data, enrollment.moduleId)).filter(Boolean);
  const myCourseIds = uniqueNumbers(myModules.flatMap((module) => module.courseIds || []));
  const myCourses = data.courses.filter((course) => myCourseIds.includes(Number(course.id)));
  const eligibleEvents = (data.events || []).filter((event) => isEventEligibleForStudent(data, event, student));
  const myEventRegistrations = (data.eventRegistrations || []).filter((registration) => Number(registration.studentId) === Number(student.id));
  const [message, setMessage] = React.useState("");

  const registerEvent = (event) => {
    setMessage("");

    const reason = getEventRegistrationBlockReason(data, event, student);
    if (reason) {
      setMessage(reason);
      return;
    }

    updateData({
      ...data,
      eventRegistrations: [
        ...(data.eventRegistrations || []),
        {
          id: nextId(data.eventRegistrations || []),
          eventId: event.id,
          studentId: student.id,
          studentName: student.nom,
          registeredBy: student.nom,
          registeredAt: today()
        }
      ]
    });

    setMessage("Inscription enregistrée.");
  };

  const unregisterEvent = (registrationId) => {
    updateData({
      ...data,
      eventRegistrations: (data.eventRegistrations || []).filter((registration) => Number(registration.id) !== Number(registrationId))
    });
    setMessage("Inscription supprimée.");
  };

  return (
    <>
      <div className="page-header"><div><h1>Mes inscriptions</h1></div></div>
      {message && <div className="global-success">{message}</div>}

      <section className="panel">
        <h2 className="panel-title">Modules</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Module</th><th>Code</th><th>Cours inclus</th></tr>
            </thead>
            <tbody>
              {myModules.map((module) => {
                const courseLabels = (module.courseIds || [])
                  .map((courseId) => data.courses.find((course) => Number(course.id) === Number(courseId)))
                  .filter(Boolean)
                  .map((course) => `${course.nom} — ${course.enseignant}`);

                return (
                  <tr key={module.id}>
                    <td>{module.nom}</td>
                    <td>{module.code}</td>
                    <td>{courseLabels.join(", ")}</td>
                  </tr>
                );
              })}
              {myModules.length === 0 && <tr><td colSpan="3">Aucun module.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Cours</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Code</th><th>Cours</th><th>Enseignant</th><th>Semestre</th><th>Séances</th></tr>
            </thead>
            <tbody>
              {myCourses.map((course) => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.nom}</td>
                  <td>{course.enseignant}</td>
                  <td>{course.semestre}</td>
                  <td>{(data.courseSessions || []).filter((session) => Number(session.courseId) === Number(course.id)).length}</td>
                </tr>
              ))}
              {myCourses.length === 0 && <tr><td colSpan="5">Aucun cours.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Événements disponibles</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Événement</th><th>Date</th><th>Lieu</th><th>Cours lié</th><th>Places</th><th>Action</th></tr>
            </thead>
            <tbody>
              {eligibleEvents.map((event) => {
                const registered = isStudentRegisteredToEvent(data, event.id, student.id);
                const course = getEventCourse(data, event);
                const conflict = getStudentEventScheduleConflict(data, event, student);
                const full = getEventRegisteredCount(data, event.id) >= Number(event.capacity);
                return (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{formatEventSlot(event)}</td>
                    <td>{event.lieu}</td>
                    <td>{course ? course.nom : "—"}</td>
                    <td>{getEventRegisteredCount(data, event.id)} / {event.capacity}</td>
                    <td>
                      {registered ? (
                        <span className="status-pill">Inscrit</span>
                      ) : conflict ? (
                        <span className="status-pill muted">Cours en même temps</span>
                      ) : full ? (
                        <span className="status-pill muted">Complet</span>
                      ) : (
                        <button className="btn-primary btn-small" type="button" onClick={() => registerEvent(event)}>S'inscrire</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {eligibleEvents.length === 0 && <tr><td colSpan="6">Aucun événement disponible.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Mes événements</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Événement</th><th>Date</th><th>Lieu</th><th>Action</th></tr>
            </thead>
            <tbody>
              {myEventRegistrations.map((registration) => {
                const event = (data.events || []).find((item) => Number(item.id) === Number(registration.eventId));
                return (
                  <tr key={registration.id}>
                    <td>{event?.title || "Événement supprimé"}</td>
                    <td>{event ? formatEventSlot(event) : "—"}</td>
                    <td>{event?.lieu || "—"}</td>
                    <td><button className="btn-danger btn-small" type="button" onClick={() => unregisterEvent(registration.id)}>Annuler</button></td>
                  </tr>
                );
              })}
              {myEventRegistrations.length === 0 && <tr><td colSpan="4">Aucune inscription.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

const StudentJustificationsPage = ({ data, updateData, student }) => {
  const [texts, setTexts] = React.useState({});
  const [files, setFiles] = React.useState({});
  const [filePreviews, setFilePreviews] = React.useState({});
  const [message, setMessage] = React.useState("");
  const requests = (data.absenceJustifications || [])
    .filter((request) => request.etudiant === student.nom)
    .filter((request) => {
      const attendance = data.attendances.find((item) =>
        item.etudiant === request.etudiant &&
        (
          request.sessionId
            ? Number(item.sessionId) === Number(request.sessionId)
            : item.cours === request.cours && item.date === request.date
        )
      );

      return !attendance || attendance.statut === "Absent" || attendance.statut === "Retard";
    });

  const handleFileChange = (requestId, file) => {
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Format refusé. Vous pouvez envoyer uniquement un PDF ou une image.");
      return;
    }

    const maxSize = 3 * 1024 * 1024;

    if (file.size > maxSize) {
      setMessage("Fichier trop lourd. Taille maximale : 3 Mo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFiles({
        ...files,
        [requestId]: {
          name: file.name,
          type: file.type,
          data: reader.result
        }
      });

      setFilePreviews({
        ...filePreviews,
        [requestId]: file.name
      });

      setMessage("Pièce jointe ajoutée : " + file.name);
    };

    reader.readAsDataURL(file);
  };

  const sendJustification = (requestId) => {
    const value = (texts[requestId] || "").trim();
    const attachedFile = files[requestId];

    if (value === "" && !attachedFile) {
      setMessage("Écrivez une réponse ou ajoutez un PDF / une image avant d'envoyer.");
      return;
    }

    updateData({
      ...data,
      absenceJustifications: (data.absenceJustifications || []).map((request) =>
        request.id === requestId
          ? {
              ...request,
              justification: value || request.justification,
              statut: request.statut === "Validée" || request.statut === "Refusée" ? request.statut : "Envoyée",
              submittedAt: today(),
              attachmentName: attachedFile?.name || request.attachmentName || "",
              attachmentType: attachedFile?.type || request.attachmentType || "",
              attachmentData: attachedFile?.data || request.attachmentData || "",
              conversation: [
                ...(request.conversation || []),
                {
                  from: student.nom,
                  role: "Étudiant",
                  text: value || ("Pièce jointe envoyée : " + attachedFile.name),
                  date: today()
                }
              ]
            }
          : request
      ),
      attendances: data.attendances.map((attendance) => {
        const request = (data.absenceJustifications || []).find((item) => item.id === requestId);

        if (
          request &&
          attendance.etudiant === request.etudiant &&
          attendance.cours === request.cours &&
          attendance.date === request.date
        ) {
          return { ...attendance, methode: "Justificatif envoyé" };
        }

        return attendance;
      })
    });

    setTexts({ ...texts, [requestId]: "" });
    setFiles({ ...files, [requestId]: null });
    setFilePreviews({ ...filePreviews, [requestId]: "" });
    setMessage("Réponse envoyée à l'administration.");
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Justification d'absences</h1>
        </div>
      </div>

      {message && (
        <div className={message.includes("refusé") || message.includes("trop") || message.includes("Écrivez") ? "global-error" : "global-success"}>
          {message}
        </div>
      )}

      <section className="panel">
        <h2 className="panel-title">Demandes reçues</h2>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Discussion</th>
                <th>Fichier</th>
                <th>Répondre</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.cours}</td>
                  <td>{request.date}</td>
                  <td><span className="status-pill">{request.statut}</span></td>
                  <td>
                    <div className="thread-box">
                      {(request.conversation || []).map((msg, index) => (
                        <div className="thread-message" key={index}>
                          <strong>{msg.from} ({msg.role})</strong><br/>
                          <span>{msg.text}</span><br/>
                          <small>{msg.date}</small>
                        </div>
                      ))}

                      {(!request.conversation || request.conversation.length === 0) && (
                        <span>Aucun échange.</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {request.attachmentData && (
                      <p style={{ marginBottom:"8px" }}>
                        <a
                          href={request.attachmentData}
                          download={request.attachmentName || "justificatif"}
                          target="_blank"
                        >
                          {request.attachmentName || "Télécharger le fichier"}
                        </a>
                      </p>
                    )}

                    {request.statut !== "Validée" && (
                      <>
                        <input
                          type="file"
                          accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp"
                          onChange={(e) => handleFileChange(request.id, e.target.files[0])}
                        />
                        {filePreviews[request.id] && (
                          <p className="panel-subtitle" style={{ marginTop:"8px" }}>
                            Nouveau fichier : {filePreviews[request.id]}
                          </p>
                        )}
                      </>
                    )}

                    {request.statut === "Validée" && !request.attachmentData && "Aucun fichier"}
                  </td>
                  <td>
                    {request.statut === "Validée" ? (
                      <span className="status-pill">Dossier validé</span>
                    ) : (
                      <textarea
                        placeholder="Ajouter une réponse, précision ou nouveau justificatif..."
                        value={texts[request.id] || ""}
                        onChange={(e) => setTexts({ ...texts, [request.id]: e.target.value })}
                        style={{
                          width:"100%",
                          minHeight:"90px",
                          border:"2px solid var(--border)",
                          borderRadius:"10px",
                          padding:"10px"
                        }}
                      ></textarea>
                    )}
                  </td>
                  <td>
                    {request.statut === "Validée" ? (
                      <span className="status-pill">Terminé</span>
                    ) : (
                      <button className="btn-primary btn-small" onClick={() => sendJustification(request.id)}>
                        Envoyer réponse
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="7">Aucune demande de justification pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

const StudentSchedulePage = ({ data, student }) => {
  const myCourseIds = getEffectiveStudentCourseIds(data, student);
  const allSessions = (data.courseSessions || [])
    .filter((session) => myCourseIds.includes(Number(session.courseId)))
    .sort((a, b) => `${a.date} ${getSessionStartTime(a)}`.localeCompare(`${b.date} ${getSessionStartTime(b)}`));

  const firstSessionDate = allSessions[0]?.date || today();
  const [weekStart, setWeekStart] = React.useState(getWeekMonday(firstSessionDate));
  const [selectedSessionId, setSelectedSessionId] = React.useState(allSessions[0]?.id || "");

  const weekDays = getCalendarWeekDays(weekStart);
  const weekSessions = allSessions.filter((session) => isSessionInsideWeek(session, weekStart));

  React.useEffect(() => {
    if (allSessions.length === 0) {
      if (selectedSessionId !== "") setSelectedSessionId("");
      return;
    }

    const exists = allSessions.some((session) => Number(session.id) === Number(selectedSessionId));
    const existsInWeek = weekSessions.some((session) => Number(session.id) === Number(selectedSessionId));

    if (!exists || (!existsInWeek && weekSessions.length > 0)) {
      const nextSession = weekSessions[0] || allSessions[0];
      setSelectedSessionId(nextSession?.id || "");
    }
  }, [data.courseSessions, data.courses, student?.id, weekStart]);

  const selectedSession = allSessions.find((session) => Number(session.id) === Number(selectedSessionId)) || weekSessions[0] || allSessions[0] || null;
  const selectedCourse = selectedSession ? getSessionCourse(data, selectedSession) : null;

  const changeWeek = (days) => {
    const next = addDaysToDate(parseISODate(weekStart), days);
    setWeekStart(formatISODate(next));
    setSelectedSessionId("");
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Emploi du temps</h1>
        </div>
      </div>

      <section className="panel">
        <div className="calendar-toolbar">
          <div>
            <h2 className="panel-title">Semaine du {getWeekRangeLabel(weekStart)}</h2>
          </div>
          <div className="calendar-actions">
            <button type="button" onClick={() => changeWeek(-7)}>← Semaine précédente</button>
            <input
              type="date"
              value={weekStart}
              onChange={(e) => {
                setWeekStart(getWeekMonday(e.target.value));
                setSelectedSessionId("");
              }}
            />
            <button type="button" onClick={() => { setWeekStart(getWeekMonday(firstSessionDate)); setSelectedSessionId(""); }}>Semaine des premiers cours</button>
            <button type="button" onClick={() => changeWeek(7)}>Semaine suivante →</button>
          </div>
        </div>

        {allSessions.length === 0 && (
          <p className="panel-subtitle">Aucune séance programmée pour les modules de votre classe.</p>
        )}

        <div className="hyper-calendar">
          <div className="hyper-calendar-head">
            <div className="hyper-head-cell">Heure</div>
            {weekDays.map((day) => (
              <div className="hyper-head-cell" key={day.iso}>{day.label}<br/><span>{day.shortLabel}</span></div>
            ))}
          </div>

          <div className="hyper-calendar-body">
            <div className="hyper-time-column" style={{ height:`${CALENDAR_HEIGHT}px` }}>
              {CALENDAR_HOURS.map((hour) => (
                <div
                  key={hour}
                  className="hyper-time-label"
                  style={{ top:`${((hour * 60 - CALENDAR_START_MINUTES) / 60) * CALENDAR_HOUR_HEIGHT}px` }}
                >
                  {String(hour).padStart(2, "0")}h00
                </div>
              ))}
            </div>

            {weekDays.map((day) => {
              const daySessions = weekSessions.filter((session) => session.date === day.iso);

              return (
                <div className="hyper-day-column" key={day.iso} style={{ height:`${CALENDAR_HEIGHT}px` }}>
                  {daySessions.map((session) => {
                    const course = getSessionCourse(data, session);
                    const isSelected = selectedSession && Number(selectedSession.id) === Number(session.id);

                    return (
                      <button
                        key={session.id}
                        type="button"
                        className={isSelected ? "calendar-event selected" : "calendar-event"}
                        style={getCalendarCardStyle(daySessions, session)}
                        onClick={() => setSelectedSessionId(session.id)}
                      >
                        <strong>{session.courseName}</strong>
                        <span>{formatSessionHour(getSessionStartTime(session))} - {formatSessionHour(getSessionEndTime(session))}</span>
                        <small>{course?.enseignant || ""}</small>
                        <small>{session.salle}</small>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Détail de la séance</h2>
        {selectedSession ? (
          <div className="mini-list">
            <div className="mini-item"><strong>Cours :</strong> {selectedSession.courseName}</div>
            <div className="mini-item"><strong>Date / heure :</strong> {formatSessionDateTime(selectedSession)}</div>
            <div className="mini-item"><strong>Salle :</strong> {selectedSession.salle}</div>
            <div className="mini-item"><strong>Enseignant :</strong> {selectedCourse?.enseignant || "—"}</div>
          </div>
        ) : (
          <p className="panel-subtitle">Aucune séance programmée pour votre classe.</p>
        )}
      </section>
    </>
  );
};

const StudentApp = ({ data, updateData, currentUser, logout, notificationReads, markNotificationsRead }) => {
  const [tab, setTab] = React.useState("dashboard");
  const notificationBreakdown = getUnreadNotificationBreakdown(data, currentUser, notificationReads);

  const handleSetTab = (nextTab) => {
    setTab(nextTab);

    if (nextTab === "messages") {
      markNotificationsRead("messages");
    }

    if (nextTab === "justifications") {
      markNotificationsRead("justifications");
    }
  };

  const openNotifications = () => {
    if (notificationBreakdown.messages > 0) {
      handleSetTab("messages");
    } else if (notificationBreakdown.justifications > 0) {
      handleSetTab("justifications");
    } else {
      handleSetTab("messages");
    }
  };
  const student = data.students.find((item) => item.email === currentUser.email) || data.students[0];
  const myCourseIds = getEffectiveStudentCourseIds(data, student);
  const myCourses = data.courses.filter((course) => myCourseIds.includes(Number(course.id)));
  const myClassKey = getClassKey(student);
  const myModules = (data.classEnrollments || [])
    .filter((enrollment) => enrollment.classe === myClassKey)
    .map((enrollment) => getModuleById(data, enrollment.moduleId))
    .filter(Boolean);
  const studentSessions = (data.courseSessions || []).filter((session) => myCourseIds.includes(Number(session.courseId)));
  const studentGrades = data.grades.filter((grade) => grade.etudiant === student.nom);
  const studentAttendances = data.attendances.filter((attendance) => attendance.etudiant === student.nom);
  const generalAverage = getGeneralAverageForStudent(data, student);

  const menuItems = [
    ["dashboard", "📊", "Tableau de bord"],
    ["enroll", "📦", "Inscriptions"],
    ["grades", "📝", "Notes"],
    ["schedule", "📅", "Emploi du temps"],
    ["presence", "✅", "Présence"],
    ["justifications", "📎", "Justificatifs"],
    ["messages", "💬", "Messagerie"]
  ];

  return (
    <DashboardLayout
      currentUser={currentUser}
      logout={logout}
      tab={tab}
      setTab={handleSetTab}
      menuItems={menuItems}
      footerLabel="SmartCampus - Espace Étudiant"
      notificationCount={notificationBreakdown.total}
      notificationBreakdown={notificationBreakdown}
      onNotificationClick={openNotifications}
      onUserClick={() => handleSetTab("profile")}
    >
      {tab === "dashboard" && (
        <>
          <div className="page-header"><div><h1>Dashboard étudiant</h1></div></div>
          <section className="dashboard-grid">
            <div className="metric-card"><h3>Modules</h3><strong>{myModules.length}</strong></div>
            <div className="metric-card"><h3>Moyenne générale</h3><strong>{generalAverage}</strong></div>
            <div className="metric-card"><h3>Séances</h3><strong>{studentSessions.length}</strong></div>
            <div className="metric-card"><h3>Messages</h3><strong>{data.messages.length}</strong></div>
          </section>
          <section className="cards-two">
            <div className="panel"><h2 className="panel-title">Prochaines séances</h2><div className="mini-list">{studentSessions.slice(0, 5).map((session) => <div className="mini-item" key={session.id}><strong>{session.courseName}</strong><br/>{formatSessionLabel(session)}</div>)}</div></div>
            <div className="panel"><h2 className="panel-title">Notes récentes</h2><div className="mini-list">{studentGrades.map((grade) => <div className="mini-item" key={grade.id}><strong>{grade.cours}</strong><br/>Moyenne : {moyenne(grade)} / 20</div>)}</div></div>
          </section>
        </>
      )}
      {tab === "enroll" && <StudentEnrollmentPage data={data} updateData={updateData} student={student}/>}
      {tab === "grades" && (
        <>
          <GenericTable title="Mes notes" subtitle="" items={studentGrades.map((g) => {
            const module = getModuleForCourse(data, g.cours);
            return { ...g, moduleName:module?.nom || "—", coefficient:module ? getModuleCoefficient(module) : "—", suivi:categoryAverage(g, "Suivi"), ds:categoryAverage(g, "DS"), projet:categoryAverage(g, "Projet"), moyenne:moyenne(g) };
          })} columns={[["cours","Cours"],["moduleName","Module"],["coefficient","Coeff."],["suivi","Suivi"],["ds","DS"],["projet","Projet"],["moyenne","Moyenne"]]}/>
          <section className="panel"><h2 className="panel-title">Moyenne générale</h2><strong className="big-number">{generalAverage} / 20</strong></section>
        </>
      )}
      {tab === "schedule" && <StudentSchedulePage data={data} student={student}/>}
      {tab === "presence" && <StudentPresencePage data={data} updateData={updateData} student={student}/>}
      {tab === "justifications" && <StudentJustificationsPage data={data} updateData={updateData} student={student}/>}
      {tab === "messages" && <MessagingPage data={data} updateData={updateData} currentUser={currentUser}/>}
      {tab === "profile" && <ProfilePanel user={currentUser} profile={student}/>}
    </DashboardLayout>
  );
};


const TeacherClassesPage = ({ data, teacher }) => {
  const teacherCourses = (data.courses || []).filter((course) => course.enseignant === teacher.nom);
  const teacherCourseIds = new Set(teacherCourses.map((course) => Number(course.id)));

  const rows = getAvailableClasses(data)
    .map((classe) => {
      const classCourseIds = getCourseIdsForClass(data, classe.key);
      const courses = teacherCourses.filter((course) => classCourseIds.includes(Number(course.id)));
      if (courses.length === 0) return null;

      const students = (data.students || []).filter((student) => getClassKey(student) === classe.key);
      const moduleNames = (data.classEnrollments || [])
        .filter((enrollment) => enrollment.classe === classe.key)
        .map((enrollment) => (data.modules || []).find((module) => Number(module.id) === Number(enrollment.moduleId)))
        .filter(Boolean)
        .filter((module) => (module.courseIds || []).some((courseId) => teacherCourseIds.has(Number(courseId))))
        .map((module) => module.nom);

      return {
        classe: classe.key,
        etudiants: students.map((student) => student.nom).join(", ") || "Aucun étudiant",
        nbEtudiants: students.length,
        modules: moduleNames.join(", ") || "—",
        cours: courses.map((course) => course.nom).join(", ")
      };
    })
    .filter(Boolean);

  return (
    <>
      <div className="page-header"><div><h1>Mes classes</h1></div></div>
      <section className="panel">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Classe</th>
                <th>Étudiants</th>
                <th>Modules</th>
                <th>Cours concernés</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.classe}>
                  <td><strong>{row.classe}</strong><br/><small>{row.nbEtudiants} étudiant(s)</small></td>
                  <td>{row.etudiants}</td>
                  <td>{row.modules}</td>
                  <td>{row.cours}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan="4">Aucune classe associée.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

const TeacherSchedulePage = ({ data, teacher }) => {
  const teacherCourses = data.courses.filter((course) => course.enseignant === teacher.nom);
  const teacherCourseIds = teacherCourses.map((course) => Number(course.id));
  const allSessions = (data.courseSessions || [])
    .filter((session) => teacherCourseIds.includes(Number(session.courseId)))
    .sort((a, b) => `${a.date} ${getSessionStartTime(a)}`.localeCompare(`${b.date} ${getSessionStartTime(b)}`));

  const firstSessionDate = allSessions[0]?.date || today();
  const [weekStart, setWeekStart] = React.useState(getWeekMonday(firstSessionDate));
  const [selectedSessionId, setSelectedSessionId] = React.useState(allSessions[0]?.id || "");

  const weekDays = getCalendarWeekDays(weekStart);
  const weekSessions = allSessions.filter((session) => isSessionInsideWeek(session, weekStart));

  React.useEffect(() => {
    if (allSessions.length === 0) {
      if (selectedSessionId !== "") setSelectedSessionId("");
      return;
    }

    const exists = allSessions.some((session) => Number(session.id) === Number(selectedSessionId));
    const existsInWeek = weekSessions.some((session) => Number(session.id) === Number(selectedSessionId));

    if (!exists || (!existsInWeek && weekSessions.length > 0)) {
      const nextSession = weekSessions[0] || allSessions[0];
      setSelectedSessionId(nextSession?.id || "");
    }
  }, [data.courseSessions, data.courses, teacher?.id, weekStart]);

  const selectedSession = allSessions.find((session) => Number(session.id) === Number(selectedSessionId)) || weekSessions[0] || allSessions[0] || null;
  const selectedCourse = selectedSession ? getSessionCourse(data, selectedSession) : null;
  const selectedClasses = selectedCourse ? getClassesForCourse(data, selectedCourse.id) : [];

  const changeWeek = (days) => {
    const next = addDaysToDate(parseISODate(weekStart), days);
    setWeekStart(formatISODate(next));
    setSelectedSessionId("");
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Emploi du temps enseignant</h1>
        </div>
      </div>

      <section className="panel">
        <div className="calendar-toolbar">
          <div>
            <h2 className="panel-title">Semaine du {getWeekRangeLabel(weekStart)}</h2>
          </div>
          <div className="calendar-actions">
            <button type="button" onClick={() => changeWeek(-7)}>← Semaine précédente</button>
            <input
              type="date"
              value={weekStart}
              onChange={(e) => {
                setWeekStart(getWeekMonday(e.target.value));
                setSelectedSessionId("");
              }}
            />
            <button type="button" onClick={() => { setWeekStart(getWeekMonday(firstSessionDate)); setSelectedSessionId(""); }}>Semaine des premiers cours</button>
            <button type="button" onClick={() => changeWeek(7)}>Semaine suivante →</button>
          </div>
        </div>

        {allSessions.length === 0 && (
          <p className="panel-subtitle">Aucune séance programmée pour vos cours.</p>
        )}

        <div className="hyper-calendar">
          <div className="hyper-calendar-head">
            <div className="hyper-head-cell">Heure</div>
            {weekDays.map((day) => (
              <div className="hyper-head-cell" key={day.iso}>{day.label}<br/><span>{day.shortLabel}</span></div>
            ))}
          </div>

          <div className="hyper-calendar-body">
            <div className="hyper-time-column" style={{ height:`${CALENDAR_HEIGHT}px` }}>
              {CALENDAR_HOURS.map((hour) => (
                <div
                  key={hour}
                  className="hyper-time-label"
                  style={{ top:`${((hour * 60 - CALENDAR_START_MINUTES) / 60) * CALENDAR_HOUR_HEIGHT}px` }}
                >
                  {String(hour).padStart(2, "0")}h00
                </div>
              ))}
            </div>

            {weekDays.map((day) => {
              const daySessions = weekSessions.filter((session) => session.date === day.iso);

              return (
                <div className="hyper-day-column" key={day.iso} style={{ height:`${CALENDAR_HEIGHT}px` }}>
                  {daySessions.map((session) => {
                    const course = getSessionCourse(data, session);
                    const isSelected = selectedSession && Number(selectedSession.id) === Number(session.id);

                    return (
                      <button
                        key={session.id}
                        type="button"
                        className={isSelected ? "calendar-event selected" : "calendar-event"}
                        style={getCalendarCardStyle(daySessions, session)}
                        onClick={() => setSelectedSessionId(session.id)}
                      >
                        <strong>{session.courseName}</strong>
                        <span>{formatSessionHour(getSessionStartTime(session))} - {formatSessionHour(getSessionEndTime(session))}</span>
                        <small>{session.salle}</small>
                        <small>{getClassesForCourse(data, course?.id).join(", ") || "Classe non affectée"}</small>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Détail de la séance</h2>
        {selectedSession ? (
          <div className="mini-list">
            <div className="mini-item"><strong>Cours :</strong> {selectedSession.courseName}</div>
            <div className="mini-item"><strong>Date / heure :</strong> {formatSessionDateTime(selectedSession)}</div>
            <div className="mini-item"><strong>Salle :</strong> {selectedSession.salle}</div>
            <div className="mini-item"><strong>Enseignant :</strong> {selectedCourse?.enseignant || teacher.nom}</div>
            <div className="mini-item"><strong>Classes :</strong> {selectedClasses.join(", ") || "Aucune classe inscrite"}</div>
          </div>
        ) : (
          <p className="panel-subtitle">Aucune séance programmée pour vos cours.</p>
        )}
      </section>
    </>
  );
};

const TeacherApp = ({ data, updateData, currentUser, logout, notificationReads, markNotificationsRead }) => {
  const [tab, setTab] = React.useState("dashboard");
  const notificationBreakdown = getUnreadNotificationBreakdown(data, currentUser, notificationReads);

  const handleSetTab = (nextTab) => {
    setTab(nextTab);

    if (nextTab === "messages") {
      markNotificationsRead("messages");
    }

    if (nextTab === "presence") {
      markNotificationsRead("justifications");
    }
  };

  const openNotifications = () => {
    if (notificationBreakdown.messages > 0) {
      handleSetTab("messages");
    } else if (notificationBreakdown.justifications > 0) {
      handleSetTab("presence");
    } else {
      handleSetTab("messages");
    }
  };
  const teacher = data.teachers.find((item) => item.email === currentUser.email) || data.teachers[0];
  const teacherCourses = data.courses.filter((course) => course.enseignant === teacher.nom);
  const teacherCourseIds = new Set(teacherCourses.map((course) => Number(course.id)));
  const teacherStudentsCount = (data.students || []).filter((student) =>
    getEffectiveStudentCourseIds(data, student).some((courseId) => teacherCourseIds.has(Number(courseId)))
  ).length;

  const menuItems = [
    ["dashboard", "📊", "Tableau de bord"],
    ["courses", "📚", "Cours enseignés"],
    ["classes", "👥", "Classes"],
    ["grades", "📝", "Notes"],
    ["presence", "✅", "Présences"],
    ["schedule", "📅", "Emploi du temps"],
    ["messages", "💬", "Messagerie"]
  ];

  return (
    <DashboardLayout
      currentUser={currentUser}
      logout={logout}
      tab={tab}
      setTab={handleSetTab}
      menuItems={menuItems}
      footerLabel="SmartCampus - Espace Enseignant"
      notificationCount={notificationBreakdown.total}
      notificationBreakdown={notificationBreakdown}
      onNotificationClick={openNotifications}
      onUserClick={() => handleSetTab("profile")}
    >
      {tab === "dashboard" && (
        <>
          <div className="page-header"><div><h1>Dashboard enseignant</h1></div></div>
          <section className="dashboard-grid">
            <div className="metric-card"><h3>Cours enseignés</h3><strong>{teacherCourses.length}</strong></div>
            <div className="metric-card"><h3>Étudiants inscrits</h3><strong>{teacherStudentsCount}</strong></div>
            <div className="metric-card"><h3>Notes à valider</h3><strong>{data.grades.filter((g) => teacherCourses.some((course) => course.nom === g.cours) && !isGradeLocked(g)).length}</strong></div>
            <div className="metric-card"><h3>Séances QR</h3><strong>{data.attendanceSessions.filter((s) => s.enseignant === teacher.nom).length}</strong></div>
          </section>
          <section className="panel"><h2 className="panel-title">Cours responsables</h2><div className="mini-list">{teacherCourses.map((course) => <div className="mini-item" key={course.id}><strong>{course.nom}</strong><br/>{getCourseSessions(data, course.id).length} séance(s) — {getCourseRegisteredCount(data, course.id)}/{course.capacite} inscrits</div>)}</div></section>
        </>
      )}
      {tab === "courses" && <GenericTable title="Cours enseignés" subtitle="" items={teacherCourses.map((course) => ({ ...course, seances:getCourseSessions(data, course.id).length, classes:getClassesForCourse(data, course.id).join(", ") || "Aucune classe", inscrits:getCourseRegisteredCount(data, course.id) }))} columns={[["code","Code"],["nom","Cours"],["semestre","Semestre"],["classes","Classes"],["seances","Séances"],["inscrits","Inscrits"]]}/>}
      {tab === "classes" && <TeacherClassesPage data={data} teacher={teacher}/>}
      {tab === "grades" && <GradesPage data={data} updateData={updateData} allowedCourses={teacherCourses} title="Notes de mes cours" canValidate={false}/>}
      {tab === "presence" && <TeacherQRCodePage data={data} updateData={updateData} teacher={teacher}/>}
      {tab === "schedule" && <TeacherSchedulePage data={data} teacher={teacher}/>}
      {tab === "messages" && <MessagingPage data={data} updateData={updateData} currentUser={currentUser}/>}
      {tab === "profile" && <ProfilePanel user={currentUser} profile={teacher}/>}
    </DashboardLayout>
  );
};

const ProfilePanel = ({ user, profile }) => (
  <>
    <div className="page-header"><div><h1>Profil utilisateur</h1></div></div>
    <section className="panel">
      <div className="profile-box">
        <div className="avatar">{initials(user.nom)}</div>
        <div>
          <h2 className="panel-title">{user.nom}</h2>
          <div className="mini-list">
            <div className="mini-item"><strong>Email :</strong> {user.email}</div>
            <div className="mini-item"><strong>Rôle :</strong> {user.role}</div>
            {profile?.niveau && <div className="mini-item"><strong>Niveau :</strong> {profile.niveau}</div>}
            {profile?.groupe && <div className="mini-item"><strong>Groupe :</strong> {profile.groupe}</div>}
            {profile?.departement && <div className="mini-item"><strong>Département :</strong> {profile.departement}</div>}
            {profile?.cours && <div className="mini-item"><strong>Cours :</strong> {profile.cours}</div>}
          </div>
        </div>
      </div>
    </section>
  </>
);

const App = () => {
  const [page, setPage] = React.useState("accueil");
  const [data, setData] = React.useState(defaultData);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [notificationReads, setNotificationReads] = React.useState(loadNotificationReads);
  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState("");

  const navigate = (pageName) => setPage(pageName);

  const pageForRole = (role) => {
    if (role === "Administrateur") return "admin";
    if (role === "Enseignant") return "teacher";
    if (role === "Étudiant") return "student";
    return "accueil";
  };

  const refreshData = async () => {
    try {
      const result = await apiRequest("list_data");
      setData(normalizeCourseRegisteredCounts(result.data));
      setApiError("");
    } catch (error) {
      setApiError("Impossible de charger MySQL. Vérifiez database.sql et api/config.php.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const boot = async () => {
      try {
        const dataResult = await apiRequest("list_data");
        setData(normalizeCourseRegisteredCounts(dataResult.data));

        const sessionResult = await apiRequest("current_user");
        if (sessionResult.user) {
          setCurrentUser(sessionResult.user);
          setPage(pageForRole(sessionResult.user.role));
        }

        setApiError("");
      } catch (error) {
        setApiError("Impossible de charger MySQL. Vérifiez database.sql et api/config.php.");
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, []);

  const updateData = async (newData) => {
    const normalizedData = normalizeCourseRegisteredCounts(newData);
    setData(normalizedData);

    try {
      await apiRequest("save_all", { data: normalizedData });
      await refreshData();
    } catch (error) {
      setApiError(error.message || "Erreur sauvegarde MySQL.");
    }
  };

  const markNotificationsRead = (category = "all") => {
    if (!currentUser) return;

    const userKey = getNotificationUserKey(currentUser);
    const previousUserReads = getUserReadState(notificationReads, currentUser);

    const nextUserReads = {
      messages: { ...(previousUserReads.messages || {}) },
      justifications: { ...(previousUserReads.justifications || {}) }
    };

    if (category === "messages" || category === "all") {
      getVisibleMessagesForUser(data.messages, currentUser).forEach((message) => {
        nextUserReads.messages[message.id] = getMessageFingerprint(message);
      });
    }

    if (category === "justifications" || category === "all") {
      getRelevantJustificationsForUser(data, currentUser).forEach((request) => {
        nextUserReads.justifications[request.id] = getJustificationFingerprint(request);
      });
    }

    const nextReads = {
      ...notificationReads,
      [userKey]: nextUserReads
    };

    setNotificationReads(nextReads);
    saveNotificationReads(nextReads);
  };

  const logout = async () => {
    try { await apiRequest("logout"); } catch (error) {}
    setCurrentUser(null);
    setPage("accueil");
  };

  if (loading) {
    return (
      <div className="app">
        <main className="login-page">
          <section className="card">
            <h2 className="card-title">Chargement SmartCampus</h2>
            <p style={{ textAlign:"center", color:"#64748b" }}>Connexion à PHP / MySQL...</p>
          </section>
        </main>
      </div>
    );
  }

  if (page === "admin" && currentUser?.role === "Administrateur") {
    return (
      <AdminApp
        data={data}
        updateData={updateData}
        currentUser={currentUser}
        logout={logout}
        notificationReads={notificationReads}
        markNotificationsRead={markNotificationsRead}
      />
    );
  }
  if (page === "student" && currentUser?.role === "Étudiant") {
    return (
      <StudentApp
        data={data}
        updateData={updateData}
        currentUser={currentUser}
        logout={logout}
        notificationReads={notificationReads}
        markNotificationsRead={markNotificationsRead}
      />
    );
  }
  if (page === "teacher" && currentUser?.role === "Enseignant") {
    return (
      <TeacherApp
        data={data}
        updateData={updateData}
        currentUser={currentUser}
        logout={logout}
        notificationReads={notificationReads}
        markNotificationsRead={markNotificationsRead}
      />
    );
  }

  return (
    <div className="app">
      {apiError && (
        <div className="global-warning" style={{ margin:"16px auto 0", maxWidth:"900px" }}>
          {apiError}
        </div>
      )}
      <header className="navbar">
        <div className="logo" onClick={() => navigate("accueil")}><img src="assets/ece-logo.jpg" alt="ECE Logo"/></div>
        <nav className="nav-links">
          <button onClick={() => navigate("accueil")}>Accueil</button>
          <button onClick={() => navigate("connexion")}>Connexion</button>
          <button onClick={() => navigate("explorer")}>Explorer</button>
          <button onClick={() => navigate("contact")}>Contact</button>
        </nav>
      </header>

      {page === "accueil" && <HomePage navigate={navigate}/>}
      {page === "connexion" && <LoginPage data={data} setCurrentUser={setCurrentUser} showPassword={showPassword} setShowPassword={setShowPassword} navigate={navigate}/>}
      {page === "contact" && <ContactPage navigate={navigate}/>}
      {page === "explorer" && <ExplorerPage navigate={navigate}/>}

      <footer className="footer">© 2026 ECE SmartCampus — Tous droits réservés.</footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
