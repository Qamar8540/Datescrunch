import Link from "next/link";
import { cloudinaryThumb } from "@/lib/cloudinary-url";
import { createClient } from "@/lib/supabase/server";
import ActiveToggle from "@/components/active-toggle";
import ConfirmDeleteButton from "@/components/confirm-delete-button";
import StatusBanner from "@/components/status-banner";
import { deleteProduct } from "@/lib/actions/products";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; success?: string; lowstock?: string };
}) {
  const supabase = createClient();
  const q = searchParams.q?.trim() ?? "";
  const categoryFilter = searchParams.category ?? "";

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  let query = supabase
    .from("products")
    .select(
      "id, name, price, discount_price, stock_qty, is_active, is_featured, categories(name), product_images(image_url, sort_order)"
    )
    .order("created_at", { ascending: false })
    .order("sort_order", { foreignTable: "product_images" });

  if (q) query = query.ilike("name", `%${q}%`);
  if (categoryFilter) query = query.eq("category_id", categoryFilter);
  if (searchParams.lowstock) query = query.eq("is_active", true).lte("stock_qty", 5);

  const { data: products, error } = await query;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-card bg-mahogany px-4 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark"
        >
          Add product
        </Link>
      </div>

      {searchParams.success && (
        <div className="mb-4">
          <StatusBanner type="success" message="Product saved successfully." />
        </div>
      )}

      <form method="GET" className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search products…"
          className="w-full max-w-xs rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        />
        <select
          name="category"
          defaultValue={categoryFilter}
          className="rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        >
          <option value="">All categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-card border border-sand px-4 py-2 text-sm text-coffee hover:border-mahogany"
        >
          Filter
        </button>
      </form>

      {error && <StatusBanner type="error" message="Could not load products." />}

      {products && products.length === 0 && (
        <div className="rounded-card border border-dashed border-sand bg-white/50 p-8 text-center text-sm text-stone">
          {q || categoryFilter ? (
            <p>No products match your search/filter.</p>
          ) : (
            <>
              <p>No products yet.</p>
              <Link href="/admin/products/new" className="mt-2 inline-block text-mahogany hover:underline">
                Add your first product
              </Link>
            </>
          )}
        </div>
      )}

      {products && products.length > 0 && (
        <div className="overflow-x-auto rounded-card border border-sand bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-sand text-stone">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => {
                const thumb = product.product_images?.[0]?.image_url;
                return (
                  <tr key={product.id} className="border-b border-sand last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-card bg-sand/50">
                          {thumb && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={cloudinaryThumb(thumb, 80)} alt="" loading="lazy" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-coffee">{product.name}</p>
                          {product.is_featured && (
                            <span className="text-xs text-toffee">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone">
                      {product.categories?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {product.discount_price ? (
                        <>
                          <span className="text-coffee">₹{product.discount_price}</span>{" "}
                          <span className="text-xs text-stone line-through">
                            ₹{product.price}
                          </span>
                        </>
                      ) : (
                        <span>₹{product.price}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone">{product.stock_qty}</td>
                    <td className="px-4 py-3">
                      <ActiveToggle productId={product.id} initialActive={product.is_active} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm text-mahogany hover:underline"
                        >
                          Edit
                        </Link>
                        <ConfirmDeleteButton
                          confirmMessage={`Delete "${product.name}"? This can't be undone.`}
                          action={deleteProduct.bind(null, product.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
