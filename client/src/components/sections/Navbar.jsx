import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";

import { gsap } from "gsap";
import { Menu, X, Globe, Sun, Moon, ArrowRight } from "lucide-react";

const Navbar = ({ about, lang }) => {
  const isEn = lang === "en";
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef(null);
  const loc = useLocation();
  const lp = isEn ? "" : "/id";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current, { y: -60, opacity: 0, duration: 0.6, ease: "power2.out", delay: 0.05 });
  }, []);

  const close = () => setOpen(false);

  const links = [
    { to: `${lp}/`, en: "Home", id: "Beranda" },
    { to: `${lp}/about`, en: "About", id: "Tentang" },
    { to: `${lp}/services`, en: "Services", id: "Layanan" },
    { to: `${lp}/portfolio`, en: "Portfolio", id: "Portofolio" },
    { to: `${lp}/contact`, en: "Contact", id: "Kontak" },
  ];

  const isActive = (p) => {
    const c = loc.pathname;
    if (p === `${lp}/`) return c === p || c === lp;
    return c.startsWith(p);
  };

  return (
    <>
      <nav ref={ref} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 dark:bg-primary-900/90 backdrop-blur-lg border-b border-primary-100 dark:border-primary-800" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={`${lp}/`} className="flex items-center gap-2.5 shrink-0">
            {about?.logo ? (
              <img src={about.logo} alt="Logo" className="w-7 h-7 object-cover" />
            ) : (
              <div className="w-7 h-7 bg-primary-400 rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
            )}
            <div className="leading-none">
              <span className="font-extrabold text-sm text-primary-900 dark:text-white tracking-tight">PixlCraft</span>
              <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-primary-400 block">Studio</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={`text-[13px] font-semibold transition-colors relative pb-0.5 ${isActive(l.to) ? "text-primary-400" : "text-primary-700 dark:text-primary-200 hover:text-primary-400"}`}>
                {isEn ? l.en : l.id}
                {isActive(l.to) && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary-400 rounded-full" />}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link to={isEn ? "/id/" : "/"} className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-primary-500 hover:text-primary-400 transition-colors">
              <Globe size={12} />
              {isEn ? "EN" : "ID"}
            </Link>
            <button onClick={toggle} aria-label="Theme" className="w-8 h-8 flex items-center justify-center text-primary-500 hover:text-primary-400 transition-colors rounded-md hover:bg-primary-50 dark:hover:bg-primary-800">
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="lg:hidden w-8 h-8 flex items-center justify-center text-primary-700 dark:text-primary-200">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 bg-white dark:bg-primary-900 flex flex-col justify-center lg:hidden transition-all duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="px-8 flex flex-col gap-5">
          {links.map((l, i) => (
            <Link key={i} to={l.to} onClick={close} className={`font-extrabold text-2xl text-primary-900 dark:text-white tracking-tight pb-4 border-b border-primary-100 dark:border-primary-800 flex items-center justify-between transition-all duration-200 ${open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`} style={{ transitionDelay: `${i * 40}ms` }}>
              {isEn ? l.en : l.id}
              <ArrowRight size={16} className="text-primary-300" />
            </Link>
          ))}
          <div className="mt-6">
            <Link to={`${lp}/contact`} onClick={close} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-400 text-white font-bold text-sm rounded-md hover:bg-primary-500 transition-colors">
              {isEn ? "Start a Project" : "Mulai Proyek"} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
