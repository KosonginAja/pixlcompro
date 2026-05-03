import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { gsap } from "gsap";
import { ArrowRight, ArrowUpRight, Box } from "lucide-react";
import AnimatedCounter from "../../components/AnimatedCounter";
import { SectionWrapper, SectionHeader, SectionContent } from "../../components/layout";
import Navbar from "../../components/sections/Navbar";
import Footer from "../../components/sections/Footer";

/* ── Typewriter ── */
function useTypewriter(text, speed = 100, pause = 3000, delay = 1400) {
  const [d, setD] = useState("");
  useEffect(() => {
    if (!text) return;
    let del = false, i = 0, timer;
    const go = () => {
      setD(text.slice(0, i));
      if (!del && i === text.length) timer = setTimeout(() => { del = true; go(); }, pause);
      else if (del && i === 0) { del = false; timer = setTimeout(go, 400); }
      else { i = del ? i - 1 : i + 1; timer = setTimeout(go, del ? speed / 2 : speed); }
    };
    const init = setTimeout(go, delay);
    return () => { clearTimeout(init); clearTimeout(timer); };
  }, [text, speed, pause, delay]);
  return d;
}

const Home = ({ lang = "en" }) => {
  const isEn = lang === "en";
  const lp = isEn ? "" : "/id";
  const [hero, setHero] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const f1 = async () => {
      try {
        const [h, a] = await Promise.all([supabase.from("hero").select("*").maybeSingle(), supabase.from("about").select("*").maybeSingle()]);
        if (h.data) setHero({ headlineEn: h.data.headline_en, headlineId: h.data.headline_id, subheadlineEn: h.data.subheadline_en, subheadlineId: h.data.subheadline_id, ctaTextEn: h.data.cta_text_en, ctaTextId: h.data.cta_text_id, ctaLink: h.data.cta_link, badgeTextEn: h.data.badge_text_en, badgeTextId: h.data.badge_text_id });
        if (a.data) setAbout({ descriptionEn: a.data.description_en, descriptionId: a.data.description_id, visionEn: a.data.vision_en, visionId: a.data.vision_id, missionEn: a.data.mission_en, missionId: a.data.mission_id, founded: a.data.founded, clients: a.data.clients, projects: a.data.projects, teamCount: a.data.team_count, contactEmail: a.data.contact_email, contactPhone: a.data.contact_phone, socials: a.data.socials, image: a.data.image, logo: a.data.logo });
      } catch (e) { console.error(e); } finally { setLoading(false); }
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

  useEffect(() => {
    if (loading || !heroRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".hero-badge", { y: -15, opacity: 0, duration: 0.4, delay: 0.1 })
        .from(".hero-h1", { y: 30, opacity: 0, duration: 0.6 }, "-=0.2")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(".hero-cta", { y: 15, opacity: 0, stagger: 0.08, duration: 0.4 }, "-=0.2")
        .from(".hero-stat", { x: 30, opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.3");
    }, heroRef);
    return () => ctx.revert();
  }, [loading]);

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-primary-900">
      <div className="w-8 h-8 border-2 border-primary-200 dark:border-primary-700 border-b-primary-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans selection:bg-primary-400/30 selection:text-primary-900 dark:selection:text-white transition-colors">
      <Helmet><title>{isEn ? "PixlCraft Studio — Creative Digital Agency" : "PixlCraft Studio — Agensi Kreatif Digital"}</title></Helmet>
      <Navbar about={about} lang={lang} />

      <main>
        {/* ═══ 1. HERO — gradient bg, 60/40 ═══ */}
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-16" style={{ background: "linear-gradient(135deg, #001d32 0%, #003352 50%, #004b74 100%)" }}>
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full py-20 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* LEFT 3/5 = 60% */}
            <div className="lg:col-span-3">
              {hero?.badgeTextEn && (
                <div className="hero-badge mb-5">
                  <span className="eyebrow text-primary-300">{isEn ? hero.badgeTextEn : hero.badgeTextId}</span>
                </div>
              )}
              <h1 className="hero-h1 font-extrabold text-white leading-[1.1] tracking-tight mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
                {firstPart}
                <span className="font-pixel text-primary-300 block mt-2" style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.85rem)", lineHeight: 2 }}>
                  {typed}<span className="ml-0.5" style={{ animation: "blink-cursor 1s step-end infinite" }}>_</span>
                </span>
              </h1>
              <p className="hero-sub text-primary-200 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
                {isEn ? hero?.subheadlineEn : hero?.subheadlineId}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={`${lp}/contact`} className="hero-cta inline-flex items-center gap-2 px-6 py-3 bg-primary-400 text-white font-bold text-sm rounded-md hover:bg-primary-300 transition-colors">
                  {isEn ? hero?.ctaTextEn : hero?.ctaTextId} <ArrowRight size={15} />
                </Link>
                <Link to={`${lp}/services`} className="hero-cta inline-flex items-center gap-2 px-6 py-3 border border-primary-400 text-primary-200 font-semibold text-sm rounded-md hover:bg-white/5 transition-colors">
                  {isEn ? "Our Services" : "Layanan Kami"}
                </Link>
              </div>
            </div>

            {/* RIGHT 2/5 = 40% */}
            <div className="lg:col-span-2 hidden lg:flex flex-col gap-4">
              {stats.map((s, i) => (
                <div key={i} className="hero-stat p-5 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 transition-colors">
                  <div className="text-3xl font-extrabold text-white leading-none mb-1"><AnimatedCounter value={s.val} /></div>
                  <div className="text-xs font-medium text-primary-300 tracking-wide">{isEn ? s.en : s.id}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 2. CREDIBILITY / TRUST ═══ */}
        {testimonials.length > 0 && (
          <section className="bg-primary-50 dark:bg-primary-800/20 border-b border-primary-100 dark:border-primary-800 transition-colors">
            <div className="py-5 overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-primary-50 dark:from-primary-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-primary-50 dark:from-primary-900 to-transparent z-10 pointer-events-none" />
              <div className="flex items-center" style={{ animation: "marquee 35s linear infinite", width: "max-content" }}>
                {[...testimonials, ...testimonials].filter(c => c.name).map((c, i) => (
                  <div key={i} className="inline-flex items-center gap-3 mx-10 shrink-0 group">
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-10 h-8 object-contain grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-300" />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-md flex items-center justify-center"><span className="font-bold text-primary-400 text-xs">{c.name?.charAt(0)}</span></div>
                    )}
                    <span className="font-bold text-lg text-primary-300 dark:text-primary-600 tracking-tight whitespace-nowrap">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ 3. SERVICES PREVIEW ═══ */}
        <SectionWrapper bg="bg-white dark:bg-primary-900">
          <SectionHeader label={isEn ? "Services" : "Layanan"} title={isEn ? "What We Do Best" : "Keahlian Kami"} description={isEn ? "End-to-end digital solutions engineered for measurable business growth." : "Solusi digital end-to-end untuk pertumbuhan bisnis terukur."} />
          <SectionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {services.slice(0, 4).map((s, i) => (
                <div key={s._id} className="gsap-fade group p-7 rounded-lg border border-primary-100 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-800/20 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all duration-300">
                  <div className="flex items-start gap-4 mb-3">
                    <span className="font-pixel text-[9px] text-primary-300 dark:text-primary-600 leading-none shrink-0 mt-1">{(i + 1).toString().padStart(2, "0")}</span>
                    <h3 className="font-bold text-lg text-primary-900 dark:text-white leading-snug">{isEn ? s.titleEn : s.titleId}</h3>
                  </div>
                  <p className="text-primary-600 dark:text-primary-400 text-sm leading-relaxed ml-9 line-clamp-2">{isEn ? s.descriptionEn : s.descriptionId}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 gsap-fade">
              <Link to={`${lp}/services`} className="inline-flex items-center gap-2 text-primary-400 font-semibold text-sm hover:gap-3 transition-all accent-line">
                {isEn ? "View All Services" : "Lihat Semua Layanan"} <ArrowRight size={14} />
              </Link>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* ═══ 4. FEATURED PORTFOLIO ═══ */}
        <SectionWrapper bg="bg-primary-50 dark:bg-primary-800/10">
          <SectionHeader label={isEn ? "Portfolio" : "Portofolio"} title={isEn ? "Selected Work" : "Karya Terpilih"} />
          <SectionContent>
            {portfolio.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                <div className="lg:col-span-3 gsap-fade"><PCard p={portfolio[0]} isEn={isEn} large /></div>
                <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
                  {portfolio.slice(1, 3).map(p => <div key={p._id} className="gsap-fade"><PCard p={p} isEn={isEn} /></div>)}
                </div>
              </div>
            )}
            <div className="mt-10 gsap-fade">
              <Link to={`${lp}/portfolio`} className="inline-flex items-center gap-2 text-primary-400 font-semibold text-sm hover:gap-3 transition-all accent-line">
                {isEn ? "View All Projects" : "Lihat Semua Proyek"} <ArrowRight size={14} />
              </Link>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* ═══ 5. ABOUT PREVIEW — 60/40 ═══ */}
        {about && (
          <SectionWrapper bg="bg-white dark:bg-primary-900">
            <SectionContent>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
                <div className="lg:col-span-3 gsap-fade">
                  <span className="eyebrow mb-4 block">{isEn ? "About Us" : "Tentang Kami"}</span>
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-primary-900 dark:text-white tracking-tight leading-[1.15] mb-5">{isEn ? "Your Website Should Work, Not Just Look Good" : "Website Anda Harus Bekerja, Bukan Hanya Terlihat Bagus"}</h2>
                  <div className="section-divider mb-5" />
                  <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed mb-6 max-w-lg">{isEn ? about.descriptionEn : about.descriptionId}</p>
                  <Link to={`${lp}/about`} className="inline-flex items-center gap-2 text-primary-400 font-semibold text-sm hover:gap-3 transition-all accent-line">
                    {isEn ? "Learn More" : "Selengkapnya"} <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="lg:col-span-2 gsap-fade">
                  {about.image ? (
                    <img src={about.image} alt="About" className="w-full aspect-[4/5] object-cover rounded-lg" loading="lazy" />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center"><span className="text-primary-300 text-sm">Image</span></div>
                  )}
                </div>
              </div>
            </SectionContent>
          </SectionWrapper>
        )}

        {/* ═══ 6. PROCESS ═══ */}
        <SectionWrapper bg="bg-primary-900 dark:bg-primary-900">
          <SectionHeader label={isEn ? "Process" : "Proses"} title={isEn ? "How We Deliver Results" : "Cara Kami Bekerja"} className="[&_h2]:text-white [&_.eyebrow]:text-primary-400" />
          <SectionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { en: "Discovery", id: "Riset", dEn: "Deep-dive into your brand, goals, and audience.", dId: "Mendalami brand, tujuan, dan audiens Anda." },
                { en: "Strategy", id: "Strategi", dEn: "Craft a clear roadmap with measurable milestones.", dId: "Menyusun roadmap dengan milestone terukur." },
                { en: "Execution", id: "Eksekusi", dEn: "Build pixel-perfect, performant solutions.", dId: "Membangun solusi presisi dan performa tinggi." },
                { en: "Launch", id: "Peluncuran", dEn: "Deploy, test, and provide ongoing optimization.", dId: "Deploy, testing, dan optimasi berkelanjutan." },
              ].map((step, i) => (
                <div key={i} className="gsap-fade p-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                  <span className="font-pixel text-[9px] text-primary-500 block mb-3">{(i + 1).toString().padStart(2, "0")}</span>
                  <h3 className="font-bold text-lg text-white mb-2">{isEn ? step.en : step.id}</h3>
                  <p className="text-primary-400 text-sm leading-relaxed">{isEn ? step.dEn : step.dId}</p>
                </div>
              ))}
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* ═══ 7. CTA ═══ */}
        <SectionWrapper bg="bg-white dark:bg-primary-950">
          <SectionContent>
            <div className="gsap-fade rounded-xl p-12 lg:p-20 text-center" style={{ background: "linear-gradient(135deg, #001d32 0%, #003352 100%)" }}>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">{isEn ? "Ready to Elevate Your Digital Presence?" : "Siap Tingkatkan Kehadiran Digital Anda?"}</h2>
              <p className="text-primary-300 text-base mb-8 max-w-md mx-auto">{isEn ? "Let's discuss your project and create something remarkable." : "Mari diskusikan proyek Anda dan bangun sesuatu yang luar biasa."}</p>
              <Link to={`${lp}/contact`} className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-400 text-white font-bold text-sm rounded-md hover:bg-primary-300 transition-colors">
                {isEn ? "Start a Project" : "Mulai Proyek"} <ArrowRight size={15} />
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
    <div className="group rounded-lg overflow-hidden cursor-pointer border border-primary-100 dark:border-primary-800 hover:shadow-md transition-all duration-300 bg-white dark:bg-primary-800/20"
      onClick={() => p.url && window.open(p.url.startsWith("http") ? p.url : `https://${p.url}`, "_blank")}
      onMouseEnter={() => { if (ref.current) ref.current.style.opacity = "1"; }}
      onMouseLeave={() => { if (ref.current) ref.current.style.opacity = "0"; }}>
      <div className={`relative overflow-hidden ${large ? "aspect-[16/10]" : "aspect-[16/10]"}`}>
        {p.image ? <img src={p.image} alt={isEn ? p.titleEn : p.titleId} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" loading="lazy" />
          : <div className="w-full h-full bg-primary-50 dark:bg-primary-800 flex items-center justify-center"><Box size={28} className="text-primary-200" /></div>}
        <div ref={ref} className="absolute inset-0 bg-primary-900/70 flex items-center justify-center opacity-0 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"><ArrowUpRight size={18} className="text-white" /></div>
        </div>
      </div>
      <div className="p-4">
        <span className="text-[10px] font-semibold text-primary-400 uppercase tracking-[0.12em] block mb-1">{isEn ? p.categoryEn : p.categoryId}</span>
        <h3 className="font-bold text-primary-900 dark:text-white text-sm leading-snug">{isEn ? p.titleEn : p.titleId}</h3>
      </div>
    </div>
  );
};

export default Home;
