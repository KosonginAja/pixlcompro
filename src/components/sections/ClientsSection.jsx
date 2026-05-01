/* ClientsSection — ticker text only */

const ClientsSection = ({ testimonials, about, lang }) => {
  const isEn = lang === "en";

  const clients = testimonials?.filter((t) => t.name) || [];
  if (clients.length === 0) return null;

  return (
    <section
      id="client"
      className="bg-primary-900 dark:bg-primary-50 relative overflow-hidden border-t-4 border-primary-500 dark:border-primary-400 transition-colors"
    >
      {/* Dither & scanlines */}
      <div className="absolute inset-0 bg-dither pointer-events-none" />
      <div className="absolute inset-0 scanlines pointer-events-none" />
      {/* Left accent stripe */}
      <div className="section-stripe" />

      {/* ── Heading row ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 flex flex-col sm:flex-row sm:items-end gap-6 relative z-10">
        <div>
          <span className="brut-label text-primary-400 dark:text-primary-500 border-primary-500 mb-4 inline-block">
            {'>'} {isEn ? "OUR CLIENTS" : "KLIEN KAMI"}
          </span>
          <h2
            className="text-4xl lg:text-6xl font-black text-white dark:text-primary-900 tracking-tighter uppercase leading-none"
            data-text={isEn ? "Trusted By" : "Dipercaya Oleh"}
          >
            {isEn ? "Trusted By" : "Dipercaya Oleh"}
          </h2>
        </div>
        <p className="text-primary-400 dark:text-primary-500 text-sm font-medium border-l-4 border-primary-600 pl-4 max-w-xs pb-1">
          {isEn
            ? "Brands & companies we've partnered with."
            : "Merek dan perusahaan yang telah bermitra dengan kami."}
        </p>
      </div>

      {/* ── Ticker strip: logo + name ── */}
      <div className="border-t-4 border-b-4 border-primary-700 dark:border-primary-300 py-4 overflow-hidden relative">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-primary-900 dark:from-primary-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-primary-900 dark:from-primary-50 to-transparent z-10 pointer-events-none" />

        {/*
          Seamless marquee technique:
          - Outer wrapper = relative, overflow-hidden (done on parent)
          - Two identical inner rows both running marquee; second starts exactly
            when first finishes (animation-delay: -duration/2 trick not needed;
            instead we just duplicate content INSIDE one div so -50% lands on clone)
        */}
        <div
          className="flex items-center gap-0"
          style={{
            animation: "marquee 28s linear infinite",
            willChange: "transform",
            width: "max-content",
          }}
        >
          {[...clients, ...clients].map((c, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-4 mx-10 shrink-0 group cursor-default"
            >
              {/* Logo */}
              {c.avatar ? (
                <div className="w-14 h-10 flex items-center justify-center shrink-0">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="max-w-full max-h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 border-2 border-primary-600 dark:border-primary-300 flex items-center justify-center shrink-0 bg-primary-800 dark:bg-primary-100">
                  <span className="font-pixel text-primary-400 dark:text-primary-500 text-[10px]">
                    {c.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Name */}
              <span className="font-black text-2xl lg:text-3xl text-white dark:text-primary-900 uppercase tracking-tight whitespace-nowrap">
                {c.name}
              </span>

              {/* Separator */}
              <span className="ml-6 text-primary-600 dark:text-primary-400 font-black text-2xl select-none">
                |
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA strip ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex items-center justify-between gap-4 relative z-10">
        <span className="font-pixel text-[8px] text-primary-600 dark:text-primary-400 uppercase tracking-widest">
          {about?.clients || `${clients.length}+`} {isEn ? "Partners Worldwide" : "Mitra di Seluruh Dunia"}
        </span>
        <a href="#contact" className="brut-btn pixel-shift-hover">
          <span className="font-pixel text-[9px]">
            {isEn ? "Work With Us" : "Bekerja Sama"}
          </span>
        </a>
      </div>
    </section>
  );
};

export default ClientsSection;
