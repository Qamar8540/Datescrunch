import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/product-form";
import { createProduct } from "@/lib/actions/products";

export default async function NewProductPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Add product</h1>
      <ProductForm categories={categories ?? []} onSave={createProduct} />
    </div>
  );
}
