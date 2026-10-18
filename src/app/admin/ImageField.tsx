"use client";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ImageCropper } from "./ImageCropper";

// Vercel rejects request bodies over ~4.5MB, so anything bigger is
// re-encoded (longest edge 2560px) before it's uploaded.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

async function downscale(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("Couldn't read this image"));
      i.src = url;
    });
    const scale = Math.min(1, 2560 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, 0.88));
    if (!blob) throw new Error("Couldn't compress this image");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function uploadImage(blob: Blob, name = "image"): Promise<string> {
  const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : blob.type === "image/gif" ? "gif" : "jpg";
  const fd = new FormData();
  fd.append("file", new File([blob], `${name}.${ext}`, { type: blob.type || "image/jpeg" }));
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${sessionStorage.getItem("admin_password") || ""}` },
    body: fd,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(json.error || (res.status === 413 ? "Image too large" : `Upload failed (${res.status})`));
  }
  return json.url as string;
}

export function ImageField({
  label,
  value,
  onChange,
  aspect = null,
  compact = false,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: number | null;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ src: string; file?: File } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function closeCropper() {
    if (pending?.file) URL.revokeObjectURL(pending.src);
    setPending(null);
  }

  async function run(task: () => Promise<Blob>) {
    setBusy(true);
    setError("");
    try {
      const url = await uploadImage(await task());
      onChange(url);
      closeCropper();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      closeCropper();
    } finally {
      setBusy(false);
    }
  }

  function pickFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image.");
      return;
    }
    // GIF/SVG can't go through a canvas without losing animation/vectors.
    if (file.type === "image/gif" || file.type === "image/svg+xml") {
      run(async () => file);
      return;
    }
    setPending({ src: URL.createObjectURL(file), file });
  }

  const thumb = compact ? "h-20 w-28" : "h-40 w-full max-w-sm";

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-ink mb-2">{label}</label>}
      <div
        className={`flex ${compact ? "items-center" : "flex-col sm:flex-row sm:items-end"} gap-3`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pickFile(e.dataTransfer.files[0]);
        }}
      >
        <div className={`${thumb} rounded-lg border border-line bg-paper-lo overflow-hidden flex items-center justify-center shrink-0`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-ink-50">No image</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="px-3 py-2 text-sm rounded-lg bg-ink text-paper font-semibold disabled:opacity-50"
          >
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => setPending({ src: value })}
              disabled={busy}
              className="px-3 py-2 text-sm rounded-lg border border-line font-semibold hover:bg-paper-lo disabled:opacity-50"
            >
              Crop
            </button>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={busy}
              className="px-3 py-2 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            pickFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      {pending && createPortal(
        <ImageCropper
          src={pending.src}
          mime={pending.file?.type}
          defaultAspect={aspect}
          onCancel={closeCropper}
          allowOriginal={!!pending.file}
          onUseOriginal={() => {
            const f = pending.file!;
            run(async () => (f.size > MAX_UPLOAD_BYTES ? downscale(f) : f));
          }}
          onDone={(blob) => run(async () => blob)}
        />,
        document.body,
      )}
    </div>
  );
}
