import { cn } from "@/lib/utils";

const logoUrl = new URL("../../img/Logo-Don-Pepe.png", import.meta.url).href;

export function Logo({ className }: { className?: string }) {
  return (
    <img 
      src={logoUrl} 
      alt="Don Pepe Business Group Logo" 
      className={cn("object-contain w-full h-full", className)} 
    />
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
