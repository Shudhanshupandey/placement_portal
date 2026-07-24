/**
 * Seed demo placement drives + announcements so the student dashboard has data.
 *
 * Usage (real project):
 *   set GOOGLE_APPLICATION_CREDENTIALS to a service-account key, then:
 *   cd Backend/functions && node seed-demo.mjs
 *
 * Usage (emulator):
 *   set FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 and GCLOUD_PROJECT=<id>, then run.
 *
 * Optional: set STUDENT_UID=<uid> to also create a personal welcome notification.
 */
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp({
  credential: process.env.FIRESTORE_EMULATOR_HOST ? undefined : applicationDefault(),
  projectId: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || undefined,
});

const db = getFirestore();
const YEAR = new Date().getFullYear();
const days = (n) => new Date(Date.now() + n * 24 * 3600 * 1000);

const drives = [
  {
    companyName: "Infosys",
    role: "Systems Engineer",
    jobType: "Full-time",
    packageLabel: "6.5 LPA",
    location: "Pune / Bengaluru",
    description: "Join Infosys as a Systems Engineer working across modern enterprise stacks.",
    skills: ["Java", "SQL", "Problem Solving"],
    openings: 40,
    eligibility: { courses: ["B.Tech"], minCgpa: 6.5, allowBacklogs: false, passingYears: [YEAR + 1] },
    status: "published",
    lastDate: days(7),
    driveDate: days(20),
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    companyName: "Deloitte",
    role: "Analyst — Technology",
    jobType: "Full-time",
    packageLabel: "8.2 LPA",
    location: "Gurugram",
    description: "Work with global clients on technology consulting engagements.",
    skills: ["JavaScript", "SQL"],
    openings: 15,
    eligibility: {
      courses: ["B.Tech"],
      branches: ["Computer Science & Engineering", "Information Technology", "Electronics & Communication"],
      minCgpa: 7.0,
      maxActiveBacklogs: 1,
      passingYears: [YEAR + 1],
    },
    status: "published",
    lastDate: days(4),
    driveDate: days(15),
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    companyName: "Google",
    role: "Software Engineer, University Grad",
    jobType: "Full-time",
    packageLabel: "45 LPA",
    location: "Bengaluru / Hyderabad",
    description: "Build products used by billions. Strong fundamentals in DSA required.",
    skills: ["DSA", "System Design", "C++"],
    openings: 5,
    eligibility: {
      courses: ["B.Tech"],
      branches: ["Computer Science & Engineering", "Information Technology"],
      minCgpa: 8.0,
      allowBacklogs: false,
      requiredSkills: ["DSA", "System Design"],
      passingYears: [YEAR + 1],
    },
    status: "published",
    lastDate: days(10),
    driveDate: days(28),
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    companyName: "TCS",
    role: "Assistant System Engineer",
    jobType: "Full-time",
    packageLabel: "3.6 LPA",
    location: "Multiple",
    description: "TCS National Qualifier Test based hiring for B.Tech graduates.",
    skills: ["Aptitude", "C"],
    openings: 100,
    eligibility: { courses: ["B.Tech"], minCgpa: 6.0, passingYears: [YEAR + 1] },
    status: "published",
    lastDate: days(2),
    driveDate: days(12),
    createdAt: FieldValue.serverTimestamp(),
  },
];

const announcements = [
  {
    recipientId: "all",
    type: "announcement",
    title: "Placement season 2026 is now live",
    message: "Keep your profile updated and resumes ready. New drives are added weekly.",
    read: false,
    link: "/placement-drives",
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    recipientId: "all",
    type: "drive",
    title: "Google drive open for applications",
    message: "Software Engineer roles are now open. Check eligibility and apply before the deadline.",
    read: false,
    link: "/placement-drives",
    createdAt: FieldValue.serverTimestamp(),
  },
];

async function main() {
  const batch = db.batch();
  drives.forEach((d) => batch.set(db.collection("placementDrives").doc(), d));
  announcements.forEach((n) => batch.set(db.collection("notifications").doc(), n));

  if (process.env.STUDENT_UID) {
    batch.set(db.collection("notifications").doc(), {
      recipientId: process.env.STUDENT_UID,
      type: "system",
      title: "Welcome to the SAITM Placement Portal",
      message: "Complete your profile to unlock placement drives.",
      read: false,
      link: "/dashboard",
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`Seeded ${drives.length} drives and ${announcements.length} announcements.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
