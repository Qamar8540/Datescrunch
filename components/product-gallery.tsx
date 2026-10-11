"use client";

import { useState } from "react";
import { cloudinaryThumb, cloudinaryLarge } from "@/lib/cloudinary-url";

export default function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-card bg-sand/40 text-sm text-stone">
        No image available
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-card bg-sand/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cloudinaryLarge(images[active], 900)}
          alt={productName}
          loading="eager"
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={img}
              onClick={() => setActive(index)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-card border ${
                index === active ? "border-mahogany" : "border-sand"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cloudinaryThumb(img, 128)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
