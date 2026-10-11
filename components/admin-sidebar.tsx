import Link from "next/link";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-sand bg-ivory px-4 py-2 md:h-screen md:w-56 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:px-3 md:py-6">
      <div className="hidden px-2 pb-6 font-display text-lg font-semibold text-mahogany md:block">
        DatesCrunch
      </div>
      {ADMIN_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="whitespace-nowrap rounded-card px-3 py-2 text-sm text-coffee/80 hover:bg-sand hover:text-mahogany"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
