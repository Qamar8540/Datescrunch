"use client";

import { useState } from "react";
import Link from "next/link";
import WhatsAppLink from "@/components/whatsapp-link";

export default function MobileNav({
  links,
  whatsappNumber,
}: {
  links: { href: string; label: string }[];
  whatsappNumber: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-9 w-9 items-center justify-center rounded-card border border-sand text-coffee"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-sand bg-ivory px-4 py-4 shadow-sm">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-card px-2 py-2 text-sm text-coffee/80 hover:bg-sand hover:text-mahogany"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {whatsappNumber && (
            <div className="mt-3 border-t border-sand pt-3">
              <WhatsAppLink
                phoneNumber={whatsappNumber}
                message="Hi, I'd like to know more about DatesCrunch products."
                label="Chat on WhatsApp"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
