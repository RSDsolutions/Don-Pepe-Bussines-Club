import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { CsvColumn } from "./csv";
import { dateTime } from "./format";

const NAVY: [number, number, number] = [15, 22, 38];
const GOLD: [number, number, number] = [212, 175, 55];
const GOLD_DARK: [number, number, number] = [138, 109, 31];

function drawHeader(doc: jsPDF, title: string, subtitle?: string): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(GOLD_DARK[0], GOLD_DARK[1], GOLD_DARK[2]);
  doc.text("DON PEPE BUSINESS GROUP", 40, 44);

  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(title, 40, 62);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 120);
  const sub = `${subtitle ? subtitle + "   ·   " : ""}Generado: ${dateTime(new Date())}   ·   Cifras en USD`;
  doc.text(sub, 40, 76);
  return 90; // startY for the table
}

/** Downloads a data table as a branded PDF (direct download, no print dialog). */
export function downloadTablePDF<T>(opts: {
  filename: string;
  title: string;
  subtitle?: string;
  columns: CsvColumn<T>[];
  rows: T[];
  landscape?: boolean;
}): void {
  const doc = new jsPDF({ orientation: opts.landscape ? "landscape" : "portrait", unit: "pt" });
  const startY = drawHeader(doc, opts.title, opts.subtitle);

  autoTable(doc, {
    startY,
    head: [opts.columns.map((c) => c.label)],
    body: opts.rows.map((row) =>
      opts.columns.map((c) => {
        const v = c.get ? c.get(row) : (row as any)[c.key];
        return v === null || v === undefined ? "" : String(v);
      })
    ),
    styles: { fontSize: 8, cellPadding: 4, textColor: 40, overflow: "linebreak" },
    headStyles: { fillColor: NAVY, textColor: GOLD, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [246, 243, 235] },
    margin: { left: 40, right: 40 },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${data.pageNumber}`,
        doc.internal.pageSize.getWidth() - 80,
        doc.internal.pageSize.getHeight() - 20
      );
    },
  });

  if (opts.rows.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(130, 130, 130);
    doc.text("Sin datos en el período seleccionado.", 40, startY + 30);
  }

  doc.save(opts.filename);
}

export interface SummarySection {
  heading: string;
  rows: [string, string][];
  /** Bolds the last row (e.g. a total/balance line). */
  emphasizeLast?: boolean;
}

/** Downloads a key/value summary report (e.g. accounting balance) as PDF. */
export function downloadSummaryPDF(opts: {
  filename: string;
  title: string;
  subtitle?: string;
  sections: SummarySection[];
}): void {
  const doc = new jsPDF({ unit: "pt" });
  let y = drawHeader(doc, opts.title, opts.subtitle);

  for (const s of opts.sections) {
    autoTable(doc, {
      startY: y,
      head: [[s.heading, ""]],
      body: s.rows,
      styles: { fontSize: 10, cellPadding: 6, textColor: 40 },
      headStyles: { fillColor: NAVY, textColor: GOLD, fontStyle: "bold" },
      columnStyles: { 1: { halign: "right" } },
      margin: { left: 40, right: 40 },
      didParseCell: (d) => {
        if (s.emphasizeLast && d.section === "body" && d.row.index === s.rows.length - 1) {
          d.cell.styles.fontStyle = "bold";
          d.cell.styles.fontSize = 11;
        }
      },
    });
    y = (doc as any).lastAutoTable.finalY + 18;
  }

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Documento generado automáticamente desde el panel de administración.",
    40,
    doc.internal.pageSize.getHeight() - 30
  );

  doc.save(opts.filename);
}
