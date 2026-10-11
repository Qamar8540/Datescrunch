import { v2 as cloudinary } from "cloudinary";

// Server-side Cloudinary config, used by the admin upload API route
// (Products phase) to store product images/videos and return a URL that
// gets saved in the `product_images` table / `products.video_url` column.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
