export interface CsvColumn<T> {
  key: string;
  label: string;
  /** Optional value accessor/formatter; defaults to row[key]. */
  get?: (row: T) => string | number | null | undefined;
}

function escapeCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r;]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function toCSV<T>(columns: CsvColumn<T>[], rows: T[]): string {
  const header = columns.map((c) => escapeCell(c.label)).join(",");
  const lines = rows.map((row) =>
    columns
      .map((c) => escapeCell(c.get ? c.get(row) : (row as any)[c.key]))
      .join(",")
  );
  return [header, ...lines].join("\r\n");
}

export function downloadCSV(filename: string, csv: string): void {
  // Prepend UTF-8 BOM so Excel renders accents (á, ñ...) correctly.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(filename, blob);
}

export function triggerDownload(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Timestamp suffix like 2026-07-05 for filenames. */
export function stamp(): string {
  return new Date().toISOString().slice(0, 10);
}
