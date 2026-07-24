import { adminDb } from "./admin";
import { isSmtpConfigured, sendMail } from "./mailer";

/**
 * Deliver an email.
 *
 * Primary path is direct SMTP (see `mailer.ts`) — it works locally under the
 * emulator and in production, and fails loudly so the caller can tell the user
 * the code never went out.
 *
 * Fallback (SMTP not configured) writes to the `mail` collection consumed by
 * the Firebase "Trigger Email from Firestore" extension. NOTE: that extension
 * does not run in the emulator, so without SMTP nothing is actually delivered
 * during local development.
 */
export async function queueEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  if (isSmtpConfigured) {
    await sendMail(to, subject, html);
    return;
  }

  await adminDb.collection("mail").add({
    to,
    message: { subject, html },
    createdAt: new Date(),
  });
}

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  await queueEmail(
    email,
    "Your SAITM Placement Portal verification code",
    otpEmailTemplate(otp)
  );
}

export async function sendRecruiterVerificationEmail(
  email: string,
  link: string
): Promise<void> {
  await queueEmail(
    email,
    "Verify your email — SAITM Placement Portal",
    actionEmailTemplate(
      "Verify your email",
      "Confirm your email address to continue your recruiter registration. After verification, the SAITM Placement Cell will review your account.",
      "Verify email",
      link
    )
  );
}

export async function sendRecruiterApprovedEmail(email: string): Promise<void> {
  await queueEmail(
    email,
    "Your recruiter account is approved — SAITM Placement Portal",
    actionEmailTemplate(
      "Account approved",
      "Your recruiter account has been approved by the SAITM Placement Cell. You can now sign in and start recruiting.",
      "Sign in",
      "https://example.com/recruiter/login"
    )
  );
}

function actionEmailTemplate(
  heading: string,
  body: string,
  cta: string,
  href: string
): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;background:#F8F7F4;padding:32px;border-radius:16px">
    <h1 style="color:#18305F;margin:0 0 4px;text-align:center">SAITM Placement Portal</h1>
    <div style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;padding:24px;margin-top:16px">
      <h2 style="color:#172554;margin:0 0 8px;font-size:18px">${heading}</h2>
      <p style="color:#374151;margin:0 0 20px">${body}</p>
      <a href="${href}" style="display:inline-block;background:#18305F;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">${cta}</a>
    </div>
    <p style="color:#9CA3AF;font-size:12px;text-align:center;margin-top:20px">
      © ${new Date().getFullYear()} St. Andrews Institute of Technology &amp; Management
    </p>
  </div>`;
}

function otpEmailTemplate(otp: string): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;background:#F8F7F4;padding:32px;border-radius:16px">
    <div style="text-align:center">
      <h1 style="color:#18305F;margin:0 0 4px">SAITM Placement Portal</h1>
      <p style="color:#6B7280;margin:0 0 24px">Email verification</p>
    </div>
    <div style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;padding:24px;text-align:center">
      <p style="color:#374151;margin:0 0 12px">Use this one-time code to sign in:</p>
      <div style="font-size:32px;letter-spacing:8px;font-weight:700;color:#18305F">${otp}</div>
      <p style="color:#6B7280;font-size:13px;margin:16px 0 0">
        This code expires in 10 minutes. If you didn't request it, ignore this email.
      </p>
    </div>
    <p style="color:#9CA3AF;font-size:12px;text-align:center;margin-top:20px">
      © ${new Date().getFullYear()} St. Andrews Institute of Technology &amp; Management
    </p>
  </div>`;
}
