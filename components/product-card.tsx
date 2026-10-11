"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { cloudinaryThumb } from "@/lib/cloudinary-url";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  stock_qty: number;
  is_featured: boolean;
  image: string | null;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const effectivePrice = product.discount_price ?? product.price;
  const outOfStock = product.stock_qty <= 0;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: effectivePrice,
      image: product.image,
      stockQty: product.stock_qty,
    });
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-sand bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-sand/40">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cloudinaryThumb(product.image, 400)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-stone">
            No image
          </div>
        )}
        {product.is_featured && (
          <span className="absolute left-2 top-2 rounded-full bg-toffee px-2 py-0.5 text-xs font-medium text-coffee">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-medium text-coffee">{product.name}</h3>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-medium text-mahogany">₹{effectivePrice}</span>
          {product.discount_price && (
            <span className="text-xs text-stone line-through">₹{product.price}</span>
          )}
        </div>

        <p className={`mt-1 text-xs ${outOfStock ? "text-rust" : "text-olive"}`}>
          {outOfStock
            ? "Out of stock"
            : product.stock_qty <= 5
            ? `Only ${product.stock_qty} left`
            : "In stock"}
        </p>

        <button
          onClick={handleQuickAdd}
          disabled={outOfStock}
          className="mt-3 rounded-card border border-mahogany py-1.5 text-xs font-medium text-mahogany hover:bg-mahogany hover:text-ivory disabled:cursor-not-allowed disabled:border-sand disabled:text-stone disabled:hover:bg-transparent"
        >
          {outOfStock ? "Unavailable" : "Add to cart"}
        </button>
      </div>
    </Link>
  );
}
