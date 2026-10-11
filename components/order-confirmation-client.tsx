"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WhatsAppLink from "@/components/whatsapp-link";
import { orderWhatsAppMessage } from "@/lib/whatsapp";

interface OrderSummary {
  orderNumber: string;
  customerName: string;
  address: string;
  city: string;
  pincode: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

export default function OrderConfirmationClient({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("dc_last_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      // ignore
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Thank you for your order!</h1>
        <p className="mt-2 text-sm text-stone">
          We&apos;ve received your order and will contact you shortly to confirm
          delivery. If you have any questions, reach out on WhatsApp.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/products"
            className="rounded-card border border-mahogany px-5 py-2 text-sm text-mahogany hover:bg-mahogany hover:text-ivory"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-olive">Order placed successfully!</h1>
        <p className="mt-1 text-sm text-stone">
          Order number: <span className="font-medium text-coffee">{order.orderNumber}</span>
        </p>
      </div>

      <div className="mt-8 rounded-card border border-sand bg-white p-6">
        <h2 className="text-sm font-medium text-coffee">Delivery to</h2>
        <p className="mt-1 text-sm text-stone">
          {order.customerName}
          <br />
          {order.address}, {order.city} — {order.pincode}
        </p>

        <h2 className="mt-6 text-sm font-medium text-coffee">Items</h2>
        <div className="mt-2 space-y-1">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-stone">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-sand pt-4 text-base font-semibold">
          <span>Total (Cash on Delivery)</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <WhatsAppLink
          phoneNumber={phoneNumber}
          message={orderWhatsAppMessage({ orderNumber: order.orderNumber })}
          label="Contact us about this order"
        />
        <Link
          href="/products"
          className="rounded-card border border-mahogany px-5 py-2 text-sm text-mahogany hover:bg-mahogany hover:text-ivory"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
