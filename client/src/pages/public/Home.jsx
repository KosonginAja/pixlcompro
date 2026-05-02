import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowRight, ArrowUpRight, Box } from "lucide-react";
import AnimatedCounter from "../../components/AnimatedCounter";
import { SectionWrapper, SectionHeader, SectionContent } from "../../components/layout";
import Navbar from "../../components/sections/Navbar";
import Footer from "../../components/sections/Footer";

/* ── Typewriter (hero only) ── */
function useTypewriter(text, speed = 100, pause = 3000, delay = 1400) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!text) return;
    let del = false, i = 0, timer;
    const go = () => {
      setDisplayed(text.slice(0, i));
      if (!del && i === text.length) timer = setTimeout(() => { del = true; go(); }, pause);
      else if (del && i === 0) { del = false; timer = setTimeout(go, 400); }
      else { i = del ? i - 1 : i + 1; timer = setTimeout(go, del ? speed / 2 : speed); }
    };
    const init = setTimeout(go, delay);
    return () => { clearTimeout(init); clearTimeout(timer); };
  }, [text, speed, pause, delay]);
  return displayed;
}

const Home = ({ lang = "en" }) => {
  const isEn = lang === "en";
  const lp = isEn ? "" : "/id";
  const [hero, setHero] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [about, setAbout] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const f1 = async () => {
      try {
        const [h, a] = await Promise.all([supabase.from("hero").select("*").maybeSingle(), supabase.from("about").select("*").maybeSingle()]);
        if (h.data) setHero({ headlineEn: h.data.headline_en, headlineId: h.data.headline_id, subheadlineEn: h.data.subheadline_en, subheadlineId: h.data.subheadline_id, ctaTextEn: h.data.cta_text_en, ctaTextId: h.data.cta_text_id, ctaLink: h.data.cta_link, badgeTextEn: h.data.badge_text_en, badgeTextId: h.data.badge_text_id });
        if (a.data) setAbout({ descriptionEn: a.data.description_en, descriptionId: a.data.description_id, visionEn: a.data.vision_en, visionId: a.data.vision_id, missionEn: a.data.mission_en, missionId: a.data.mission_id, founded: a.data.founded, clients: a.data.clients, projects: a.data.projects, teamCount: a.data.team_count, contactEmail: a.data.contact_email, contactPhone: a.data.contact_phone, socials: a.data.socials, image: a.data.image, logo: a.data.logo });
      } catch (e) { console.error(e); } finally { setPageLoading(false); }
    };
    const f2 = async () => {
      try {
        const [s, p, t] = await Promise.all([
          supabase.from("services").select("*").order("order", { ascending: true }),
          supabase.from("portfolio").select("*").order("order", { ascending: true }),
          supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
        ]);
        if (s.data) setServices(s.data.map(x => ({ _id: x.id, titleEn: x.title_en, titleId: x.title_id, descriptionEn: x.description_en, descriptionId: x.description_id, features: x.features || [], icon: x.icon, categoryEn: x.category_en, categoryId: x.category_id })));
        if (p.data) setPortfolio(p.data.map(x => ({ _id: x.id, titleEn: x.title_en, titleId: x.title_id, descriptionEn: x.description_en, descriptionId: x.description_id, url: x.url, categoryEn: x.category_en, categoryId: x.category_id, image: x.image })));
        if (t.data) setTestimonials(t.data.map(x => ({ _id: x.id, name: x.name, avatar: x.image })));
      } catch (e) { console.error(e); }
    };
    f1(); f2();
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-badge", { y: -20, opacity: 0, duration: 0.5, delay: 0.1 })
      .from(".hero-h1", { y: 50, opacity: 0, duration: 0.8 }, "-=0.3")
      .from(".hero-sub", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".hero-cta", { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.3")
      .from(".hero-stat", { x: 60, opacity: 0, stagger: 0.12, duration: 0.7 }, "-=0.5");
  }, { scope: heroRef });

  const headline = isEn ? hero?.headlineEn || "" : hero?.headlineId || "";
  const words = headline.trim().split(" ").filter(Boolean);
  const lastWord = words.length > 1 ? words.pop() : headline;
  const firstPart = words.join(" ") + (words.length ? " " : "");
  const typed = useTypewriter(lastWord, 120, 4000, 100);

  const stats = [
    { val: about?.clients || "500+", en: "Clients Served", id: "Klien Dilayani" },
    { val: about?.projects || "1000+", en: "Projects Delivered", id: "Proyek Diselesaikan" },
    { val: about?.founded || "2015", en: "Established", id: "Tahun Berdiri" },
  ];

  if (pageLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-primary-900">
      <div className="w-10 h-10 border-[3px] border-primary-200 dark:border-primary-700 border-b-primary-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans selection:bg-primary-500 selection:text-white transition-colors">
      <Helmet><title>{isEn ? "PixlCraft Studio — Creative Digital Agency" : "PixlCraft Studio — Agensi Kreatif Digital"}</title></Helmet>
      <Navbar about={about} lang={lang} />

      <main>
        {/* ═══ 1. HERO — Fibonacci 62/38 ═══ */}
        <section ref={heroRef} className="relative min-h-screen flex items-center bg-white dark:bg-primary-900 transition-colors overflow-hidden pt-[72px]">
          {/* Background number */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.04]">
            <span className="font-pixel text-[30vw] text-primary-900 dark:text-primary-100 leading-none">01</span>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full py-20 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* LEFT — 3/5 = 60% ≈ Fibonacci */}
            <div className="lg:col-span-3">
              {hero?.badgeTextEn && (
                <div className="hero-badge mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary-400 text-xs font-bold text-primary-500 uppercase tracking-[0.15em]">
                    {isEn ? hero.badgeTextEn : hero.badgeTextId}
                  </span>
                </div>
              )}
              <h1 className="hero-h1 font-black text-primary-900 dark:text-primary-50 leading-[1.08] tracking-tight mb-8 text-[clamp(2.5rem,5.5vw,4.5rem)]">
                {firstPart}
                <span className="font-pixel text-primary-500 dark:text-primary-300 block mt-2" style={{ fontSize: "clamp(0.9rem, 2.8vw, 2rem)", lineHeight: 1.4 }}>
                  {typed}<span className="ml-0.5" style={{ animation: "blink-cursor 1s step-end infinite" }}>|</span>
                </span>
              </h1>
              <p className="hero-sub text-primary-600 dark:text-primary-300 text-lg leading-relaxed mb-10 max-w-lg font-medium">
                {isEn ? hero?.subheadlineEn : hero?.subheadlineId}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={`${lp}/contact`} className="hero-cta inline-flex items-center gap-2 px-7 py-4 bg-primary-500 text-white font-bold text-sm tracking-wide hover:bg-primary-600 transition-colors shadow-[4px_4px_0_0_#004b74]">
                  {isEn ? hero?.ctaTextEn : hero?.ctaTextId} <ArrowRight size={16} />
                </Link>
                <Link to={`${lp}/services`} className="hero-cta inline-flex items-center gap-2 px-7 py-4 border-2 border-primary-500 text-primary-500 font-bold text-sm tracking-wide hover:bg-primary-500 hover:text-white transition-all">
                  {isEn ? "Our Services" : "Layanan Kami"}
                </Link>
              </div>
            </div>

            {/* RIGHT — 2/5 = 40% ≈ Fibonacci */}
            <div className="lg:col-span-2 hidden lg:flex flex-col gap-5">
              {stats.map((s, i) => (
                <div key={i} className="hero-stat border-2 border-primary-200 dark:border-primary-700 p-6 bg-primary-50/50 dark:bg-primary-800/30 hover:border-primary-400 transition-colors">
                  <div className="text-3xl font-black text-primary-900 dark:text-primary-50 leading-none mb-2"><AnimatedCounter value={s.val} /></div>
                  <div className="text-xs font-semibold text-primary-500 uppercase tracking-[0.15em]">{isEn ? s.en : s.id}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-primary-200 dark:bg-primary-700" />
        </section>

        {/* ═══ 2. CREDIBILITY ═══ */}
        {testimonials.length > 0 && (
          <section className="bg-primary-50 dark:bg-primary-800/30 overflow-hidden transition-colors">
            <div className="py-6 overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-primary-50 dark:from-primary-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-primary-50 dark:from-primary-900 to-transparent z-10 pointer-events-none" />
              <div className="flex items-center" style={{ animation: "marquee 30s linear infinite", width: "max-content" }}>
                {[...testimonials, ...testimonials].filter(c => c.name).map((c, i) => (
                  <div key={i} className="inline-flex items-center gap-4 mx-12 shrink-0 group">
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-12 h-9 object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                    ) : (
                      <div className="w-9 h-9 bg-primary-200 dark:bg-primary-700 flex items-center justify-center"><span className="font-bold text-primary-500 text-xs">{c.name?.charAt(0)}</span></div>
                    )}
                    <span className="font-black text-xl text-primary-400 dark:text-primary-500 uppercase tracking-tight whitespace-nowrap">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ 3. SERVICES PREVIEW ═══ */}
        <SectionWrapper id="services-preview" bg="bg-white dark:bg-primary-950">
          <SectionHeader label={isEn ? "SERVICES" : "LAYANAN"} title={isEn ? "What We Do Best" : "Keahlian Kami"} description={isEn ? "End-to-end digital solutions engineered for measurable business growth." : "Solusi digital end-to-end yang dirancang untuk pertumbuhan bisnis terukur."} />
          <SectionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {services.slice(0, 4).map((s, i) => (
                <div key={s._id} className="gsap-fade group border-2 border-primary-200 dark:border-primary-700 p-8 hover:border-primary-400 hover:shadow-[4px_4px_0_0_#2c7cb6] dark:hover:shadow-[4px_4px_0_0_#4c97d1] transition-all duration-300">
                  <div className="flex items-start gap-5 mb-4">
                    <span className="font-pixel text-2xl text-primary-200 dark:text-primary-700 leading-none shrink-0">{(i + 1).toString().padStart(2, "0")}</span>
                    <h3 className="font-black text-lg text-primary-900 dark:text-primary-50 leading-tight">{isEn ? s.titleEn : s.titleId}</h3>
                  </div>
                  <p className="text-primary-600 dark:text-primary-400 text-sm leading-relaxed font-medium line-clamp-3 ml-12">{isEn ? s.descriptionEn : s.descriptionId}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 gsap-fade">
              <Link to={`${lp}/services`} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-bold text-sm tracking-wide hover:bg-primary-600 transition-colors shadow-[4px_4px_0_0_#004b74]">
                {isEn ? "View All Services" : "Lihat Semua Layanan"} <ArrowRight size={14} />
              </Link>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* ═══ 4. FEATURED PORTFOLIO — Fibonacci card sizing ═══ */}
        <SectionWrapper id="portfolio-preview" bg="bg-primary-50 dark:bg-primary-900">
          <SectionHeader label={isEn ? "PORTFOLIO" : "PORTOFOLIO"} title={isEn ? "Selected Work" : "Karya Terpilih"} />
          <SectionContent>
            {portfolio.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Featured — 3/5 = 60% ≈ golden ratio */}
                <div className="lg:col-span-3 gsap-fade"><PCard p={portfolio[0]} isEn={isEn} large /></div>
                <div className="lg:col-span-2 flex flex-col gap-8">
                  {portfolio.slice(1, 3).map(p => <div key={p._id} className="gsap-fade"><PCard p={p} isEn={isEn} /></div>)}
                </div>
              </div>
            )}
            <div className="mt-12 gsap-fade">
              <Link to={`${lp}/portfolio`} className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-500 font-bold text-sm tracking-wide hover:bg-primary-500 hover:text-white transition-all">
                {isEn ? "View All Projects" : "Lihat Semua Proyek"} <ArrowRight size={14} />
              </Link>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* ═══ 5. ABOUT PREVIEW — 62/38 ═══ */}
        {about && (
          <SectionWrapper id="about-preview" bg="bg-white dark:bg-primary-950">
            <SectionContent>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
                <div className="lg:col-span-3 gsap-fade">
                  <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.2em] mb-4 block">{isEn ? "ABOUT US" : "TENTANG KAMI"}</span>
                  <h2 className="text-3xl lg:text-[2.8rem] font-black text-primary-900 dark:text-primary-50 tracking-tight leading-[1.1] mb-6">{isEn ? "Building Digital Experiences That Matter" : "Membangun Pengalaman Digital yang Bermakna"}</h2>
                  <div className="w-12 h-[3px] bg-primary-500 mb-6" />
                  <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed font-medium mb-8 max-w-lg">{isEn ? about.descriptionEn : about.descriptionId}</p>
                  <Link to={`${lp}/about`} className="inline-flex items-center gap-2 text-primary-500 font-bold text-sm hover:gap-3 transition-all">
                    {isEn ? "Learn More About Us" : "Lebih Lanjut"} <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="lg:col-span-2 gsap-fade">
                  {about.image ? (
                    <img src={about.image} alt="About" className="w-full aspect-[4/5] object-cover border-2 border-primary-200 dark:border-primary-700 shadow-[6px_6px_0_0_#2c7cb6] dark:shadow-[6px_6px_0_0_#4c97d1]" loading="lazy" />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-primary-100 dark:bg-primary-800 border-2 border-primary-200 flex items-center justify-center"><span className="text-primary-400 text-sm">Image</span></div>
                  )}
                </div>
              </div>
            </SectionContent>
          </SectionWrapper>
        )}

        {/* ═══ 6. PROCESS ═══ */}
        <SectionWrapper id="process" bg="bg-primary-900 dark:bg-primary-50">
          <SectionHeader label={isEn ? "PROCESS" : "PROSES"} title={isEn ? "How We Deliver Results" : "Cara Kami Bekerja"} className="[&_h2]:text-white dark:[&_h2]:text-primary-900 [&_span]:text-primary-400" />
          <SectionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { en: "Discovery", id: "Riset", dEn: "Deep-dive into your brand, goals, and target audience.", dId: "Mendalami brand, tujuan, dan audiens target Anda." },
                { en: "Strategy", id: "Strategi", dEn: "Craft a roadmap with clear milestones and deliverables.", dId: "Menyusun roadmap dengan milestone yang jelas." },
                { en: "Execution", id: "Eksekusi", dEn: "Build pixel-perfect, performant solutions with modern tools.", dId: "Membangun solusi presisi dengan teknologi modern." },
                { en: "Launch", id: "Peluncuran", dEn: "Deploy, test, and provide ongoing support and optimization.", dId: "Deploy, testing, dan dukungan berkelanjutan." },
              ].map((step, i) => (
                <div key={i} className="gsap-fade p-8 border border-primary-700 dark:border-primary-300 bg-primary-800/50 dark:bg-primary-100/50">
                  <span className="font-pixel text-3xl text-primary-600 dark:text-primary-400 leading-none block mb-4">{(i + 1).toString().padStart(2, "0")}</span>
                  <h3 className="font-black text-lg text-white dark:text-primary-900 tracking-tight mb-3">{isEn ? step.en : step.id}</h3>
                  <p className="text-primary-400 dark:text-primary-600 text-sm leading-relaxed font-medium">{isEn ? step.dEn : step.dId}</p>
                </div>
              ))}
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* ═══ 7. CTA ═══ */}
        <SectionWrapper id="cta" bg="bg-white dark:bg-primary-950">
          <SectionContent>
            <div className="gsap-fade border-2 border-primary-200 dark:border-primary-700 shadow-[6px_6px_0_0_#2c7cb6] dark:shadow-[6px_6px_0_0_#4c97d1] p-12 lg:p-20 text-center">
              <h2 className="text-3xl lg:text-5xl font-black text-primary-900 dark:text-primary-50 tracking-tight leading-tight mb-6">{isEn ? "Ready to Elevate Your Digital Presence?" : "Siap Tingkatkan Kehadiran Digital Anda?"}</h2>
              <div className="w-12 h-[3px] bg-primary-500 mx-auto mb-8" />
              <p className="text-primary-600 dark:text-primary-300 text-base mb-10 max-w-lg mx-auto font-medium">{isEn ? "Let's discuss your project and create something remarkable together." : "Mari diskusikan proyek Anda dan bangun sesuatu yang luar biasa bersama."}</p>
              <Link to={`${lp}/contact`} className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-bold text-sm tracking-wide hover:bg-primary-600 transition-colors shadow-[4px_4px_0_0_#004b74]">
                {isEn ? "Start a Project" : "Mulai Proyek"} <ArrowRight size={14} />
              </Link>
            </div>
          </SectionContent>
        </SectionWrapper>
      </main>

      <Footer about={about} lang={lang} />
    </div>
  );
};

/* ── Portfolio Card ── */
const PCard = ({ p, isEn, large = false }) => {
  const ref = useRef(null);
  return (
    <div className="group border-2 border-primary-200 dark:border-primary-700 overflow-hidden cursor-pointer hover:border-primary-400 hover:shadow-[6px_6px_0_0_#2c7cb6] dark:hover:shadow-[4px_4px_0_0_#4c97d1] transition-all duration-300"
      onClick={() => p.url && window.open(p.url.startsWith("http") ? p.url : `https://${p.url}`, "_blank")}
      onMouseEnter={() => { if (ref.current) ref.current.style.clipPath = "circle(150% at 50% 50%)"; }}
      onMouseLeave={() => { if (ref.current) ref.current.style.clipPath = "circle(0% at 50% 50%)"; }}>
      <div className={`relative overflow-hidden ${large ? "aspect-[16/10]" : "aspect-[16/10]"}`}>
        {p.image ? <img src={p.image} alt={isEn ? p.titleEn : p.titleId} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          : <div className="w-full h-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center"><Box size={32} className="text-primary-300" /></div>}
        <div ref={ref} className="absolute inset-0 bg-primary-900/85 flex flex-col items-center justify-center gap-3 pointer-events-none" style={{ clipPath: "circle(0% at 50% 50%)", transition: "clip-path 0.4s cubic-bezier(0.77,0,0.175,1)" }}>
          <ArrowUpRight size={24} className="text-white" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">{isEn ? "View Project" : "Lihat Proyek"}</span>
        </div>
      </div>
      <div className="p-5">
        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.15em] block mb-1">{isEn ? p.categoryEn : p.categoryId}</span>
        <h3 className="font-black text-primary-900 dark:text-primary-50 text-base leading-tight">{isEn ? p.titleEn : p.titleId}</h3>
      </div>
    </div>
  );
};

export default Home;
