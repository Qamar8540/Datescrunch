import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import WhatsAppLink from "@/components/whatsapp-link";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with DatesCrunch for orders, bulk enquiries, or support.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Contact Us</h1>
      <p className="mt-3 text-stone">
        Have a question about an order, bulk pricing, or gifting? Reach out
        — we&rsquo;re happy to help.
      </p>

      <div className="mt-8 space-y-4 rounded-card border border-sand bg-white p-6">
        {settings.store_phone && (
          <div>
            <p className="text-sm font-medium text-coffee">Phone</p>
            <a
              href={`tel:${settings.store_phone}`}
              className="text-sm text-mahogany hover:underline"
            >
              {settings.store_phone}
            </a>
          </div>
        )}
        {settings.store_email && (
          <div>
            <p className="text-sm font-medium text-coffee">Email</p>
            <a
              href={`mailto:${settings.store_email}`}
              className="text-sm text-mahogany hover:underline"
            >
              {settings.store_email}
            </a>
          </div>
        )}
        {settings.store_address && (
          <div>
            <p className="text-sm font-medium text-coffee">Address</p>
            <p className="text-sm text-stone">{settings.store_address}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-coffee">WhatsApp</p>
          <div className="mt-2">
            <WhatsAppLink
              phoneNumber={settings.whatsapp_number ?? ""}
              message="Hi, I have a question about DatesCrunch."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
