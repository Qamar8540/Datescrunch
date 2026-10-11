import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBanner from "@/components/status-banner";
import OrderStatusSelect from "@/components/order-status-select";
import { formatOrderNumber, parseOrderNoFromQuery } from "@/lib/order-number";

const PAGE_SIZE = 20;
const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    status?: string;
    from?: string;
    to?: string;
    page?: string;
  };
}) {
  const supabase = createClient();
  const q = searchParams.q?.trim() ?? "";
  const status = searchParams.status ?? "";
  const from = searchParams.from ?? "";
  const to = searchParams.to ?? "";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const rangeFrom = (page - 1) * PAGE_SIZE;
  const rangeTo = rangeFrom + PAGE_SIZE - 1;

  let query = supabase
    .from("orders")
    .select("id, order_no, customer_name, phone, total_amount, status, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (q) {
    const orderNo = parseOrderNoFromQuery(q);
    const conditions = [`customer_name.ilike.%${q}%`, `phone.ilike.%${q}%`];
    if (orderNo !== null) conditions.push(`order_no.eq.${orderNo}`);
    query = query.or(conditions.join(","));
  }
  if (status) query = query.eq("status", status);
  if (from) query = query.gte("created_at", `${from}T00:00:00`);
  if (to) query = query.lte("created_at", `${to}T23:59:59`);

  const { data: orders, count, error } = await query.range(rangeFrom, rangeTo);

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  function pageHref(target: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    params.set("page", String(target));
    return `/admin/orders?${params.toString()}`;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Orders</h1>

      <form method="GET" className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search order #, name or phone…"
          className="w-full max-w-xs rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-card border border-sand bg-white px-3 py-2 text-sm capitalize focus:border-mahogany focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="from"
          defaultValue={from}
          className="rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        />
        <input
          type="date"
          name="to"
          defaultValue={to}
          className="rounded-card border border-sand bg-white px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-card border border-sand px-4 py-2 text-sm text-coffee hover:border-mahogany"
        >
          Filter
        </button>
      </form>

      {error && <StatusBanner type="error" message="Could not load orders. Please try again." />}

      {orders && orders.length === 0 && (
        <div className="rounded-card border border-dashed border-sand bg-white/50 p-8 text-center text-sm text-stone">
          {q || status || from || to
            ? "No orders match your search/filters."
            : "No orders yet — they'll show up here as customers check out."}
        </div>
      )}

      {orders && orders.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-card border border-sand bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-sand text-stone">
                <tr>
                  <th className="px-4 py-3 font-medium">Order #</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-sand last:border-0">
                    <td className="px-4 py-3 font-medium text-coffee">
                      {formatOrderNumber(order.order_no, order.created_at)}
                    </td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3 text-stone">{order.phone}</td>
                    <td className="px-4 py-3">₹{order.total_amount}</td>
                    <td className="px-4 py-3 text-stone">
                      {new Date(order.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-stone">COD</td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm text-mahogany hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <Link
                href={pageHref(Math.max(1, page - 1))}
                aria-disabled={page <= 1}
                className={`rounded-card border border-sand px-3 py-1.5 ${
                  page <= 1 ? "pointer-events-none opacity-40" : "hover:border-mahogany"
                }`}
              >
                Previous
              </Link>
              <span className="text-stone">
                Page {page} of {totalPages}
              </span>
              <Link
                href={pageHref(Math.min(totalPages, page + 1))}
                aria-disabled={page >= totalPages}
                className={`rounded-card border border-sand px-3 py-1.5 ${
                  page >= totalPages ? "pointer-events-none opacity-40" : "hover:border-mahogany"
                }`}
              >
                Next
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
