import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();
  const storeName = settings.store_name || "DatesCrunch";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm text-stone">
        <p>
          {storeName} collects only the information needed to process your
          order: your name, phone number, delivery address, city, and
          pincode. We do not require an account or password to place an
          order.
        </p>
        <p>
          This information is used solely to fulfil and communicate about
          your order (including contacting you on WhatsApp or by phone if
          needed), and is not sold or shared with third parties for
          marketing purposes.
        </p>
        <p>
          Order and contact information is stored securely in our database
          and is only accessible to the store owner/administrator.
        </p>
        <p>
          If you&rsquo;d like your data removed from our records, contact us on
          WhatsApp or email and we&rsquo;ll act on your request.
        </p>
        <p className="text-xs text-stone/70">
          This page is a general policy template — review it against your
          local data-protection requirements before launch.
        </p>
      </div>
    </div>
  );
}
