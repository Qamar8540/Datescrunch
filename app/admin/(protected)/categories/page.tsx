import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/confirm-delete-button";
import StatusBanner from "@/components/status-banner";
import { deleteCategory } from "@/lib/actions/categories";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { q?: string; success?: string };
}) {
  const supabase = createClient();
  const q = searchParams.q?.trim() ?? "";

  let query = supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  const { data: categories, error } = await query;

  const productCounts = new Map<string, number>();
  if (categories && categories.length > 0) {
    await Promise.all(
      categories.map(async (category) => {
        const { count } = await supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("category_id", category.id);
        productCounts.set(category.id, count ?? 0);
      })
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-card bg-mahogany px-4 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark"
        >
          Add category
        </Link>
      </div>

      {searchParams.success && (
        <div className="mb-4">
          <StatusBanner type="success" message="Category saved successfully." />
        </div>
      )}

      <form method="GET" className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search categories…"
          className="w-full max-w-xs rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        />
      </form>

      {error && (
        <StatusBanner type="error" message="Could not load categories." />
      )}

      {categories && categories.length === 0 && (
        <div className="rounded-card border border-dashed border-sand bg-white/50 p-8 text-center text-sm text-stone">
          {q ? (
            <p>No categories match &ldquo;{q}&rdquo;.</p>
          ) : (
            <>
              <p>No categories yet.</p>
              <Link href="/admin/categories/new" className="mt-2 inline-block text-mahogany hover:underline">
                Add your first category
              </Link>
            </>
          )}
        </div>
      )}

      {categories && categories.length > 0 && (
        <div className="overflow-x-auto rounded-card border border-sand bg-white">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-sand text-stone">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-sand last:border-0">
                  <td className="px-4 py-3">{category.name}</td>
                  <td className="px-4 py-3 text-stone">{category.slug}</td>
                  <td className="px-4 py-3 text-stone">
                    {productCounts.get(category.id) ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="text-sm text-mahogany hover:underline"
                      >
                        Edit
                      </Link>
                      <ConfirmDeleteButton
                        confirmMessage={`Delete "${category.name}"? This can't be undone.`}
                        action={deleteCategory.bind(null, category.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
