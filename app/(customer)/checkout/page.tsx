import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
