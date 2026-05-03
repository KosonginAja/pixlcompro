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
    gsap.fromTo(ref.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.1 });
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
      <nav ref={ref} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-primary-900/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,29,50,0.08)]" : "bg-white/80 dark:bg-primary-900/80 backdrop-blur-sm"}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-[55px]">
          {/* Logo */}
          <Link to={`${lp}/`} className="flex items-center gap-2 shrink-0 group">
            {about?.logo ? (
              <img src={about.logo} alt="PixlCraft" className="w-6 h-6 object-contain" />
            ) : (
              <div className="w-6 h-6 bg-primary-400 flex items-center justify-center">
                <span className="text-white font-extrabold text-[10px]">P</span>
              </div>
            )}
            <span className="font-extrabold text-[13px] text-primary-900 dark:text-white tracking-tight leading-none">PixlCraft<span className="text-primary-400">.</span></span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={`text-[13px] font-medium transition-colors ${isActive(l.to) ? "text-primary-400 font-semibold" : "text-[#666] dark:text-primary-300 hover:text-primary-900 dark:hover:text-white"}`}>
                {isEn ? l.en : l.id}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            <Link to={isEn ? "/id/" : "/"} className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-semibold text-[#999] hover:text-primary-400 transition-colors">
              <Globe size={12} />
              {isEn ? "EN" : "ID"}
            </Link>
            <button onClick={toggle} aria-label="Theme" className="w-8 h-8 flex items-center justify-center text-[#999] hover:text-primary-400 transition-colors">
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <Link to={`${lp}/contact`} className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 bg-primary-400 text-white text-[12px] font-bold tracking-wide hover:bg-primary-500 transition-colors">
              {isEn ? "Start Project" : "Mulai"} <ArrowRight size={12} />
            </Link>
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="lg:hidden w-8 h-8 flex items-center justify-center text-primary-900 dark:text-white">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-primary-900 flex flex-col justify-center lg:hidden">
          <div className="px-8 flex flex-col gap-0">
            {links.map((l, i) => (
              <Link key={i} to={l.to} onClick={close} className="font-bold text-xl text-primary-900 dark:text-white py-4 border-b border-primary-100 dark:border-primary-800 flex items-center justify-between">
                {isEn ? l.en : l.id}
                <ArrowRight size={14} className="text-primary-300" />
              </Link>
            ))}
            <div className="mt-8">
              <Link to={`${lp}/contact`} onClick={close} className="inline-flex items-center gap-2 px-5 py-3 bg-primary-400 text-white font-bold text-sm">
                {isEn ? "Start Project" : "Mulai Proyek"} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
