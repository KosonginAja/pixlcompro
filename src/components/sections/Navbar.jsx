import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Menu, X, Globe, ArrowRight, Sun, Moon } from "lucide-react";

const Navbar = ({ about, lang }) => {
  const isEn = lang === "en";
  const { dark, toggle } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -80, opacity: 0, duration: 0.8, ease: "back.out(1.3)", delay: 0.1,
    });
  }, { scope: navRef });

  const handleLinkClick = () => setIsMenuOpen(false);

  const menuItems = [
    { href: "#",          en: "Home",      id: "Beranda"    },
    { href: "#about",     en: "About",     id: "Tentang"    },
    { href: "#services",  en: "Services",  id: "Layanan"    },
    { href: "#portfolio", en: "Portfolio", id: "Portofolio" },
    { href: "#client",    en: "Clients",   id: "Klien"      },
    { href: "#contact",   en: "Contact",   id: "Kontak"     },
  ];

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-primary-900/95 dark:bg-primary-50/95 backdrop-blur-sm border-b-2 border-primary-500"
            : "bg-transparent border-b-2 border-transparent"
        }`}
      >
        {/* Gradient underline when scrolled */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px]">
            <div className="brut-divider" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0 accent-line">
            {about?.logo ? (
              <img
                src={about.logo}
                alt="Logo"
                className="w-9 h-9 object-cover border-2 border-primary-400"
              />
            ) : (
              <div className="w-9 h-9 bg-primary-500 border-2 border-primary-300 flex items-center justify-center">
                <span className="font-pixel text-white text-[10px]">P</span>
              </div>
            )}
            <span className="leading-none hidden sm:block">
              <span className={`font-pixel text-[10px] ${scrolled ? "text-white dark:text-primary-900" : "text-primary-900 dark:text-primary-50"}`}>
                PixlCraft
              </span>
              <br />
              <span className={`text-[11px] font-bold tracking-widest ${scrolled ? "text-primary-300 dark:text-primary-600" : "text-primary-500"}`}>
                Studio
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className={`text-[13px] font-semibold uppercase tracking-widest transition-colors accent-line ${
                  scrolled
                    ? "text-primary-200 dark:text-primary-700 hover:text-primary-300 dark:hover:text-primary-500"
                    : "text-primary-700 dark:text-primary-300 hover:text-primary-500"
                }`}
              >
                {isEn ? item.en : item.id}
              </a>
            ))}
          </div>

          {/* Right controls — Language + Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <a
              href={isEn ? "/id" : "/"}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-2 text-[11px] font-bold uppercase tracking-wider transition-all pixel-shift-hover ${
                scrolled
                  ? "border-primary-400 text-primary-200 dark:text-primary-700 dark:border-primary-600 hover:bg-primary-500 hover:text-white hover:border-primary-500"
                  : "border-primary-400 text-primary-600 dark:text-primary-300 hover:bg-primary-500 hover:text-white"
              }`}
            >
              <Globe size={12} strokeWidth={2.5} />
              {isEn ? "EN" : "ID"}
            </a>

            {/* Theme toggle — desktop only in navbar, mobile in burger area */}
            <button
              onClick={toggle}
              aria-label={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`w-10 h-10 border-2 flex items-center justify-center transition-all pixel-shift-hover ${
                scrolled
                  ? "border-primary-400 text-primary-200 dark:text-primary-700 dark:border-primary-600 hover:bg-primary-500 hover:text-white"
                  : "border-primary-400 text-primary-600 dark:text-primary-300 hover:bg-primary-500 hover:text-white"
              }`}
            >
              {dark ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
            </button>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className={`lg:hidden w-10 h-10 border-2 flex items-center justify-center transition-all pixel-shift-hover ${
                scrolled
                  ? "border-primary-400 text-primary-200 hover:bg-primary-500 hover:text-white"
                  : "border-primary-500 text-primary-600 dark:text-primary-300 hover:bg-primary-500 hover:text-white"
              }`}
            >
              {isMenuOpen ? <X size={18} strokeWidth={3} /> : <Menu size={18} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Menu ── */}
      <div
        className={`fixed inset-0 z-40 bg-primary-900 dark:bg-primary-50 flex flex-col items-start justify-center lg:hidden transition-all duration-400 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Dither pattern */}
        <div className="absolute inset-0 bg-dither pointer-events-none" />
        {/* Scan lines */}
        <div className="absolute inset-0 scanlines pointer-events-none" />
        {/* Accent stripe */}
        <div className="section-stripe" />

        <div className="relative px-12 flex flex-col gap-8 w-full">
          {menuItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              onClick={handleLinkClick}
              className={`font-black text-4xl text-primary-50 dark:text-primary-900 uppercase tracking-tighter transition-all duration-300 border-b-2 border-primary-700 dark:border-primary-300 pb-4 flex items-center justify-between group ${
                isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {isEn ? item.en : item.id}
              <ArrowRight
                size={20}
                className="opacity-0 group-hover:opacity-100 text-primary-400 transition-all -translate-x-2 group-hover:translate-x-0"
              />
            </a>
          ))}

          {/* Mobile: CTA Contact Us */}
          <div className="flex gap-4 mt-4">
            <a
              href="#contact"
              onClick={handleLinkClick}
              className="brut-btn pixel-shift-hover"
            >
              {isEn ? "Contact Us" : "Hubungi Kami"}
              <ArrowRight size={16} strokeWidth={3} />
            </a>
          </div>
        </div>

        {/* Corner label */}
        <div className="absolute bottom-8 right-8">
          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
            PixlCraft Studio
          </span>
        </div>
      </div>

      {/* ── Fixed bottom-right: Contact Us CTA — hide when mobile menu is open ── */}
      <a
        href="#contact"
        className={`fixed bottom-6 right-6 z-[100] brut-btn pixel-shift-hover shadow-[4px_4px_0_0_#004b74] dark:shadow-[4px_4px_0_0_#4c97d1] transition-all duration-300 ${
          isMenuOpen ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {isEn ? "Contact Us" : "Hubungi Kami"}
        <ArrowRight size={14} strokeWidth={3} />
      </a>
    </>
  );
};

export default Navbar;
