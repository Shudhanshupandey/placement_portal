import { IS_DEV_MODE } from "@/lib/dev-mode/flag";
import { uploadDocumentToStorage as realUpload } from "@/lib/storage/upload";
import { uploadDocumentToStorage as mockUpload } from "@/lib/storage/upload.mock";

export type { UploadedDoc } from "@/lib/storage/upload";

/** Implementation selector — see `features/auth/services/index.ts` for the rationale. */
export const uploadDocumentToStorage = IS_DEV_MODE ? mockUpload : realUpload;
