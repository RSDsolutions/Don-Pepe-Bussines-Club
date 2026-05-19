import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook, MessageCircle } from "lucide-react";
import { Logo } from "./icons";

export function Footer() {
  return (
    <footer className="bg-[var(--color-brand-navy)] border-t border-[var(--color-brand-gold)] border-opacity-15 pb-8">
      <div className="divider-gold" />
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="flex flex-col items-start">
            <div className="w-20 h-20 mb-6 transition-transform duration-300 hover:scale-105">
              <Logo className="w-full h-full" />
            </div>
            <p className="font-serif italic text-xl text-[var(--color-brand-graylight)] max-w-sm">
              "Desde los años 70 construyendo tradición y trabajo"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-sans font-medium text-xs tracking-widest uppercase text-[var(--color-brand-gold)] mb-2">Compañía</h4>
              <Link to="/" className="font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] transition-colors">Inicio</Link>
              <Link to="/historia" className="font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] transition-colors">Historia</Link>
              <Link to="/productos" className="font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] transition-colors">Productos</Link>
              <Link to="/contacto" className="font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] transition-colors">Contacto</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-sans font-medium text-xs tracking-widest uppercase text-[var(--color-brand-gold)] mb-2">Empresas</h4>
              <Link to="/import" className="font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] transition-colors">Don Pepe Import</Link>
              <Link to="/seafood" className="font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-teal)] transition-colors">Don Pepe Sea Food</Link>
              <Link to="/atm" className="font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] transition-colors">Don Pepe ATM</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-sans font-medium text-xs tracking-widest uppercase text-[var(--color-brand-gold)] mb-2">Contacto</h4>
            <a href="mailto:info@donpepebussinessgroup.com" className="font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] transition-colors">info@donpepebussinessgroup.com</a>
            <a href="https://wa.me/14073743951" target="_blank" rel="noreferrer" className="font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] transition-colors">+1 (407) 374-3951</a>

            <div className="flex items-center gap-4 mt-4">
              <a href="https://wa.me/14073743951" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-[var(--color-brand-goldmuted)] flex items-center justify-center text-[var(--color-brand-goldmuted)] hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-navy)] transition-all duration-300">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[var(--color-brand-goldmuted)] flex items-center justify-center text-[var(--color-brand-goldmuted)] hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-navy)] transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[var(--color-brand-goldmuted)] flex items-center justify-center text-[var(--color-brand-goldmuted)] hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-navy)] transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[var(--color-brand-goldmuted)] flex items-center justify-center text-[var(--color-brand-goldmuted)] hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-navy)] transition-all duration-300">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--color-brand-gold)] border-opacity-20 pt-8 flex flex-col items-center gap-4">
          <p className="font-serif italic text-[13px] text-[var(--color-brand-goldmuted)]">
            From Tradition to Global Business
          </p>
          <p className="font-sans text-xs text-[var(--color-brand-graymuted)]">
            © 2026 Don Pepe Business Group · Ecuador & Estados Unidos
          </p>
        </div>
      </div>
    </footer>
  );
}
