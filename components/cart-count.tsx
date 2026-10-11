"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartCount() {
  const { totalCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative rounded-card border border-mahogany px-4 py-2 text-sm text-mahogany hover:bg-mahogany hover:text-ivory"
    >
      Cart
      {totalCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rust text-xs text-ivory">
          {totalCount}
        </span>
      )}
    </Link>
  );
}
