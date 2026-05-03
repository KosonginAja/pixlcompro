import { Link } from "react-router-dom";

const Footer = ({ about, lang }) => {
  const isEn = lang === "en";
  const year = new Date().getFullYear();
  const lp = isEn ? "" : "/id";

  const nav = [
    { to: `${lp}/`, en: "Home", id: "Beranda" },
    { to: `${lp}/about`, en: "About", id: "Tentang" },
    { to: `${lp}/services`, en: "Services", id: "Layanan" },
    { to: `${lp}/portfolio`, en: "Portfolio", id: "Portofolio" },
    { to: `${lp}/contact`, en: "Contact", id: "Kontak" },
  ];

  const socials = about?.socials || [];

  return (
    <footer className="surface-deep">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Main grid — Fibonacci: 3 + 1 + 1 + 1 feel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-[55px] border-t border-white/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              {about?.logo ? <img src={about.logo} alt="Logo" className="w-5 h-5 object-contain" /> : <div className="w-5 h-5 bg-primary-400 flex items-center justify-center"><span className="text-white font-extrabold text-[8px]">P</span></div>}
              <span className="font-extrabold text-[13px] text-white tracking-tight">PixlCraft<span className="text-primary-400">.</span></span>
            </div>
            <p className="text-primary-400 text-[13px] leading-relaxed max-w-[200px]">
              {isEn ? "Where Ideas Take Shape." : "Where Ideas Take Shape."}
            </p>
          </div>

          {/* Nav */}
          <div>
            <span className="font-pixel text-[7px] text-primary-500 uppercase tracking-[0.2em] mb-4 block">Nav</span>
            <ul className="space-y-2">
              {nav.map(item => (
                <li key={item.to}><Link to={item.to} className="text-primary-300 hover:text-white text-[13px] transition-colors">{isEn ? item.en : item.id}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="font-pixel text-[7px] text-primary-500 uppercase tracking-[0.2em] mb-4 block">{isEn ? "Contact" : "Kontak"}</span>
            <div className="space-y-2">
              {about?.contactEmail && <a href={`mailto:${about.contactEmail}`} className="block text-primary-300 hover:text-white text-[13px] transition-colors">{about.contactEmail}</a>}
              {about?.contactPhone && <p className="text-primary-300 text-[13px]">{about.contactPhone}</p>}
            </div>
          </div>

          {/* Social */}
          <div>
            <span className="font-pixel text-[7px] text-primary-500 uppercase tracking-[0.2em] mb-4 block">Social</span>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socials.map(({ label, href, url, icon }) => (
                  <a key={label} href={href || url} target="_blank" rel="noreferrer" className="text-primary-400 hover:text-white transition-colors text-sm" aria-label={label}>
                    <i className={icon}></i>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="py-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-primary-500">&copy; {year} PixlCraft Studio</p>
          <p className="font-pixel text-[7px] text-primary-600 tracking-[0.15em]">CRAFTED PIXEL BY PIXEL</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
