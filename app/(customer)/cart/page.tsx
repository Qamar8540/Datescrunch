import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import CartClient from "@/components/cart-client";

export const metadata: Metadata = {
  title: "Your Cart",
};

export default async function CartPage() {
  const settings = await getSettings();
  return <CartClient phoneNumber={settings.whatsapp_number ?? ""} />;
}
