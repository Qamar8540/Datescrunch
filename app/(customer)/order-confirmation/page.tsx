import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import OrderConfirmationClient from "@/components/order-confirmation-client";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function OrderConfirmationPage() {
  const settings = await getSettings();
  return <OrderConfirmationClient phoneNumber={settings.whatsapp_number ?? ""} />;
}
