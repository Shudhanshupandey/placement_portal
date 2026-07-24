import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/firebase/client";

const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export interface UploadedDoc {
  url: string;
  path: string;
  name: string;
  size: number;
}

/**
 * Upload a DOCUMENT to Firebase Storage — resumes, marksheets, certificates.
 * Photos go to Cloudinary instead (see lib/cloudinary/upload).
 */
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

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `students/${uid}/${category}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise<UploadedDoc>((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, path, name: file.name, size: file.size });
      }
    );
  });
}
