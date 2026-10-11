"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function AddToCartPanel({
  productId,
  name,
  slug,
  price,
  image,
  stockQty,
}: {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  stockQty: number;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = stockQty <= 0;

  function handleAdd() {
    addItem({ productId, name, slug, price, image, stockQty }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem({ productId, name, slug, price, image, stockQty }, quantity);
    router.push("/cart");
  }

  if (outOfStock) {
    return (
      <p className="rounded-card bg-rust/10 px-3 py-2 text-sm text-rust">
        This product is currently out of stock.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-card border border-sand">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-coffee hover:text-mahogany"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[2rem] text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(stockQty, q + 1))}
            className="px-3 py-2 text-coffee hover:text-mahogany"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span className="text-xs text-stone">{stockQty} available</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handleAdd}
          className="rounded-card border border-mahogany px-5 py-2 text-sm font-medium text-mahogany hover:bg-mahogany hover:text-ivory"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
        <button
          onClick={handleBuyNow}
          className="rounded-card bg-mahogany px-5 py-2 text-sm font-medium text-ivory hover:bg-mahogany-dark"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
