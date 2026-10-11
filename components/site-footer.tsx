import Link from "next/link";
import { getSettings } from "@/lib/settings";
import WhatsAppLink from "@/components/whatsapp-link";

const QUICK_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

const POLICY_LINKS = [
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/return-refund-policy", label: "Return & Refund" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
];

export default async function SiteFooter() {
  const settings = await getSettings();
  const storeName = settings.store_name || "DatesCrunch";

  return (
    <footer className="mt-16 border-t border-sand bg-sand/60">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-semibold text-mahogany">
              {storeName}
            </p>
            <p className="mt-2 max-w-xs text-sm text-stone">
              Premium dates, dry fruits and gift packs — sourced with care,
              delivered fresh.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-coffee">Quick links</p>
            <nav className="mt-2 flex flex-col gap-1.5 text-sm text-stone">
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-mahogany">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-medium text-coffee">Contact</p>
            <div className="mt-2 space-y-1.5 text-sm text-stone">
              {settings.store_phone && <p>{settings.store_phone}</p>}
              {settings.store_email && <p>{settings.store_email}</p>}
              {settings.store_address && <p>{settings.store_address}</p>}
              {settings.whatsapp_number && (
                <div className="pt-1">
                  <WhatsAppLink
                    phoneNumber={settings.whatsapp_number}
                    message={`Hi, I have a question about ${storeName}.`}
                    label="Chat on WhatsApp"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-coffee">Policies</p>
            <nav className="mt-2 flex flex-col gap-1.5 text-sm text-stone">
              {POLICY_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-mahogany">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <p className="mt-8 border-t border-sand pt-6 text-sm text-stone">
          &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
