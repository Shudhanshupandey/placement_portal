import { env } from "@/config/env";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/**
 * Unsigned Cloudinary upload — MEDIA ONLY (photos, logos, banners).
 * Requires an unsigned upload preset. Documents must NOT use this (use Firebase Storage).
 */
export async function uploadImageToCloudinary(
  file: File,
  folder = "saitm/students"
): Promise<CloudinaryUploadResult> {
  const { cloudName, uploadPreset } = env.cloudinary;
  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded here.");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);
  form.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    throw new Error("Image upload failed. Please try again.");
  }
  const data = (await res.json()) as { secure_url: string; public_id: string };
  return { url: data.secure_url, publicId: data.public_id };
}
