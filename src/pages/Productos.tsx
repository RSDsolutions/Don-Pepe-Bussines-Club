import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Fish, PackageCheck, ShieldCheck, Snowflake, CreditCard, Truck } from "lucide-react";
import { FadeIn, staggerDelay } from "@/components/FadeIn";
import { PageHero } from "@/components/PageHero";
import { useLang } from "@/contexts/LangContext";
import { useCart } from "@/contexts/CartContext";
import { useStoreProducts } from "@/lib/store";
import { slugify, money } from "@/lib/format";

const standardIcons = [PackageCheck, Snowflake, ShieldCheck];
const atmIcons = [CreditCard, Truck, ShieldCheck];

const exportImgs = [
  "https://images.pexels.com/photos/30893343/pexels-photo-30893343.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/5149342/pexels-photo-5149342.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/4109751/pexels-photo-4109751.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/35585310/pexels-photo-35585310.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/31437952/pexels-photo-31437952.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
];

const seafoodImgs = [
  "https://images.pexels.com/photos/8352346/pexels-photo-8352346.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/33211047/pexels-photo-33211047.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/30648997/pexels-photo-30648997.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
  "https://images.pexels.com/photos/3903587/pexels-photo-3903587.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1",
];

export function Productos() {
  const { T, lang } = useLang();
  const t = T.productos;
  const importProds = T.import.products;
  const seafoodProds = T.seafood.products;

  // Live catalog from the database, with graceful fallback to static copy.
  const store = useStoreProducts(lang);

  const importList = store.hasData
    ? store.importProducts.map((p) => ({
        name: p.name, desc: p.description, tag: p.tag, img: p.image, price: p.price, slug: p.slug,
      }))
    : importProds.map((prod, i) => ({
        name: prod.name, desc: prod.desc, tag: "Don Pepe Import", img: exportImgs[i], price: 120, slug: slugify(prod.name),
      }));

  const seafoodList = store.hasData
    ? store.seafoodProducts.map((p) => ({
        name: p.name, desc: p.description, tag: p.tag, img: p.image, price: p.price, slug: p.slug,
      }))
    : seafoodProds.map((prod, i) => ({
        name: prod.name, desc: prod.desc, tag: "Don Pepe Sea Food", img: seafoodImgs[i], price: 175, slug: slugify(prod.name),
      }));

  return (
    <div className="w-full bg-[var(--color-brand-black)]">
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        imageUrl="https://images.pexels.com/photos/4109751/pexels-photo-4109751.jpeg?auto=compress&cs=tinysrgb&w=1920"
        imageAlt="Premium Ecuadorian products"
      />

      <section className="theme-dark py-16 bg-[var(--color-brand-navy)] border-b border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.standards.map((std, i) => {
            const Icon = standardIcons[i];
            return (
              <FadeIn key={i} delay={staggerDelay(i)} direction="up">
                <div className="h-full border border-[var(--color-brand-gold)]/20 p-6 flex gap-4 items-start bg-[var(--color-brand-navymid)]/40">
                  <div className="w-12 h-12 rounded-full border border-[var(--color-brand-gold)]/30 flex items-center justify-center text-[var(--color-brand-gold)] shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-[18px] text-[var(--color-brand-offwhite)] mb-2">{std.title}</h3>
                    <p className="font-sans text-[14px] text-[var(--color-brand-graylight)] leading-relaxed">{std.text}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Import Products */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16">
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block mb-4">
              {t.importEyebrow}
            </span>
            <h2 className="font-serif font-bold text-[42px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0]">
              {t.importHeading}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {importList.map((prod, i) => (
              <ProductCard key={prod.slug || i} name={prod.name} desc={prod.desc} tag={prod.tag} img={prod.img} price={prod.price} slug={prod.slug} delay={staggerDelay(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Seafood Products */}
      <section className="theme-dark py-24 md:py-32 bg-[var(--color-brand-navy)] border-y border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-16">
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block mb-4">
              {t.seafoodEyebrow}
            </span>
            <h2 className="font-serif font-bold text-[42px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0]">
              {t.seafoodHeading}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {seafoodList.map((prod, i) => (
              <ProductCard key={prod.slug || i} name={prod.name} desc={prod.desc} tag={prod.tag} img={prod.img} price={prod.price} slug={prod.slug} delay={staggerDelay(i)} dark />
            ))}
          </div>
        </div>
      </section>

      {/* ATM */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
            <FadeIn direction="left">
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block mb-4">
                {t.atmEyebrow}
              </span>
              <h2 className="font-serif font-bold text-[42px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0] mb-6">
                {t.atmHeading}
              </h2>
              <p className="font-sans text-[17px] text-[var(--color-brand-graylight)] leading-relaxed mb-8">
                {t.atmBody}
              </p>
              <Link
                to="/atm"
                className="inline-flex items-center gap-2 font-sans font-semibold text-sm uppercase tracking-widest text-[var(--color-brand-gold)] hover:text-[var(--color-brand-goldlight)] transition-colors"
              >
                {t.atmCta} <ArrowRight size={18} />
              </Link>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.atmServices.map((svc, i) => {
                const Icon = atmIcons[i];
                return (
                  <FadeIn key={i} delay={staggerDelay(i)} direction="up">
                    <div className="h-full bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/25 p-8 flex flex-col gap-5 hover:border-[var(--color-brand-gold)] transition-colors">
                      <div className="w-14 h-14 rounded-full bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/25 flex items-center justify-center text-[var(--color-brand-gold)]">
                        <Icon size={24} />
                      </div>
                      <h3 className="font-serif text-[28px] leading-none text-[var(--color-brand-offwhite)]">{svc.name}</h3>
                      <p className="font-sans text-[14px] text-[var(--color-brand-graylight)] leading-relaxed">{svc.desc}</p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="theme-dark py-24 bg-[var(--color-brand-navy)] border-t border-[var(--color-brand-gold)]/20">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <FadeIn>
            <Fish className="w-12 h-12 text-[var(--color-brand-gold)] mx-auto mb-6" />
            <h2 className="font-serif font-bold text-[38px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0] mb-6">
              {t.ctaHeading}
            </h2>
            <p className="font-sans text-[16px] md:text-[18px] text-[var(--color-brand-graylight)] leading-relaxed mb-10">
              {t.ctaBody}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <a
                href="https://wa.me/14073743951"
                target="_blank"
                rel="noreferrer"
                className="bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105"
              >
                {t.ctaWhatsapp}
              </a>
              <Link
                to="/contacto"
                className="border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-[rgba(239,184,16,0.08)]"
              >
                {t.ctaContact}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ name, desc, tag, img, delay, price = 120, slug: slugProp, dark = false }: {
  key?: any;
  name: string; desc: string; tag: string; img: string; delay: number; price?: number; slug?: string; dark?: boolean;
}) {
  const slug = slugProp || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    addToCart({
      id: slug,
      name,
      price,
      image: img,
      quantity: 1,
      tag
    });
  };

  return (
    <FadeIn delay={delay} direction="up">
      <Link to={`/producto/${slug}`} className="block h-[420px] sm:h-[460px]">
        <div
          className="group relative w-full h-full overflow-hidden rounded-none border border-[var(--color-brand-gold)]/20 bg-[var(--color-brand-black)] shadow-lg transition-all duration-500 ease-in-out hover:shadow-[0_20px_40px_rgba(239,184,16,0.15)] hover:-translate-y-2"
        >
          {/* Background Image with Zoom Effect on Hover */}
          <img
            src={img}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-500 group-hover:opacity-100"></div>

          {/* Content Container */}
          <div className="relative flex h-full flex-col justify-between p-6">
            {/* Top Section: Tag */}
            <div className="flex h-12 items-start">
               <div className="flex px-4 py-1.5 items-center justify-center rounded-none border border-white/30 bg-black/30 backdrop-blur-md">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-[var(--color-brand-gold)]">{tag}</span>
               </div>
            </div>
            
            {/* Middle Section: Details (slides up on hover) */}
            <div className="space-y-3 transition-transform duration-500 ease-in-out group-hover:-translate-y-20">
              <div>
                <h3 className="text-2xl sm:text-[28px] leading-tight font-serif font-bold text-white drop-shadow-md line-clamp-2">{name}</h3>
                <p className="text-sm text-white/80 mt-2 font-medium tracking-wide">DON PEPE</p>
              </div>
              <div className="pt-2">
                <h4 className="font-semibold text-white/90 text-xs tracking-wider mb-2 uppercase">Descripción</h4>
                <p className="text-[13px] text-white/70 leading-relaxed line-clamp-3">
                  {desc || "Producto premium de alta calidad importado desde Ecuador, seleccionado bajo los más estrictos estándares para ti."}
                </p>
              </div>
            </div>

            {/* Bottom Section: Price and Button (revealed on hover) */}
            <div className="absolute -bottom-24 left-0 w-full p-6 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100">
              <div className="flex items-end justify-between border-t border-white/20 pt-5">
                <div className="flex flex-col">
                  <span className="text-white/70 text-[10px] uppercase tracking-widest font-semibold mb-1">Por paca (50 uds)</span>
                  <span className="text-3xl font-serif font-bold text-[var(--color-brand-gold)] drop-shadow-sm">{money(price)}</span>
                </div>
                <button 
                  onClick={handleAdd} 
                  className="flex items-center justify-center gap-2 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-5 py-3 rounded-none text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--color-brand-goldlight)] hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
                >
                  Añadir <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}
