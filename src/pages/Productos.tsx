import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, Fish, PackageCheck, ShieldCheck, Snowflake, Truck } from "lucide-react";
import { FadeIn, staggerDelay } from "@/components/FadeIn";
import { AnchorMark } from "@/components/icons";
import { PageHero } from "@/components/PageHero";

const exportProducts = [
  {
    name: "Yuca empacada al vacío",
    desc: "Selección premium lista para retail, food service y distribución.",
    tag: "Don Pepe Import",
    img: "https://images.pexels.com/photos/30893343/pexels-photo-30893343.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  },
  {
    name: "Chifle premium",
    desc: "Snack ecuatoriano de plátano verde con empaque para mercado internacional.",
    tag: "Don Pepe Import",
    img: "https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  },
  {
    name: "Pasta de maní orgánica",
    desc: "Producto natural, estable y versátil para canales especializados.",
    tag: "Don Pepe Import",
    img: "https://images.pexels.com/photos/5149342/pexels-photo-5149342.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  },
  {
    name: "Café premium",
    desc: "Granos de altura con perfil aromático para compradores exigentes.",
    tag: "Don Pepe Import",
    img: "https://images.pexels.com/photos/4109751/pexels-photo-4109751.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  },
  {
    name: "Cacao de finca",
    desc: "Origen ecuatoriano, ideal para chocolatería, manufactura y exportación.",
    tag: "Don Pepe Import",
    img: "https://images.pexels.com/photos/35585310/pexels-photo-35585310.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  },
  {
    name: "Especias naturales",
    desc: "Sabores auténticos de nuestra tierra para cocinas y marcas privadas.",
    tag: "Don Pepe Import",
    img: "https://images.pexels.com/photos/31437952/pexels-photo-31437952.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  },
];

const seafoodProducts = [
  {
    name: "Albacora",
    desc: "Pesca selectiva, formatos fresco y congelado para distribución.",
    tag: "Don Pepe Sea Food",
    img: "https://images.pexels.com/photos/8352346/pexels-photo-8352346.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  },
  {
    name: "Camarón",
    desc: "Tallas premium, cadena de frío controlada y calidad de exportación.",
    tag: "Don Pepe Sea Food",
    img: "https://images.pexels.com/photos/33211047/pexels-photo-33211047.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  },
  {
    name: "Calamar",
    desc: "Producto procesado en planta para compradores mayoristas.",
    tag: "Don Pepe Sea Food",
    img: "https://images.pexels.com/photos/30648997/pexels-photo-30648997.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  },
  {
    name: "Mariscos varios",
    desc: "Variedad del mar ecuatoriano con abastecimiento para USA.",
    tag: "Don Pepe Sea Food",
    img: "https://images.pexels.com/photos/3903587/pexels-photo-3903587.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  },
];

const atmSolutions = [
  {
    Icon: CreditCard,
    name: "ATM para negocios",
    desc: "Terminales para comercios en Estados Unidos con operación y soporte.",
  },
  {
    Icon: Truck,
    name: "Reposición de efectivo",
    desc: "Gestión de efectivo para mantener la disponibilidad del servicio.",
  },
  {
    Icon: ShieldCheck,
    name: "Mantenimiento técnico",
    desc: "Soporte preventivo y correctivo para operación continua.",
  },
];

const standards = [
  { Icon: PackageCheck, title: "Empaque comercial", text: "Formatos pensados para distribución, retail y mayoristas." },
  { Icon: Snowflake, title: "Cadena de frío", text: "Control de frescura para productos del mar y perecibles." },
  { Icon: ShieldCheck, title: "Cumplimiento", text: "Procesos alineados con importación y operación en USA." },
];

export function Productos() {
  return (
    <div className="w-full bg-[var(--color-brand-black)]">
      <PageHero
        eyebrow="Catálogo Directo"
        title="PRODUCTOS"
        subtitle="Del grupo, listos para hacer negocio"
        imageUrl="https://images.pexels.com/photos/4109751/pexels-photo-4109751.jpeg?auto=compress&cs=tinysrgb&w=1920"
        imageAlt="Productos ecuatorianos premium"
      />

      <section className="theme-dark py-16 bg-[var(--color-brand-navy)] border-b border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {standards.map(({ Icon, title, text }, i) => (
            <FadeIn key={title} delay={staggerDelay(i)} direction="up">
              <div className="h-full border border-[var(--color-brand-gold)]/20 p-6 flex gap-4 items-start bg-[var(--color-brand-navymid)]/40">
                <div className="w-12 h-12 rounded-full border border-[var(--color-brand-gold)]/30 flex items-center justify-center text-[var(--color-brand-gold)] shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-[18px] text-[var(--color-brand-offwhite)] mb-2">{title}</h3>
                  <p className="font-sans text-[14px] text-[var(--color-brand-graylight)] leading-relaxed">{text}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16">
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block mb-4">
              DON PEPE IMPORT
            </span>
            <h2 className="font-serif font-bold text-[42px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0]">
              Productos ecuatorianos
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exportProducts.map((product, i) => (
              <ProductCard key={product.name} product={product} delay={staggerDelay(i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="theme-dark py-24 md:py-32 bg-[var(--color-brand-navy)] border-y border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16">
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block mb-4">
              DON PEPE SEA FOOD
            </span>
            <h2 className="font-serif font-bold text-[42px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0]">
              Productos del mar
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {seafoodProducts.map((product, i) => (
              <ProductCard key={product.name} product={product} delay={staggerDelay(i)} dark />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
            <FadeIn direction="left">
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block mb-4">
                DON PEPE ATM
              </span>
              <h2 className="font-serif font-bold text-[42px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0] mb-6">
                Soluciones para comercios
              </h2>
              <p className="font-sans text-[17px] text-[var(--color-brand-graylight)] leading-relaxed mb-8">
                Además de productos de exportación, el grupo ofrece infraestructura ATM para negocios que necesitan generar flujo, servicio al cliente y disponibilidad de efectivo.
              </p>
              <Link
                to="/atm"
                className="inline-flex items-center gap-2 font-sans font-semibold text-sm uppercase tracking-widest text-[var(--color-brand-gold)] hover:text-[var(--color-brand-goldlight)] transition-colors"
              >
                Ver división ATM <ArrowRight size={18} />
              </Link>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {atmSolutions.map(({ Icon, name, desc }, i) => (
                <FadeIn key={name} delay={staggerDelay(i)} direction="up">
                  <div className="h-full bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/25 p-8 flex flex-col gap-5 hover:border-[var(--color-brand-gold)] transition-colors">
                    <div className="w-14 h-14 rounded-full bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/25 flex items-center justify-center text-[var(--color-brand-gold)]">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-serif text-[28px] leading-none text-[var(--color-brand-offwhite)]">{name}</h3>
                    <p className="font-sans text-[14px] text-[var(--color-brand-graylight)] leading-relaxed">{desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="theme-dark py-24 bg-[var(--color-brand-navy)] border-t border-[var(--color-brand-gold)]/20">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <FadeIn>
            <Fish className="w-12 h-12 text-[var(--color-brand-gold)] mx-auto mb-6" />
            <h2 className="font-serif font-bold text-[38px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0] mb-6">
              ¿Quieres cotizar un producto?
            </h2>
            <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] leading-relaxed mb-10">
              Escríbenos y te conectamos con la división correcta según producto, volumen, destino y canal de distribución.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <a
                href="https://wa.me/14073743951"
                target="_blank"
                rel="noreferrer"
                className="bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105"
              >
                Cotizar por WhatsApp
              </a>
              <Link
                to="/contacto"
                className="border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-[rgba(239,184,16,0.08)]"
              >
                Contacto comercial
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

function ProductCard({
  product,
  delay,
  dark = false,
}: {
  product: { name: string; desc: string; tag: string; img: string };
  delay: number;
  dark?: boolean;
}) {
  return (
    <FadeIn delay={delay} direction="up">
      <article
        className={[
          "group h-full overflow-hidden border transition-all duration-300",
          dark
            ? "bg-[var(--color-brand-navymid)] border-[var(--color-brand-gold)]/25 hover:border-[var(--color-brand-gold)]"
            : "bg-[var(--color-brand-black)] border-[var(--color-brand-gold)]/25 hover:border-[var(--color-brand-gold)] hover:shadow-[0_16px_40px_rgba(239,184,16,0.08)]",
        ].join(" ")}
      >
        <div className="h-[250px] overflow-hidden relative">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(58,58,58,0.65)] via-transparent to-transparent" />
        </div>
        <div className="p-8">
          <span className="inline-flex mb-4 px-3 py-1 rounded-sm border border-[var(--color-brand-gold)]/40 text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-gold)]">
            {product.tag}
          </span>
          <h3 className="font-serif font-bold text-[30px] leading-none text-[var(--color-brand-offwhite)] mb-4">
            {product.name}
          </h3>
          <p className="font-sans text-[15px] leading-relaxed text-[var(--color-brand-graylight)]">
            {product.desc}
          </p>
        </div>
      </article>
    </FadeIn>
  );
}
