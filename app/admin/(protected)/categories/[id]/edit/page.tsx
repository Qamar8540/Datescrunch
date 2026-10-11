import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CategoryForm from "@/components/category-form";
import { updateCategory } from "@/lib/actions/categories";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", params.id)
    .single();

  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit category</h1>
      <CategoryForm
        initialName={category.name}
        onSave={updateCategory.bind(null, category.id)}
      />
    </div>
  );
}
