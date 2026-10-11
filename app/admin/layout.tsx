import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin | DatesCrunch",
    template: "%s | Admin | DatesCrunch",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
