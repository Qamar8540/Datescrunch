import CategoryForm from "@/components/category-form";
import { createCategory } from "@/lib/actions/categories";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Add category</h1>
      <CategoryForm onSave={createCategory} />
    </div>
  );
}
