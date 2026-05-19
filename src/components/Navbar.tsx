import { useState, useEffect, useRef, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./icons";
import { useLang } from "@/contexts/LangContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, T } = useLang();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsVisible(y > 40);
      setIsScrolled(y > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  const scrollToContact = () => {
    navigate("/contacto");
  };

  const handleEmpresasClick = (e: MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById("empresas");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem('scrollToEmpresas', 'true');
      navigate('/');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navHeight = isScrolled ? "h-[64px]" : "h-[80px]";
  const dropdownTop = isScrolled ? "64px" : "80px";

  const navLinks = [
    { label: T.nav.home, path: "/" },
    { label: T.nav.history, path: "/historia" },
    { label: T.nav.products, path: "/productos" },
  ];

  return (
    <>
      <header
        className={cn(
          "theme-dark fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          "bg-[var(--color-brand-navy)] backdrop-blur-xl border-b",
          isVisible
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none",
          isScrolled
            ? "border-[var(--color-brand-gold)]/15"
            : "border-[var(--color-brand-gold)]/10"
        )}
      >
        <div className={cn(
          "max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between transition-all duration-300",
          navHeight
        )}>
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Logo className="w-full h-full" />
            </div>
            <div className="hidden md:flex flex-col border-l border-[var(--color-brand-gold)]/20 pl-4">
              <span className="font-serif text-xl leading-none font-bold text-[var(--color-brand-gold)] tracking-wider">DON PEPE</span>
              <span className="font-sans text-[10px] text-[var(--color-brand-goldlight)] tracking-[0.3em] font-semibold uppercase">BUSINESS GROUP</span>
              <span className="font-sans text-[8px] text-[#7A6E60] tracking-wide mt-0.5">donpepebussinessgroup.com</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center h-full gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative font-sans text-sm font-medium transition-colors h-full flex items-center",
                  isActive(link.path) ? "text-[var(--color-brand-gold)]" : "text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)]"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-brand-gold)] transform origin-left transition-transform duration-[350ms]",
                  isActive(link.path) ? "scale-x-100" : "scale-x-0"
                )} style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }} />
              </Link>
            ))}

            {/* Dropdown Companies */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                onClick={handleEmpresasClick}
                className="font-sans text-sm font-medium text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] transition-colors flex items-center gap-1"
              >
                {T.nav.companies} <ChevronDown size={14} className={cn("transition-transform duration-200", dropdownOpen && "rotate-180")} />
              </button>

              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 w-52 bg-[var(--color-brand-navy)] border border-[var(--color-brand-gold)]/20 border-t-[var(--color-brand-gold)] py-2 shadow-xl transition-all duration-200 z-50",
                  dropdownOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                )}
                style={{ top: dropdownTop, borderTopWidth: '1px', borderTopColor: 'var(--color-brand-gold)' }}
              >
                <Link
                  to="/import"
                  className="group/item flex items-center px-6 py-3 font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-navymid)] transition-colors relative"
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 group-hover/item:w-[2px] h-4/5 bg-[var(--color-brand-gold)] transition-[width] duration-200" />
                  Don Pepe Import
                </Link>
                <Link
                  to="/seafood"
                  className="group/item flex items-center px-6 py-3 font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-teal)] hover:bg-[var(--color-brand-navymid)] transition-colors relative"
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 group-hover/item:w-[2px] h-4/5 bg-[var(--color-brand-teal)] transition-[width] duration-200" />
                  Don Pepe Sea Food
                </Link>
                <Link
                  to="/atm"
                  className="group/item flex items-center px-6 py-3 font-sans text-sm text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-navymid)] transition-colors relative"
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 group-hover/item:w-[2px] h-4/5 bg-[var(--color-brand-gold)] transition-[width] duration-200" />
                  Don Pepe ATM
                </Link>
              </div>
            </div>

            <Link
              to="/contacto"
              className={cn(
                "relative font-sans text-sm font-medium transition-colors h-full flex items-center",
                isActive("/contacto") ? "text-[var(--color-brand-gold)]" : "text-[var(--color-brand-graylight)] hover:text-[var(--color-brand-gold)]"
              )}
            >
              {T.nav.contact}
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-brand-gold)] transform origin-left transition-transform duration-[350ms]",
                isActive("/contacto") ? "scale-x-100" : "scale-x-0"
              )} style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }} />
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="flex items-center gap-1 font-sans text-[11px] font-semibold tracking-wider select-none"
              aria-label="Switch language"
            >
              <span className={lang === "es" ? "text-[var(--color-brand-gold)]" : "text-[var(--color-brand-graymuted)] hover:text-[var(--color-brand-graylight)] transition-colors"}>ES</span>
              <span className="text-[var(--color-brand-graymuted)]/40 mx-0.5">|</span>
              <span className={lang === "en" ? "text-[var(--color-brand-gold)]" : "text-[var(--color-brand-graymuted)] hover:text-[var(--color-brand-graylight)] transition-colors"}>EN</span>
            </button>

            <button
              onClick={scrollToContact}
              className="gold-pulse px-8 py-2 rounded-full border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] text-xs font-semibold uppercase tracking-widest hover:bg-[var(--color-brand-gold)] hover:text-[var(--color-brand-navy)] transition-all duration-300 hover:scale-105"
            >
              {T.nav.contactBtn}
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-[var(--color-brand-gold)] z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-[var(--color-brand-navy)] z-40 transition-opacity duration-300 flex overflow-y-auto pt-24 pb-12 items-center justify-center",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col items-center w-full px-8 gap-6 max-h-[80vh]">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className="w-full text-center py-4 text-3xl font-serif text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)] border-b border-[var(--color-brand-gold)]/20"
              style={{
                transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                transitionDelay: mobileMenuOpen ? `${(i + 1) * 80}ms` : "0ms",
                opacity: mobileMenuOpen ? 1 : 0,
                transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)"
              }}
            >
              {link.label}
            </Link>
          ))}

          <div
            className="w-full text-center flex flex-col items-center py-4 border-b border-[var(--color-brand-gold)]/20"
            style={{
              transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              transitionDelay: mobileMenuOpen ? "240ms" : "0ms",
              opacity: mobileMenuOpen ? 1 : 0,
              transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)"
            }}
          >
            <span className="text-3xl font-serif text-[var(--color-brand-offwhite)] mb-4">{T.nav.companies}</span>
            <div className="flex flex-col items-center space-y-4">
              <Link to="/import" className="flex items-center gap-2 font-sans text-lg text-[var(--color-brand-gold)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)] flex-shrink-0" />
                Don Pepe Import
              </Link>
              <Link to="/seafood" className="flex items-center gap-2 font-sans text-lg text-[var(--color-brand-teal)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-teal)] flex-shrink-0" />
                Don Pepe Sea Food
              </Link>
              <Link to="/atm" className="flex items-center gap-2 font-sans text-lg text-[var(--color-brand-gold)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)] flex-shrink-0" />
                Don Pepe ATM
              </Link>
            </div>
          </div>

          <Link
            to="/contacto"
            className="w-full text-center py-4 text-3xl font-serif text-[var(--color-brand-offwhite)] hover:text-[var(--color-brand-gold)]"
            style={{
              transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              transitionDelay: mobileMenuOpen ? "320ms" : "0ms",
              opacity: mobileMenuOpen ? 1 : 0,
              transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)"
            }}
          >
            {T.nav.contact}
          </Link>

          {/* Language toggle mobile */}
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="flex items-center gap-2 font-sans text-sm font-semibold tracking-wider mt-2"
            style={{
              transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              transitionDelay: mobileMenuOpen ? "400ms" : "0ms",
              opacity: mobileMenuOpen ? 1 : 0,
              transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)"
            }}
          >
            <span className={lang === "es" ? "text-[var(--color-brand-gold)]" : "text-[var(--color-brand-graymuted)]"}>ES</span>
            <span className="text-[var(--color-brand-graymuted)]/40">|</span>
            <span className={lang === "en" ? "text-[var(--color-brand-gold)]" : "text-[var(--color-brand-graymuted)]"}>EN</span>
          </button>
        </nav>
      </div>
    </>
  );
}
