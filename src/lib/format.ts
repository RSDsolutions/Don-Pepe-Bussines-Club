export function money(value: number | null | undefined): string {
  const n = typeof value === "number" ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function shortDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("es-EC", { year: "numeric", month: "short", day: "2-digit" });
}

export function dateTime(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString("es-EC", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** slugify used to keep public-store URLs stable with the seed data. */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
