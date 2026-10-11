"use server";

import { createClient } from "@/lib/supabase/server";
import { formatOrderNumber } from "@/lib/order-number";

export interface PlaceOrderInput {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
  items: { productId: string; quantity: number }[];
}

export interface PlaceOrderResult {
  error?: string;
  orderId?: string;
  orderNumber?: string;
}

export async function placeOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  if (!input.customerName.trim()) return { error: "Name is required." };
  if (!input.phone.trim()) return { error: "Phone number is required." };
  if (!input.address.trim()) return { error: "Address is required." };
  if (!input.city.trim()) return { error: "City is required." };
  if (!input.pincode.trim()) return { error: "Pincode is required." };
  if (input.items.length === 0) return { error: "Your cart is empty." };

  const supabase = createClient();

  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: input.customerName.trim(),
    p_phone: input.phone.trim(),
    p_address: input.address.trim(),
    p_city: input.city.trim(),
    p_pincode: input.pincode.trim(),
    p_notes: input.notes.trim() || null,
    p_items: input.items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
    })),
  });

  if (error) {
    // Postgres RAISE EXCEPTION messages (out of stock, empty cart, etc.)
    // arrive here as error.message — safe to show directly to the customer.
    return { error: error.message || "Could not place order. Please try again." };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    return { error: "Could not place order. Please try again." };
  }

  return {
    orderId: row.order_id,
    orderNumber: formatOrderNumber(row.order_no, row.created_at),
  };
}

export interface UpdateOrderStatusResult {
  error?: string;
}

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<UpdateOrderStatusResult> {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return { error: "Invalid status." };
  }

  const supabase = createClient();

  // Defense in depth: RLS already blocks this for anyone but the signed-in
  // admin, but check explicitly so a stray/unauthenticated call gets a
  // clear error instead of a silent no-op update.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated." };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    return { error: "Could not update order status. Please try again." };
  }

  return {};
}
