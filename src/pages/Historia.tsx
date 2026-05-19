import { useRef, useEffect, useState } from "react";
import { FadeIn, staggerDelay } from "@/components/FadeIn";
import { AnchorMark } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { useLang } from "@/contexts/LangContext";

const donPepeImage = new URL("../../img/Don pepe.png", import.meta.url).href;

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(target > 1000 ? target - 20 : 0);
  const startedRef = useRef(false);
  const rafRef = useRef<number>(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          observer.disconnect();
          const start = target > 1000 ? target - 20 : 0;
          const startTime = performance.now();
          const animate = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 4);
            setCount(Math.round(start + eased * (target - start)));
            if (t < 1) rafRef.current = requestAnimationFrame(animate);
          };
          rafRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return { count, ref };
}

function TimelineNode({ year, text, index, flip }: { year: string; text: string; index: number; flip: boolean }) {
  const [pulsed, setPulsed] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const year1990 = useCountUp(1990);
  const year2010 = useCountUp(2010);
  const year2020 = useCountUp(2020);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPulsed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (dotRef.current) observer.observe(dotRef.current);
    return () => observer.disconnect();
  }, []);

  const renderYear = () => {
    if (year === "1990s") return <><span ref={year1990.ref}>{year1990.count}</span>s</>;
    if (year === "2010s") return <><span ref={year2010.ref}>{year2010.count}</span>s</>;
    if (year === "2020") return <span ref={year2020.ref}>{year2020.count}</span>;
    return year;
  };

  return (
    <FadeIn delay={100 + staggerDelay(index)} className={`relative flex items-center ${flip ? "md:flex-row-reverse" : ""}`}>
      <div
        ref={dotRef}
        className={`absolute left-[24px] md:left-1/2 w-4 h-4 bg-[var(--color-brand-gold)] rounded-full -translate-x-1/2 shadow-[0_0_15px_rgba(239,184,16,0.5)] ${pulsed ? "gold-pulse-3" : ""}`}
      />
      <div className={`pl-16 md:pl-0 w-full md:w-1/2 flex flex-col ${flip ? "md:items-start md:pl-16" : "md:items-end md:pr-16 text-left md:text-right"}`}>
        <span className="font-serif font-bold text-[24px] text-[var(--color-brand-gold)]" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {renderYear()}
        </span>
        <p className="font-sans text-[16px] text-[var(--color-brand-offwhite)] font-medium mt-2">{text}</p>
      </div>
    </FadeIn>
  );
}

export function Historia() {
  const { T } = useLang();
  const t = T.historia;

  const timeline = [
    { year: t.timelineY1, text: t.timelineT1 },
    { year: "1990s",      text: t.timelineT2 },
    { year: "2010s",      text: t.timelineT3 },
    { year: "2020",       text: t.timelineT4 },
    { year: t.timelineY5, text: t.timelineT5 },
  ];

  return (
    <div className="w-full bg-[var(--color-brand-black)]">
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        imageUrl="https://images.pexels.com/photos/17039185/pexels-photo-17039185.jpeg?auto=compress&cs=tinysrgb&w=1920"
        imageAlt="Traditional Ecuadorian market"
      />

      {/* Opening Quote */}
      <section className="theme-dark py-24 bg-[var(--color-brand-navy)] border-y border-[var(--color-brand-gold)]/20">
        <div className="max-w-[700px] mx-auto px-6 text-center relative">
          <span
            className="absolute top-0 left-8 font-serif leading-none select-none pointer-events-none"
            style={{ fontSize: '180px', color: 'var(--color-brand-gold)', opacity: 0.08, lineHeight: 1 }}
            aria-hidden
          >
            "
          </span>
          <FadeIn>
            <blockquote className="gold-shimmer font-serif italic text-[28px] md:text-[36px] leading-snug relative z-10">
              {t.quote1}
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* Story Sections */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col gap-32">

          {/* Section 1 */}
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <div className="md:w-1/2">
              <FadeIn direction="left">
                <span className="font-sans flex items-center gap-4 text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase mb-4">
                  <div className="w-8 h-[1px] bg-[var(--color-brand-gold)]" />
                  {t.s1Eyebrow}
                </span>
                <h3 className="font-serif font-bold text-[32px] text-[var(--color-brand-offwhite)] mb-6">{t.s1Heading}</h3>
                <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] leading-[1.75] mb-6">{t.s1P1}</p>
                <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] leading-[1.75]">{t.s1P2}</p>
              </FadeIn>
            </div>
            <div className="md:w-1/2 w-full">
              <FadeIn direction="right" className="w-full aspect-[4/5] max-h-[600px] border border-[var(--color-brand-gold)]/40 relative overflow-hidden mx-auto max-w-[500px]">
                <img src={donPepeImage} alt="Don Pepe historical portrait" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.65) 0%, transparent 55%)' }} />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <div className="w-12 h-[1px] bg-[var(--color-brand-gold)] opacity-70" />
                  <span className="font-serif italic text-[14px] text-[var(--color-brand-goldlight)] whitespace-nowrap">{t.s1PhotoLabel}</span>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-16 lg:gap-24">
            <div className="md:w-1/2 w-full">
              <FadeIn direction="left" className="w-full aspect-[4/5] max-h-[600px] border border-[var(--color-brand-gold)]/40 relative overflow-hidden mx-auto max-w-[500px]">
                <img
                  src="https://images.pexels.com/photos/1211787/pexels-photo-1211787.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&dpr=1"
                  alt="Maritime cargo port and export"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.5) 0%, transparent 65%)' }} />
              </FadeIn>
            </div>
            <div className="md:w-1/2">
              <FadeIn direction="right">
                <span className="font-sans flex items-center gap-4 text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase mb-4">
                  <div className="w-8 h-[1px] bg-[var(--color-brand-gold)]" />
                  {t.s2Eyebrow}
                </span>
                <h3 className="font-serif font-bold text-[32px] text-[var(--color-brand-offwhite)] mb-6">{t.s2Heading}</h3>
                <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] leading-[1.75] mb-6">{t.s2P1}</p>
                <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] leading-[1.75]">{t.s2P2}</p>
              </FadeIn>
            </div>
          </div>

          {/* Section 3 */}
          <div className="max-w-[800px] mx-auto text-center">
            <FadeIn>
              <div className="flex justify-center mb-4">
                <span className="font-sans flex items-center gap-4 text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase">
                  <div className="w-8 h-[1px] bg-[var(--color-brand-gold)]" />
                  {t.s3Eyebrow}
                  <div className="w-8 h-[1px] bg-[var(--color-brand-gold)]" />
                </span>
              </div>
              <h3 className="font-serif font-bold text-[32px] text-[var(--color-brand-offwhite)] mb-6">{t.s3Heading}</h3>
              <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] leading-[1.75]">{t.s3Body}</p>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[var(--color-brand-navy)] border-y border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 flex flex-col gap-4">
          {t.values.map((val, i) => (
            <FadeIn key={i} delay={staggerDelay(i, 120)} direction="left">
              <div className="flex items-center gap-6 group/val cursor-default py-2">
                <span
                  className="block h-[1px] bg-[var(--color-brand-gold)] flex-shrink-0 transition-[width] duration-300 ease-out group-hover/val:w-[120px]"
                  style={{ width: '60px' }}
                />
                <span
                  className="font-serif italic text-[var(--color-brand-offwhite)] group-hover/val:text-[var(--color-brand-gold)] transition-colors duration-[400ms]"
                  style={{ fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 1 }}
                >
                  {val}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32">
        <div className="max-w-[800px] mx-auto px-6 relative">
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[1px] bg-[var(--color-brand-gold)]/30 -translate-x-1/2" />
          <div className="flex flex-col gap-16">
            {timeline.map((node, i) => (
              <TimelineNode key={i} year={node.year} text={node.text} index={i} flip={i % 2 === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Duality */}
      <section className="py-24 border-t border-[var(--color-brand-gold)]/20 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">
          <FadeIn direction="left">
            <div className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)] p-12 lg:p-24 flex flex-col justify-center min-h-[400px]">
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase mb-4 block">{t.dualitySoulLabel}</span>
              <h3 className="font-serif font-bold text-[32px] text-[var(--color-brand-offwhite)] mb-4">
                {t.dualitySoulHeading.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h3>
              <p className="font-sans text-[var(--color-brand-graylight)]">{t.dualitySoulBody}</p>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="bg-[var(--color-brand-gold)] p-12 lg:p-24 flex flex-col justify-center min-h-[400px]">
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-navy)] uppercase mb-4 block">{t.dualityVisionLabel}</span>
              <h3 className="font-serif font-bold text-[32px] text-[var(--color-brand-navy)] mb-4">
                {t.dualityVisionHeading.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h3>
              <p className="font-sans text-[#4A3D22]">{t.dualityVisionBody}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="py-32">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <FadeIn direction="scale" duration={800}>
            <blockquote className="gold-shimmer font-serif italic text-[32px] md:text-[40px] leading-snug text-balance">
              {t.quote2}
            </blockquote>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
