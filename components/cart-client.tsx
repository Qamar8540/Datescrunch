"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { cloudinaryThumb } from "@/lib/cloudinary-url";
import WhatsAppLink from "@/components/whatsapp-link";
import { cartWhatsAppMessage } from "@/lib/whatsapp";

export default function CartClient({ phoneNumber }: { phoneNumber: string }) {
  const { items, removeItem, setQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-stone">
          Browse our products and add something delicious.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-card bg-mahogany px-5 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark"
        >
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Your Cart</h1>

      <div className="mt-6 divide-y divide-sand rounded-card border border-sand bg-white">
        {items.map((item) => (
          <div key={item.productId} className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-card bg-sand/40">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cloudinaryThumb(item.image, 128)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-[140px] flex-1">
              <Link href={`/products/${item.slug}`} className="text-sm font-medium text-coffee hover:text-mahogany">
                {item.name}
              </Link>
              <p className="text-sm text-stone">₹{item.price}</p>
            </div>

            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
              <div className="flex items-center rounded-card border border-sand">
                <button
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  className="px-2 py-1 text-coffee hover:text-mahogany"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stockQty}
                  className="px-2 py-1 text-coffee hover:text-mahogany disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

                <p className="w-16 text-right text-sm font-medium text-coffee">
                ₹{item.price * item.quantity}
              </p>

              <button
                onClick={() => removeItem(item.productId)}
                className="text-xs text-rust hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-end gap-4">
        <p className="text-lg font-semibold">Subtotal: ₹{subtotal}</p>
        <div className="flex flex-wrap justify-end gap-3">
          <WhatsAppLink
            phoneNumber={phoneNumber}
            message={cartWhatsAppMessage({ items, total: subtotal })}
            label="Order via WhatsApp"
          />
          <Link
            href="/checkout"
            className="rounded-card bg-mahogany px-6 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
