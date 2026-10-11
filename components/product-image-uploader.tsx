"use client";

import { useRef, useState } from "react";
import { cloudinaryThumb } from "@/lib/cloudinary-url";

interface PendingImage {
  id: string; // local key
  url: string | null; // set once upload finishes
  previewUrl: string; // object URL for instant preview
  uploading: boolean;
  error: string | null;
}

export default function ProductImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [pending, setPending] = useState<PendingImage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const newPending: PendingImage[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      url: null,
      previewUrl: URL.createObjectURL(file),
      uploading: true,
      error: null,
    }));

    setPending((prev) => [...prev, ...newPending]);

    files.forEach(async (file, index) => {
      const item = newPending[index];
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("kind", "image");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Upload failed.");

        onChange([...images, data.url]);
        setPending((prev) => prev.filter((p) => p.id !== item.id));
      } catch (err) {
        setPending((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? { ...p, uploading: false, error: "Upload failed." }
              : p
          )
        );
      }
    });

    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img !== url));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url, index) => (
          <div
            key={url}
            className="relative h-24 w-24 overflow-hidden rounded-card border border-sand bg-sand/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cloudinaryThumb(url, 96)} alt="" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-coffee/70 px-1 py-0.5">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="text-xs text-ivory disabled:opacity-30"
                aria-label="Move image earlier"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="text-xs text-ivory hover:text-rust"
                aria-label="Remove image"
              >
                ✕
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === images.length - 1}
                className="text-xs text-ivory disabled:opacity-30"
                aria-label="Move image later"
              >
                →
              </button>
            </div>
          </div>
        ))}

        {pending.map((item) => (
          <div
            key={item.id}
            className="relative h-24 w-24 overflow-hidden rounded-card border border-sand bg-sand/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.previewUrl}
              alt=""
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-coffee/30">
              {item.uploading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" />
              ) : (
                <span className="px-1 text-center text-[10px] text-ivory">
                  {item.error}
                </span>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-24 flex-col items-center justify-center rounded-card border border-dashed border-sand text-xs text-stone hover:border-mahogany hover:text-mahogany"
        >
          <span className="text-xl leading-none">+</span>
          Add image
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="mt-2 text-xs text-stone">
        First image is the main product photo. Use the arrows to reorder.
      </p>
    </div>
  );
}
