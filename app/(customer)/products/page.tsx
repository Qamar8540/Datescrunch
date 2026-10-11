import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductCard, { type ProductCardData } from "@/components/product-card";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse premium dates, dry fruits and gift packs from DatesCrunch. Fresh stock, fair prices, cash on delivery.",
  alternates: { canonical: `${SITE_URL}/products` },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const supabase = createClient();
  const q = searchParams.q?.trim() ?? "";
  const categorySlug = searchParams.category ?? "";

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  const activeCategory = categories?.find((c) => c.slug === categorySlug);

  let query = supabase
    .from("products")
    .select(
      "id, name, slug, price, discount_price, stock_qty, is_featured, product_images(image_url, sort_order)"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .order("sort_order", { foreignTable: "product_images" });

  if (q) query = query.ilike("name", `%${q}%`);
  if (activeCategory) query = query.eq("category_id", activeCategory.id);

  const { data: products } = await query;

  const cards: ProductCardData[] = (products ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    discount_price: p.discount_price,
    stock_qty: p.stock_qty,
    is_featured: p.is_featured,
    image: p.product_images?.[0]?.image_url ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold md:text-3xl">
        {activeCategory ? activeCategory.name : "All Products"}
      </h1>

      <form method="GET" className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search products…"
          className="w-full max-w-xs rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        />
        <select
          name="category"
          defaultValue={categorySlug}
          className="rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        >
          <option value="">All categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-card border border-mahogany px-4 py-2 text-sm text-mahogany hover:bg-mahogany hover:text-ivory"
        >
          Filter
        </button>
      </form>

      {cards.length === 0 ? (
        <div className="mt-10 rounded-card border border-dashed border-sand bg-white/50 p-10 text-center text-sm text-stone">
          {q || activeCategory
            ? "No products match your search/filter."
            : "No products available right now — please check back soon."}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
