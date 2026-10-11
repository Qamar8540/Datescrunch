import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  alternates: { canonical: `${SITE_URL}/return-refund-policy` },
};

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Return &amp; Refund Policy</h1>
      <div className="mt-6 space-y-4 text-sm text-stone">
        <p>
          Because our products are perishable food items, we&rsquo;re unable to
          accept returns once an order has been delivered, except in the
          case of damaged, spoiled, or incorrect items.
        </p>
        <p>
          If your order arrives damaged, spoiled, or different from what
          you ordered, please contact us on WhatsApp within 24 hours of
          delivery with your order number and a photo of the item. We&rsquo;ll
          arrange a replacement or refund after reviewing your request.
        </p>
        <p>
          Refunds for eligible cases are processed back to the original
          payment method (or adjusted against a replacement order for Cash
          on Delivery orders) within 5–7 business days of approval.
        </p>
        <p>
          Orders cannot be cancelled once they have been dispatched. To
          cancel before dispatch, contact us as soon as possible on
          WhatsApp with your order number.
        </p>
        <p className="text-xs text-stone/70">
          This page is a general policy template — adjust the timelines
          and conditions above to match your actual return process before
          launch.
        </p>
      </div>
    </div>
  );
}
