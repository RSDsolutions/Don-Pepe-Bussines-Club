import { Link } from "react-router-dom";
import { FadeIn, staggerDelay } from "@/components/FadeIn";
import { AnchorMark } from "@/components/icons";
import { CheckCircle, Package, Globe, Award, Star } from "lucide-react";
import { PageHero } from "@/components/PageHero";

const features = [
  { Icon: CheckCircle, title: "Productos certificados", desc: "Cumplimos con todas las normativas de importación y exportación de Ecuador y USA." },
  { Icon: Package, title: "Envíos seguros y puntuales", desc: "Cadena logística optimizada desde el origen hasta el destino." },
  { Icon: Award, title: "Calidad premium garantizada", desc: "Selección rigurosa de cada producto antes de ser empacado." },
  { Icon: Globe, title: "Relación a largo plazo", desc: "No somos un proveedor más. Somos tu socio de confianza." },
];

export function Import() {
  return (
    <div className="w-full bg-[var(--color-brand-black)]">
      <PageHero
        eyebrow="Don Pepe Import"
        title="IMPORTACIÓN"
        subtitle="Calidad que cruza fronteras"
        imageUrl="https://images.pexels.com/photos/32921658/pexels-photo-32921658.jpeg?auto=compress&cs=tinysrgb&w=1920"
        imageAlt="Productos ecuatorianos premium de exportación"
      />

      {/* Products Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16 md:mb-24 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-[var(--color-brand-gold)]" />
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase">
                NUESTROS PRODUCTOS
              </span>
              <div className="w-8 h-[1px] bg-[var(--color-brand-gold)]" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              { name: "Yuca empacada al vacío", desc: "Selección premium, lista para el consumo.", img: "https://images.pexels.com/photos/30893343/pexels-photo-30893343.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" },
              { name: "Chifle premium", desc: "Snack de plátano verde con sal marina.", img: "https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" },
              { name: "Pasta de maní orgánica", desc: "100% natural, sin aditivos.", img: "https://images.pexels.com/photos/5149342/pexels-photo-5149342.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" },
              { name: "Café premium", desc: "Granos de altura cultivados en fincas exclusivas.", img: "https://images.pexels.com/photos/4109751/pexels-photo-4109751.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" },
              { name: "Cacao de finca", desc: "Origen único, aroma y sabor incomparable.", img: "https://images.pexels.com/photos/35585310/pexels-photo-35585310.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" },
              { name: "Especias naturales", desc: "El toque auténtico de nuestra tierra.", img: "https://images.pexels.com/photos/31437952/pexels-photo-31437952.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1" }
            ].map((prod, i) => (
              <FadeIn key={prod.name} delay={staggerDelay(i)} direction="up">
                <div className="group flex flex-col h-full bg-[var(--color-brand-navy)] border border-[var(--color-brand-goldmuted)]/50 transition-all duration-300 hover:border-[var(--color-brand-gold)] hover:shadow-[0_0_0_1px_rgba(239,184,16,0.6),0_16px_40px_rgba(239,184,16,0.08)]">
                  <div className="h-[240px] relative overflow-hidden border-b border-[var(--color-brand-goldmuted)]/50">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" loading="lazy" />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(to top, rgba(239,184,16,0.25), transparent)' }}
                    />
                  </div>
                  <div className="p-8 flex-grow flex flex-col items-start gap-4">
                    <span className="px-3 py-1 rounded-sm border border-[var(--color-brand-gold)]/50 group-hover:border-[var(--color-brand-gold)] group-hover:bg-[var(--color-brand-gold)]/10 text-[10px] font-semibold font-sans uppercase tracking-[0.15em] text-[var(--color-brand-gold)] transition-all duration-300">
                      100% Ecuatoriano
                    </span>
                    <h3 className="font-serif font-bold text-[28px] leading-none text-[var(--color-brand-offwhite)] group-hover:text-[var(--color-brand-goldlight)] transition-colors duration-300">
                      {prod.name}
                    </h3>
                    <p className="font-sans text-[15px] leading-relaxed text-[var(--color-brand-graylight)]">
                      {prod.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-[var(--color-brand-black)] border-t border-[var(--color-brand-gold)]/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16 md:mb-24 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-[var(--color-brand-gold)]" />
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase">
                ¿POR QUÉ ELEGIR DON PEPE IMPORT?
              </span>
              <div className="w-8 h-[1px] bg-[var(--color-brand-gold)]" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ Icon, title, desc }, i) => (
              <FadeIn key={i} delay={staggerDelay(i)} direction="up">
                <div className="p-8 bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/15 hover:border-[var(--color-brand-gold)] transition-all duration-300 h-full flex flex-col gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--color-brand-gold)]/20">
                    <Icon size={22} className="text-[var(--color-brand-gold)]" />
                  </div>
                  <h3 className="font-sans font-semibold text-[20px] text-[var(--color-brand-offwhite)]">
                    {title}
                  </h3>
                  <p className="font-sans text-[14px] text-[var(--color-brand-graylight)]">
                    {desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
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
                quote: "El cumplimiento aduanero y la calidad del café que recibimos consistentemente hace de Don Pepe nuestro importador estrella.",
                name: "Roberto V.",
                role: "Director Operaciones, G-Foods LLC"
              },
              {
                quote: "Nuestros clientes en USA notan la diferencia. El chifle premium siempre llega intacto y a tiempo.",
                name: "Luisa F.",
                role: "Gerente de Compras, Latin Markets"
              }
            ].map((t, i) => (
              <FadeIn key={i} delay={staggerDelay(i)} direction="up">
                <div className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/20 p-8 h-full flex flex-col justify-between hover:border-[var(--color-brand-gold)]/50 transition-colors">
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

      {/* Route Display */}
      <section className="py-24 bg-[var(--color-brand-navy)] border-y border-[var(--color-brand-gold)]/20 text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <FadeIn>
            <h2 className="font-serif font-bold text-[36px] md:text-[56px] text-[var(--color-brand-offwhite)] mb-6">
              Ecuador <span className="text-[var(--color-brand-gold)]">→</span> Estados Unidos
            </h2>
            <div className="flex justify-center mb-6">
              <AnchorMark className="w-12 h-12 text-[var(--color-brand-gold)] opacity-70 anchor-watermark" />
            </div>
            <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)]">
              Red logística optimizada asegurando que el producto mantenga su frescura e integridad hasta el destino final.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contacto Card */}
      <section className="py-24 md:py-32">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <FadeIn className="bg-[var(--color-brand-navymid)] border border-[var(--color-brand-gold)] p-12 relative overflow-hidden">
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] text-[var(--color-brand-navy)] uppercase bg-[var(--color-brand-gold)] px-4 py-2 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md">Atención directa · Lunes a Sábado</span>
            <h3 className="font-serif text-[32px] text-[var(--color-brand-offwhite)] mb-4 mt-6">¿Distribuyes en USA?</h3>
            <p className="font-sans text-[var(--color-brand-graylight)] mb-10">
              Cotiza al por mayor y sé parte de nuestra red de distribuidores de productos Don Pepe.
            </p>
            <div className="flex flex-col gap-6 text-left border-y border-[var(--color-brand-gold)]/20 py-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <span className="text-[20px]">📧</span>
                <a href="mailto:donpepeimport@gmail.com" className="font-sans font-medium text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)] transition-colors">donpepeimport@gmail.com</a>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <span className="text-[20px]">📞</span>
                <a href="tel:+14073743951" className="font-sans font-medium text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)] transition-colors">+1 407 374 3951</a>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-center md:justify-start">
                <span className="text-[20px]">🌐</span>
                <a href="https://donpepeimport.com" target="_blank" rel="noreferrer" className="font-sans font-medium text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)] transition-colors">donpepeimport.com</a>
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
