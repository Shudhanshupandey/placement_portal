/**
 * Centralized, typed access to public environment variables.
 * Read env ONLY through this module — never `process.env` scattered in components.
 */
export const env = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
    functionsRegion:
      process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "asia-south1",
  },
  useEmulator: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true",
  allowedEmailDomain:
    process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN ?? "saitm.ac.in",
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "",
  },
} as const;
