import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { FadeIn, staggerDelay } from "@/components/FadeIn";
import { AnchorMark, Logo } from "@/components/icons";
import { useLang } from "@/contexts/LangContext";

const heroImage = new URL("../../img/Don pepe oficina.png", import.meta.url).href;

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
  const { T } = useLang();
  const t = T.home;
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
      {/* Hero Section — Cinematic, image background */}
      <section
        ref={heroSectionRef}
        className="relative overflow-hidden"
        style={{ height: '100vh', minHeight: '600px' }}
      >
        {/* Background image — subtle parallax shift on mouse */}
        <div
          className="absolute inset-[-4%]"
          style={{
            transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -7}px)`,
            transition: 'transform 2.2s cubic-bezier(0.22,1,0.36,1)',
            animation: 'hero-bg-in 2s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient overlay: dark top (navbar), open middle, heavy dark at bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,7,3,0.68) 0%, rgba(10,7,3,0.22) 42%, rgba(10,7,3,0.52) 70%, rgba(10,7,3,0.93) 100%)',
          }}
        />

        {/* Gold ambient glow — top-center, parallax */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(239,184,16,0.10) 0%, transparent 70%)',
            transform: `translateX(calc(-50% + ${mousePos.x * 18}px)) translateY(${mousePos.y * 12}px)`,
            transition: 'transform 1.8s cubic-bezier(0.22,1,0.36,1)',
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-24 pt-12">

          {/* Logo */}
          <div style={{ animation: 'hero-logo-enter 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}>
            <div className="hero-logo-float w-[100px] h-[100px] md:w-[130px] md:h-[130px] mb-7">
              <div
                style={{ filter: 'drop-shadow(0 4px 24px rgba(239,184,16,0.55)) brightness(1.08)' }}
                className="w-full h-full"
              >
                <Logo className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* DON PEPE — letter by letter */}
          <h1
            className="flex font-serif font-bold text-white leading-none mb-4"
            style={{
              fontSize: 'clamp(52px, 7.8vw, 100px)',
              letterSpacing: '0.07em',
            }}
          >
            {["D","O","N"," ","P","E","P","E"].map((letter, i) =>
              letter === " " ? (
                <span key={i} className="w-[0.28em] inline-block" />
              ) : (
                <span
                  key={i}
                  className="inline-block cursor-default"
                  style={{ animation: `hero-letter-in 0.58s cubic-bezier(0.22,1,0.36,1) ${0.38 + i * 0.07}s both, hero-gold-wave 4.5s linear ${1.8 + i * 0.09}s infinite` }}
                >
                  {letter}
                </span>
              )
            )}
          </h1>

          {/* BUSINESS GROUP */}
          <div style={{ animation: 'hero-line-in 0.7s cubic-bezier(0.22,1,0.36,1) 1s both' }}>
            <span className="font-sans font-medium text-[11px] md:text-[13px] tracking-[0.58em] text-[var(--color-brand-goldlight)] uppercase">
              Business Group
            </span>
          </div>

          {/* Gold separator line — draws in */}
          <div
            className="mt-5 h-[1px] bg-[var(--color-brand-gold)]/55"
            style={{ animation: 'hero-underline-draw 1.1s cubic-bezier(0.22,1,0.36,1) 1.2s both', width: '44px' }}
          />

          {/* Eyebrow below */}
          <div
            className="mt-4"
            style={{ animation: 'hero-line-in 0.7s cubic-bezier(0.22,1,0.36,1) 1.38s both' }}
          >
            <span className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] text-white/45 uppercase">
              {t.heroSince}
            </span>
          </div>
        </div>

        {/* Bottom frosted strip — company navigation (like Bulgari locations) */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{ animation: 'hero-line-in 0.8s cubic-bezier(0.22,1,0.36,1) 1.55s both' }}
        >
          <div className="border-t border-white/10 bg-black/50 backdrop-blur-md">
            <div className="max-w-[1440px] mx-auto px-4">
              <div className="flex flex-col md:flex-row items-stretch justify-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                {[
                  { to: "/import",  label: "Don Pepe Import",    sub: t.importSub },
                  { to: "/seafood", label: "Don Pepe Sea Food",  sub: t.seafoodSub },
                  { to: "/atm",     label: "Don Pepe ATM",       sub: t.atmSub },
                ].map(({ to, label, sub }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex flex-col items-center justify-center py-4 px-8 md:px-12 lg:px-20 text-center hover:bg-white/6 transition-colors duration-300 relative overflow-hidden"
                  >
                    {/* Gold bottom accent on hover */}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-12 bg-[var(--color-brand-gold)] transition-[width] duration-300 ease-out" />
                    <span className="font-sans font-semibold text-[10px] md:text-[11px] tracking-[0.24em] text-white/80 uppercase group-hover:text-[var(--color-brand-gold)] transition-colors duration-300">
                      {label}
                    </span>
                    <span className="font-sans text-[8px] md:text-[9px] tracking-[0.18em] text-white/32 uppercase mt-1 group-hover:text-white/55 transition-colors duration-300">
                      {sub}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
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
              <div className="text-xs uppercase tracking-widest text-[var(--color-brand-graylight)] opacity-70">{t.statsYears}</div>
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
              <div className="text-xs uppercase tracking-widest text-[var(--color-brand-graylight)] opacity-70">{t.statsCompanies}</div>
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
              <div className="text-xs uppercase tracking-widest text-[var(--color-brand-graylight)] opacity-70">{t.statsCountries}</div>
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
                {t.historyEyebrow}
              </span>
              <h2 className="font-serif font-bold text-[48px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0] mb-8">
                {t.historyHeading.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h2>
              <p className="font-sans text-lg text-[var(--color-brand-graylight)] leading-relaxed mb-8">
                {t.historyBody}
              </p>
              <Link to="/historia" className="inline-flex items-center gap-2 font-sans font-semibold text-sm uppercase tracking-widest text-[var(--color-brand-gold)] hover:text-[var(--color-brand-goldlight)] transition-colors">
                {t.historyCta} <ArrowRight size={18} />
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
                <span className="font-serif italic text-[18px] text-[var(--color-brand-goldlight)] whitespace-nowrap">{t.historyLabel}</span>
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
              {t.groupEyebrow}
            </span>
            <h2 className="font-serif font-bold text-[48px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0] mb-8">
              {t.groupHeading}
            </h2>
            <p className="font-sans text-lg text-[var(--color-brand-graylight)] leading-relaxed max-w-[600px] mx-auto">
              {t.groupBody}
            </p>
          </FadeIn>
        </div>

        <div className="max-w-[1440px] mx-auto w-full flex flex-col md:flex-row gap-6 md:gap-0 mt-8">
          {[
            { to: "/import", accent: "var(--color-brand-gold)", label: t.importLabel, text: t.importText, border: "border-l-[var(--color-brand-gold)]" },
            { to: "/seafood", accent: "var(--color-brand-teal)", label: t.seafoodLabel, text: t.seafoodText, border: "border-l-[var(--color-brand-teal)]" },
            { to: "/atm", accent: "var(--color-brand-graymuted)", label: t.atmLabel, text: t.atmText, border: "border-l-[var(--color-brand-graymuted)]" },
          ].map(({ to, accent, label, text, border }, i) => (
            <FadeIn key={to} delay={staggerDelay(i + 1)} direction="up" className="flex-1">
              <Link
                to={to}
                className={`group flex flex-col justify-center min-h-[160px] md:min-h-[200px] border border-[var(--color-brand-gold)]/10 md:border-y-0 md:border-t border-t-[var(--color-brand-gold)]/10 md:border-r px-8 md:px-12 cursor-pointer hover:bg-[rgba(239,184,16,0.06)] transition-colors border-l-[4px] ${border} relative overflow-hidden`}
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
              {t.valoresEyebrow}
            </span>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {t.valores.map((val, i) => (
              <FadeIn key={val} delay={staggerDelay(i)} direction="up">
                <span className="block font-serif italic text-[36px] md:text-[48px] text-[var(--color-brand-offwhite)] mb-2 hover:text-[var(--color-brand-gold)] transition-colors duration-[400ms] cursor-default group/val">
                  {val}
                  <span className="block h-[1px] bg-[var(--color-brand-gold)] origin-left scale-x-0 group-hover/val:scale-x-100 transition-transform duration-[400ms] ease-out mt-2 mx-auto w-3/4" />
                </span>
                <p className="font-sans text-[14px] text-[var(--color-brand-graylight)] max-w-[200px] mx-auto">
                  {t.valoresDesc}
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
              {t.routeBody}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-[var(--color-brand-black)] border-t border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16">
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block mb-4">
              {t.testimonialsEyebrow}
            </span>
            <h2 className="font-serif font-bold text-[36px] md:text-[48px] text-[var(--color-brand-offwhite)]">
              {t.testimonialsHeading}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.testimonials.map((tm, i) => (
              <FadeIn key={i} delay={staggerDelay(i)} direction="up">
                <div className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/20 p-8 h-full flex flex-col justify-between hover:border-[var(--color-brand-gold)]/50 transition-colors">
                  <div>
                    <div className="flex gap-1 mb-6 text-[var(--color-brand-gold)]">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <blockquote className="font-serif italic text-2xl text-[var(--color-brand-offwhite)] leading-snug mb-8">
                      "{tm.quote}"
                    </blockquote>
                  </div>
                  <div>
                    <div className="font-sans text-[var(--color-brand-gold)] font-medium text-sm tracking-wide">{tm.name}</div>
                    <div className="font-sans text-xs text-[var(--color-brand-graylight)] mt-1">{tm.role}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 md:py-32 bg-[var(--color-brand-black)] border-t border-[var(--color-brand-gold)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <FadeIn>
            <h2 className="font-serif font-bold text-[36px] md:text-[48px] text-[var(--color-brand-offwhite)] mb-12">
              {t.ctaHeading}
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="https://wa.me/14073743951"
                target="_blank"
                rel="noreferrer"
                className="bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(239,184,16,0.35)] inline-block"
              >
                {t.ctaWhatsapp}
              </a>
              <a
                href="mailto:info@donpepebussinessgroup.com"
                className="border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-[rgba(239,184,16,0.08)] inline-block"
              >
                {t.ctaEmail}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
