import React from "react";
import { Check, Download } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

export interface TicketProps {
  ticketId: string;
  amount: number;
  date: Date;
  cardHolder: string;
  last4Digits: string;
  barcodeValue?: string;
  paymentType?: string;
  items?: any[];
  shippingAddress?: any;
  onClose: () => void;
}

export function AnimatedTicket({
  ticketId,
  amount,
  date,
  cardHolder,
  last4Digits,
  barcodeValue = "28937261273650",
  paymentType,
  items = [],
  shippingAddress,
  onClose,
}: TicketProps) {
  const { lang } = useLang();

  const translations = {
    es: {
      success: "¡Tu pago fue realizado con éxito!",
      commerce: "Comercio",
      amountLabel: "Monto",
      requestNo: "Nº de solicitud",
      dateLabel: "Fecha",
      timeLabel: "Hora",
      paymentTypeLabel: "Tipo de pago",
      installmentType: "Tipo de cuota",
      noInstallments: "Sin Cuotas",
      installmentsCount: "Cantidad de cuotas",
      installmentValue: "Valor cuota",
      cardNo: "Nº tarjeta",
      productType: "Tipo de producto",
      productDesc: "Portal Pago Generales",
      download: "DESCARGAR DETALLE",
      returnStore: "VOLVER AL COMERCIO",
      debit: "Débito",
      orderSummaryTitle: "Resumen del pedido",
      orderPlaced: "Pedido realizado",
      orderNo: "N.º de pedido",
      sendTo: "Enviar a",
      paymentMethod: "Método de pago",
      endingIn: "que termina en",
      summary: "Resumen del pedido",
      products: "Productos:",
      shipping: "Envío:",
      totalBeforeTax: "Total antes de impuestos:",
      taxes: "Impuestos:",
      totalVAT: "Total (I.V.A. Incluido):",
      arrivesTomorrow: "Llega mañana",
      soldBy: "Vendido por:"
    },
    en: {
      success: "Your payment was successful!",
      commerce: "Commerce",
      amountLabel: "Amount",
      requestNo: "Request No.",
      dateLabel: "Date",
      timeLabel: "Time",
      paymentTypeLabel: "Payment Type",
      installmentType: "Installment Type",
      noInstallments: "No Installments",
      installmentsCount: "Number of installments",
      installmentValue: "Installment value",
      cardNo: "Card No.",
      productType: "Product Type",
      productDesc: "General Payment Portal",
      download: "DOWNLOAD DETAILS",
      returnStore: "RETURN TO STORE",
      debit: "Debit",
      orderSummaryTitle: "Order Summary",
      orderPlaced: "Order placed",
      orderNo: "Order No.",
      sendTo: "Send to",
      paymentMethod: "Payment Method",
      endingIn: "ending in",
      summary: "Order Summary",
      products: "Products:",
      shipping: "Shipping:",
      totalBeforeTax: "Total before tax:",
      taxes: "Taxes:",
      totalVAT: "Total (VAT included):",
      arrivesTomorrow: "Arrives tomorrow",
      soldBy: "Sold by:"
    }
  };
  const t = translations[lang];

  const formattedAmount = new Intl.NumberFormat(lang === 'es' ? "es-ES" : "en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  const formattedDateLong = new Intl.DateTimeFormat(lang === 'es' ? "es-ES" : "en-US", {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);

  const formattedDate = new Intl.DateTimeFormat(lang === 'es' ? "es-ES" : "en-GB", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat(lang === 'es' ? "es-ES" : "en-GB", {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);

  return (
    <>
      {/* SCREEN LAYOUT */}
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200 print:hidden">
        
        <div className="flex flex-col items-center w-full max-w-[420px] animate-in slide-in-from-bottom-8 duration-300 ease-out">
          
          {/* Top Logos */}
          <div className="flex items-center justify-center gap-6 mb-8 text-[var(--color-brand-offwhite)]">
            <div className="text-2xl font-serif font-bold tracking-widest text-[var(--color-brand-gold)]">
              DON PEPE
            </div>
            <div className="w-[1px] h-8 bg-[var(--color-brand-gold)]/30"></div>
            <div className="text-xl font-bold italic tracking-wide">
              PayPal
            </div>
          </div>

          {/* Ticket Block */}
          <div className="relative w-full bg-white rounded-none shadow-2xl pt-12 pb-8 px-8">
            
            {/* Floating Checkmark with Animation */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#00B4D8] rounded-full flex items-center justify-center shadow-lg border-[5px] border-white animate-in zoom-in spin-in-12 duration-700 ease-out">
              <Check className="text-white w-7 h-7 stroke-[3] animate-pulse" />
            </div>

            {/* Title */}
            <h2 className="text-[#03045E] font-bold text-center text-[18px] mb-8">
              {t.success}
            </h2>

            {/* Commerce & Amount Row */}
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold mb-1">{t.commerce}</span>
                <span className="text-[#03045E] font-serif font-bold text-xl tracking-wide uppercase">DON PEPE</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 font-semibold mb-1">{t.amountLabel}</span>
                <span className="text-[#03045E] font-bold text-2xl">{formattedAmount}</span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-slate-200 mb-6"></div>

            {/* Details List */}
            <div className="flex flex-col gap-3 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{t.requestNo}</span>
                <span className="text-slate-500">{ticketId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{t.dateLabel}</span>
                <span className="text-slate-500">{formattedDate} hrs.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{t.timeLabel}</span>
                <span className="text-slate-500">{formattedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{t.paymentTypeLabel}</span>
                <span className="text-slate-500">{paymentType || t.debit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{t.installmentType}</span>
                <span className="text-slate-500">{t.noInstallments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{t.installmentsCount}</span>
                <span className="text-slate-500">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{t.installmentValue}</span>
                <span className="text-slate-500">$0</span>
              </div>
              {last4Digits && (
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{t.cardNo}</span>
                  <span className="text-slate-500">**********{last4Digits}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{t.productType}</span>
                <span className="text-slate-500">{t.productDesc}</span>
              </div>
            </div>

          </div>

          {/* Outside Buttons with Active Scale Effects */}
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 text-[var(--color-brand-gold)] font-bold text-sm tracking-widest mt-8 hover:opacity-80 active:scale-95 transition-all"
          >
            <Download className="w-5 h-5" />
            {t.download}
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] font-bold uppercase tracking-widest text-[13px] py-4 mt-6 rounded-none hover:brightness-110 active:scale-[0.98] transition-all border border-[var(--color-brand-gold)]"
          >
            {t.returnStore}
          </button>

        </div>
      </div>

      {/* PRINT LAYOUT - Hidden on screen, block on print */}
      <div className="hidden print:block w-full max-w-[900px] mx-auto bg-white p-8 text-black font-sans">
        
        {/* Logo area */}
        <div className="mb-6">
          <div className="text-3xl font-serif font-bold tracking-widest text-black">
            DON PEPE
          </div>
        </div>

        <h1 className="text-3xl font-normal mb-2">{t.orderSummaryTitle}</h1>
        <div className="flex gap-6 text-sm mb-6">
          <p>{t.orderPlaced} {formattedDateLong}</p>
          <p>{t.orderNo} {ticketId}</p>
        </div>

        {/* 3-Column Info Box */}
        <div className="border border-slate-300 rounded-lg p-6 mb-8 grid grid-cols-3 gap-8">
          
          {/* Col 1: Enviar a */}
          <div className="flex flex-col text-sm">
            <span className="font-bold mb-1">{t.sendTo}</span>
            <span className="uppercase">{shippingAddress?.firstName} {shippingAddress?.lastName}</span>
            <span className="uppercase">{shippingAddress?.address}</span>
            <span className="uppercase">{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}</span>
          </div>

          {/* Col 2: Método de pago */}
          <div className="flex flex-col text-sm">
            <span className="font-bold mb-1">{t.paymentMethod}</span>
            <span>{paymentType || t.debit} {t.endingIn} {last4Digits}</span>
          </div>

          {/* Col 3: Resumen */}
          <div className="flex flex-col text-sm">
            <span className="font-bold mb-2">{t.summary}</span>
            <div className="flex justify-between mb-1">
              <span>{t.products}</span>
              <span>{formattedAmount}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>{t.shipping}</span>
              <span>US$0.00</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>{t.totalBeforeTax}</span>
              <span>{formattedAmount}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>{t.taxes}</span>
              <span>US$0.00</span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>{t.totalVAT}</span>
              <span>{formattedAmount}</span>
            </div>
          </div>
        </div>

        {/* Items List */}
        {items && items.length > 0 && items.map((item, i) => (
          <div key={i} className="border border-slate-300 rounded-lg p-6 mb-4">
            <h3 className="font-bold mb-4 text-base">{t.arrivesTomorrow}</h3>
            <div className="flex gap-6">
              <div className="w-24 h-24 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col gap-1 text-sm text-slate-700">
                <p className="font-bold text-[#007185] text-base">{item.name}</p>
                <p className="text-xs">{t.soldBy} DON PEPE</p>
                <p className="font-bold text-[#B12704] mt-1 text-base">US${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}

      </div>
    </>
  );
}

