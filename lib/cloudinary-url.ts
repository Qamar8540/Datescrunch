// Cloudinary lets you request a resized/optimized version of an already
// uploaded image by inserting a transformation segment into its URL — no
// re-upload needed. This keeps thumbnails (grid, cart, gallery strip)
// from shipping full-resolution images over mobile connections.
export function cloudinaryTransform(url: string, transform: string): string {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}

export function cloudinaryThumb(url: string, size = 400): string {
  return cloudinaryTransform(url, `w_${size},h_${size},c_fill,q_auto,f_auto`);
}

// For a larger, but still capped, primary image (product gallery hero).
export function cloudinaryLarge(url: string, size = 900): string {
  return cloudinaryTransform(url, `w_${size},c_limit,q_auto,f_auto`);
}
