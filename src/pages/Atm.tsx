import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { FadeIn, staggerDelay } from "@/components/FadeIn";
import { PageHero } from "@/components/PageHero";

function AtmIllustration() {
  return (
    <div className="w-full h-full bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/30 flex items-center justify-center">
      <div className="flex flex-col items-center" style={{ width: '160px', gap: '0' }}>
        {/* Machine body */}
        <div
          className="w-full bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 rounded-t-sm flex flex-col items-center"
          style={{ height: '220px', padding: '16px', gap: '12px' }}
        >
          {/* Screen */}
          <div
            className="w-full bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/40 rounded-sm flex items-center justify-center flex-shrink-0"
            style={{ height: '100px' }}
          >
            <div className="w-3/4 h-1 bg-[var(--color-brand-gold)]/20 rounded-full" />
          </div>
          {/* Card slot */}
          <div className="w-3/4 flex-shrink-0" style={{ height: '2px', background: 'rgba(201,148,58,0.4)', borderRadius: '2px' }} />
          {/* Keypad */}
          <div
            className="grid flex-shrink-0"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full bg-[var(--color-brand-gold)]/20 border border-[var(--color-brand-gold)]/30"
                style={{ width: '14px', height: '14px' }}
              />
            ))}
          </div>
        </div>
        {/* Base */}
        <div
          className="bg-[var(--color-brand-gold)]/20 rounded-b-sm"
          style={{ width: '83.33%', height: '12px' }}
        />
        {/* Stand */}
        <div
          className="bg-[var(--color-brand-gold)]/10"
          style={{ width: '50%', height: '8px' }}
        />
      </div>
    </div>
  );
}

export function Atm() {
  return (
    <div className="w-full bg-[var(--color-brand-black)]">
      <PageHero
        eyebrow="Don Pepe ATM"
        title="ATM SOLUTIONS"
        subtitle="Tecnología financiera con esencia humana"
        imageUrl="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920"
        imageAlt="Servicios financieros y tecnología"
      />

      {/* Services Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Depósitos", desc: "Gestión segura y rápida." },
              { name: "Retiros", desc: "Disponibilidad garantizada de efectivo." },
              { name: "Débito", desc: "Procesamiento de transacciones eficiente." },
              { name: "Soporte empresarial", desc: "Atención dedicada a locales comerciales." }
            ].map((service, i) => (
              <FadeIn key={service.name} delay={staggerDelay(i)} direction="up">
                <div className="p-8 border-t border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-navy)] h-full flex flex-col gap-4 hover:bg-[var(--color-brand-navymid)] transition-colors">
                  <h3 className="font-sans font-semibold text-[20px] text-[var(--color-brand-offwhite)]">
                    {service.name}
                  </h3>
                  <p className="font-sans text-[14px] text-[var(--color-brand-graylight)]">
                    {service.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnología con Valores */}
      <section className="py-24 bg-[var(--color-brand-black)] border-t border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <FadeIn>
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase mb-6 block" style={{ fontVariant: 'small-caps' }}>
                NUESTRA FILOSOFÍA
              </span>
              <h2 className="font-serif font-bold text-[36px] md:text-[48px] text-[var(--color-brand-offwhite)] mb-8 leading-[1.1]">
                Tecnología moderna,<br />valores de siempre
              </h2>
              <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] leading-[1.75] mb-8">
                En Don Pepe ATM combinamos la eficiencia de la tecnología financiera moderna con los valores que han definido al grupo desde los años 70: confianza, compromiso y atención personalizada. Cada terminal que instalamos es una extensión de nuestra forma de hacer negocios.
              </p>
              <Link
                to="/historia"
                className="inline-flex items-center gap-2 font-sans font-medium text-[var(--color-brand-gold)] hover:text-[var(--color-brand-offwhite)] transition-colors group"
              >
                Conoce el grupo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeIn>
          </div>
          <div className="md:w-1/2 w-full">
            <FadeIn direction="right" className="w-full h-[400px]">
              <AtmIllustration />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Cobertura */}
      <section className="py-24 bg-[var(--color-brand-navy)] border-y border-[var(--color-brand-gold)]/20 text-center">
        <div className="max-w-[1000px] mx-auto px-6">
          <FadeIn>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block mb-6">
              COBERTURA
            </span>
            <div className="text-[64px] mb-6">🇺🇸</div>
            <h2 className="font-serif font-bold text-[var(--color-brand-offwhite)] mb-6" style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.1 }}>
              Operamos en<br />Estados Unidos
            </h2>
            <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] mb-12 max-w-[600px] mx-auto">
              Instalación, mantenimiento y reposición de efectivo para negocios en todo el territorio estadounidense.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Instalación", "Mantenimiento", "Soporte 24/7", "Reposición de efectivo"].map((pill) => (
                <span
                  key={pill}
                  className="px-5 py-2 border border-[var(--color-brand-gold)]/30 rounded-full text-sm font-sans text-[var(--color-brand-graylight)] hover:border-[var(--color-brand-gold)] transition-colors cursor-default"
                >
                  {pill}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-24 bg-[var(--color-brand-black)] border-t border-[var(--color-brand-gold)]/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16">
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block mb-4">
              CASOS DE ÉXITO
            </span>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
            {[
              {
                quote: "El equipo de soporte 24/7 siempre responde al instante. Tener el ATM operativo y abastecido nos quitó un gran dolor de cabeza.",
                name: "Miguel O.",
                role: "Propietario, Sunset Supermarket"
              },
              {
                quote: "La transparencia en las ganancias y el mantenimiento rápido son clave. Totalmente recomendados.",
                name: "Sarah W.",
                role: "Gerente, Route 66 Gas Station"
              }
            ].map((t, i) => (
              <FadeIn key={i} delay={staggerDelay(i)} direction="up">
                <div className="bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)]/30 p-8 h-full flex flex-col justify-between hover:border-[var(--color-brand-gold)] transition-colors">
                  <div>
                    <div className="flex gap-1 mb-6 text-[var(--color-brand-gold)]">
                      {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
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

      {/* Contacto Card */}
      <section className="py-24 md:py-32">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <FadeIn className="bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)] p-12 relative overflow-hidden">
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] text-[var(--color-brand-navy)] uppercase bg-[var(--color-brand-gold)] px-4 py-2 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md">Atención directa · Lunes a Sábado</span>
            <h3 className="font-serif text-[32px] text-[var(--color-brand-offwhite)] mb-4 mt-6">Soporte Técnico VIP</h3>
            <p className="font-sans text-[var(--color-brand-graylight)] mb-10">
              Servicio exclusivo de instalación y mantenimiento a nivel nacional.
            </p>
            <div className="flex flex-col gap-6 text-left border-y border-[var(--color-brand-gold)]/20 py-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <span className="text-[20px]">📧</span>
                <a href="mailto:info@donpepebussinessgroup.com" className="font-sans font-medium text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)] transition-colors">info@donpepebussinessgroup.com</a>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <span className="text-[20px]">📞</span>
                <a href="tel:+14073743951" className="font-sans font-medium text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)] transition-colors">+1 407 374 3951</a>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <span className="text-[20px]">🌐</span>
                <a href="https://donpepebussinessgroup.com" target="_blank" rel="noreferrer" className="font-sans font-medium text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)] transition-colors">donpepebussinessgroup.com</a>
              </div>
            </div>
            <a
              href="https://wa.me/14073743951"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-10 py-4 w-full rounded-full bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] font-sans font-semibold uppercase tracking-widest hover:scale-105 transition-all duration-300"
            >
              Atención WhatsApp
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
