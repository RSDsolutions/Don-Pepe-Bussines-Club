import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { FadeIn, staggerDelay } from "@/components/FadeIn";
import { AnchorMark, Logo } from "@/components/icons";

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          observer.disconnect();
          const startTime = performance.now();
          const animate = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 4);
            setCount(Math.round(eased * target));
            if (t < 1) rafRef.current = requestAnimationFrame(animate);
          };
          rafRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return { count, ref };
}

export function Home() {
  const location = useLocation();
  const [lineVisible, setLineVisible] = useState(false);
  const lineRef = useRef<HTMLElement>(null);
  const stat50 = useCountUp(50);
  const stat3 = useCountUp(3);
  const stat2 = useCountUp(2);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = heroSectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (e.clientY > rect.bottom) return;
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('scrollToEmpresas') === 'true') {
      sessionStorage.removeItem('scrollToEmpresas');
      setTimeout(() => {
        const el = document.getElementById("empresas");
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (lineRef.current) observer.observe(lineRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section — split layout */}
      <section
        ref={heroSectionRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[var(--color-brand-black)] pt-20"
      >
        {/* Dot grid */}
        <div className="absolute inset-0 hero-dot-grid pointer-events-none" />

        {/* Ambient gold blobs — parallax opposite direction */}
        <div
          className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201,148,58,0.09) 0%, transparent 65%)',
            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
            transition: 'transform 1.6s cubic-bezier(0.22,1,0.36,1)',
          }}
        />
        <div
          className="absolute -bottom-48 -right-48 w-[550px] h-[550px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(201,148,58,0.06) 0%, transparent 65%)',
            transform: `translate(${mousePos.x * -14}px, ${mousePos.y * -14}px)`,
            transition: 'transform 2s cubic-bezier(0.22,1,0.36,1)',
          }}
        />

        {/* Noise overlay */}
        <div className="noise-overlay" />

        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-16 flex flex-col md:flex-row items-center gap-16 md:gap-0 min-h-[calc(100vh-80px)] py-24">

          {/* ── LEFT: Logo ── */}
          <div className="md:w-[42%] flex items-center justify-center relative">

            {/* Decorative rings — slower parallax */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `translate(${mousePos.x * -16}px, ${mousePos.y * -16}px)`,
                transition: 'transform 1.1s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div
                className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full border border-[var(--color-brand-gold)]/15"
                style={{ animation: 'hero-ring-breathe 4s ease-in-out infinite' }}
              />
              <div
                className="absolute w-[340px] h-[340px] md:w-[450px] md:h-[450px] rounded-full border border-[var(--color-brand-gold)]/08"
                style={{ animation: 'hero-ring-breathe 4s ease-in-out 1.3s infinite' }}
              />
            </div>

            {/* Parallax wrapper (no animation, only translate) */}
            <div
              style={{
                transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
                transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {/* Entrance animation wrapper */}
              <div style={{ animation: 'hero-logo-enter 1.1s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}>
                {/* Float animation wrapper */}
                <div className="hero-logo-float w-[200px] h-[200px] md:w-[290px] md:h-[290px] lg:w-[330px] lg:h-[330px] relative">
                  {/* Soft glow halo */}
                  <div
                    className="absolute inset-[-20%] rounded-full pointer-events-none"
                    style={{ boxShadow: '0 0 80px 40px rgba(201,148,58,0.10)' }}
                  />
                  {/* Drop shadow via wrapper */}
                  <div style={{ filter: 'drop-shadow(0 12px 40px rgba(201,148,58,0.22))' }} className="w-full h-full">
                    <Logo className="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div
            className="hidden md:flex self-stretch items-center mx-8 lg:mx-14"
            style={{ animation: 'hero-divider-in 1.1s cubic-bezier(0.22,1,0.36,1) 0.55s both' }}
          >
            <div className="w-[1px] h-[55%] bg-gradient-to-b from-transparent via-[var(--color-brand-gold)]/30 to-transparent" />
          </div>

          {/* ── RIGHT: Brand identity ── */}
          <div className="md:w-[58%] flex flex-col items-center md:items-start text-center md:text-left">

            {/* Eyebrow */}
            <div
              className="flex items-center gap-3 mb-8"
              style={{ animation: 'hero-line-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both' }}
            >
              <div className="w-7 h-[1px] bg-[var(--color-brand-gold)]" />
              <span className="font-sans font-semibold text-[10px] tracking-[0.32em] text-[var(--color-brand-gold)] uppercase">
                Desde los años 70
              </span>
              <div className="w-7 h-[1px] bg-[var(--color-brand-gold)]" />
            </div>

            {/* DON PEPE — letter by letter */}
            <h1
              className="flex flex-wrap font-serif font-bold leading-[0.92] tracking-[-0.01em] text-[var(--color-brand-offwhite)] mb-4"
              style={{ fontSize: 'clamp(58px, 7.5vw, 100px)' }}
            >
              {["D","O","N"," ","P","E","P","E"].map((letter, i) =>
                letter === " " ? (
                  <span key={i} className="w-[0.22em] inline-block" />
                ) : (
                  <span
                    key={i}
                    className="inline-block cursor-default transition-colors duration-300 hover:text-[var(--color-brand-gold)]"
                    style={{ animation: `hero-letter-in 0.55s cubic-bezier(0.22,1,0.36,1) ${0.38 + i * 0.07}s both` }}
                  >
                    {letter}
                  </span>
                )
              )}
            </h1>

            {/* BUSINESS GROUP with underline draw */}
            <div
              className="relative mb-10 self-center md:self-start"
              style={{ animation: 'hero-line-in 0.7s cubic-bezier(0.22,1,0.36,1) 1s both' }}
            >
              <span className="font-sans font-medium text-[13px] md:text-[16px] tracking-[0.48em] text-[var(--color-brand-gold)] uppercase">
                Business Group
              </span>
              <div
                className="absolute -bottom-2 left-0 h-[1px]"
                style={{
                  background: 'linear-gradient(to right, var(--color-brand-gold), transparent)',
                  animation: 'hero-underline-draw 0.9s cubic-bezier(0.22,1,0.36,1) 1.35s both',
                }}
              />
            </div>

            {/* Description */}
            <p
              className="font-sans text-[16px] md:text-[17px] text-[var(--color-brand-graylight)] leading-relaxed mb-10 max-w-[460px]"
              style={{ animation: 'hero-line-in 0.7s cubic-bezier(0.22,1,0.36,1) 1.12s both' }}
            >
              Un legado familiar que conecta Ecuador con el mundo. Tradición, calidad y visión internacional desde hace más de cinco décadas.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{ animation: 'hero-line-in 0.7s cubic-bezier(0.22,1,0.36,1) 1.28s both' }}
            >
              <Link
                to="/historia"
                className="relative overflow-hidden bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(201,148,58,0.4)] text-center group"
              >
                <span className="relative z-10">Conoce la Historia</span>
                <span className="absolute inset-0 bg-[var(--color-brand-goldlight)] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </Link>
              <a
                href="#empresas"
                className="group border border-[var(--color-brand-gold)]/55 text-[var(--color-brand-gold)] px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:border-[var(--color-brand-gold)] hover:bg-[rgba(201,148,58,0.07)] text-center flex items-center justify-center gap-2"
              >
                Nuestras Empresas
                <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom gold line */}
        <div className="absolute bottom-0 left-0 h-px bg-[var(--color-brand-gold)]/20 gold-line-anim" />
      </section>

      {/* Stats Bar */}
      <section className="bg-[var(--color-brand-navy)] border-t border-[var(--color-brand-gold)]/10 py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-around gap-12 md:gap-0">
            <FadeIn delay={staggerDelay(0)} className="text-center">
              <div
                ref={stat50.ref}
                className="font-serif text-5xl font-bold text-[var(--color-brand-gold)] mb-1"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {stat50.count}+
              </div>
              <div className="text-xs uppercase tracking-widest text-[var(--color-brand-graylight)] opacity-70">Años de trayectoria</div>
            </FadeIn>
            <div className="hidden md:block h-12 w-[1px] bg-[var(--color-brand-gold)]/20" />
            <FadeIn delay={staggerDelay(1)} className="text-center relative">
              <div className="md:hidden absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-[var(--color-brand-gold)]/20" />
              <div
                ref={stat3.ref}
                className="font-serif text-5xl font-bold text-[var(--color-brand-gold)] mb-1"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {stat3.count}
              </div>
              <div className="text-xs uppercase tracking-widest text-[var(--color-brand-graylight)] opacity-70">Empresas del grupo</div>
            </FadeIn>
            <div className="hidden md:block h-12 w-[1px] bg-[var(--color-brand-gold)]/20" />
            <FadeIn delay={staggerDelay(2)} className="text-center relative">
              <div className="md:hidden absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-[var(--color-brand-gold)]/20" />
              <div
                ref={stat2.ref}
                className="font-serif text-5xl font-bold text-[var(--color-brand-gold)] mb-1"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {stat2.count}
              </div>
              <div className="text-xs uppercase tracking-widest text-[var(--color-brand-graylight)] opacity-70">Países de operación</div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Historia Teaser */}
      <section className="py-24 md:py-32 bg-[var(--color-brand-black)] border-b border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <div className="md:w-[55%]">
            <FadeIn direction="left">
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase mb-6 block">
                NUESTRA HISTORIA
              </span>
              <h2 className="font-serif font-bold text-[48px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0] mb-8">
                Una historia nacida<br />desde abajo
              </h2>
              <p className="font-sans text-lg text-[var(--color-brand-graylight)] leading-relaxed mb-8">
                Su historia no nació en oficinas elegantes. Nació con sacrificio, humildad y el inquebrantable deseo de salir adelante. Lo que comenzó como un esfuerzo familiar, hoy se consolida como un grupo empresarial que trasciende fronteras.
              </p>
              <Link to="/historia" className="inline-flex items-center gap-2 font-sans font-semibold text-sm uppercase tracking-widest text-[var(--color-brand-gold)] hover:text-[var(--color-brand-goldlight)] transition-colors">
                Leer la historia completa <ArrowRight size={18} />
              </Link>
            </FadeIn>
          </div>
          <div className="md:w-[45%] w-full h-[500px]">
            <FadeIn direction="right" className="w-full h-full relative overflow-hidden">
              <img
                src="https://images.pexels.com/photos/17039185/pexels-photo-17039185.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1"
                alt="Mercado tradicional en Sudamérica"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.65) 0%, rgba(8,8,8,0.15) 50%, transparent 100%)' }} />
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                <div className="w-16 h-[1px] bg-[var(--color-brand-gold)] opacity-70" />
                <span className="font-serif italic text-[18px] text-[var(--color-brand-goldlight)] whitespace-nowrap">Ecuador · Años 70</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Empresas Section */}
      <section id="empresas" className="bg-[var(--color-brand-black)] pb-24 md:pb-32 px-6 md:px-12 flex flex-col border-t border-[var(--color-brand-gold)]/10 pt-24 md:pt-32">
        <div className="max-w-[1440px] mx-auto w-full text-center mb-16">
          <FadeIn>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase mb-6 block">
              EL GRUPO
            </span>
            <h2 className="font-serif font-bold text-[48px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0] mb-8">
              Nuestras Empresas
            </h2>
            <p className="font-sans text-lg text-[var(--color-brand-graylight)] leading-relaxed max-w-[600px] mx-auto">
              Un grupo construido sobre valores reales — tres empresas, una sola visión.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-[1440px] mx-auto w-full flex flex-col md:flex-row gap-6 md:gap-0 mt-8">
          {[
            { to: "/import", accent: "var(--color-brand-gold)", label: "Import", text: "Productos ecuatorianos\nal mundo", border: "border-l-[var(--color-brand-gold)]" },
            { to: "/seafood", accent: "var(--color-brand-teal)", label: "Sea Food", text: "Mariscos premium\nde exportación", border: "border-l-[var(--color-brand-teal)]" },
            { to: "/atm", accent: "var(--color-brand-graymuted)", label: "ATM Solutions", text: "Servicios financieros\nen USA", border: "border-l-[var(--color-brand-graymuted)]" },
          ].map(({ to, accent, label, text, border }, i) => (
            <FadeIn key={to} delay={staggerDelay(i + 1)} direction="up" className="flex-1">
              <Link
                to={to}
                className={`group flex flex-col justify-center min-h-[160px] md:min-h-[200px] border border-[var(--color-brand-gold)]/10 md:border-y-0 md:border-t border-t-[var(--color-brand-gold)]/10 md:border-r px-8 md:px-12 cursor-pointer hover:bg-[rgba(201,148,58,0.06)] transition-colors border-l-[4px] ${border} relative overflow-hidden`}
              >
                <div className="flex flex-col mb-4 md:mb-0">
                  <span className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: `var(--color-brand-${accent.includes('gold') ? 'gold' : accent.includes('teal') ? 'teal' : 'graymuted'})` }}>{label}</span>
                  <span className="font-serif text-2xl text-[var(--color-brand-offwhite)] leading-tight whitespace-pre-line">{text}</span>
                </div>
                <ArrowRight
                  className="md:absolute right-8 top-1/2 md:-translate-y-1/2 w-6 h-6 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                  style={{ color: `var(--color-brand-${accent.includes('gold') ? 'gold' : accent.includes('teal') ? 'teal' : 'graymuted'})` }}
                />
                {/* Bottom line animation */}
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-[width] duration-[400ms] ease-out"
                  style={{ backgroundColor: `var(--color-brand-${accent.includes('gold') ? 'gold' : accent.includes('teal') ? 'teal' : 'graymuted'})` }}
                />
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 md:py-32 bg-[var(--color-brand-black)] border-b border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16">
            <span className="font-sans font-medium text-[11px] tracking-[0.2em] text-[var(--color-brand-gold)] uppercase">
              LO QUE NOS DEFINE
            </span>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {["Confianza", "Esfuerzo", "Calidad", "Compromiso"].map((val, i) => (
              <FadeIn key={val} delay={staggerDelay(i)} direction="up">
                <span className="block font-serif italic text-[36px] md:text-[48px] text-[var(--color-brand-offwhite)] mb-2 hover:text-[var(--color-brand-gold)] transition-colors duration-[400ms] cursor-default group/val">
                  {val}
                  <span className="block h-[1px] bg-[var(--color-brand-gold)] origin-left scale-x-0 group-hover/val:scale-x-100 transition-transform duration-[400ms] ease-out mt-2 mx-auto w-3/4" />
                </span>
                <p className="font-sans text-[14px] text-[var(--color-brand-graylight)] max-w-[200px] mx-auto">
                  Fundamento intocable de cada operación y relación de nuestro grupo.
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Ecuador → USA — cinematic */}
      <section className="py-32 bg-[var(--color-brand-navy)] border-b border-[var(--color-brand-gold)]/20" ref={lineRef}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 mb-12">
              {/* Ecuador */}
              <div className="text-center md:w-1/3">
                <span className="text-5xl md:text-7xl block mb-3">🇪🇨</span>
                <span className="font-serif font-bold text-[32px] md:text-[48px] text-[var(--color-brand-offwhite)]">Ecuador</span>
              </div>

              {/* Animated line with anchor */}
              <div className="flex-1 md:max-w-[280px] relative flex items-center justify-center h-12">
                <div
                  className="h-[1px] bg-[var(--color-brand-gold)] absolute left-0"
                  style={{
                    width: lineVisible ? '100%' : '0%',
                    transition: lineVisible ? 'width 1.4s cubic-bezier(0.22,1,0.36,1) 0.3s' : 'none',
                  }}
                />
                <div className="z-10 bg-[var(--color-brand-navy)] px-3">
                  <AnchorMark className="w-8 h-8 text-[var(--color-brand-gold)] opacity-80" />
                </div>
              </div>

              {/* USA */}
              <div className="text-center md:w-1/3">
                <span className="text-5xl md:text-7xl block mb-3">🇺🇸</span>
                <span className="font-serif font-bold text-[32px] md:text-[48px] text-[var(--color-brand-offwhite)]">Estados Unidos</span>
              </div>
            </div>

            <p className="font-sans text-[18px] text-center text-[var(--color-brand-offwhite)] opacity-80">
              Conectando dos mundos desde hace décadas.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-24 md:py-32 bg-[var(--color-brand-black)] border-t border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16">
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block mb-4">
              TESTIMONIOS
            </span>
            <h2 className="font-serif font-bold text-[36px] md:text-[48px] text-[var(--color-brand-offwhite)]">
              Lo que dicen nuestros socios
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "El compromiso de Don Pepe Import nos permitió asegurar una cadena de suministro constante para nuestra cadena de restaurantes.",
                name: "Carlos Rivera",
                role: "Director de Compras, Sabor Latino USA"
              },
              {
                quote: "La calidad del camarón y la puntualidad en las entregas de Don Pepe Sea Food no tiene comparación en el mercado.",
                name: "Maria González",
                role: "CEO, Ocean Imports LLC"
              },
              {
                quote: "Desde que instalamos los cajeros de Don Pepe ATM, la retención de efectivo en nuestro local aumentó un 40%.",
                name: "David Kim",
                role: "Propietario, K-Mart Express"
              }
            ].map((t, i) => (
              <FadeIn key={i} delay={staggerDelay(i)} direction="up">
                <div className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/20 p-8 h-full flex flex-col justify-between hover:border-[var(--color-brand-gold)]/50 transition-colors">
                  <div>
                    <div className="flex gap-1 mb-6 text-[var(--color-brand-gold)]">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <blockquote className="font-serif italic text-2xl text-[var(--color-brand-offwhite)] leading-snug mb-8">
                      "{t.quote}"
                    </blockquote>
                  </div>
                  <div>
                    <div className="font-sans text-[var(--color-brand-gold)] font-medium text-sm tracking-wide">{t.name}</div>
                    <div className="font-sans text-xs text-[var(--color-brand-graylight)] mt-1">{t.role}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto CTA */}
      <section id="contact" className="py-24 md:py-32 bg-[var(--color-brand-black)] border-t border-[var(--color-brand-gold)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <FadeIn>
            <h2 className="font-serif font-bold text-[36px] md:text-[48px] text-[var(--color-brand-offwhite)] mb-12">
              ¿Quieres hacer negocios con nosotros?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="https://wa.me/14073743951"
                target="_blank"
                rel="noreferrer"
                className="bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(201,148,58,0.35)] inline-block"
              >
                Escribir por WhatsApp
              </a>
              <a
                href="mailto:info@donpepebussinessgroup.com"
                className="border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-[rgba(201,148,58,0.08)] inline-block"
              >
                Enviar un Email
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
