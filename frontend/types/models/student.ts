import type { Timestamp } from "firebase/firestore";

export type Gender = "male" | "female" | "other";
export type Category = "general" | "obc" | "sc" | "st" | "ews";
export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-"
  | "AB+"
  | "AB-";
export type AcademicStatus = "regular" | "backlog" | "detained" | "passed";

/** Firestore: students/{uid} — core identity + personal details + onboarding meta. */
export interface StudentProfile {
  uid: string;
  email: string;
  role: "student";

  // Personal (Step 1 — mandatory)
  fullName: string;
  gender: Gender;
  dateOfBirth: string; // ISO yyyy-mm-dd
  mobileNumber: string;
  alternateMobileNumber?: string;
  aadhaarNumber?: string;
  category: Category;
  bloodGroup?: BloodGroup;
  address: string;
  city: string;
  state: string;
  pincode: string;
  photoUrl?: string; // Cloudinary (student photo = media)

  // Onboarding meta
  profileCompleted: boolean;
  completionPercentage: number;
  sections: {
    personal: boolean;
    academic: boolean;
    professional: boolean;
    documents: boolean;
  };

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Lightweight profile meta the AuthProvider exposes app-wide. */
export interface StudentProfileMeta {
  exists: boolean;
  profileCompleted: boolean;
  completionPercentage: number;
  fullName?: string;
  photoUrl?: string;
  sections?: {
    personal: boolean;
    academic: boolean;
    professional: boolean;
    documents: boolean;
  };
}
