"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { placeOrder } from "@/lib/actions/orders";
import StatusBanner from "@/components/status-banner";

export default function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-stone">Add products to your cart before checking out.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-card bg-mahogany px-5 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark"
        >
          Shop products
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const result = await placeOrder({
      ...form,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });

    setSaving(false);

    if (result.error || !result.orderNumber) {
      setError(result.error || "Could not place order. Please try again.");
      return;
    }

    try {
      window.sessionStorage.setItem(
        "dc_last_order",
        JSON.stringify({
          orderNumber: result.orderNumber,
          customerName: form.customerName,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
          items: items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
          total: subtotal,
        })
      );
    } catch {
      // sessionStorage unavailable — confirmation page will show a generic message
    }

    clearCart();
    router.push("/order-confirmation");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-sand bg-white p-6">
          <div>
            <label className="block text-sm font-medium">Full name</label>
            <input
              required
              value={form.customerName}
              onChange={(e) => update("customerName", e.target.value)}
              className="mt-1 w-full rounded-card border border-sand px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone number</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="mt-1 w-full rounded-card border border-sand px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Full address</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="mt-1 w-full rounded-card border border-sand px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="mt-1 w-full rounded-card border border-sand px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Pincode</label>
              <input
                required
                value={form.pincode}
                onChange={(e) => update("pincode", e.target.value)}
                className="mt-1 w-full rounded-card border border-sand px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Notes (optional)</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="mt-1 w-full rounded-card border border-sand px-3 py-2 text-sm focus:border-mahogany focus:outline-none"
            />
          </div>

          {error && <StatusBanner type="error" message={error} />}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-card bg-mahogany py-2.5 text-sm font-medium text-ivory hover:bg-mahogany-dark disabled:opacity-60"
          >
            {saving ? "Placing order…" : "Place Order (Cash on Delivery)"}
          </button>
        </form>

        <div className="h-fit rounded-card border border-sand bg-white p-6">
          <h2 className="text-sm font-medium text-coffee">Order summary</h2>
          <div className="mt-3 space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-stone">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-sand pt-4 text-base font-semibold">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
          <p className="mt-3 text-xs text-stone">Payment: Cash on Delivery</p>
        </div>
      </div>
    </div>
  );
}
