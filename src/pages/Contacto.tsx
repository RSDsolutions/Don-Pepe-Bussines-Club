import { useState, type ChangeEvent } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Copy, Instagram, Linkedin, Facebook } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { useLang } from "@/contexts/LangContext";

export function Contacto() {
  const { T } = useLang();
  const t = T.contacto;

  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    pais: t.countryEcuador,
    asunto: "",
    mensaje: ""
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSend = () => {
    const text = t.waMessage(formData.nombre, formData.empresa, formData.pais, formData.asunto, formData.mensaje);
    window.open(`https://wa.me/14073743951?text=${text}`, "_blank");
  };

  return (
    <div className="w-full bg-[var(--color-brand-black)]">
      <PageHero
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        imageUrl="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1920"
        imageAlt="Don Pepe Business team"
      />
      <section className="py-24 md:py-32 border-b border-[var(--color-brand-gold)]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* Left Column */}
            <div className="lg:w-[60%] w-full">
              <FadeIn direction="left">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-sans text-[11px] font-semibold tracking-[0.25em] text-[var(--color-brand-gold)] uppercase block">
                    {t.eyebrow}
                  </span>
                  <div className="w-12 h-[1px] bg-[var(--color-brand-gold)]"></div>
                </div>
                <h2 className="font-serif font-bold text-[42px] md:text-[56px] text-[var(--color-brand-offwhite)] leading-[1.0] mb-12">
                  {t.heading}
                </h2>

                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-[12px] uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.labelName}</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-[var(--color-brand-goldmuted)]/50 py-3 text-[var(--color-brand-navy)] placeholder:text-[var(--color-brand-graymuted)] font-sans focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-[12px] uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.labelCompany}</label>
                      <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-[var(--color-brand-goldmuted)]/50 py-3 text-[var(--color-brand-navy)] placeholder:text-[var(--color-brand-graymuted)] font-sans focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors"
                        placeholder="My Company LLC"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-[12px] uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.labelCountry}</label>
                      <select
                        name="pais"
                        value={formData.pais}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-[var(--color-brand-goldmuted)]/50 py-3 text-[var(--color-brand-navy)] placeholder:text-[var(--color-brand-graymuted)] font-sans focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors appearance-none"
                      >
                        <option value={t.countryEcuador} className="bg-[var(--color-brand-navy)] text-[var(--color-brand-cream)]">{t.countryEcuador}</option>
                        <option value={t.countryUSA} className="bg-[var(--color-brand-navy)] text-[var(--color-brand-cream)]">{t.countryUSA}</option>
                        <option value={t.countryOther} className="bg-[var(--color-brand-navy)] text-[var(--color-brand-cream)]">{t.countryOther}</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-[12px] uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.labelSubject}</label>
                      <input
                        type="text"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-[var(--color-brand-goldmuted)]/50 py-3 text-[var(--color-brand-navy)] placeholder:text-[var(--color-brand-graymuted)] font-sans focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors"
                        placeholder={t.placeholderSubject}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[12px] uppercase tracking-wider text-[var(--color-brand-graylight)]">{t.labelMessage}</label>
                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      rows={4}
                      className="bg-transparent border-b border-[var(--color-brand-goldmuted)]/50 py-3 text-[var(--color-brand-navy)] placeholder:text-[var(--color-brand-graymuted)] font-sans focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors resize-none"
                      placeholder={t.placeholderMessage}
                    ></textarea>
                  </div>

                  <button
                    onClick={handleWhatsAppSend}
                    className="mt-8 bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest transition-transform hover:scale-105 inline-block w-full md:w-auto self-start"
                  >
                    {t.sendBtn}
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right Column */}
            <div className="lg:w-[40%] w-full flex flex-col justify-end">
              <FadeIn direction="up" delay={200} className="bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)] p-10 flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-[12px] uppercase tracking-wider text-[var(--color-brand-gold)]">{t.phoneLabel}</span>
                  <a href="https://wa.me/14073743951" target="_blank" rel="noreferrer" className="font-serif text-[28px] text-[var(--color-brand-white)] hover:text-[var(--color-brand-gold)] transition-colors">
                    +1 (407) 374-3951
                  </a>
                </div>

                <div className="flex flex-col gap-4">
                  <span className="font-sans text-[12px] uppercase tracking-wider text-[var(--color-brand-gold)]">{t.emailsLabel}</span>
                  <div className="flex flex-col">
                    <span className="font-sans text-[12px] text-[var(--color-brand-graylight)]">{t.importLabel}</span>
                    <a href="mailto:donpepeimport@gmail.com" className="font-sans text-[16px] text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)] transition-colors flex items-center justify-between">
                      donpepeimport@gmail.com <Copy size={14} className="text-[var(--color-brand-goldmuted)] opacity-0 hover:opacity-100" />
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-[12px] text-[var(--color-brand-graylight)]">{t.seafoodLabel}</span>
                    <a href="mailto:info@donpepeseafood.com" className="font-sans text-[16px] text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)] transition-colors flex items-center justify-between">
                      info@donpepeseafood.com <Copy size={14} className="text-[var(--color-brand-goldmuted)] opacity-0 hover:opacity-100" />
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-[12px] text-[var(--color-brand-graylight)]">{t.corpLabel}</span>
                    <a href="mailto:info@donpepebussinessgroup.com" className="font-sans text-[16px] text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)] transition-colors flex items-center justify-between">
                      info@donpepebussinessgroup.com <Copy size={14} className="text-[var(--color-brand-goldmuted)] opacity-0 hover:opacity-100" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-8 border-t border-[var(--color-brand-gold)]/20">
                  <a href="#" className="w-12 h-12 rounded-full border border-[var(--color-brand-goldmuted)] flex items-center justify-center text-[var(--color-brand-goldmuted)] hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-navy)] transition-all duration-300">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full border border-[var(--color-brand-goldmuted)] flex items-center justify-center text-[var(--color-brand-goldmuted)] hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-navy)] transition-all duration-300">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full border border-[var(--color-brand-goldmuted)] flex items-center justify-center text-[var(--color-brand-goldmuted)] hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-navy)] transition-all duration-300">
                    <Facebook size={20} />
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
