"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export interface ActionResult {
  error?: string;
}

export async function createCategory(name: string): Promise<ActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Category name is required." };

  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .insert({ name: trimmed, slug: slugify(trimmed) });

  if (error) {
    if (error.code === "23505") {
      return { error: "A category with a similar name already exists." };
    }
    return { error: "Could not create category. Please try again." };
  }

  return {};
}

export async function updateCategory(
  id: string,
  name: string
): Promise<ActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Category name is required." };

  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name: trimmed, slug: slugify(trimmed) })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "A category with a similar name already exists." };
    }
    return { error: "Could not update category. Please try again." };
  }

  return {};
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = createClient();

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) {
    return { error: "Could not check category usage. Please try again." };
  }

  if (count && count > 0) {
    return {
      error: `Cannot delete — ${count} product${
        count === 1 ? " is" : "s are"
      } using this category. Move or delete ${
        count === 1 ? "it" : "them"
      } first.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    return { error: "Could not delete category. Please try again." };
  }

  return {};
}
