import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import ProductCard, { type ProductCardData } from "@/components/product-card";
import WhatsAppLink from "@/components/whatsapp-link";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  description:
    "Shop premium dates, dry fruits and gift packs online. Fresh, hand-picked quality with cash on delivery.",
  alternates: { canonical: SITE_URL },
};

const WHY_CHOOSE_US = [
  {
    title: "Hand-picked quality",
    body: "Every batch is checked for freshness and size before it reaches you.",
  },
  {
    title: "Cash on delivery",
    body: "Pay when your order arrives — no online payment required.",
  },
  {
    title: "Gifting made easy",
    body: "Ready-made combo packs for festivals, weddings and corporate gifting.",
  },
  {
    title: "Order on WhatsApp",
    body: "Prefer to chat? Message us directly and we'll take your order.",
  },
];

export default async function HomePage() {
  const supabase = createClient();
  const settings = await getSettings();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  let { data: featured } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, discount_price, stock_qty, is_featured, product_images(image_url, sort_order)"
    )
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { foreignTable: "product_images" })
    .limit(8);

  // No products marked featured yet? Show the newest active products
  // instead — still real catalog data, never placeholder items.
  if (!featured || featured.length === 0) {
    const { data: latest } = await supabase
      .from("products")
      .select(
        "id, name, slug, price, discount_price, stock_qty, is_featured, product_images(image_url, sort_order)"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .order("sort_order", { foreignTable: "product_images" })
      .limit(8);
    featured = latest ?? [];
  }

  const featuredCards: ProductCardData[] = featured.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    discount_price: p.discount_price,
    stock_qty: p.stock_qty,
    is_featured: p.is_featured,
    image: p.product_images?.[0]?.image_url ?? null,
  }));

  return (
    <div>
      {/* Hero */}
      <section className="bg-sand/40">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-sm uppercase tracking-wide text-mahogany">
            {settings.store_name || "DatesCrunch"}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold md:text-5xl">
            Premium dates &amp; dry fruits, delivered fresh to your door.
          </h1>
          <p className="mt-4 max-w-xl text-stone">
            Hand-picked quality, honest prices, and cash on delivery — order
            online or straight from WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-card bg-mahogany px-6 py-3 text-sm font-medium text-ivory hover:bg-mahogany-dark"
            >
              Shop now
            </Link>
            <WhatsAppLink
              phoneNumber={settings.whatsapp_number ?? ""}
              message="Hi, I'd like to know more about DatesCrunch products."
              label="Chat on WhatsApp"
            />
          </div>
        </div>
      </section>

      {/* Brand intro */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold">Sourced with care, sold with trust</h2>
          <p className="mt-3 text-stone">
            {settings.store_description || (
              <>
                {settings.store_name || "DatesCrunch"} brings you a curated
                selection of premium dates and dry fruits, sourced for
                freshness and quality. Whether it&rsquo;s a daily snack or a festive
                gift, we pack every order with the same care.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-xl font-semibold">Shop by category</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="rounded-card border border-sand bg-white p-6 text-center transition-shadow hover:shadow-md"
              >
                <span className="font-display text-lg text-mahogany">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Best sellers</h2>
          <Link href="/products" className="text-sm text-mahogany hover:underline">
            View all
          </Link>
        </div>

        {featuredCards.length === 0 ? (
          <p className="mt-6 text-sm text-stone">
            Products are being added — check back soon.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredCards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why choose us */}
      <section className="bg-sand/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-semibold">Why choose us</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title}>
                <p className="font-medium text-mahogany">{item.title}</p>
                <p className="mt-1 text-sm text-stone">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">Prefer ordering on WhatsApp?</h2>
        <p className="mt-2 text-sm text-stone">
          Send us a message and we&rsquo;ll help you place your order directly.
        </p>
        <div className="mt-6 flex justify-center">
          <WhatsAppLink
            phoneNumber={settings.whatsapp_number ?? ""}
            message="Hi, I'd like to place an order with DatesCrunch."
          />
        </div>
      </section>

      {/* Customer reviews placeholder */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-xl font-semibold">What our customers say</h2>
        <div className="mt-6 rounded-card border border-dashed border-sand bg-white/50 p-10 text-center text-sm text-stone">
          Reviews are coming soon — be one of our first customers!
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-sand/40 py-16 text-center">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-xl font-semibold">Questions before you order?</h2>
          <p className="mt-2 text-sm text-stone">
            We&apos;re happy to help with bulk orders, gifting, or anything else.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-card border border-mahogany px-6 py-3 text-sm text-mahogany hover:bg-mahogany hover:text-ivory"
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
