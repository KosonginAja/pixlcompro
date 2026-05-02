import AnimatedCounter from "../AnimatedCounter";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";

const AboutSection = ({ about, lang }) => {
  const isEn = lang === "en";
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      // Standard vertical fade-ins for all devices
      gsap.fromTo(".about-intro-text",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: ".about-intro-block", start: "top 85%", toggleActions: "play none none reverse" },
        });
        
      gsap.fromTo(".about-vm-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".about-vm-block", start: "top 85%", toggleActions: "play none none reverse" },
        });
        
      gsap.fromTo(".about-stat-card",
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.12, duration: 0.6,
          scrollTrigger: { trigger: ".about-stats-block", start: "top 85%", toggleActions: "play none none reverse" },
        });
    }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-white dark:bg-primary-950 relative overflow-hidden transition-colors py-16 lg:py-24"
    >
      <div className="absolute inset-0 bg-pixel-grid pointer-events-none" />

      <div className="flex flex-col gap-16 lg:gap-32 w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* ══════════════════════════
            BLOCK 1 — WHO WE ARE
        ══════════════════════════ */}
        <div className="about-intro-block w-full flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Image — slightly rotated */}
          <div className="about-image-frame relative w-full lg:w-1/2 -rotate-1 lg:-rotate-2">
            {about.image ? (
              <img
                src={about.image}
                alt="About PixlCraft"
                width="800"
                height="800"
                loading="lazy"
                className="w-full h-[420px] lg:h-[520px] object-cover border-4 border-primary-500 shadow-[10px_10px_0_0_#004b74] dark:shadow-[10px_10px_0_0_#4c97d1]"
              />
            ) : (
              <div className="w-full h-[420px] lg:h-[520px] bg-primary-100 dark:bg-primary-800 border-4 border-primary-500 shadow-[10px_10px_0_0_#004b74] dark:shadow-[10px_10px_0_0_#4c97d1] flex items-center justify-center">
                <span className="font-pixel text-primary-400 text-xs">IMAGE</span>
              </div>
            )}
            {/* Year badge — offset out of frame */}
            <div className="absolute -bottom-4 -right-2 lg:-bottom-6 lg:-right-6 bg-primary-600 border-4 border-primary-300 dark:border-primary-700 px-5 py-3 lg:px-6 lg:py-4 shadow-[5px_5px_0_0_#004b74] rotate-2">
              <div className="font-pixel text-white text-xl lg:text-2xl leading-none">{about.founded || "2015"}</div>
              <div className="text-primary-200 text-[10px] uppercase tracking-widest mt-1 font-semibold">
                {isEn ? "Est." : "Berdiri"}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="about-intro-text w-full lg:w-1/2">
            <div className="about-section-label mb-6">
              <span className="brut-label text-primary-500 border-primary-400">{'>'} {isEn ? "About" : "Tentang"}</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-primary-900 dark:text-primary-50 tracking-tight leading-none mb-8">
              {isEn ? "Who We Are" : "Siapa Kami"}
            </h2>
            <div className="w-20 h-1.5 bg-primary-500 mb-8" />
            <p className="text-primary-600 dark:text-primary-300 text-lg leading-relaxed whitespace-pre-wrap max-w-xl font-medium">
              {isEn ? about.descriptionEn : about.descriptionId}
            </p>
          </div>
        </div>

        {/* ══════════════════════════
            BLOCK 2 — VISION & MISSION
        ══════════════════════════ */}
        <div className="about-vm-block w-full">
          <div className="mb-14 morph-item text-center lg:text-left">
            <span className="brut-label text-primary-500 border-primary-400 mb-4 inline-block">
              {'>'} {isEn ? "Our Purpose" : "Tujuan Kami"}
            </span>
            <h3 className="text-4xl lg:text-5xl font-black text-primary-900 dark:text-primary-50 tracking-tight leading-none">
              {isEn ? "Vision & Mission" : "Visi & Misi"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Vision Card — rotated differently */}
            <div
              className="about-vm-card morph-item border-4 border-primary-400 p-8 lg:p-10 shadow-[6px_6px_0_0_#2c7cb6] dark:shadow-[6px_6px_0_0_#4c97d1] bg-white dark:bg-primary-800 hover:shadow-[10px_10px_0_0_#2c7cb6] dark:hover:shadow-[10px_10px_0_0_#4c97d1] transition-all duration-200 -rotate-1"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-500 border-2 border-primary-300 flex items-center justify-center">
                  <span className="text-white text-[11px] font-bold">01</span>
                </div>
                <span className="text-2xl lg:text-3xl font-black text-primary-900 dark:text-primary-50 uppercase tracking-tight">
                  {isEn ? "Vision" : "Visi"}
                </span>
              </div>
              <p className="text-primary-700 dark:text-primary-300 text-base md:text-lg leading-relaxed font-medium">
                {isEn ? about.visionEn : about.visionId}
              </p>
            </div>

            {/* Mission Card — opposite rotation */}
            <div
              className="about-vm-card morph-item border-4 border-primary-600 p-8 lg:p-10 shadow-[6px_6px_0_0_#004b74] dark:shadow-[6px_6px_0_0_#2c7cb6] bg-white dark:bg-primary-800 hover:shadow-[10px_10px_0_0_#004b74] dark:hover:shadow-[10px_10px_0_0_#2c7cb6] transition-all duration-200 rotate-1 lg:mt-4"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-700 dark:bg-primary-200 border-2 border-primary-500 flex items-center justify-center">
                  <span className="text-white dark:text-primary-900 text-[11px] font-bold">02</span>
                </div>
                <span className="text-2xl lg:text-3xl font-black text-primary-900 dark:text-primary-50 uppercase tracking-tight">
                  {isEn ? "Mission" : "Misi"}
                </span>
              </div>
              <p className="text-primary-700 dark:text-primary-300 text-base md:text-lg leading-relaxed font-medium">
                {isEn ? about.missionEn : about.missionId}
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════
            BLOCK 3 — IMPACT/STATS
        ══════════════════════════ */}
        <div className="about-stats-block w-full bg-primary-800 dark:bg-primary-900 p-8 lg:p-16 border-4 border-primary-400 dark:border-primary-700 shadow-[8px_8px_0_0_#2c7cb6] relative scanlines">
          <div className="absolute inset-0 bg-dither pointer-events-none opacity-50 dark:opacity-20" />
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center justify-between">
            <div className="lg:w-1/3 text-center lg:text-left">
              <h3 className="text-3xl lg:text-5xl font-black text-white dark:text-primary-100 tracking-tighter uppercase mb-6">
                {isEn ? "The Impact We Create" : "Dampak Yang Kami Berikan"}
              </h3>
              <a href="#portfolio" className="brut-btn pixel-shift-hover text-[10px] mt-4 inline-flex">
                <span className="text-[11px] font-bold tracking-wide">
                  {isEn ? "See Our Portfolio" : "Lihat Portofolio"}
                </span>
                <ArrowRight size={14} strokeWidth={3} />
              </a>
            </div>

            <div className="lg:w-2/3 flex flex-col sm:flex-row gap-8 w-full">
              {/* Stat 1 */}
              <div
                className="about-stat-card flex-1 border-4 border-primary-400 dark:border-primary-600 p-8 lg:p-10 shadow-[6px_6px_0_0_#2c7cb6] dark:shadow-[6px_6px_0_0_#004b74] relative overflow-hidden bg-primary-700 dark:bg-[#002642] -rotate-1"
              >
                <div className="absolute -top-4 -right-4 font-pixel text-[80px] text-primary-500/20 dark:text-primary-500/10 leading-none select-none">01</div>
                <div className="text-5xl lg:text-6xl font-black text-white dark:text-primary-50 mb-3 relative z-10">
                  <AnimatedCounter value={about.clients || "500+"} />
                </div>
                <div className="text-sm font-semibold uppercase tracking-widest text-primary-300 dark:text-primary-400">
                  {isEn ? "Global Clients" : "Klien Global"}
                </div>
              </div>

              {/* Stat 2 */}
              <div
                className="about-stat-card flex-1 border-4 border-primary-300 dark:border-primary-700 p-8 lg:p-10 shadow-[6px_6px_0_0_#4c97d1] dark:shadow-[6px_6px_0_0_#003352] relative overflow-hidden bg-primary-900 dark:bg-[#001424] rotate-1 lg:translate-y-2"
              >
                <div className="absolute -top-4 -right-4 font-pixel text-[80px] text-primary-700/30 dark:text-primary-700/20 leading-none select-none">02</div>
                <div className="text-5xl lg:text-6xl font-black text-white dark:text-primary-50 mb-3 relative z-10">
                  <AnimatedCounter value={about.projects || "1000+"} />
                </div>
                <div className="text-sm font-semibold uppercase tracking-widest text-primary-400 dark:text-primary-500">
                  {isEn ? "Projects Completed" : "Proyek Selesai"}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
