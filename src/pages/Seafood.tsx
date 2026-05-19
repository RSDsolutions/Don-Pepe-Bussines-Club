import { FadeIn, staggerDelay } from "@/components/FadeIn";
import { Star } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useLang } from "@/contexts/LangContext";

export function Seafood() {
  const { T } = useLang();
  const t = T.seafood;
  return (
    <div className="w-full bg-[var(--color-brand-black)]">
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        imageUrl="https://images.pexels.com/photos/8352778/pexels-photo-8352778.jpeg?auto=compress&cs=tinysrgb&w=1920"
        imageAlt="Fresh seafood from the Ecuadorian market"
      />

      {/* Quality Badges */}
      <section className="py-16 bg-[var(--color-brand-navy)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {t.badges.map((badge, i) => (
              <FadeIn key={i} delay={staggerDelay(i)} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--color-brand-teal)]" />
                <span className="font-sans text-[14px] uppercase tracking-wider text-[var(--color-brand-graylight)]">{badge}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16 md:mb-24 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-[var(--color-brand-teal)]" />
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-teal)] uppercase cursor-default">
                {t.productsEyebrow}
              </span>
              <div className="w-8 h-[1px] bg-[var(--color-brand-teal)]" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {[
              { ...t.products[0], img: "https://images.pexels.com/photos/8352346/pexels-photo-8352346.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" },
              { ...t.products[1], img: "https://images.pexels.com/photos/33211047/pexels-photo-33211047.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" },
              { ...t.products[2], img: "https://images.pexels.com/photos/30648997/pexels-photo-30648997.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" },
              { ...t.products[3], img: "https://images.pexels.com/photos/3903587/pexels-photo-3903587.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" },
            ].map((prod, i) => (
              <FadeIn key={i} delay={staggerDelay(i)} direction="up">
                <div
                  className="group flex flex-col h-full bg-[var(--color-brand-navy)] border border-[var(--color-brand-teal)]/30 transition-all duration-300 hover:border-[var(--color-brand-teal)] hover:shadow-[0_0_0_1px_rgba(239,184,16,0.5),0_16px_40px_rgba(239,184,16,0.08)]"
                  style={{ minHeight: '420px' }}
                >
                  <div className="h-[240px] relative overflow-hidden border-b border-[var(--color-brand-teal)]/30">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" loading="lazy" />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to top, rgba(239,184,16,0.25), transparent)' }}
                    />
                  </div>
                  <div className="p-10 flex-grow flex flex-col items-start gap-4">
                    <span className="px-3 py-1 rounded-sm bg-[var(--color-brand-navymid)] border border-[var(--color-brand-teal)]/50 group-hover:border-[var(--color-brand-teal)] group-hover:bg-[var(--color-brand-teal)]/10 text-[10px] font-semibold font-sans uppercase tracking-[0.1em] text-[var(--color-brand-teal)] transition-all duration-300">
                      {prod.badge}
                    </span>
                    <h3 className="font-serif font-bold text-[32px] leading-none text-[var(--color-brand-offwhite)] group-hover:text-[var(--color-brand-teal)] transition-colors duration-300 mt-2">
                      {prod.name}
                    </h3>
                    <p className="font-sans text-[16px] leading-relaxed text-[var(--color-brand-graylight)]">
                      {prod.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[var(--color-brand-black)] border-t border-[var(--color-brand-teal)]/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16">
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-teal)] uppercase block mb-4">
              {t.testimonialsEyebrow}
            </span>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
            {t.testimonials.map((tm, i) => (
              <FadeIn key={i} delay={staggerDelay(i)} direction="up">
                <div className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-teal)]/30 p-8 h-full flex flex-col justify-between hover:border-[var(--color-brand-teal)]/80 transition-colors">
                  <div>
                    <div className="flex gap-1 mb-6 text-[var(--color-brand-teal)]">
                      {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
                    </div>
                    <blockquote className="font-serif italic text-2xl text-[var(--color-brand-offwhite)] leading-snug mb-8">
                      "{tm.quote}"
                    </blockquote>
                  </div>
                  <div>
                    <div className="font-sans text-[var(--color-brand-teal)] font-medium text-sm tracking-wide">{tm.name}</div>
                    <div className="font-sans text-xs text-[var(--color-brand-graylight)] mt-1">{tm.role}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Route Display */}
      <section className="py-24 bg-[var(--color-brand-navy)] border-y border-[var(--color-brand-teal)]/20 text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif font-bold text-[36px] md:text-[56px] text-[var(--color-brand-offwhite)] mb-6">
              {T.common.ecuador} <span className="text-[var(--color-brand-teal)]">→</span> {T.common.usa}
            </h2>
            <div className="flex justify-center mb-6">
              <svg className="w-12 h-12 text-[var(--color-brand-teal)] anchor-watermark" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)]">
              {t.routeBody}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Card */}
      <section className="py-24 md:py-32">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <FadeIn className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-teal)] p-12 relative overflow-hidden">
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] text-[var(--color-brand-navy)] uppercase bg-[var(--color-brand-teal)] px-4 py-2 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md">{T.common.directSupport}</span>
            <h3 className="font-serif text-[32px] text-[var(--color-brand-offwhite)] mb-4 mt-6">{t.cardHeading}</h3>
            <p className="font-sans text-[var(--color-brand-graylight)] mb-10">{t.cardBody}</p>
            <div className="flex flex-col gap-6 text-left border-y border-[var(--color-brand-teal)]/20 py-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <span className="text-[20px]">📧</span>
                <a href="mailto:info@donpepeseafood.com" className="font-sans font-medium text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-teal)] transition-colors">info@donpepeseafood.com</a>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <span className="text-[20px]">📞</span>
                <a href="tel:+14073743951" className="font-sans font-medium text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-teal)] transition-colors">+1 407 374 3951</a>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <span className="text-[20px]">🌐</span>
                <a href="https://donpepeseafood.com" target="_blank" rel="noreferrer" className="font-sans font-medium text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-teal)] transition-colors">donpepeseafood.com</a>
              </div>
            </div>
            <a
              href="https://wa.me/14073743951"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-10 py-4 w-full rounded-full bg-[var(--color-brand-teal)] text-[var(--color-brand-navy)] font-sans font-semibold uppercase tracking-widest hover:scale-105 transition-all duration-300"
            >
              {T.common.whatsappBtn}
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
