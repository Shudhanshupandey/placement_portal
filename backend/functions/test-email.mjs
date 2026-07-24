/**
 * Verify SMTP delivery end-to-end, without running the portal.
 *
 * Reads the same SMTP_* keys the functions use, from `backend/functions/.env`.
 *
 * Usage:
 *   cd backend/functions && node test-email.mjs you@gmail.com
 *
 * A "success" here means the mail server ACCEPTED the message — check the
 * inbox (and Spam) to confirm delivery.
 */
import { readFileSync } from "node:fs";
import nodemailer from "nodemailer";

// Minimal .env reader — the Firebase CLI injects these at runtime, but this
// script runs standalone.
function loadEnv(path = ".env") {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    console.error(`Could not read ${path} — run this from backend/functions/.`);
    process.exit(1);
  }
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const value = m[2].trim().replace(/^["'](.*)["']$/, "$1");
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
}

loadEnv();

const to = process.argv[2];
if (!to) {
  console.error("Usage: node test-email.mjs <recipient@example.com>");
  process.exit(1);
}

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_USER || "";
const pass = process.env.SMTP_PASS || "";

if (!user || !pass) {
  console.error(
    "SMTP_USER / SMTP_PASS are empty in backend/functions/.env.\n" +
      "Gmail: myaccount.google.com → Security → 2-Step Verification → App passwords.\n" +
      "Paste the 16-character app password (NOT your normal Gmail password)."
  );
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

console.log(`Connecting to ${host}:${port} as ${user} …`);

try {
  await transporter.verify();
  console.log("✓ SMTP credentials accepted.");
} catch (err) {
  console.error("✗ SMTP login failed:", err.message);
  if (/Username and Password not accepted|BadCredentials/i.test(err.message)) {
    console.error(
      "  → Gmail rejects normal passwords. Create an App Password and use that."
    );
  }
  process.exit(1);
}

const info = await transporter.sendMail({
  from: process.env.MAIL_FROM || `SAITM Placement Portal <${user}>`,
  to,
  subject: "SAITM Placement Portal — SMTP test",
  html: `<div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;background:#F8F7F4;padding:32px;border-radius:16px">
    <h1 style="color:#18305F;margin:0 0 4px;text-align:center">SAITM Placement Portal</h1>
    <div style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;padding:24px;margin-top:16px">
      <p style="color:#374151;margin:0">SMTP is configured correctly. Login OTP emails will now reach this inbox.</p>
    </div>
  </div>`,
});

console.log(`✓ Sent to ${to} (id ${info.messageId}). Check the inbox and Spam.`);
