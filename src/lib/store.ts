import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/database.types";
import type { Lang } from "@/i18n/translations";

/** Normalized shape consumed by the public store UI. */
export interface StoreProduct {
  id: string;
  slug: string;
  division: string;
  name: string;
  description: string;
  badge: string;
  price: number;
  unit: string;
  image: string;
  tag: string;
}

const TAG_BY_DIVISION: Record<string, string> = {
  import: "Don Pepe Import",
  seafood: "Don Pepe Sea Food",
  atm: "Don Pepe ATM",
};

export function divisionTag(division: string): string {
  return TAG_BY_DIVISION[division] || "Don Pepe";
}

export function mapProduct(p: Product, lang: Lang): StoreProduct {
  const es = lang === "es";
  return {
    id: p.id,
    slug: p.slug,
    division: p.division,
    name: es ? p.name_es : p.name_en,
    description: (es ? p.description_es : p.description_en) || "",
    badge: (es ? p.badge_es : p.badge_en) || "",
    price: Number(p.price) || 0,
    unit: p.unit || "unidad",
    image: p.image_url || "",
    tag: divisionTag(p.division),
  };
}

/** Fetches active products for the storefront, split by division. */
export function useStoreProducts(lang: Lang) {
  const [products, setProducts] = useState<StoreProduct[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (cancelled) return;
      if (error || !data) {
        setProducts(null); // signal fallback
      } else {
        setProducts(data.map((p) => mapProduct(p as Product, lang)));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const importProducts = products?.filter((p) => p.division === "import") ?? [];
  const seafoodProducts = products?.filter((p) => p.division === "seafood") ?? [];

  return {
    loading,
    /** null => DB unavailable/empty, caller should fall back to static copy. */
    hasData: products !== null && products.length > 0,
    importProducts,
    seafoodProducts,
    allProducts: products ?? [],
  };
}

export interface CheckoutItem {
  id: string; // slug used across the storefront
  name: string;
  price: number;
  quantity: number;
}

export interface SaveOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  paymentMethod?: string;
  items: CheckoutItem[];
  subtotal: number;
  shipping?: number;
  total: number;
}

/**
 * Persists a completed checkout (order + items) to the database.
 * Best-effort: returns the order number on success or null on failure so the
 * customer-facing confirmation flow never breaks if the DB is unavailable.
 */
export async function saveOrder(input: SaveOrderInput): Promise<string | null> {
  try {
    // Resolve product ids from slugs so items link back to the catalog.
    const slugs = input.items.map((i) => i.id);
    const { data: prodRows } = await supabase.from("products").select("id,slug").in("slug", slugs);
    const idBySlug = new Map((prodRows || []).map((p) => [p.slug, p.id]));

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_name: input.customerName || "Cliente",
        customer_email: input.customerEmail || "",
        customer_phone: input.customerPhone || "",
        address: input.address || "",
        city: input.city || "",
        state: input.state || "",
        postal_code: input.postalCode || "",
        country: input.country || "",
        payment_method: input.paymentMethod || "",
        status: "paid",
        subtotal: input.subtotal,
        shipping: input.shipping || 0,
        total: input.total,
      })
      .select("id, order_number")
      .single();

    if (error || !order) return null;

    const itemRows = input.items.map((i) => ({
      order_id: order.id,
      product_id: idBySlug.get(i.id) ?? null,
      product_name: i.name,
      unit_price: i.price,
      quantity: i.quantity,
      line_total: Number((i.price * i.quantity).toFixed(2)),
    }));
    await supabase.from("order_items").insert(itemRows);

    return (order as { order_number: string }).order_number;
  } catch {
    return null;
  }
}

/** Fetches a single active product by slug (returns null if not found). */
export async function fetchProductBySlug(slug: string, lang: Lang): Promise<StoreProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error || !data) return null;
  return mapProduct(data as Product, lang);
}
