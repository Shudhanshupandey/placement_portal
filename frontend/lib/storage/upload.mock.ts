import type { UploadedDoc } from "@/lib/storage/upload";

/**
 * Development document upload — the mock counterpart of `lib/storage/upload.ts`.
 *
 * Keeps the real size and MIME validation (a 12 MB file must still be rejected
 * in dev, or the error state never gets built) and drives `onProgress` through
 * a short ramp so progress bars are exercised rather than jumping to 100.
 *
 * Documents are returned as object URLs, not data URIs: a 10 MB PDF as base64
 * would blow the localStorage quota. The consequence is that document links
 * work for the lifetime of the tab and go stale after a reload — the trade-off
 * is deliberate and documented in `docs/21_DEVELOPMENT_MODE.md`.
 */

const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 MB — same ceiling as production
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const tick = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function uploadDocumentToStorage(
  uid: string,
  file: File,
  category: string,
  onProgress?: (pct: number) => void
): Promise<UploadedDoc> {
  if (file.size > MAX_DOC_BYTES) {
    throw new Error("File is too large. Maximum size is 10 MB.");
  }
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type. Upload a PDF or image.");
  }

  for (const pct of [12, 34, 58, 79, 93, 100]) {
    await tick(90);
    onProgress?.(pct);
  }

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  return {
    url: URL.createObjectURL(file),
    path: `students/${uid}/${category}/${Date.now()}_${safeName}`,
    name: file.name,
    size: file.size,
  };
}
