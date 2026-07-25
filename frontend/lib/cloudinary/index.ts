import { IS_DEV_MODE } from "@/lib/dev-mode/flag";
import { uploadImageToCloudinary as realUpload } from "@/lib/cloudinary/upload";
import { uploadImageToCloudinary as mockUpload } from "@/lib/cloudinary/upload.mock";

export type { CloudinaryUploadResult } from "@/lib/cloudinary/upload";

/** Implementation selector — see `features/auth/services/index.ts` for the rationale. */
export const uploadImageToCloudinary = IS_DEV_MODE ? mockUpload : realUpload;
