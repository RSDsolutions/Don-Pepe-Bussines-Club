import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  // SVG inline logo: white circle with gold anchor centered and black/gold brand contrast.
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
    >
      <circle cx="100" cy="100" r="95" fill="var(--color-brand-black)" stroke="var(--color-brand-goldmuted)" strokeWidth="1"/>
      <g transform="translate(100, 110) scale(0.6)">
        <path d="M0 -30 V40 M-20 -10 H20 M-30 20 C-30 40, -10 50, 0 50 C10 50, 30 40, 30 20" stroke="var(--color-brand-gold)" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <circle cx="0" cy="-40" r="10" stroke="var(--color-brand-gold)" strokeWidth="6" fill="none"/>
      </g>
      <text x="100" y="55" textAnchor="middle" fill="var(--color-brand-gold)" fontFamily="Cormorant Garamond, serif" fontWeight="700" fontSize="22">
        DON PEPE
      </text>
      <text x="100" y="155" textAnchor="middle" fill="var(--color-brand-goldlight)" fontFamily="Outfit, sans-serif" fontWeight="500" fontSize="8" letterSpacing="0.2em">
        BUSINESS GROUP
      </text>
    </svg>
  );
}

export function AnchorMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M50 20 V80 M30 35 H70 M20 60 C20 80, 40 90, 50 90 C60 90, 80 80, 80 60" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <circle cx="50" cy="10" r="10" stroke="currentColor" strokeWidth="8" fill="none"/>
    </svg>
  );
}
