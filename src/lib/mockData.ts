// Mock data layer for Brainexa Phase 2
// All structures live in-memory; replace with backend calls later.

export type Role = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  referralCode?: string;
  referredBy?: string | null;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Test {
  id: string;
  title: string;
  scope: "subject" | "chapter" | "topic";
  refId: string; // subjectId / chapterId / topicId
  questions: Question[];
}

export interface Doubt {
  id: string;
  topicId: string;
  studentId: string;
  studentName: string;
  question: string;
  reply?: string;
  status: "pending" | "answered";
  createdAt: string;
}

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  youtubeId: string; // video id, embed as https://www.youtube.com/embed/{id}
  pdfUrl: string;
  unlockAt?: string; // ISO date
  description?: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  courseId: string;
  title: string;
  icon?: string;
  chapters: Chapter[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  subjects: Subject[];
}

export interface TeacherAssignment {
  teacherId: string;
  subjectId: string;
  commissionPercent: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  date: string;
}

export interface Referral {
  referrerId: string;
  refereeId: string;
  level: 1 | 2 | 3;
}

export interface ReferralCommission {
  id: string;
  referrerId: string;
  refereeId: string;
  enrollmentId: string;
  level: 1 | 2 | 3;
  percent: number;
  amount: number;
  status: "pending" | "paid";
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  date: string;
}

// ---------- Seed data ----------

export const users: User[] = [
  { id: "u-admin", name: "Admin", email: "admin@brainexa.in", role: "admin" },
  { id: "u-teacher1", name: "Dr. Rajesh Verma", email: "rajesh@brainexa.in", role: "teacher" },
  { id: "u-teacher2", name: "Ms. Priya Sharma", email: "priya@brainexa.in", role: "teacher" },
  {
    id: "u-student1",
    name: "Aman Kumar",
    email: "aman@student.in",
    role: "student",
    referralCode: "AMAN123",
    referredBy: null,
  },
  {
    id: "u-student2",
    name: "Riya Singh",
    email: "riya@student.in",
    role: "student",
    referralCode: "RIYA456",
    referredBy: "u-student1",
  },
  {
    id: "u-student3",
    name: "Karan Patel",
    email: "karan@student.in",
    role: "student",
    referralCode: "KARAN789",
    referredBy: "u-student2",
  },
];

const topic = (id: string, chapterId: string, title: string, youtubeId: string): Topic => ({
  id,
  chapterId,
  title,
  youtubeId,
  pdfUrl: `https://example.com/${id}.pdf`,
  description: `Learn ${title} step by step.`,
});

// Course display order: Class 10 Premium, Class 10 Demo, Class 9 Premium, Class 9 Demo
export const courses: Course[] = [
  {
    id: "c-class10-premium",
    title: "Class 10 Science — Premium",
    description:
      "Complete Class 10 Science board preparation — full syllabus videos, notes, chapter-wise quizzes and doubt support.",
    price: 299,
    subjects: [
      {
        id: "s-c10-sci",
        courseId: "c-class10-premium",
        title: "Science",
        chapters: [
          {
            id: "ch-c10-sci-1",
            subjectId: "s-c10-sci",
            title: "Chemical Reactions and Equations",
            topics: [
              topic("t-1", "ch-c10-sci-1", "Types of Chemical Reactions", "ZM8ECpBuQYE"),
              topic("t-2", "ch-c10-sci-1", "Balancing Chemical Equations", "8wZugqi_uCg"),
            ],
          },
          {
            id: "ch-c10-sci-2",
            subjectId: "s-c10-sci",
            title: "Acids, Bases and Salts",
            topics: [
              topic("t-3", "ch-c10-sci-2", "pH Scale & Indicators", "ZvPrn3aBQG8"),
              topic("t-4", "ch-c10-sci-2", "Common Salt & Bleaching Powder", "kKKM8Y-u7ds"),
            ],
          },
          {
            id: "ch-c10-sci-3",
            subjectId: "s-c10-sci",
            title: "Light — Reflection and Refraction",
            topics: [
              topic("t-5", "ch-c10-sci-3", "Spherical Mirrors", "iwP4heWDhvw"),
              topic("t-6", "ch-c10-sci-3", "Refraction Through Lenses", "NyOYW07-L5g"),
            ],
          },
          {
            id: "ch-c10-sci-4",
            subjectId: "s-c10-sci",
            title: "Life Processes",
            topics: [
              topic("t-7", "ch-c10-sci-4", "Nutrition in Plants & Animals", "Rd4a1X3B61w"),
              topic("t-8", "ch-c10-sci-4", "Respiration & Transportation", "Aoi4j8es4gQ"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-class10-demo",
    title: "Class 10 Science — Demo",
    description:
      "Free demo of Class 10 Science with sample video lessons and a basic quiz so you can try Brainexa before enrolling.",
    price: 0,
    subjects: [
      {
        id: "s-c10-sci-demo",
        courseId: "c-class10-demo",
        title: "Science",
        chapters: [
          {
            id: "ch-c10-sci-demo-1",
            subjectId: "s-c10-sci-demo",
            title: "Demo Chapter — Class 10 Science",
            topics: [
              topic("t-9", "ch-c10-sci-demo-1", "Introduction to Class 10 Science", "8IlzKri08kk"),
              topic("t-10", "ch-c10-sci-demo-1", "Sample Topic: Light Reflection", "ml4NSzCQobk"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-class9-premium",
    title: "Class 9 Science — Premium",
    description:
      "Complete Class 9 Science board preparation — full syllabus videos, notes, chapter-wise quizzes and doubt support.",
    price: 299,
    subjects: [
      {
        id: "s-c9-sci",
        courseId: "c-class9-premium",
        title: "Science",
        chapters: [
          {
            id: "ch-c9-sci-1",
            subjectId: "s-c9-sci",
            title: "Matter in Our Surroundings",
            topics: [
              topic("t-11", "ch-c9-sci-1", "States of Matter", "riXcZT2ICjA"),
              topic("t-12", "ch-c9-sci-1", "Evaporation & Latent Heat", "hQpQ0hxVNTg"),
            ],
          },
          {
            id: "ch-c9-sci-2",
            subjectId: "s-c9-sci",
            title: "Atoms and Molecules",
            topics: [
              topic("t-13", "ch-c9-sci-2", "Laws of Chemical Combination", "ZM8ECpBuQYE"),
              topic("t-14", "ch-c9-sci-2", "Atomic Mass & Mole Concept", "8wZugqi_uCg"),
            ],
          },
          {
            id: "ch-c9-sci-3",
            subjectId: "s-c9-sci",
            title: "Motion",
            topics: [
              topic("t-15", "ch-c9-sci-3", "Distance, Displacement & Speed", "ZvPrn3aBQG8"),
              topic("t-16", "ch-c9-sci-3", "Equations of Motion", "kKKM8Y-u7ds"),
            ],
          },
          {
            id: "ch-c9-sci-4",
            subjectId: "s-c9-sci",
            title: "The Fundamental Unit of Life",
            topics: [
              topic("t-17", "ch-c9-sci-4", "Cell Structure", "iwP4heWDhvw"),
              topic("t-18", "ch-c9-sci-4", "Cell Organelles", "NyOYW07-L5g"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-class9-demo",
    title: "Class 9 Science — Demo",
    description:
      "Free demo of Class 9 Science with sample video lessons and a basic quiz so you can try Brainexa before enrolling.",
    price: 0,
    subjects: [
      {
        id: "s-c9-sci-demo",
        courseId: "c-class9-demo",
        title: "Science",
        chapters: [
          {
            id: "ch-c9-sci-demo-1",
            subjectId: "s-c9-sci-demo",
            title: "Demo Chapter — Class 9 Science",
            topics: [
              topic("t-19", "ch-c9-sci-demo-1", "Introduction to Class 9 Science", "Rd4a1X3B61w"),
              topic("t-20", "ch-c9-sci-demo-1", "Sample Topic: Matter Around Us", "Aoi4j8es4gQ"),
            ],
          },
        ],
      },
    ],
  },
];

export const teacherAssignments: TeacherAssignment[] = [
  { teacherId: "u-teacher1", subjectId: "s-c10-sci", commissionPercent: 40 },
  { teacherId: "u-teacher1", subjectId: "s-c9-sci", commissionPercent: 40 },
  { teacherId: "u-teacher2", subjectId: "s-c10-sci-demo", commissionPercent: 30 },
  { teacherId: "u-teacher2", subjectId: "s-c9-sci-demo", commissionPercent: 30 },
];

export const enrollments: Enrollment[] = [
  { id: "e-1", studentId: "u-student1", courseId: "c-class10-premium", amount: 299, date: "2026-02-01" },
  { id: "e-2", studentId: "u-student2", courseId: "c-class10-premium", amount: 299, date: "2026-02-15" },
  { id: "e-3", studentId: "u-student3", courseId: "c-class9-premium", amount: 299, date: "2026-03-10" },
  { id: "e-4", studentId: "u-student2", courseId: "c-class9-demo", amount: 0, date: "2026-04-01" },
];

export const referrals: Referral[] = [
  { referrerId: "u-student1", refereeId: "u-student2", level: 1 },
  { referrerId: "u-student2", refereeId: "u-student3", level: 1 },
  { referrerId: "u-student1", refereeId: "u-student3", level: 2 },
];

export const referralRates = { L1: 7, L2: 3, L3: 2.5 };

export const referralCommissions: ReferralCommission[] = [
  {
    id: "rc-1",
    referrerId: "u-student1",
    refereeId: "u-student2",
    enrollmentId: "e-2",
    level: 1,
    percent: 7,
    amount: Math.round(299 * 0.07),
    status: "paid",
  },
  {
    id: "rc-2",
    referrerId: "u-student2",
    refereeId: "u-student3",
    enrollmentId: "e-3",
    level: 1,
    percent: 7,
    amount: Math.round(299 * 0.07),
    status: "pending",
  },
  {
    id: "rc-3",
    referrerId: "u-student1",
    refereeId: "u-student3",
    enrollmentId: "e-3",
    level: 2,
    percent: 3,
    amount: Math.round(299 * 0.03),
    status: "pending",
  },
];

export const withdrawals: WithdrawalRequest[] = [
  { id: "w-1", userId: "u-student1", amount: 350, status: "pending", date: "2026-04-20" },
];

export const doubts: Doubt[] = [
  {
    id: "d-1",
    topicId: "t-1",
    studentId: "u-student1",
    studentName: "Aman Kumar",
    question: "What is the difference between speed and velocity?",
    reply: "Speed is scalar, velocity is vector with direction.",
    status: "answered",
    createdAt: "2026-04-22",
  },
  {
    id: "d-2",
    topicId: "t-1",
    studentId: "u-student2",
    studentName: "Riya Singh",
    question: "Can acceleration be negative?",
    status: "pending",
    createdAt: "2026-04-25",
  },
];

const sampleQs = (n: number, prefix: string): Question[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `${prefix}-q${i + 1}`,
    text: `Sample question ${i + 1} for ${prefix}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: i % 4,
  }));

export const tests: Test[] = [
  { id: "test-t1", title: "Chemical Reactions — Topic Quiz", scope: "topic", refId: "t-1", questions: sampleQs(5, "t1") },
  { id: "test-ch1", title: "Light — Chapter Test", scope: "chapter", refId: "ch-c10-sci-3", questions: sampleQs(10, "ch1") },
  { id: "test-sphy", title: "Class 10 Science — Subject Test", scope: "subject", refId: "s-c10-sci", questions: sampleQs(15, "sphy") },
  { id: "test-t4", title: "States of Matter — Topic Quiz", scope: "topic", refId: "t-11", questions: sampleQs(5, "t4") },
];

// ---------- Helpers ----------

export const getCourse = (id: string) => courses.find((c) => c.id === id);
export const getSubject = (id: string) => {
  for (const c of courses) {
    const s = c.subjects.find((x) => x.id === id);
    if (s) return { course: c, subject: s };
  }
  return undefined;
};
export const getChapter = (id: string) => {
  for (const c of courses)
    for (const s of c.subjects) {
      const ch = s.chapters.find((x) => x.id === id);
      if (ch) return { course: c, subject: s, chapter: ch };
    }
  return undefined;
};
export const getTopic = (id: string) => {
  for (const c of courses)
    for (const s of c.subjects)
      for (const ch of s.chapters) {
        const t = ch.topics.find((x) => x.id === id);
        if (t) return { course: c, subject: s, chapter: ch, topic: t };
      }
  return undefined;
};

export const getDoubtsForTopic = (topicId: string) =>
  doubts.filter((d) => d.topicId === topicId);

export const getTestsForRef = (scope: Test["scope"], refId: string) =>
  tests.filter((t) => t.scope === scope && t.refId === refId);

export const getTeacherSubjects = (teacherId: string) => {
  const sIds = teacherAssignments.filter((a) => a.teacherId === teacherId).map((a) => a.subjectId);
  const list: { course: Course; subject: Subject; commission: number }[] = [];
  for (const c of courses)
    for (const s of c.subjects)
      if (sIds.includes(s.id)) {
        const a = teacherAssignments.find(
          (x) => x.teacherId === teacherId && x.subjectId === s.id,
        )!;
        list.push({ course: c, subject: s, commission: a.commissionPercent });
      }
  return list;
};

export const getTeacherEarnings = (teacherId: string) => {
  const assigned = getTeacherSubjects(teacherId);
  let totalSales = 0;
  let totalEarning = 0;
  const courseIds = new Set(assigned.map((a) => a.course.id));
  for (const e of enrollments) {
    if (!courseIds.has(e.courseId)) continue;
    const subj = assigned.find((a) => a.course.id === e.courseId);
    if (!subj) continue;
    totalSales += e.amount;
    totalEarning += Math.round((e.amount * subj.commission) / 100);
  }
  return {
    totalSales,
    totalEarning,
    paid: Math.round(totalEarning * 0.4),
    pending: totalEarning - Math.round(totalEarning * 0.4),
  };
};

export const getStudentReferralStats = (studentId: string) => {
  const direct = referralCommissions.filter((r) => r.referrerId === studentId && r.level === 1);
  const l2 = referralCommissions.filter((r) => r.referrerId === studentId && r.level === 2);
  const l3 = referralCommissions.filter((r) => r.referrerId === studentId && r.level === 3);
  const sum = (arr: ReferralCommission[]) => arr.reduce((a, b) => a + b.amount, 0);
  const totalReferrals = referrals.filter((r) => r.referrerId === studentId).length;
  return {
    direct: sum(direct),
    l2: sum(l2),
    l3: sum(l3),
    total: sum(direct) + sum(l2) + sum(l3),
    totalReferrals,
  };
};

export const getStudentEnrollments = (studentId: string) =>
  enrollments
    .filter((e) => e.studentId === studentId)
    .map((e) => ({ enrollment: e, course: getCourse(e.courseId)! }));
