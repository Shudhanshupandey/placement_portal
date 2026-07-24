import nodemailer, { type Transporter } from "nodemailer";
import { logger } from "firebase-functions/v2";

/**
 * SMTP transport for transactional mail (OTP codes, verification links).
 *
 * Defaults target Gmail SMTP: set `SMTP_USER` to the sending Gmail address and
 * `SMTP_PASS` to a Google **App Password** (Google account → Security →
 * 2-Step Verification → App passwords). A normal account password will NOT
 * work; Google rejects it with "Username and Password not accepted".
 *
 * When SMTP is not configured, callers fall back to the Firestore `mail`
 * queue (see `email.ts`) so local work never hard-fails on missing secrets.
 */

const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465);
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";

/** Gmail rewrites a mismatched From, so default it to the authenticated user. */
const MAIL_FROM =
  process.env.MAIL_FROM ?? `SAITM Placement Portal <${SMTP_USER}>`;

/** True once both credentials are present — the switch between SMTP and queue. */
export const isSmtpConfigured = Boolean(SMTP_USER && SMTP_PASS);

// Reused across warm invocations so we don't reopen a TLS session per email.
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      // 465 = implicit TLS; 587 = STARTTLS upgrade.
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

/**
 * Deliver one email over SMTP. Throws on failure so the caller can surface a
 * "couldn't send" error instead of silently pretending the code was sent.
 */
export async function sendMail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const info = await getTransporter().sendMail({
    from: MAIL_FROM,
    to,
    subject,
    html,
  });
  logger.info(`[mail] sent to ${to} (${info.messageId})`);
}

/** Verify credentials/connectivity without sending — used by diagnostics. */
export async function verifySmtp(): Promise<void> {
  await getTransporter().verify();
}
