"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { ActionResult } from "@/lib/actions/categories";

export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  category_id: string;
  price: string; // form values arrive as strings; parsed + validated here
  discount_price: string;
  stock_qty: string;
  is_active: boolean;
  is_featured: boolean;
  video_url: string;
  images: string[]; // Cloudinary secure URLs, in display order
}

function validate(input: ProductInput): string | null {
  if (!input.name.trim()) return "Product name is required.";
  if (!input.category_id) return "Please select a category.";

  const price = Number(input.price);
  if (!input.price || Number.isNaN(price) || price <= 0) {
    return "Price must be a number greater than 0.";
  }

  if (input.discount_price) {
    const discount = Number(input.discount_price);
    if (Number.isNaN(discount) || discount < 0) {
      return "Discount price must be a valid number.";
    }
    if (discount >= price) {
      return "Discount price must be less than the regular price.";
    }
  }

  const stock = Number(input.stock_qty);
  if (input.stock_qty === "" || Number.isNaN(stock) || stock < 0) {
    return "Stock quantity must be a number of 0 or more.";
  }

  return null;
}

export async function createProduct(
  input: ProductInput
): Promise<ActionResult> {
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const supabase = createClient();

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: input.name.trim(),
      slug: slugify(input.slug || input.name),
      description: input.description.trim() || null,
      category_id: input.category_id,
      price: Number(input.price),
      discount_price: input.discount_price ? Number(input.discount_price) : null,
      stock_qty: Number(input.stock_qty),
      is_active: input.is_active,
      is_featured: input.is_featured,
      video_url: input.video_url.trim() || null,
    })
    .select("id")
    .single();

  if (error || !product) {
    if (error?.code === "23505") {
      return { error: "This slug is already used by another product." };
    }
    return { error: "Could not create product. Please try again." };
  }

  if (input.images.length > 0) {
    const rows = input.images.map((image_url, index) => ({
      product_id: product.id,
      image_url,
      sort_order: index,
    }));
    const { error: imagesError } = await supabase
      .from("product_images")
      .insert(rows);
    if (imagesError) {
      return {
        error:
          "Product was created, but saving its images failed. Edit the product to try adding images again.",
      };
    }
  }

  return {};
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<ActionResult> {
  const validationError = validate(input);
  if (validationError) return { error: validationError };

  const supabase = createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: input.name.trim(),
      slug: slugify(input.slug || input.name),
      description: input.description.trim() || null,
      category_id: input.category_id,
      price: Number(input.price),
      discount_price: input.discount_price ? Number(input.discount_price) : null,
      stock_qty: Number(input.stock_qty),
      is_active: input.is_active,
      is_featured: input.is_featured,
      video_url: input.video_url.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "This slug is already used by another product." };
    }
    return { error: "Could not update product. Please try again." };
  }

  // Simplest correct approach: replace the whole image set every save,
  // in the order the admin currently has them in.
  const { error: deleteImagesError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", id);

  if (deleteImagesError) {
    return {
      error:
        "Product details were saved, but images could not be updated. Please try again.",
    };
  }

  if (input.images.length > 0) {
    const rows = input.images.map((image_url, index) => ({
      product_id: id,
      image_url,
      sort_order: index,
    }));
    const { error: imagesError } = await supabase
      .from("product_images")
      .insert(rows);
    if (imagesError) {
      return {
        error:
          "Product details were saved, but images could not be updated. Please try again.",
      };
    }
  }

  return {};
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    return { error: "Could not delete product. Please try again." };
  }
  return {};
}

export async function toggleProductActive(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: "Could not update product status." };
  }
  return {};
}
