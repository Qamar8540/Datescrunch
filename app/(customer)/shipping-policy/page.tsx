import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Shipping Policy",
  alternates: { canonical: `${SITE_URL}/shipping-policy` },
};

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Shipping Policy</h1>
      <div className="mt-6 space-y-4 text-sm text-stone">
        <p>
          We aim to process and dispatch every order within 1–2 business
          days of confirmation. Delivery timelines depend on your location
          and typically range from 3–7 business days once shipped.
        </p>
        <p>
          You&rsquo;ll be contacted by phone or WhatsApp to confirm your order
          before it ships, since we currently offer Cash on Delivery (COD)
          only.
        </p>
        <p>
          Shipping charges, if any, are calculated at checkout based on
          your delivery location and order value.
        </p>
        <p>
          If your order is delayed or you haven&rsquo;t received a delivery
          update, please contact us on WhatsApp with your order number and
          we&rsquo;ll look into it right away.
        </p>
        <p className="text-xs text-stone/70">
          This page is a general policy template — update the specific
          timelines and charges above to match your actual courier
          arrangements before launch.
        </p>
      </div>
    </div>
  );
}
