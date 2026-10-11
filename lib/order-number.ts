export function formatOrderNumber(orderNo: number, createdAt: string | Date): string {
  const date = new Date(createdAt);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `DC-${y}${m}${d}-${String(orderNo).padStart(4, "0")}`;
}

// Best-effort reverse lookup for the admin search box: pulls the trailing
// numeric segment out of a pasted order number (or a bare number) so it
// can be matched against orders.order_no.
export function parseOrderNoFromQuery(query: string): number | null {
  const parts = query.trim().split("-");
  const last = parts[parts.length - 1];
  if (/^\d+$/.test(last)) {
    return parseInt(last, 10);
  }
  return null;
}
