import Link from "next/link";
import { cloudinaryThumb } from "@/lib/cloudinary-url";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import { formatOrderNumber } from "@/lib/order-number";
import OrderStatusSelect from "@/components/order-status-select";
import WhatsAppLink from "@/components/whatsapp-link";
import { adminOrderWhatsAppMessage } from "@/lib/whatsapp";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_no, customer_name, phone, address, city, pincode, notes, status, total_amount, created_at"
    )
    .eq("id", params.id)
    .single();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select(
      "id, product_id, product_name_snapshot, price_snapshot, quantity, products(product_images(image_url, sort_order))"
    )
    .eq("order_id", order.id);

  const settings = await getSettings();
  const orderNumber = formatOrderNumber(order.order_no, order.created_at);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-mahogany hover:underline">
        ← Back to Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{orderNumber}</h1>
        <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
      </div>

      <p className="mt-1 text-sm text-stone">
        Placed{" "}
        {new Date(order.created_at).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })}{" "}
        · Payment: Cash on Delivery
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-card border border-sand bg-white p-5">
          <h2 className="text-sm font-medium text-coffee">Customer</h2>
          <p className="mt-2 text-sm text-stone">
            {order.customer_name}
            <br />
            {order.phone}
          </p>

          <h2 className="mt-4 text-sm font-medium text-coffee">Delivery address</h2>
          <p className="mt-2 text-sm text-stone">
            {order.address}
            <br />
            {order.city} — {order.pincode}
          </p>

          {order.notes && (
            <>
              <h2 className="mt-4 text-sm font-medium text-coffee">Customer notes</h2>
              <p className="mt-2 text-sm text-stone">{order.notes}</p>
            </>
          )}
        </div>

        <div className="rounded-card border border-sand bg-white p-5">
          <h2 className="text-sm font-medium text-coffee">Contact customer</h2>
          <p className="mt-2 text-sm text-stone">
            Reach out directly about this order.
          </p>
          <div className="mt-3">
            <WhatsAppLink
              phoneNumber={settings.whatsapp_number ?? ""}
              message={adminOrderWhatsAppMessage({
                customerName: order.customer_name,
                orderNumber,
                status: order.status,
                total: order.total_amount,
              })}
              label="Contact Customer on WhatsApp"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-card border border-sand bg-white">
        <h2 className="border-b border-sand px-5 py-3 text-sm font-medium text-coffee">
          Items
        </h2>
        <div className="divide-y divide-sand">
          {(items ?? []).map((item: any) => {
            const image = item.products?.product_images?.[0]?.image_url;
            const subtotal = item.price_snapshot * item.quantity;
            return (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-card bg-sand/40">
                  {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cloudinaryThumb(image, 80)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-coffee">
                    {item.product_name_snapshot}
                  </p>
                  <p className="text-xs text-stone">
                    ₹{item.price_snapshot} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-coffee">₹{subtotal}</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between border-t border-sand px-5 py-4 text-base font-semibold">
          <span>Order total</span>
          <span>₹{order.total_amount}</span>
        </div>
      </div>
    </div>
  );
}
