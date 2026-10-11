import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import ProductGallery from "@/components/product-gallery";
import AddToCartPanel from "@/components/add-to-cart-panel";
import WhatsAppLink from "@/components/whatsapp-link";
import ProductCard, { type ProductCardData } from "@/components/product-card";
import { productWhatsAppMessage } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/site-url";

async function getProduct(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, discount_price, stock_qty, is_active, video_url, category_id, categories(name), product_images(image_url, sort_order)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .order("sort_order", { foreignTable: "product_images" })
    .single();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product not found" };

  const image = (product as any).product_images?.[0]?.image_url;
  const description =
    product.description?.slice(0, 155) ||
    `Buy ${product.name} online from DatesCrunch — premium quality, cash on delivery.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `${SITE_URL}/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const supabase = createClient();
  const settings = await getSettings();

  const images = (product as any).product_images
    ?.map((i: any) => i.image_url)
    ?? [];

  const { data: related } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, discount_price, stock_qty, is_featured, product_images(image_url, sort_order)"
    )
    .eq("category_id", product.category_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .order("sort_order", { foreignTable: "product_images" })
    .limit(4);

  const relatedCards: ProductCardData[] = (related ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    discount_price: p.discount_price,
    stock_qty: p.stock_qty,
    is_featured: p.is_featured,
    image: p.product_images?.[0]?.image_url ?? null,
  }));

  const effectivePrice = product.discount_price ?? product.price;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: images.length > 0 ? images : undefined,
    sku: product.slug,
    category: (product as any).categories?.name || undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "INR",
      price: effectivePrice,
      availability:
        product.stock_qty > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={images} productName={product.name} />

        <div>
          {(product as any).categories?.name && (
            <p className="text-xs uppercase text-stone">
              {(product as any).categories.name}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-semibold md:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-xl font-semibold text-mahogany">₹{effectivePrice}</span>
            {product.discount_price && (
              <span className="text-sm text-stone line-through">₹{product.price}</span>
            )}
          </div>

          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm text-stone">
              {product.description}
            </p>
          )}

          <div className="mt-6">
            <AddToCartPanel
              productId={product.id}
              name={product.name}
              slug={product.slug}
              price={effectivePrice}
              image={images[0] ?? null}
              stockQty={product.stock_qty}
            />
          </div>

          <div className="mt-4">
            <WhatsAppLink
              phoneNumber={settings.whatsapp_number ?? ""}
              message={productWhatsAppMessage({
                name: product.name,
                price: effectivePrice,
                quantity: 1,
              })}
            />
          </div>

          {product.video_url && (
            <div className="mt-8">
              <p className="mb-2 text-sm font-medium text-coffee">Product video</p>
              <video
                controls
                className="w-full rounded-card border border-sand"
                src={product.video_url}
              />
            </div>
          )}
        </div>
      </div>

      {relatedCards.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold">You may also like</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedCards.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
