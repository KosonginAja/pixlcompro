import AnimatedCounter from "../AnimatedCounter";
import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowRight, ArrowDown } from "lucide-react";

/* ── Lightweight typewriter hook (Looping) ── */
function useTypewriter(text, speed = 100, pause = 3000, delay = 1400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;

    let isDeleting = false;
    let i = 0;
    let timer;

    const type = () => {
      setDisplayed(text.slice(0, i));

      if (!isDeleting && i === text.length) {
        setDone(true);
        timer = setTimeout(() => {
          isDeleting = true;
          setDone(false);
          type();
        }, pause); // Pause at the end before deleting
      } else if (isDeleting && i === 0) {
        isDeleting = false;
        timer = setTimeout(type, 400); // Pause before re-typing
      } else {
        i = isDeleting ? i - 1 : i + 1;
        const currentSpeed = isDeleting ? speed / 2 : speed;
        timer = setTimeout(type, currentSpeed);
      }
    };

    const initialTimeout = setTimeout(type, delay);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timer);
    };
  }, [text, speed, pause, delay]);

  return { displayed, done };
}

const HeroSection = ({ hero, about, lang }) => {
  const isEn = lang === "en";
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const shapeRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-label", { y: -20, opacity: 0, duration: 0.6, delay: 0.05 })
        .from(".hero-title", { y: 60, opacity: 0, duration: 0.8 }, "-=0.3")
        .from(".hero-desc", { y: 30, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          ".hero-cta",
          { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 },
          "-=0.4",
        )
        .from(".hero-stats-row", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(
          ".hero-right-panel",
          { x: 80, opacity: 0, duration: 0.9, ease: "power2.out" },
          "-=0.7",
        );

      // Morph: background shape polygon changes as user scrolls
      if (shapeRef.current) {
        gsap.to(shapeRef.current, {
          clipPath: "polygon(10% 0%, 90% 5%, 100% 90%, 5% 100%)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "80% top",
            scrub: 2,
          },
        });
      }

      // Scroll-driven fade out of content
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1.5,
        },
        y: -50,
        opacity: 0,
      });
    },
    { scope: containerRef },
  );

  /* ── Headline split + typewriter — must be at component level (Rules of Hooks) ── */
  const rawHeadline = isEn ? hero?.headlineEn || "" : hero?.headlineId || "";
  const headlineWords = rawHeadline.trim().split(" ").filter(Boolean);
  const lastWord =
    headlineWords.length > 1
      ? headlineWords[headlineWords.length - 1]
      : rawHeadline;
  const firstPart =
    headlineWords.length > 1 ? headlineWords.slice(0, -1).join(" ") + " " : "";
  // Use a slower typing speed (120ms per char) and longer pause (4000ms) before deleting
  const { displayed, done } = useTypewriter(lastWord, 120, 4000, 100);

  const stats = [
    { val: about?.clients || "500+", labelEn: "Clients", labelId: "Klien" },
    { val: about?.projects || "1000+", labelEn: "Projects", labelId: "Proyek" },
    { val: about?.founded || "2015", labelEn: "Est.", labelId: "Berdiri" },
  ];

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center bg-primary-50 dark:bg-primary-900 transition-colors duration-500 overflow-hidden pt-16 scanlines"
    >
      {/* Pixel grid */}
      <div className="absolute inset-0 bg-pixel-grid pointer-events-none" />

      {/* Diagonal morph background shape */}
      <div
        ref={shapeRef}
        className="absolute -right-20 -top-20 w-[60vw] h-[80vh] bg-primary-100 dark:bg-primary-800 pointer-events-none opacity-60"
        style={{
          clipPath: "polygon(15% 0%, 100% 0%, 100% 85%, 0% 100%)",
          willChange: "clip-path",
        }}
      />

      {/* Left accent stripe */}
      <div className="section-stripe" />

      {/* Background "PX" pixel text */}
      <div className="absolute right-4 bottom-4 pointer-events-none select-none overflow-hidden">
        <span
          className="font-pixel text-[18vw] text-primary-100 dark:text-primary-800 leading-none"
          style={{ imageRendering: "pixelated" }}
        >
          PX
        </span>
      </div>

      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12 w-full py-20 grid grid-cols-1 lg:grid-cols-7 gap-16 items-center"
      >
        {/* ── Left Block (wider: 4/7) ── */}
        <div className="lg:col-span-4">
          {/* Badge */}
          {(isEn ? hero.badgeTextEn : hero.badgeTextId) && (
            <div className="hero-label inline-block mb-8">
              <span className="neo-tag">
                {">"} {isEn ? hero.badgeTextEn : hero.badgeTextId}
              </span>
            </div>
          )}

          {/* Main headline: first part glitch + last word typewriter in pixel font */}
          <h1 className="hero-title font-black text-primary-900 dark:text-primary-50 leading-[1.05] tracking-tight mb-6 text-5xl sm:text-6xl lg:text-7xl">
            {/* First words — glitch */}
            <span className="glitch" data-text={firstPart}>
              {firstPart}
            </span>

            {/* Last word — Press Start 2P + typewriter */}
            <span
              className="font-pixel block mt-3 text-primary-500 dark:text-primary-300"
              style={{
                fontSize: "clamp(1rem, 3.2vw, 2.4rem)",
                lineHeight: 1.4,
              }}
            >
              {displayed}
              {/* Pipe cursor `|` — blinks continuously */}
              <span
                style={{
                  marginLeft: "0.1em",
                  fontWeight: "400",
                  animation: "blink-cursor 1s step-end infinite",
                }}
              >
                |
              </span>
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="hero-desc text-primary-600 dark:text-primary-300 text-lg leading-relaxed mb-10 max-w-lg font-medium border-l-4 border-primary-400 pl-5">
            {isEn ? hero.subheadlineEn : hero.subheadlineId}
          </p>

          {/* CTAs */}
          <div className="hero-cta flex flex-wrap gap-4">
            <a
              href={`#${(hero.ctaLink || "contact").replace("#", "")}`}
              className="brut-btn pixel-shift-hover"
            >
              <span className="font-pixel text-[9px]">
                {isEn ? hero.ctaTextEn : hero.ctaTextId}
              </span>
              <ArrowRight size={14} strokeWidth={3} />
            </a>
            <a href="#services" className="brut-btn-outline pixel-shift-hover">
              <span className="font-pixel text-[9px]">
                {isEn ? "Our Services" : "Layanan Kami"}
              </span>
            </a>
          </div>

          {/* Stats row — intentionally uneven */}
          <div className="hero-stats-row flex flex-wrap gap-0 mt-14 border-t-2 border-primary-300 dark:border-primary-600 pt-8">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`flex-1 min-w-[80px] pr-6 ${
                  i % 2 === 0 ? "translate-y-2" : "-translate-y-1"
                } ${
                  i < stats.length - 1
                    ? "border-r-2 border-primary-200 dark:border-primary-700 mr-6"
                    : ""
                }`}
              >
                <div className="text-3xl font-black text-primary-800 dark:text-primary-100 leading-none mb-1">
                  <AnimatedCounter value={s.val} />
                </div>
                <div className="font-pixel text-[8px] text-primary-400 dark:text-primary-500 uppercase tracking-widest mt-2">
                  {isEn ? s.labelEn : s.labelId}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel (narrower, offset) ── */}
        <div
          className="hero-right-panel hidden lg:flex flex-col gap-6 lg:col-span-3"
          style={{ transform: "rotate(-1deg) translateY(1rem)" }}
        >
          {/* Studio profile card */}
          <div className="brut-card p-8 bg-primary-800 dark:bg-primary-100 border-primary-500">
            <div className="font-pixel text-[9px] text-primary-300 dark:text-primary-600 uppercase tracking-widest mb-4">
              {">"} Studio Profile
            </div>
            <p className="text-2xl font-black text-white dark:text-primary-900 leading-tight mb-6">
              {isEn
                ? "Where raw code meets bold design."
                : "Kode tegas bertemu desain yang berani."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: isEn ? "Founded" : "Didirikan",
                  val: about?.founded || "—",
                },
                {
                  label: isEn ? "Team Size" : "Anggota",
                  val: about?.teamCount ? `${about.teamCount}` : "—",
                },
                { label: "Email", val: about?.contactEmail || "—" },
                {
                  label: isEn ? "Phone" : "Telepon",
                  val: about?.contactPhone || "—",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-t-2 border-primary-600 dark:border-primary-300 pt-3"
                >
                  <div className="text-[9px] uppercase tracking-widest text-primary-400 dark:text-primary-500 font-pixel mb-1">
                    {item.label}
                  </div>
                  <div className="font-black text-sm truncate text-white dark:text-primary-900">
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator — offset translate */}
          <div
            className="border-2 border-primary-400 dark:border-primary-500 px-6 py-4 flex items-center justify-between bg-primary-50 dark:bg-primary-900"
            style={{ transform: "translateX(1rem)" }}
          >
            <span className="font-pixel text-[9px] text-primary-500 dark:text-primary-400 uppercase tracking-widest">
              {isEn ? "Scroll to explore" : "Scroll untuk jelajahi"}
            </span>
            <ArrowDown size={16} className="text-primary-500 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px]">
        <div className="brut-divider" />
      </div>
    </section>
  );
};

export default HeroSection;
