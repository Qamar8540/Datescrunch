import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about DatesCrunch — our story, quality standards, and company information.",
  alternates: { canonical: `${SITE_URL}/about` },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DatesCrunch",
  legalName: "PZ Brothers Private Limited",
  alternateName: "PZ Brothers Pvt Ltd",
  url: SITE_URL,
  foundingDate: "2022-01-19",
  identifier: "U52399DL2022PTC392641",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "H.No - F-13/17, T/F, F/P Joga Bai Ext., Okhla, Hazara Manzil, Khazori Road",
    addressLocality: "Delhi",
    postalCode: "110025",
    addressCountry: "IN",
  },
};

export default async function AboutPage() {
  const settings = await getSettings();
  const storeName = settings.store_name || "DatesCrunch";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <h1 className="text-3xl font-semibold">About Us</h1>

      <div className="mt-6 space-y-4 text-stone">
        <p>
          {storeName} brings you premium-quality dates and dry fruits,
          sourced with care and delivered fresh. We work with trusted
          suppliers, check every batch for quality, and pack each order
          carefully before it ships.
        </p>
        <p>
          We keep our range focused — dates, dry fruits, and thoughtfully
          put-together gift packs — so we can maintain consistent quality
          across everything we sell, rather than spreading ourselves thin
          across hundreds of products.
        </p>
        <p>
          Our promise is simple: fair prices, honest descriptions, and
          support that&rsquo;s easy to reach — whether that&rsquo;s through our
          website or a quick message on WhatsApp.
        </p>
      </div>

      <div className="mt-10 rounded-card border border-sand bg-white p-6">
        <h2 className="text-sm font-medium text-coffee">Company Information</h2>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm text-stone sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-stone/70">Operated by</dt>
            <dd>PZ Brothers Private Limited</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-stone/70">CIN</dt>
            <dd>U52399DL2022PTC392641</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-stone/70">Incorporated</dt>
            <dd>19 January 2022</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-stone/70">Business</dt>
            <dd>Dry fruits &amp; dates trading, under the DatesCrunch brand</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase text-stone/70">Registered Office</dt>
            <dd>
              H.No - F-13/17, T/F, F/P Joga Bai Ext., Okhla, Hazara Manzil,
              Khazori Road, Delhi - 110025
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
