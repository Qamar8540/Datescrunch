import WhatsAppIcon from "@/components/icons/whatsapp-icon";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppLink({
  phoneNumber,
  message,
  label = "Order on WhatsApp",
  className = "",
}: {
  phoneNumber: string;
  message: string;
  label?: string;
  className?: string;
}) {
  if (!phoneNumber) return null;

  return (
    <a
      href={buildWhatsAppUrl(phoneNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-card bg-olive px-4 py-2 text-sm font-medium text-ivory hover:opacity-90 ${className}`}
    >
      <WhatsAppIcon className="h-4 w-4" />
      {label}
    </a>
  );
}
