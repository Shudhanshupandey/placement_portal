/** Static option lists for the onboarding wizard selects. */

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

export const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
] as const;

export const BLOOD_GROUP_OPTIONS = [
  "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-",
].map((g) => ({ value: g, label: g }));

export const COURSE_OPTIONS = [
  "B.Tech", "M.Tech", "MBA", "BCA", "MCA", "B.Sc", "Diploma",
].map((c) => ({ value: c, label: c }));

export const BRANCH_OPTIONS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence & Machine Learning",
  "Data Science",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other",
].map((b) => ({ value: b, label: b }));

export const YEAR_OPTIONS = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
] as const;

export const SEMESTER_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `Semester ${i + 1}`,
}));

export const ACADEMIC_STATUS_OPTIONS = [
  { value: "regular", label: "Regular" },
  { value: "backlog", label: "Has Backlogs" },
  { value: "detained", label: "Detained" },
  { value: "passed", label: "Passed" },
] as const;

export const YES_NO_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Jammu & Kashmir", "Ladakh", "Chandigarh",
  "Puducherry", "Andaman & Nicobar Islands", "Dadra & Nagar Haveli and Daman & Diu",
  "Lakshadweep",
].map((s) => ({ value: s, label: s }));

export const CURRENT_YEAR = new Date().getFullYear();
export const ADMISSION_YEARS = Array.from({ length: 8 }, (_, i) => {
  const y = CURRENT_YEAR - i;
  return { value: String(y), label: String(y) };
});
export const PASSING_YEARS = Array.from({ length: 8 }, (_, i) => {
  const y = CURRENT_YEAR + 4 - i;
  return { value: String(y), label: String(y) };
});
