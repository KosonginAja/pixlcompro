const Footer = ({ about, lang }) => {
  const isEn = lang === "en";
  const year = new Date().getFullYear();

  const menuItems = [
    { href: "#",          en: "Home",      id: "Beranda"    },
    { href: "#about",     en: "About",     id: "Tentang"    },
    { href: "#services",  en: "Services",  id: "Layanan"    },
    { href: "#portfolio", en: "Portfolio", id: "Portofolio" },
    { href: "#client",    en: "Clients",   id: "Klien"      },
    { href: "#contact",   en: "Contact",   id: "Kontak"     },
  ];

  const socials = about?.socials || [];

  return (
    <footer className="bg-primary-900 dark:bg-primary-50 relative overflow-hidden transition-colors scanlines">
      {/* Gradient top border */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-300 via-primary-500 to-primary-700 dark:from-primary-600 dark:via-primary-400 dark:to-primary-200" />

      {/* Dither background */}
      <div className="absolute inset-0 bg-dither pointer-events-none" />
      <div className="section-stripe" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ── Top row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-16 border-b-2 border-primary-700 dark:border-primary-300">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              {about?.logo ? (
                <img
                  src={about.logo}
                  alt="Logo"
                  className="w-10 h-10 object-cover border-2 border-primary-500"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-500 border-2 border-primary-400 flex items-center justify-center">
                  <span className="font-pixel text-white text-[10px]">P</span>
                </div>
              )}
              <div className="leading-none">
                <span className="font-pixel text-primary-100 dark:text-primary-800 text-[11px]">PixlCraft</span>
                <br />
                <span className="text-primary-400 dark:text-primary-500 text-xs font-bold tracking-widest">STUDIO</span>
              </div>
            </div>
            <p className="text-primary-300 dark:text-primary-600 text-sm leading-relaxed font-medium max-w-xs">
              {isEn
                ? "We build digital experiences that drive real business growth."
                : "Kami membangun pengalaman digital yang mendorong pertumbuhan bisnis nyata."}
            </p>

            {/* Socials */}
            {socials.length > 0 && (
              <div className="flex gap-3 mt-6">
                {socials.map(({ label, href, url, icon }) => (
                  <a
                    key={label}
                    href={href || url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 border-2 border-primary-600 dark:border-primary-300 flex items-center justify-center text-primary-400 dark:text-primary-500 hover:border-primary-400 hover:text-primary-200 dark:hover:text-primary-700 hover:shadow-[3px_3px_0_0_#2c7cb6] transition-all text-sm pixel-shift-hover"
                    aria-label={label}
                    title={label}
                  >
                    <i className={icon}></i>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <div>
            <span className="font-pixel text-[9px] text-primary-500 dark:text-primary-400 uppercase tracking-widest mb-5 block">
              {isEn ? "Navigation" : "Navigasi"}
            </span>
            <ul className="space-y-3">
              {menuItems.map(item => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-primary-300 dark:text-primary-600 hover:text-primary-100 dark:hover:text-primary-900 font-black text-sm uppercase tracking-widest transition-colors flex items-center gap-2 group accent-line"
                  >
                    <span className="w-4 h-0.5 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {isEn ? item.en : item.id}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact quick */}
          <div>
            <span className="font-pixel text-[9px] text-primary-500 dark:text-primary-400 uppercase tracking-widest mb-5 block">
              {isEn ? "Get In Touch" : "Hubungi Kami"}
            </span>
            <div className="space-y-4">
              {about?.contactEmail && (
                <a
                  href={`mailto:${about.contactEmail}`}
                  className="block text-primary-300 dark:text-primary-600 hover:text-primary-100 dark:hover:text-primary-900 font-medium text-sm transition-colors accent-line"
                >
                  {about.contactEmail}
                </a>
              )}
              {about?.contactPhone && (
                <p className="text-primary-300 dark:text-primary-600 font-medium text-sm">
                  {about.contactPhone}
                </p>
              )}
              <a
                href="#contact"
                className="inline-block mt-4 brut-btn text-[9px] pixel-shift-hover"
                style={{ padding: "0.6rem 1.25rem" }}
              >
                <span className="font-pixel text-[8px]">
                  {isEn ? "Start a Project" : "Mulai Proyek"}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="font-pixel text-[8px] text-primary-600 dark:text-primary-400 uppercase tracking-widest glitch-subtle"
            data-text={`© ${year} PixlCraft Studio. All rights reserved.`}
          >
            © {year} PixlCraft Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-500" />
            <span className="font-pixel text-[7px] text-primary-600 dark:text-primary-400 uppercase tracking-widest">
              {isEn ? "Built with purpose." : "Dibangun dengan tujuan."}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
