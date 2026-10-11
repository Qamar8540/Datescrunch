import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const LOW_STOCK_THRESHOLD = 5;

async function countRows(
  supabase: ReturnType<typeof createClient>,
  table: "orders" | "products",
  filters: (q: any) => any
) {
  const { count } = await filters(
    supabase.from(table).select("id", { count: "exact", head: true })
  );
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    totalOrders,
    pending,
    confirmed,
    shipped,
    delivered,
    cancelled,
    lowStock,
  ] = await Promise.all([
    countRows(supabase, "orders", (q) => q),
    countRows(supabase, "orders", (q) => q.eq("status", "pending")),
    countRows(supabase, "orders", (q) => q.eq("status", "confirmed")),
    countRows(supabase, "orders", (q) => q.eq("status", "shipped")),
    countRows(supabase, "orders", (q) => q.eq("status", "delivered")),
    countRows(supabase, "orders", (q) => q.eq("status", "cancelled")),
    countRows(supabase, "products", (q) =>
      q.eq("is_active", true).lte("stock_qty", LOW_STOCK_THRESHOLD)
    ),
  ]);

  const orderStats = [
    { label: "Total orders", value: totalOrders, href: "/admin/orders" },
    { label: "Pending", value: pending, href: "/admin/orders?status=pending" },
    { label: "Confirmed", value: confirmed, href: "/admin/orders?status=confirmed" },
    { label: "Shipped", value: shipped, href: "/admin/orders?status=shipped" },
    { label: "Delivered", value: delivered, href: "/admin/orders?status=delivered" },
    { label: "Cancelled", value: cancelled, href: "/admin/orders?status=cancelled" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {orderStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-card border border-sand bg-white p-4 hover:border-mahogany"
          >
            <p className="text-2xl font-semibold text-coffee">{stat.value}</p>
            <p className="mt-1 text-xs text-stone">{stat.label}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/products?lowstock=1"
        className="mt-6 flex items-center justify-between rounded-card border border-sand bg-white p-4 hover:border-mahogany"
      >
        <div>
          <p className="text-sm font-medium text-coffee">Low stock products</p>
          <p className="text-xs text-stone">
            {LOW_STOCK_THRESHOLD} units or fewer remaining
          </p>
        </div>
        <p className="text-2xl font-semibold text-rust">{lowStock}</p>
      </Link>
    </div>
  );
}
