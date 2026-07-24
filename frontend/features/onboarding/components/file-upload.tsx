"use client";

import * as React from "react";
import { toast } from "sonner";
import { CheckCircle2, FileText, Loader2, Plus, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Uploader = (
  file: File,
  onProgress: (pct: number) => void
) => Promise<string>;

interface FileUploadProps {
  label: string;
  description?: string;
  accept?: string;
  value?: string;
  onChange: (url: string) => void;
  uploader: Uploader;
}

/** Single-file dropzone with progress. Uploads immediately on select. */
export function FileUpload({
  label,
  description,
  accept = "application/pdf,image/*",
  value,
  onChange,
  uploader,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [name, setName] = React.useState("");

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploader(file, setProgress);
      setName(file.name);
      onChange(url);
      toast.success(`${label} uploaded`);
    } catch (err) {
      toast.error(`Couldn't upload ${label.toLowerCase()}`, {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setUploading(false);
    }
  };

  const clear = () => {
    onChange("");
    setName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-heading">{label}</p>

      {value ? (
        <div className="flex items-center justify-between rounded-lg border border-success/30 bg-success/5 px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-sm text-heading">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="max-w-[220px] truncate">{name || "Uploaded"}</span>
          </span>
          <button
            type="button"
            onClick={clear}
            className="text-muted-foreground hover:text-error"
            aria-label={`Remove ${label}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg border border-dashed border-border bg-card px-3.5 py-3 text-left transition-colors hover:border-primary hover:bg-section disabled:opacity-70"
          )}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-heading">
              {uploading ? `Uploading… ${progress}%` : "Click to upload"}
            </span>
            <span className="block text-xs text-muted-foreground">
              {description ?? "PDF or image, up to 10 MB"}
            </span>
          </span>
        </button>
      )}

      {uploading && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gold-gradient transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

interface MultiFileUploadProps {
  label: string;
  description?: string;
  accept?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  uploader: Uploader;
  max?: number;
}

/** Multi-file uploader (e.g. semester marksheets, certificates). */
export function MultiFileUpload({
  label,
  description,
  accept = "application/pdf,image/*",
  value,
  onChange,
  uploader,
  max = 12,
}: MultiFileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (value.length + urls.length >= max) break;
        const url = await uploader(file, () => {});
        urls.push(url);
      }
      onChange([...value, ...urls]);
      toast.success(`${urls.length} file(s) uploaded`);
    } catch (err) {
      toast.error(`Couldn't upload ${label.toLowerCase()}`, {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-heading">{label}</p>

      {value.length > 0 && (
        <ul className="space-y-1.5">
          {value.map((url, i) => (
            <li
              key={url}
              className="flex items-center justify-between rounded-lg border border-border bg-section px-3 py-2 text-sm"
            >
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-heading hover:text-primary"
              >
                <FileText className="h-4 w-4 text-primary" /> Document {i + 1}
              </a>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="text-muted-foreground hover:text-error"
                aria-label={`Remove document ${i + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {value.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card px-3.5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-section disabled:opacity-70"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add file
        </button>
      )}

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
