import { useState, useRef, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { supabase } from "../../lib/supabase";
import { ArrowUpRight, Box, Filter } from "lucide-react";

/* ── Single Portfolio Card ── */
const PortfolioCard = ({ p, isEn, isFeatured = false }) => {
  const overlayRef = useRef(null);

  return (
  <div
    className={`group border-[3px] border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900 overflow-hidden cursor-pointer transition-all duration-300
      hover:shadow-[8px_8px_0_0_#2c7cb6] dark:hover:shadow-[6px_6px_0_0_#4c97d1]
      hover:-translate-y-1 hover:-translate-x-0.5
      ${isFeatured ? "shadow-[6px_6px_0_0_#004b74] dark:shadow-[6px_6px_0_0_#4c97d1]" : "shadow-[4px_4px_0_0_#2c7cb6] dark:shadow-[4px_4px_0_0_#2c7cb6]"}
    `}
    onClick={() => p.url && window.open(p.url.startsWith("http") ? p.url : `https://${p.url}`, "_blank")}
    onMouseEnter={() => { if (overlayRef.current) overlayRef.current.style.clipPath = "circle(150% at 50% 50%)"; }}
    onMouseLeave={() => { if (overlayRef.current) overlayRef.current.style.clipPath = "circle(0% at 50% 50%)"; }}
  >
    {/* Image container */}
    <div className={`relative overflow-hidden ${isFeatured ? "aspect-[16/7]" : "aspect-[16/10]"}`}>
      {p.image ? (
        <img
          src={p.image}
          width="600"
          height="400"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
          alt={isEn ? p.titleEn : p.titleId}
          style={{ transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-800">
          <Box size={40} strokeWidth={1} className="text-primary-300 dark:text-primary-600" />
        </div>
      )}

      {/* Hover overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-primary-800/90 dark:bg-primary-900/90 flex flex-col items-center justify-center gap-3 z-20 pointer-events-none"
        style={{
          clipPath: "circle(0% at 50% 50%)",
          transition: "clip-path 0.45s cubic-bezier(0.77, 0, 0.175, 1)",
        }}
      >
        <div className="border-2 border-primary-300 w-14 h-14 flex items-center justify-center">
          <ArrowUpRight size={22} className="text-white" />
        </div>
        <span className="text-xs font-bold text-white tracking-widest uppercase border border-primary-400/60 px-4 py-1.5 bg-primary-700/50">
          {isEn ? "View Project" : "Lihat Proyek"}
        </span>
      </div>
    </div>

    {/* Card content */}
    <div className="p-5">
      <div className="mb-3">
        <span className="neo-tag">
          {isEn ? p.categoryEn : p.categoryId}
        </span>
      </div>
      <h3 className="font-black text-primary-900 dark:text-primary-50 text-base leading-tight line-clamp-2 mb-2">
        {isEn ? p.titleEn : p.titleId}
      </h3>
      {p.descriptionEn && (
        <p className="text-primary-600 dark:text-primary-400 text-sm line-clamp-2 leading-relaxed font-medium">
          {isEn ? p.descriptionEn : p.descriptionId}
        </p>
      )}
    </div>
  </div>
  );
};

/* ── Main Component ── */
const PortfolioSection = ({ portfolio, lang }) => {
  const isEn = lang === "en";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleLimit, setVisibleLimit]         = useState(7);
  const containerRef = useRef(null);

  const categories = useMemo(() => {
    if (!portfolio) return [];
    const cats = [...new Set(portfolio.flatMap(p =>
      isEn ? (p.categoryEn ? [p.categoryEn] : []) : (p.categoryId ? [p.categoryId] : [])
    ))];
    return cats;
  }, [portfolio, isEn]);

  const filteredItems = useMemo(() => {
    if (!portfolio) return [];
    if (selectedCategory === "All") return portfolio;
    return portfolio.filter(p =>
      isEn ? p.categoryEn === selectedCategory : p.categoryId === selectedCategory
    );
  }, [portfolio, selectedCategory, isEn]);

  const visibleItems = filteredItems.slice(0, visibleLimit);

  /* GSAP entrance */
  useGSAP(() => {
    gsap.from(".portfolio-header", {
      y: -20, opacity: 0, duration: 0.6,
      scrollTrigger: { trigger: ".portfolio-header", start: "top 88%", toggleActions: "play none none reverse" },
    });
    gsap.from(".portfolio-filters", {
      y: 15, opacity: 0, duration: 0.5,
      scrollTrigger: { trigger: ".portfolio-filters", start: "top 88%", toggleActions: "play none none reverse" },
    });
    gsap.from(".portfolio-card-item", {
      y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: ".portfolio-grid", start: "top 85%", toggleActions: "play none none none" },
    });
  }, { scope: containerRef, dependencies: [selectedCategory] });

  if (!portfolio || portfolio.length === 0) return null;

  return (
    <section
      ref={containerRef}
      id="portfolio"
      className="py-24 bg-primary-50 dark:bg-primary-950 transition-colors relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-pixel-grid pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 brut-divider" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Header */}
        <div className="portfolio-header flex flex-col lg:flex-row gap-10 lg:items-end mb-12">
          <div className="lg:w-3/5">
            <span className="brut-label text-primary-500 border-primary-400 mb-5 inline-block">
              {'>'} {isEn ? "PORTFOLIO" : "PORTOFOLIO"}
            </span>
            <h2 className="text-5xl lg:text-7xl font-black text-primary-900 dark:text-primary-50 tracking-tight leading-none">
              {isEn ? "Our Work" : "Karya Kami"}
              <br />
              <span className="text-primary-300 dark:text-primary-600 italic font-light text-3xl lg:text-4xl">
                {isEn ? "Built to last." : "Dibangun untuk bertahan."}
              </span>
            </h2>
          </div>
          <div className="lg:w-2/5">
            <p className="text-primary-600 dark:text-primary-400 text-base leading-relaxed font-medium border-l-4 border-primary-400 pl-4">
              {isEn
                ? "Real projects. Real results. Browse our selected work across design, development, and digital media."
                : "Proyek nyata. Hasil nyata. Lihat pilihan karya kami di bidang desain, pengembangan, dan media digital."}
            </p>
          </div>
        </div>

        {/* Filter chips — horizontal scroll, not equal-width */}
        <div className="portfolio-filters flex flex-wrap gap-3 mb-10">
          {["All", ...categories].map((cat, i) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setVisibleLimit(7); }}
              className={`neo-tag cursor-pointer transition-all duration-200 pixel-shift-hover
                ${selectedCategory === cat
                  ? "!bg-primary-600 !border-primary-400 !text-white shadow-[3px_3px_0_0_#004b74]"
                  : "hover:!bg-primary-100 dark:hover:!bg-primary-800 hover:shadow-[2px_2px_0_0_#2c7cb6]"}
                ${i % 3 === 0 ? "!px-5" : i % 3 === 1 ? "!px-3" : "!px-4"}
              `}
            >
              {cat === "All" ? (isEn ? "All Work" : "Semua") : cat}
            </button>
          ))}
        </div>

        {/* Portfolio grid — bento-ish: first card spans 2 cols */}
        <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {visibleItems.map((p, i) => (
            <div
              key={p._id || i}
              className={`portfolio-card-item ${
                i === 0 ? "md:col-span-2 lg:col-span-2" : ""
              } ${
                i % 5 === 2 ? "lg:mt-6" :
                i % 5 === 4 ? "lg:-mt-4" :
                i % 7 === 3 ? "lg:mt-3" : ""
              }`}
            >
              <PortfolioCard
                p={p}
                isEn={isEn}
                isFeatured={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Load more */}
        {filteredItems.length > visibleLimit && (
          <div className="flex justify-center mt-14">
            <button
              onClick={() => setVisibleLimit(v => v + 6)}
              className="brut-btn pixel-shift-hover"
            >
              <span className="text-xs font-bold">
                {isEn ? "Load More" : "Tampilkan Lagi"}
              </span>
              <Filter size={14} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
