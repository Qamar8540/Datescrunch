import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  alternates: { canonical: `${SITE_URL}/terms-and-conditions` },
};

export default async function TermsPage() {
  const settings = await getSettings();
  const storeName = settings.store_name || "DatesCrunch";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Terms &amp; Conditions</h1>
      <div className="mt-6 space-y-4 text-sm text-stone">
        <p>
          By placing an order with {storeName}, you agree to the terms
          below.
        </p>
        <p>
          <strong className="text-coffee">Orders &amp; Payment:</strong> We
          currently accept Cash on Delivery (COD) only. Prices shown on the
          site are in Indian Rupees (₹) and are inclusive of applicable
          taxes unless stated otherwise.
        </p>
        <p>
          <strong className="text-coffee">Product availability:</strong>{" "}
          Stock is updated regularly, but in the rare case an item becomes
          unavailable after you order, we will contact you to offer a
          substitute or refund.
        </p>
        <p>
          <strong className="text-coffee">Pricing errors:</strong> If a
          pricing or product description error occurs, we reserve the
          right to cancel the affected order and will inform you promptly.
        </p>
        <p>
          <strong className="text-coffee">Use of the website:</strong> You
          agree to provide accurate delivery details when placing an
          order. We are not responsible for delays caused by incorrect or
          incomplete address information.
        </p>
        <p className="text-xs text-stone/70">
          This page is a general terms template — have it reviewed to
          match your business and local regulations before launch.
        </p>
      </div>
    </div>
  );
}
