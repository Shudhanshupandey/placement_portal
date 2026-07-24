/**
 * Provision an ADMIN account (role=admin claim + users/{uid} + admins/{uid}).
 *
 * Usage (real project):
 *   set GOOGLE_APPLICATION_CREDENTIALS to a service-account key, then:
 *   ADMIN_EMAIL=admin@saitm.ac.in ADMIN_PASSWORD='StrongPass#123' \
 *   cd Backend/functions && node seed-admin.mjs
 *
 * Usage (emulator):
 *   set FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST and GCLOUD_PROJECT.
 *
 * Admins are intentionally provisioned out-of-band — there is no public admin signup.
 */
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;
const NAME = process.env.ADMIN_NAME || "Placement Cell Admin";

if (!EMAIL || !PASSWORD) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.");
  process.exit(1);
}

initializeApp({
  credential:
    process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST
      ? undefined
      : applicationDefault(),
  projectId: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || undefined,
});

const auth = getAuth();
const db = getFirestore();

async function main() {
  // Create or fetch the user.
  let user = await auth.getUserByEmail(EMAIL).catch(() => null);
  if (!user) {
    user = await auth.createUser({
      email: EMAIL,
      password: PASSWORD,
      displayName: NAME,
      emailVerified: true,
    });
    console.log(`Created admin user ${EMAIL}`);
  } else {
    await auth.updateUser(user.uid, { password: PASSWORD });
    console.log(`Updated existing user ${EMAIL}`);
  }

  await auth.setCustomUserClaims(user.uid, { role: "admin" });

  const batch = db.batch();
  batch.set(
    db.collection("users").doc(user.uid),
    {
      uid: user.uid,
      email: EMAIL,
      role: "admin",
      profileCompleted: true,
      verificationStatus: "verified",
      isActive: true,
      displayName: NAME,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  batch.set(
    db.collection("admins").doc(user.uid),
    {
      uid: user.uid,
      email: EMAIL,
      fullName: NAME,
      level: "super_admin",
      permissions: ["*"],
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  await batch.commit();

  console.log(`✅ Admin provisioned: ${EMAIL} (uid ${user.uid}). Sign in at /admin/login.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
