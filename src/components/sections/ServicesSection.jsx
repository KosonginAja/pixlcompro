import { useState, useRef, useEffect } from "react";
import { X, ArrowRight, CheckCircle2, MousePointer2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

/* ─────────────────────────────────────────
   Spotlight Item Varied Styles
───────────────────────────────────────── */
const spotlightStyles = [
  { bg: "bg-white dark:bg-primary-900", border: "border-primary-500", shadow: "hover:shadow-[4px_4px_0_0_#2c7cb6] dark:hover:shadow-[4px_4px_0_0_#4c97d1]", rotate: "-rotate-1", transform: "translate-y-1" },
  { bg: "bg-primary-50 dark:bg-primary-800", border: "border-primary-400", shadow: "hover:shadow-[-4px_4px_0_0_#2c7cb6] dark:hover:shadow-[-4px_4px_0_0_#4c97d1]", rotate: "rotate-1", transform: "-translate-y-2" },
  { bg: "bg-primary-100 dark:bg-primary-700", border: "border-primary-600", shadow: "hover:shadow-[4px_-4px_0_0_#2c7cb6] dark:hover:shadow-[4px_-4px_0_0_#4c97d1]", rotate: "-rotate-[1.5deg]", transform: "translate-y-2 translate-x-1" },
  { bg: "bg-white dark:bg-primary-900", border: "border-primary-300", shadow: "hover:shadow-[6px_6px_0_0_#2c7cb6] dark:hover:shadow-[6px_6px_0_0_#4c97d1]", rotate: "rotate-[0.5deg]", transform: "-translate-y-1 -translate-x-1" },
  { bg: "bg-primary-50 dark:bg-primary-800", border: "border-primary-500", shadow: "hover:shadow-[3px_3px_0_0_#2c7cb6] dark:hover:shadow-[3px_3px_0_0_#4c97d1]", rotate: "-rotate-[0.5deg]", transform: "translate-y-0" },
];

/* ─────────────────────────────────────────
   Spotlight Item card
───────────────────────────────────────── */
const SpotlightItem = ({ item, index, isEn, onClick }) => {
  const style = spotlightStyles[index % spotlightStyles.length];
  
  return (
    <button
      onClick={() => onClick(item, index)}
      className={`w-full text-left p-4 lg:p-5 border-[3px] ${style.border} ${style.bg} ${style.rotate} ${style.transform} ${style.shadow} transition-all duration-300 group flex items-start gap-4 cursor-pointer hover:scale-[1.02] hover:z-10 focus:outline-none`}
    >
      <div className={`w-8 h-8 shrink-0 flex items-center justify-center border-2 ${style.border} group-hover:bg-primary-500 group-hover:text-white transition-colors bg-white dark:bg-primary-950`}>
        <span className="font-pixel text-primary-500 group-hover:text-white text-[10px] leading-none transition-colors">
          {(index + 1).toString().padStart(2, "0")}
        </span>
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        {item.label && (
          <div className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-widest mb-1.5">
            {item.label}
          </div>
        )}
        <div className="text-primary-900 dark:text-primary-50 font-bold text-sm lg:text-base leading-tight pr-4">
          {isEn ? item.title_en : item.title_id}
        </div>
      </div>
      <MousePointer2
        size={16}
        className="shrink-0 text-primary-300 dark:text-primary-600 group-hover:text-primary-500 transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1 mt-1"
      />
    </button>
  );
};

/* ─────────────────────────────────────────
   Category card styles — asymmetric neo-brutalism
   Each index gets a different offset/rotation/color
───────────────────────────────────────── */
const catStyles = [
  {
    bg: "bg-primary-50 dark:bg-primary-900",
    rotate: "-rotate-[1.5deg]",
    translateX: "-translate-x-1",
    minH: "min-h-[130px]",
    pad: "p-6",
  },
  {
    bg: "bg-primary-100 dark:bg-primary-800",
    rotate: "rotate-[1deg]",
    translateX: "translate-x-2",
    minH: "min-h-[110px]",
    pad: "p-5",
  },
  {
    bg: "bg-primary-200 dark:bg-primary-700",
    rotate: "-rotate-[2deg]",
    translateX: "-translate-x-2",
    minH: "min-h-[120px]",
    pad: "p-7",
  },
  {
    bg: "bg-primary-100 dark:bg-primary-800",
    rotate: "rotate-[1.5deg]",
    translateX: "translate-x-1",
    minH: "min-h-[100px]",
    pad: "p-4",
  },
  {
    bg: "bg-primary-50 dark:bg-primary-900",
    rotate: "-rotate-[1deg]",
    translateX: "translate-x-3",
    minH: "min-h-[125px]",
    pad: "p-6",
  },
  {
    bg: "bg-primary-200 dark:bg-primary-700",
    rotate: "rotate-[2deg]",
    translateX: "-translate-x-1",
    minH: "min-h-[115px]",
    pad: "p-5",
  },
];

/* ─────────────────────────────────────────
   ServicesSection
───────────────────────────────────────── */
const ServicesSection = ({ services, about, lang }) => {
  const isEn = lang === "en";
  const [activeService, setActiveService] = useState(
    () => services?.[0] || null,
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [spotlightPage, setSpotlightPage] = useState(0);
  const ITEMS_PER_PAGE = 4;

  const visibleServices = showAllCategories
    ? services
    : services?.slice(0, 4) || [];

  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  const detailPanelRef = useRef(null);
  const modalRef = useRef(null);
  const isRevealed = useRef(false);

  /* ── Initial entrance — NO scrub (fix invisible bug) ── */
  useGSAP(
    () => {
      if (!services || services.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });

        tl.fromTo(
          ".services-header",
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        )
          .fromTo(
            ".services-subheading",
            { x: 20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
            "-=0.3",
          )
          /* service-card: only translate, NEVER touch opacity so they're always visible */
          .fromTo(
            ".service-card",
            { x: -30 },
            { x: 0, stagger: 0.07, duration: 0.5, ease: "back.out(1.3)" },
            "-=0.3",
          )
          .fromTo(
            ".service-spotlight",
            { clipPath: "inset(0 100% 0 0)", opacity: 0 },
            {
              clipPath: "inset(0 0% 0 0)",
              opacity: 1,
              duration: 0.8,
              ease: "power4.inOut",
            },
            "-=0.4",
          )
          .fromTo(
            ".spotlight-title",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4 },
            "-=0.5",
          )
          .fromTo(
            ".spotlight-desc",
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4 },
            "-=0.3",
          )
          .fromTo(
            ".spotlight-feature-item",
            { x: -10, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.06, duration: 0.3 },
            "-=0.3",
          )
          .fromTo(
            ".spotlight-cta",
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 },
            "-=0.2",
          )
          .from(
            ".spotlight-spec-box",
            { y: 15, opacity: 0, duration: 0.4 },
            "-=0.2",
          )
          .add(() => {
            isRevealed.current = true;
          });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          ".service-card",
          { x: -20 },
          {
            x: 0,
            stagger: 0.08,
            scrollTrigger: {
              trigger: ".service-grid",
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    },
    { scope: containerRef, dependencies: [services?.length] },
  );

  /* ── Category switch animation ── */
  useGSAP(
    () => {
      if (!activeService || !isRevealed.current || !spotlightRef.current)
        return;

      gsap.fromTo(
        spotlightRef.current,
        { opacity: 0, clipPath: "inset(0 80% 0 0)" },
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.5,
          ease: "power3.out",
        },
      );
      gsap.fromTo(
        [".spotlight-title", ".spotlight-desc"],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.1, ease: "power2.out" },
      );
      gsap.fromTo(
        ".spotlight-feature-item",
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, stagger: 0.06, duration: 0.3 },
      );
      gsap.fromTo(
        [".spotlight-cta", ".spotlight-spec-box"],
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 },
      );
    },
    { dependencies: [activeService?._id], scope: containerRef },
  );

  /* ── Detail panel animation ── */
  useGSAP(
    () => {
      if (selectedItem && detailPanelRef.current) {
        gsap.fromTo(
          detailPanelRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        );
      }
    },
    { dependencies: [selectedItem], scope: containerRef },
  );

  const handleOrderNow = (service, item = null) => {
    const phone = about?.contactPhone?.replace(/\D/g, "") || "";
    const waNumber = phone.startsWith("0") ? "62" + phone.slice(1) : phone;
    const title = isEn ? service.titleEn : service.titleId;
    const itemTitle = item ? (isEn ? item.title_en : item.title_id) : null;

    // Check for custom template from Supabase
    let template = isEn ? service.waTemplateEn : service.waTemplateId;
    let message = "";

    if (template) {
      // Replace safe placeholders if admin used them, e.g., [SERVICE] or [ITEM]
      message = template.replace(/\[SERVICE\]/gi, title);

      if (itemTitle) {
        // If template doesn't have [ITEM], we append it so the context isn't lost
        if (message.includes("[ITEM]")) {
          message = message.replace(/\[ITEM\]/gi, itemTitle);
        } else {
          message += isEn
            ? `\n\n(Specifically for: ${itemTitle})`
            : `\n\n(Khususnya untuk: ${itemTitle})`;
        }
      } else {
        // Remove empty item string if clicked from Main Service
        message = message.replace(/\[ITEM\]/gi, "");
      }
    } else {
      // Hardcoded fallback
      message = item
        ? isEn
          ? `Hi PixlCraft, I'm interested in "${itemTitle}" under ${title}. Can you explain more?`
          : `Halo PixlCraft, saya tertarik dengan "${itemTitle}" di ${title}. Bisa jelaskan lebih lanjut?`
        : isEn
          ? `Hi PixlCraft, I'm interested in your "${title}" service. Can you help?`
          : `Halo PixlCraft, saya tertarik dengan layanan "${title}". Bisa bantu?`;
    }

    // Clean up extra spaces
    message = message.trim();

    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  if (!services || services.length === 0) return null;
  const currentSpotlight = activeService || services[0];
  const spotlightItems = currentSpotlight?.spotlight_items || [];

  return (
    <section
      ref={containerRef}
      id="services"
      className="py-24 bg-white dark:bg-primary-950 transition-colors relative overflow-hidden scanlines"
    >
      <div className="absolute inset-0 bg-pixel-grid pointer-events-none" />
      <div className="section-stripe" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ── Header ── */}
        <div className="services-header-container flex flex-col lg:flex-row gap-12 lg:items-end mb-16">
          <div className="services-header lg:w-7/12">
            <span className="brut-label text-primary-500 border-primary-500 mb-6 inline-block">
              {">"} {isEn ? "SERVICES" : "LAYANAN"}
            </span>
            <h2 className="text-5xl lg:text-7xl font-black text-primary-900 dark:text-primary-50 tracking-tight leading-none">
              {isEn ? "Digital" : "Keunggulan"}
              <br />
              <span>
                {isEn ? "Excellence" : "Digital"}
              </span>
              <br />
              <span className="text-primary-300 dark:text-primary-700 italic font-light text-4xl lg:text-5xl">
                {isEn ? "Proven Results." : "Hasil Terbukti."}
              </span>
            </h2>
          </div>
          <div className="services-subheading lg:w-5/12">
            <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed font-medium border-l-4 border-primary-400 pl-4">
              {isEn
                ? "We don't just build websites. We engineer digital experiences that drive real business growth."
                : "Kami merancang pengalaman digital yang mendorong pertumbuhan bisnis nyata."}
            </p>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
          {/* ── Sidebar: Categories ── */}
          {/* sticky must be on the column wrapper — overflow-y on a separate inner div */}
          <div className="lg:col-span-4 sticky top-20 self-start">
            <div className="border-t-4 border-primary-500 pb-1">
              <span className="text-xs font-bold text-primary-400 dark:text-primary-600 uppercase tracking-widest block py-4">
                {isEn ? "CATEGORIES" : "KATEGORI"}
              </span>
            </div>

            {/* Categories list (expands naturally via Show More) */}
            <div className="service-grid flex flex-col gap-4 pt-2 pb-4">
              {visibleServices.map((service, index) => {
                const isActive = activeService?._id === service._id;
                const style = catStyles[index % catStyles.length];

                return (
                  <div
                    key={service._id}
                    onClick={() => {
                      setActiveService(service);
                      setSelectedItem(null);
                      setSpotlightPage(0);
                    }}
                    className={`service-card border-[3px] cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[100px] ${style.pad} ${
                      isActive
                        ? "bg-primary-600 border-primary-400 text-white shadow-[6px_6px_0_0_#004b74] rotate-0 translate-x-0 scale-[1.02] z-20"
                        : `${style.bg} border-primary-400 dark:border-primary-500 ${style.rotate} ${style.translateX} shadow-[4px_4px_0_0_#2c7cb6] dark:shadow-[4px_4px_0_0_#4c97d1] hover:shadow-[6px_6px_0_0_#004b74] hover:-translate-y-1 hover:scale-[1.01] hover:rotate-0 z-10 opacity-90 hover:opacity-100`
                    } pixel-shift-hover`}
                  >
                    <div
                      className={`text-xs font-bold mb-2 ${isActive ? "text-primary-200" : "text-primary-400 dark:text-primary-500"}`}
                    >
                      {(index + 1).toString().padStart(2, "0")}
                    </div>
                    <div>
                      <h4
                        className={`font-black text-base leading-tight mb-2 ${isActive ? "text-white" : "text-primary-900 dark:text-primary-100"}`}
                      >
                        {isEn ? service.titleEn : service.titleId}
                      </h4>
                      <div
                        className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest ${isActive ? "text-primary-200" : "text-primary-500 dark:text-primary-400"}`}
                      >
                        {isEn ? "Explore" : "Pilih"}{" "}
                        <ArrowRight size={10} strokeWidth={3} />
                      </div>
                    </div>
                    {isActive && (
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary-300" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Show More Toggle Button */}
            {services?.length > 4 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="w-full brut-btn-outline justify-center border-t-0 shadow-[0_4px_0_0_#2c7cb6] dark:shadow-[0_4px_0_0_#4c97d1]"
                style={{ paddingTop: "0.6rem", paddingBottom: "0.6rem" }}
              >
                <div className="text-xs font-semibold">
                  {showAllCategories
                    ? isEn
                      ? "Hide Categories"
                      : "Tutup Selengkapnya"
                    : isEn
                      ? `Show All (${services.length})`
                      : `Selengkapnya (${services.length})`}
                </div>
              </button>
            )}
          </div>

          {/* ── Spotlight Panel ── */}
          <div className="lg:col-span-8">
            {currentSpotlight && (
              <div
                ref={spotlightRef}
                className="service-spotlight border-4 border-primary-500 dark:border-primary-400 shadow-[8px_8px_0_0_#004b74] dark:shadow-[8px_8px_0_0_#4c97d1] bg-primary-50 dark:bg-primary-900 relative overflow-hidden"
                style={{ clipPath: "inset(0 0% 0 0)" }}
              >
                {/* Watermark index number — large, rotated, background */}
                <div
                  className="absolute -right-4 -top-6 font-pixel text-[120px] leading-none text-primary-200/30 dark:text-primary-700/20 select-none pointer-events-none"
                  style={{ transform: "rotate(12deg)" }}
                >
                  {(
                    services.findIndex((s) => s._id === currentSpotlight._id) +
                    1
                  )
                    .toString()
                    .padStart(2, "0")}
                </div>

                <div className="p-8 lg:p-10 relative z-10">
                  {/* Top meta — label floating top-left, category top-right */}
                  <div className="flex items-start justify-between mb-6">
                    <span className="brut-label text-primary-600 dark:text-primary-300 border-primary-500 text-[8px]">
                      {">"} {isEn ? "FEATURED SOLUTION" : "SOLUSI UTAMA"}
                    </span>
                    <span className="text-xs font-semibold text-primary-300 dark:text-primary-600 uppercase mt-1">
                      {isEn
                        ? currentSpotlight.categoryEn
                        : currentSpotlight.categoryId}
                    </span>
                  </div>

                  {/* Title — extra large, NOT centered */}
                  <h3 className="spotlight-title text-4xl lg:text-6xl font-black text-primary-900 dark:text-primary-50 mb-3 leading-none tracking-tight">
                    {isEn ? currentSpotlight.titleEn : currentSpotlight.titleId}
                  </h3>

                  {/* Accent line under title — NOT full width, offset */}
                  <div className="w-16 h-1.5 bg-primary-500 mb-6 ml-1" />

                  {/* Description — blockquote style, left border, max-width narrow */}
                  <p className="spotlight-desc text-primary-700 dark:text-primary-300 text-base leading-relaxed mb-8 max-w-lg border-l-4 border-primary-300 dark:border-primary-600 pl-4 italic">
                    {isEn
                      ? currentSpotlight.descriptionEn
                      : currentSpotlight.descriptionId}
                  </p>

                  {/* Features — staggered col widths */}
                  {currentSpotlight.features?.length > 0 && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                      {currentSpotlight.features.map((f, i) => (
                        <div
                          key={i}
                          className={`spotlight-feature-item flex items-start gap-2 text-primary-800 dark:text-primary-200 text-sm font-medium ${
                            i % 3 === 0 ? "w-full" : "w-auto"
                          }`}
                        >
                          <CheckCircle2
                            size={14}
                            className="text-primary-400 shrink-0 mt-0.5"
                          />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA — slightly indented, with decorative pixel dash before */}
                  <div className="spotlight-cta flex items-center gap-5 mb-8">
                    <div className="text-xs font-bold text-primary-400 select-none">
                      ——
                    </div>
                    <button
                      onClick={() => handleOrderNow(currentSpotlight)}
                      className="brut-btn"
                    >
                      <span className="text-xs font-bold">
                        {isEn ? "Get Started" : "Hubungi Kami"}
                      </span>
                      <ArrowRight size={14} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="brut-divider mb-8" />

                  {/* Spotlight Items — paginated: max 4 per page */}
                  <div>
                    <span className="text-xs font-bold text-primary-400 dark:text-primary-500 uppercase tracking-widest block mb-4">
                      {isEn ? "ITEM SERVICES" : "ITEM LAYANAN"}
                      {spotlightItems.length > ITEMS_PER_PAGE && (
                        <span className="ml-2 text-primary-300 dark:text-primary-600 font-normal">
                          ({spotlightPage * ITEMS_PER_PAGE + 1}–{Math.min((spotlightPage + 1) * ITEMS_PER_PAGE, spotlightItems.length)} of {spotlightItems.length})
                        </span>
                      )}
                    </span>
                    <div className="spotlight-spec-box grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                      {spotlightItems.length > 0 ? (
                        spotlightItems
                          .slice(spotlightPage * ITEMS_PER_PAGE, (spotlightPage + 1) * ITEMS_PER_PAGE)
                          .map((item, idx) => (
                            <SpotlightItem
                              key={spotlightPage * ITEMS_PER_PAGE + idx}
                              item={item}
                              index={spotlightPage * ITEMS_PER_PAGE + idx}
                              isEn={isEn}
                              onClick={(it, id) => {
                                setSelectedItem(it);
                                setSelectedIndex(id);
                              }}
                            />
                          ))
                      ) : (
                        <div className="md:col-span-2 border-2 border-dashed border-primary-200 dark:border-primary-700 p-8 text-center">
                          <p className="text-primary-300 dark:text-primary-600 text-xs uppercase tracking-widest">
                            {isEn ? "Specs Coming Soon" : "Spek Segera Hadir"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pagination buttons */}
                    {spotlightItems.length > ITEMS_PER_PAGE && (
                      <div className="flex items-center justify-end gap-2 mt-4">
                        <button
                          onClick={() => setSpotlightPage(p => Math.max(0, p - 1))}
                          disabled={spotlightPage === 0}
                          className="px-3 py-1.5 border-2 border-primary-400 text-primary-600 dark:text-primary-300 text-xs font-bold uppercase tracking-wider hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ← {isEn ? "Prev" : "Sebelum"}
                        </button>
                        <span className="text-xs text-primary-400 font-semibold">
                          {spotlightPage + 1} / {Math.ceil(spotlightItems.length / ITEMS_PER_PAGE)}
                        </span>
                        <button
                          onClick={() => setSpotlightPage(p => Math.min(Math.ceil(spotlightItems.length / ITEMS_PER_PAGE) - 1, p + 1))}
                          disabled={spotlightPage >= Math.ceil(spotlightItems.length / ITEMS_PER_PAGE) - 1}
                          className="px-3 py-1.5 border-2 border-primary-400 text-primary-600 dark:text-primary-300 text-xs font-bold uppercase tracking-wider hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {isEn ? "Next" : "Berikut"} →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Detail Overlay ── */}
                {selectedItem && (
                  <div
                    ref={detailPanelRef}
                    className="absolute inset-0 z-50 bg-primary-50 dark:bg-primary-900 border-4 border-primary-500 shadow-[8px_8px_0_0_#004b74] dark:shadow-[8px_8px_0_0_#4c97d1] flex flex-col overflow-hidden"
                  >
                    <div className="flex-1 p-8 lg:p-12 flex flex-col justify-between relative">
                      <div className="absolute inset-0 bg-dither pointer-events-none" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-14 h-14 bg-primary-500 border-2 border-primary-300 flex items-center justify-center">
                            <span className="font-pixel text-white text-sm">
                              {selectedIndex !== null
                                ? (selectedIndex + 1)
                                    .toString()
                                    .padStart(2, "0")
                                : "--"}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-primary-900 dark:text-primary-100 font-black text-2xl lg:text-3xl leading-tight">
                              {isEn
                                ? selectedItem.title_en
                                : selectedItem.title_id}
                            </h4>
                            {selectedItem.label && (
                              <span className="font-pixel text-primary-500 text-[9px] uppercase tracking-widest">
                                {selectedItem.label}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-primary-700 dark:text-primary-300 text-lg leading-relaxed font-light relative z-10">
                          {isEn ? selectedItem.desc_en : selectedItem.desc_id}
                        </p>
                      </div>
                      <div className="mt-8 flex items-center gap-4 relative z-10">
                        <button
                          onClick={() =>
                            handleOrderNow(currentSpotlight, selectedItem)
                          }
                          className="brut-btn"
                        >
                          <span className="text-xs font-bold">
                            {isEn ? "Inquire" : "Tanya Detail"}
                          </span>
                          <ArrowRight size={14} strokeWidth={3} />
                        </button>
                        <button
                          onClick={() => setSelectedItem(null)}
                          className="text-xs font-bold text-primary-400 hover:text-primary-600 uppercase tracking-widest transition-colors"
                        >
                          ← {isEn ? "Back" : "Kembali"}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-6 right-6 w-12 h-12 border-2 border-primary-500 bg-white dark:bg-primary-900 flex items-center justify-center hover:bg-primary-500 hover:text-white text-primary-600 dark:text-primary-300 transition-colors z-[60]"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
