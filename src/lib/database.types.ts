// Hand-written typings mirroring supabase/migrations/0001_init.sql.
// Keep in sync when the schema changes.

export interface Category {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  category_id: string | null;
  division: string; // import | seafood | atm
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  badge_es: string | null;
  badge_en: string | null;
  price: number;
  cost: number;
  unit: string;
  stock: number;
  low_stock_at: number;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  status: string; // pending|paid|shipped|completed|cancelled
  payment_method: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  type: string; // in | out | adjust
  quantity: number;
  reason: string | null;
  note: string | null;
  created_at: string;
}

export interface LedgerEntry {
  id: string;
  type: string; // income | expense
  category: string | null;
  description: string;
  amount: number;
  entry_date: string;
  order_id: string | null;
  created_at: string;
}

type Row<T> = T;
type Insert<T> = Partial<T>;
type Update<T> = Partial<T>;

interface TableShape<T> {
  Row: Row<T>;
  Insert: Insert<T>;
  Update: Update<T>;
  Relationships: [];
}

export interface Database {
  public: {
    Tables: {
      categories: TableShape<Category>;
      products: TableShape<Product>;
      orders: TableShape<Order>;
      order_items: TableShape<OrderItem>;
      inventory_movements: TableShape<InventoryMovement>;
      ledger_entries: TableShape<LedgerEntry>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
