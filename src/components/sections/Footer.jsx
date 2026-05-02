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
    <footer className="bg-primary-900 dark:bg-primary-50 relative overflow-hidden transition-colors">
      {/* Top border */}
      <div className="h-[3px] w-full bg-primary-500" />

      {/* Background number */}
      <div className="absolute right-8 bottom-4 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.04]">
        <span className="font-pixel text-[200px] text-white dark:text-primary-900 leading-none">99</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-16 border-b border-primary-700 dark:border-primary-300">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              {about?.logo ? (
                <img src={about.logo} alt="Logo" className="w-8 h-8 object-cover" />
              ) : (
                <div className="w-8 h-8 bg-primary-500 flex items-center justify-center"><span className="text-white font-black text-sm">P</span></div>
              )}
              <div className="leading-none">
                <span className="font-black text-sm text-primary-100 dark:text-primary-800 tracking-tight">PixlCraft</span>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary-500 block">Studio</span>
              </div>
            </div>
            <p className="text-primary-400 dark:text-primary-600 text-sm leading-relaxed font-medium max-w-xs">
              {isEn ? "We build digital experiences that drive real business growth." : "Kami membangun pengalaman digital yang mendorong pertumbuhan bisnis nyata."}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.15em] mb-5 block">{isEn ? "Navigation" : "Navigasi"}</span>
            <ul className="space-y-3">
              {nav.map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-primary-400 dark:text-primary-600 hover:text-primary-200 dark:hover:text-primary-900 font-semibold text-sm transition-colors">{isEn ? item.en : item.id}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.15em] mb-5 block">{isEn ? "Contact" : "Kontak"}</span>
            <div className="space-y-3">
              {about?.contactEmail && <a href={`mailto:${about.contactEmail}`} className="block text-primary-400 dark:text-primary-600 hover:text-primary-200 dark:hover:text-primary-900 font-medium text-sm transition-colors">{about.contactEmail}</a>}
              {about?.contactPhone && <p className="text-primary-400 dark:text-primary-600 font-medium text-sm">{about.contactPhone}</p>}
            </div>
          </div>

          {/* Socials */}
          <div>
            <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.15em] mb-5 block">{isEn ? "Follow Us" : "Ikuti Kami"}</span>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socials.map(({ label, href, url, icon }) => (
                  <a key={label} href={href || url} target="_blank" rel="noreferrer" className="w-9 h-9 border border-primary-600 dark:border-primary-300 flex items-center justify-center text-primary-400 dark:text-primary-500 hover:border-primary-400 hover:text-primary-200 dark:hover:text-primary-800 transition-all text-sm" aria-label={label}>
                    <i className={icon}></i>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400 tracking-wide">&copy; {year} PixlCraft Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
