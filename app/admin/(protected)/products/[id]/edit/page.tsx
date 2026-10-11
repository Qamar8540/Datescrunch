import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm, { type ProductFormValues } from "@/components/product-form";
import { updateProduct } from "@/lib/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, name, slug, description, category_id, price, discount_price, stock_qty, is_active, is_featured, video_url, product_images(image_url, sort_order)"
      )
      .eq("id", params.id)
      .order("sort_order", { foreignTable: "product_images" })
      .single(),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  if (!product) notFound();

  const initialValues: ProductFormValues = {
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    category_id: product.category_id ?? "",
    price: String(product.price),
    discount_price: product.discount_price ? String(product.discount_price) : "",
    stock_qty: String(product.stock_qty),
    is_active: product.is_active,
    is_featured: product.is_featured,
    video_url: product.video_url ?? "",
    images: (product.product_images ?? []).map((img: any) => img.image_url),
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit product</h1>
      <ProductForm
        categories={categories ?? []}
        initialValues={initialValues}
        onSave={updateProduct.bind(null, product.id)}
      />
    </div>
  );
}
