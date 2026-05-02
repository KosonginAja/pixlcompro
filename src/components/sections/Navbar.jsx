import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Menu, X, Globe, ArrowRight, Sun, Moon } from "lucide-react";

const Navbar = ({ about, lang }) => {
  const isEn = lang === "en";
  const { dark, toggle } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const lp = isEn ? "" : "/id";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  useGSAP(() => {
    gsap.from(navRef.current, { y: -80, opacity: 0, duration: 0.8, ease: "back.out(1.3)", delay: 0.1 });
  }, { scope: navRef });

  const close = () => setIsMenuOpen(false);

  const items = [
    { to: `${lp}/`, en: "Home", id: "Beranda" },
    { to: `${lp}/about`, en: "About", id: "Tentang" },
    { to: `${lp}/services`, en: "Services", id: "Layanan" },
    { to: `${lp}/portfolio`, en: "Portfolio", id: "Portofolio" },
    { to: `${lp}/contact`, en: "Contact", id: "Kontak" },
  ];

  const active = (p) => {
    const c = location.pathname;
    if (p === `${lp}/`) return c === p || c === lp;
    return c.startsWith(p);
  };

  return (
    <>
      <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-primary-900/95 backdrop-blur-md shadow-sm border-b border-primary-200 dark:border-primary-700" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to={`${lp}/`} className="flex items-center gap-3 shrink-0">
            {about?.logo ? (
              <img src={about.logo} alt="Logo" className="w-8 h-8 object-cover" />
            ) : (
              <div className="w-8 h-8 bg-primary-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">P</span>
              </div>
            )}
            <div className="leading-none">
              <span className={`font-black text-sm tracking-tight ${scrolled ? "text-primary-900 dark:text-primary-50" : "text-primary-900 dark:text-primary-50"}`}>PixlCraft</span>
              <span className={`text-[10px] font-bold tracking-[0.15em] uppercase block ${scrolled ? "text-primary-500" : "text-primary-500"}`}>Studio</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-10">
            {items.map((item) => (
              <Link key={item.to} to={item.to} className={`text-[13px] font-semibold tracking-wide transition-colors relative ${active(item.to) ? "text-primary-500" : "text-primary-700 dark:text-primary-300 hover:text-primary-500"}`}>
                {isEn ? item.en : item.id}
                {active(item.to) && <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary-500" />}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Link to={isEn ? "/id/" : "/"} className="flex items-center gap-1.5 px-3 py-1.5 border border-primary-300 dark:border-primary-600 text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-300 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all rounded-sm">
              <Globe size={12} />
              {isEn ? "EN" : "ID"}
            </Link>
            <button onClick={toggle} aria-label="Theme" className="w-9 h-9 border border-primary-300 dark:border-primary-600 flex items-center justify-center text-primary-600 dark:text-primary-300 hover:bg-primary-500 hover:text-white transition-all rounded-sm">
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu" className="lg:hidden w-9 h-9 border border-primary-300 dark:border-primary-600 flex items-center justify-center text-primary-600 dark:text-primary-300 hover:bg-primary-500 hover:text-white transition-all rounded-sm">
              {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 bg-white dark:bg-primary-900 flex flex-col items-start justify-center lg:hidden transition-all duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="relative px-8 flex flex-col gap-6 w-full">
          {items.map((item, i) => (
            <Link key={i} to={item.to} onClick={close} className={`font-black text-3xl text-primary-900 dark:text-primary-50 tracking-tight transition-all duration-300 pb-4 border-b border-primary-200 dark:border-primary-700 flex items-center justify-between group ${isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`} style={{ transitionDelay: `${i * 50}ms` }}>
              {isEn ? item.en : item.id}
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 text-primary-400 transition-all" />
            </Link>
          ))}
          <div className="mt-4">
            <Link to={`${lp}/contact`} onClick={close} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-bold text-sm tracking-wide hover:bg-primary-600 transition-colors">
              {isEn ? "Start a Project" : "Mulai Proyek"} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <Link to={`${lp}/contact`} className={`fixed bottom-6 right-6 z-[100] inline-flex items-center gap-2 px-5 py-3 bg-primary-500 text-white font-bold text-xs tracking-wide shadow-[4px_4px_0_0_#004b74] hover:shadow-[6px_6px_0_0_#004b74] hover:-translate-y-0.5 transition-all duration-300 ${isMenuOpen ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100 translate-y-0"}`}>
        {isEn ? "Contact Us" : "Hubungi Kami"} <ArrowRight size={14} />
      </Link>
    </>
  );
};

export default Navbar;
