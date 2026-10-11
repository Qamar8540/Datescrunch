import WhatsAppIcon from "@/components/icons/whatsapp-icon";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton({
  phoneNumber,
  message = "Hi, I'd like to know more about DatesCrunch products.",
}: {
  phoneNumber: string;
  message?: string;
}) {
  if (!phoneNumber) return null;

  return (
    <a
      href={buildWhatsAppUrl(phoneNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-olive text-ivory shadow-lg transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
