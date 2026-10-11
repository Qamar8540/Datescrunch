export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppMessage(params: {
  name: string;
  price: number;
  quantity: number;
  url?: string;
}): string {
  const lines = [
    `Hi, I'd like to order:`,
    `${params.name} x${params.quantity} — ₹${params.price * params.quantity}`,
  ];
  if (params.url) lines.push(params.url);
  return lines.join("\n");
}

export function cartWhatsAppMessage(params: {
  items: { name: string; quantity: number; price: number }[];
  total: number;
}): string {
  const lines = ["Hi, I'd like to order:"];
  for (const item of params.items) {
    lines.push(`- ${item.name} x${item.quantity} — ₹${item.price * item.quantity}`);
  }
  lines.push(`Total: ₹${params.total}`);
  return lines.join("\n");
}

export function orderWhatsAppMessage(params: {
  orderNumber: string;
}): string {
  return `Hi, I'd like to check the status of my order ${params.orderNumber}.`;
}

export function adminOrderWhatsAppMessage(params: {
  customerName: string;
  orderNumber: string;
  status: string;
  total: number;
}): string {
  return [
    `Hi ${params.customerName}, this is regarding your DatesCrunch order ${params.orderNumber}.`,
    `Status: ${params.status}`,
    `Total: ₹${params.total}`,
  ].join("\n");
}
