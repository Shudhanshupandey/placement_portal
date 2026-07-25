"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Camera, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface PhotoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

/** Circular profile photo uploader → Cloudinary (media). */
export function PhotoUpload({ value, onChange, folder }: PhotoUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5 MB");
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadImageToCloudinary(file, folder);
      onChange(url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          "group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-border bg-section transition-colors hover:border-primary"
        )}
        aria-label="Upload profile photo"
      >
        {value ? (
          <Image src={value} alt="Profile" fill className="object-cover" sizes="96px" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
            <User className="h-9 w-9" />
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-primary/85 py-1 text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </span>
      </button>

      <div className="space-y-1">
        <p className="text-sm font-medium text-heading">Profile Photo</p>
        <p className="text-xs text-muted-foreground">
          JPG, PNG or WEBP · up to 5 MB. Stored securely on Cloudinary.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
        >
          {value ? "Change photo" : "Upload photo"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
