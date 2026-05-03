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
    <footer className="bg-primary-900 dark:bg-primary-900 transition-colors">
      <div className="h-px w-full bg-primary-700" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              {about?.logo ? (
                <img src={about.logo} alt="Logo" className="w-7 h-7 object-cover" />
              ) : (
                <div className="w-7 h-7 bg-primary-400 rounded-sm flex items-center justify-center"><span className="text-white font-bold text-xs">P</span></div>
              )}
              <div className="leading-none">
                <span className="font-extrabold text-sm text-white tracking-tight">PixlCraft</span>
                <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-primary-400 block">Studio</span>
              </div>
            </div>
            <p className="text-primary-400 text-sm leading-relaxed max-w-xs">
              {isEn ? "We craft digital experiences that drive real business results." : "Kami membangun pengalaman digital yang mendorong hasil bisnis nyata."}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <span className="text-xs font-semibold text-primary-300 uppercase tracking-[0.15em] mb-4 block">{isEn ? "Navigation" : "Navigasi"}</span>
            <ul className="space-y-2.5">
              {nav.map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-primary-400 hover:text-white text-sm transition-colors">{isEn ? item.en : item.id}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-xs font-semibold text-primary-300 uppercase tracking-[0.15em] mb-4 block">{isEn ? "Contact" : "Kontak"}</span>
            <div className="space-y-2.5">
              {about?.contactEmail && <a href={`mailto:${about.contactEmail}`} className="block text-primary-400 hover:text-white text-sm transition-colors">{about.contactEmail}</a>}
              {about?.contactPhone && <p className="text-primary-400 text-sm">{about.contactPhone}</p>}
            </div>
          </div>

          {/* Social */}
          <div>
            <span className="text-xs font-semibold text-primary-300 uppercase tracking-[0.15em] mb-4 block">{isEn ? "Follow Us" : "Ikuti Kami"}</span>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socials.map(({ label, href, url, icon }) => (
                  <a key={label} href={href || url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-md flex items-center justify-center text-primary-400 hover:text-white hover:bg-primary-700 transition-all text-sm" aria-label={label}>
                    <i className={icon}></i>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="py-5 border-t border-primary-800">
          <p className="text-xs text-primary-500">&copy; {year} PixlCraft Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
