import Link from "next/link";
import CartCount from "@/components/cart-count";
import MobileNav from "@/components/mobile-nav";
import WhatsAppLink from "@/components/whatsapp-link";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";

export default async function SiteHeader() {
  const supabase = createClient();
  const [{ data: categories }, settings] = await Promise.all([
    supabase.from("categories").select("name, slug").order("name"),
    getSettings(),
  ]);

  const navLinks = [
    { href: "/products", label: "All Products" },
    ...(categories ?? []).map((c) => ({
      href: `/products?category=${c.slug}`,
      label: c.name,
    })),
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="relative border-b border-sand bg-ivory">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-xl font-semibold text-mahogany">
          DatesCrunch
        </Link>

        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-coffee/80 hover:text-mahogany"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {settings.whatsapp_number && (
            <div className="hidden md:block">
              <WhatsAppLink
                phoneNumber={settings.whatsapp_number}
                message="Hi, I'd like to know more about DatesCrunch products."
                label="WhatsApp"
                className="px-3 py-1.5"
              />
            </div>
          )}
          <CartCount />
          <MobileNav links={navLinks} whatsappNumber={settings.whatsapp_number ?? ""} />
        </div>
      </div>
    </header>
  );
}
