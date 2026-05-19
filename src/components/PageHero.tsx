import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt?: string;
}

export function PageHero({ eyebrow, title, subtitle, imageUrl, imageAlt = "" }: PageHeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const letters = title.split("");

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: "100vh", minHeight: "600px" }}
    >
      {/* Background image — subtle mouse parallax */}
      <div
        className="absolute inset-[-4%]"
        style={{
          transform: `translate(${mousePos.x * -9}px, ${mousePos.y * -6}px)`,
          transition: "transform 2.2s cubic-bezier(0.22,1,0.36,1)",
          animation: "hero-bg-in 1.8s ease both",
        }}
      >
        <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,7,3,0.68) 0%, rgba(10,7,3,0.25) 42%, rgba(10,7,3,0.52) 68%, rgba(10,7,3,0.90) 100%)",
        }}
      />

      {/* Gold ambient glow */}
      <div
        className="absolute top-0 left-1/2 w-[550px] h-[380px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(239,184,16,0.10) 0%, transparent 70%)",
          transform: `translateX(calc(-50% + ${mousePos.x * 16}px)) translateY(${mousePos.y * 10}px)`,
          transition: "transform 1.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-20">
        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 mb-8"
          style={{ animation: "hero-line-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}
        >
          <div className="w-6 h-[1px] bg-[var(--color-brand-gold)]" />
          <span className="font-sans font-medium text-[9px] md:text-[10px] tracking-[0.35em] text-[var(--color-brand-gold)] uppercase">
            {eyebrow}
          </span>
          <div className="w-6 h-[1px] bg-[var(--color-brand-gold)]" />
        </div>

        {/* Title — letter by letter */}
        <h1
          className="flex flex-wrap justify-center font-serif font-bold text-white leading-none mb-5"
          style={{
            fontSize: "clamp(46px, 7vw, 92px)",
            letterSpacing: "0.07em",
          }}
        >
          {letters.map((letter, i) =>
            letter === " " ? (
              <span key={i} className="w-[0.28em] inline-block" />
            ) : (
              <span
                key={i}
                className="inline-block cursor-default"
                style={{
                  animation: `hero-letter-in 0.55s cubic-bezier(0.22,1,0.36,1) ${0.3 + i * 0.06}s both, hero-gold-wave 4.5s linear ${1.6 + i * 0.09}s infinite`,
                }}
              >
                {letter}
              </span>
            )
          )}
        </h1>

        {/* Subtitle */}
        <div style={{ animation: "hero-line-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.95s both" }}>
          <p className="font-sans font-medium text-[11px] md:text-[13px] tracking-[0.38em] text-[var(--color-brand-goldlight)] uppercase text-center">
            {subtitle}
          </p>
        </div>

        {/* Separator */}
        <div
          className="mt-5 h-[1px] bg-[var(--color-brand-gold)]/50"
          style={{
            animation: "hero-underline-draw 1s cubic-bezier(0.22,1,0.36,1) 1.1s both",
            width: "44px",
          }}
        />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        style={{ animation: "hero-line-in 0.7s ease 1.5s both" }}
      >
        <span className="font-sans text-[7px] tracking-[0.28em] text-white/30 uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 text-white/30 hero-scroll-bounce" />
      </div>
    </section>
  );
}
