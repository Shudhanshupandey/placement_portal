import type { CloudinaryUploadResult } from "@/lib/cloudinary/upload";

/**
 * Development image upload — the mock counterpart of `lib/cloudinary/upload.ts`.
 *
 * Returns a data URI rather than a Cloudinary URL, so the picked image renders
 * immediately, survives a page reload (it is persisted with the profile) and
 * needs no Cloudinary account. The same type checks the real uploader performs
 * are kept, because rejecting a non-image is behaviour worth testing.
 *
 * Images only — documents go to Firebase Storage. The locked storage split
 * holds in dev mode exactly as it does in production.
 */

/** Above this, a base64 payload would threaten the localStorage quota. */
const MAX_INLINE_BYTES = 1.5 * 1024 * 1024;

function toDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageToCloudinary(
  file: File,
  folder = "saitm/students"
): Promise<CloudinaryUploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded here.");
  }

  // Large images fall back to an object URL: it costs nothing to create but is
  // revoked when the tab closes, so it must not be the default path.
  const url =
    file.size <= MAX_INLINE_BYTES ? await toDataUri(file) : URL.createObjectURL(file);

  return { url, publicId: `${folder}/dev-${Date.now()}` };
}
