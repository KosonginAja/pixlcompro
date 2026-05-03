import { useState, useEffect, useRef } from "react";
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
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-eyebrow", { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.2 })
        .fromTo(".hero-h1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.15")
        .fromTo(".hero-sub", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.25")
        .fromTo(".hero-cta", { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4 }, "-=0.2")
        .fromTo(".hero-stat", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 }, "-=0.3");
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
      <div className="w-6 h-6 border-2 border-primary-200 dark:border-primary-700 border-t-primary-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans transition-colors">
      <Helmet><title>{isEn ? "PixlCraft Studio — Where Ideas Take Shape" : "PixlCraft Studio — Where Ideas Take Shape"}</title></Helmet>
      <Navbar about={about} lang={lang} />

      <main>
        {/* ═══ 1. HERO ═══ */}
        <section ref={heroRef} className="surface-hero relative min-h-[90vh] flex items-center pt-[55px]">
          <div className="max-w-7xl mx-auto px-5 md:px-8 w-full py-[55px] lg:py-[89px]">
            {/* 62/38 split */}
            <div className="grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-[34px] lg:gap-[55px] items-end">
              {/* Left — copy */}
              <div>
                {hero?.badgeTextEn && (
                  <span className="hero-eyebrow font-pixel text-[8px] text-primary-300 tracking-[0.2em] uppercase mb-5 block">{isEn ? hero.badgeTextEn : hero.badgeTextId}</span>
                )}
                <h1 className="hero-h1 font-extrabold text-white tracking-tight leading-[1.08] mb-5" style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)" }}>
                  {firstPart}
                  <span className="text-primary-300 block mt-1 font-pixel" style={{ fontSize: "clamp(0.55rem, 1.5vw, 0.75rem)", lineHeight: 2, letterSpacing: "0.05em" }}>
                    {typed}<span className="ml-0.5" style={{ animation: "blink-cursor 1s step-end infinite" }}>_</span>
                  </span>
                </h1>
                <p className="hero-sub text-primary-200 text-[15px] leading-relaxed mb-8 max-w-md">{isEn ? hero?.subheadlineEn : hero?.subheadlineId}</p>
                <div className="flex flex-wrap gap-3">
                  <Link to={`${lp}/contact`} className="hero-cta inline-flex items-center gap-2 px-5 py-2.5 bg-primary-400 text-white font-bold text-[13px] hover:bg-primary-500 transition-colors">
                    {isEn ? hero?.ctaTextEn : hero?.ctaTextId} <ArrowRight size={13} />
                  </Link>
                  <Link to={`${lp}/portfolio`} className="hero-cta inline-flex items-center gap-2 px-5 py-2.5 border border-primary-400/40 text-primary-200 font-medium text-[13px] hover:border-primary-300 hover:text-white transition-colors">
                    {isEn ? "See Our Work" : "Lihat Karya"} <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Right — stats */}
              <div className="hidden lg:block">
                <div className="border-t border-white/10 pt-5">
                  <div className="grid grid-cols-3 gap-0">
                    {stats.map((s, i) => (
                      <div key={i} className={`hero-stat text-center py-3 ${i < 2 ? "border-r border-white/10" : ""}`}>
                        <div className="text-2xl font-extrabold text-white leading-none mb-1"><AnimatedCounter value={s.val} /></div>
                        <div className="text-[10px] font-medium text-primary-400 tracking-wide uppercase">{isEn ? s.en : s.id}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 2. TRUST MARQUEE ═══ */}
        {testimonials.length > 0 && (
          <section className="surface-accent border-y border-primary-100 dark:border-primary-800">
            <div className="py-4 overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-primary-50 dark:from-primary-800/20 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-primary-50 dark:from-primary-800/20 to-transparent z-10 pointer-events-none" />
              <div className="flex items-center" style={{ animation: "marquee 30s linear infinite", width: "max-content" }}>
                {[...testimonials, ...testimonials].filter(c => c.name).map((c, i) => (
                  <div key={i} className="inline-flex items-center gap-2.5 mx-8 shrink-0">
                    {c.avatar ? <img src={c.avatar} alt={c.name} className="w-8 h-6 object-contain grayscale opacity-40" /> : null}
                    <span className="font-semibold text-sm text-primary-400/60 dark:text-primary-500 whitespace-nowrap">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ 3. SERVICES PREVIEW ═══ */}
        <SectionWrapper surface="surface-base">
          <SectionHeader eyebrow={isEn ? "Services" : "Layanan"} title={isEn ? "What We Build" : "Apa Yang Kami Bangun"} description={isEn ? "End-to-end digital solutions crafted with precision and purpose." : "Solusi digital end-to-end yang dibuat dengan presisi dan tujuan."} />
          <SectionContent>
            <div className="space-y-0 border-t border-primary-100 dark:border-primary-800">
              {services.slice(0, 4).map((s, i) => (
                <div key={s._id} className="gsap-fade grid grid-cols-1 md:grid-cols-[55px_1fr_38fr] gap-4 md:gap-8 items-baseline py-6 border-b border-primary-100 dark:border-primary-800 group hover:bg-primary-50/50 dark:hover:bg-primary-800/10 transition-colors px-2">
                  <span className="font-pixel text-[8px] text-primary-300 dark:text-primary-600 tracking-[0.15em]">{(i + 1).toString().padStart(2, "0")}</span>
                  <h3 className="font-bold text-[18px] text-primary-900 dark:text-white leading-snug">{isEn ? s.titleEn : s.titleId}</h3>
                  <p className="text-[#666] dark:text-primary-400 text-[14px] leading-relaxed line-clamp-2">{isEn ? s.descriptionEn : s.descriptionId}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 gsap-fade">
              <Link to={`${lp}/services`} className="inline-flex items-center gap-2 text-primary-400 font-semibold text-[13px] hover:gap-3 transition-all">
                {isEn ? "View All Services" : "Lihat Semua Layanan"} <ArrowRight size={13} />
              </Link>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* ═══ 4. PORTFOLIO ═══ */}
        <SectionWrapper surface="surface-raised">
          <SectionHeader eyebrow={isEn ? "Work" : "Karya"} title={isEn ? "Selected Projects" : "Proyek Terpilih"} />
          <SectionContent>
            {portfolio.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-5">
                {/* Feature — large */}
                <div className="gsap-fade group cursor-pointer" onClick={() => portfolio[0]?.url && window.open(portfolio[0].url.startsWith("http") ? portfolio[0].url : `https://${portfolio[0].url}`, "_blank")}>
                  <div className="relative overflow-hidden aspect-[16/10] mb-3">
                    {portfolio[0].image ? <img src={portfolio[0].image} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" loading="lazy" />
                      : <div className="w-full h-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center"><Box size={24} className="text-primary-200" /></div>}
                    <div className="absolute top-3 right-3 w-7 h-7 bg-white/90 dark:bg-primary-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight size={13} className="text-primary-900 dark:text-white" /></div>
                  </div>
                  <span className="font-pixel text-[7px] text-primary-400 tracking-[0.2em] uppercase">{isEn ? portfolio[0].categoryEn : portfolio[0].categoryId}</span>
                  <h3 className="font-bold text-primary-900 dark:text-white text-[15px] mt-0.5">{isEn ? portfolio[0].titleEn : portfolio[0].titleId}</h3>
                </div>

                {/* Smaller items */}
                <div className="flex flex-col gap-5">
                  {portfolio.slice(1, 3).map(p => (
                    <div key={p._id} className="gsap-fade group cursor-pointer" onClick={() => p.url && window.open(p.url.startsWith("http") ? p.url : `https://${p.url}`, "_blank")}>
                      <div className="relative overflow-hidden aspect-[16/10] mb-2.5">
                        {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" loading="lazy" />
                          : <div className="w-full h-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center"><Box size={20} className="text-primary-200" /></div>}
                        <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-white/90 dark:bg-primary-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight size={11} className="text-primary-900 dark:text-white" /></div>
                      </div>
                      <span className="font-pixel text-[7px] text-primary-400 tracking-[0.2em] uppercase">{isEn ? p.categoryEn : p.categoryId}</span>
                      <h3 className="font-bold text-primary-900 dark:text-white text-[14px] mt-0.5">{isEn ? p.titleEn : p.titleId}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-8 gsap-fade">
              <Link to={`${lp}/portfolio`} className="inline-flex items-center gap-2 text-primary-400 font-semibold text-[13px] hover:gap-3 transition-all">
                {isEn ? "View All Projects" : "Lihat Semua Proyek"} <ArrowRight size={13} />
              </Link>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* ═══ 5. ABOUT PREVIEW — 62/38 ═══ */}
        {about && (
          <SectionWrapper surface="surface-base">
            <SectionContent>
              <div className="grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-[34px] lg:gap-[55px] items-center gsap-fade">
                <div>
                  <span className="font-pixel text-[8px] text-primary-400 tracking-[0.2em] uppercase mb-4 block">{isEn ? "About" : "Tentang"}</span>
                  <h2 className="font-extrabold text-primary-900 dark:text-white tracking-tight leading-[1.1] mb-4" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}>{isEn ? "Your Website Should Work, Not Just Look Good" : "Website Harus Bekerja, Bukan Hanya Terlihat Bagus"}</h2>
                  <p className="text-[#666] dark:text-primary-300 text-[15px] leading-relaxed mb-6 max-w-md">{isEn ? about.descriptionEn : about.descriptionId}</p>
                  <Link to={`${lp}/about`} className="inline-flex items-center gap-2 text-primary-400 font-semibold text-[13px] hover:gap-3 transition-all">
                    {isEn ? "Learn More" : "Selengkapnya"} <ArrowRight size={13} />
                  </Link>
                </div>
                <div>
                  {about.image ? <img src={about.image} alt="About" className="w-full aspect-[4/5] object-cover" loading="lazy" />
                    : <div className="w-full aspect-[4/5] bg-primary-100 dark:bg-primary-800" />}
                </div>
              </div>
            </SectionContent>
          </SectionWrapper>
        )}

        {/* ═══ 6. PROCESS ═══ */}
        <SectionWrapper surface="surface-deep">
          <SectionHeader eyebrow={isEn ? "Process" : "Proses"} title={isEn ? "How We Deliver" : "Cara Kami Bekerja"} dark />
          <SectionContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-white/10">
              {[
                { en: "Discovery", id: "Riset", dEn: "Deep-dive into your brand, goals, and audience.", dId: "Mendalami brand, tujuan, dan audiens." },
                { en: "Strategy", id: "Strategi", dEn: "Craft a clear roadmap with measurable milestones.", dId: "Menyusun roadmap dengan milestone terukur." },
                { en: "Execution", id: "Eksekusi", dEn: "Build pixel-perfect, performant solutions.", dId: "Membangun solusi presisi dan performa tinggi." },
                { en: "Launch", id: "Peluncuran", dEn: "Deploy, test, and optimize continuously.", dId: "Deploy, testing, dan optimasi berkelanjutan." },
              ].map((step, i) => (
                <div key={i} className={`gsap-fade py-8 px-5 ${i < 3 ? "border-r border-white/10" : ""} border-b border-white/10`}>
                  <span className="font-pixel text-[8px] text-primary-500 tracking-[0.2em] block mb-3">{(i + 1).toString().padStart(2, "0")}</span>
                  <h3 className="font-bold text-[17px] text-white mb-2">{isEn ? step.en : step.id}</h3>
                  <p className="text-primary-400 text-[13px] leading-relaxed">{isEn ? step.dEn : step.dId}</p>
                </div>
              ))}
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* ═══ 7. CTA ═══ */}
        <SectionWrapper surface="surface-accent">
          <SectionContent>
            <div className="gsap-fade text-center max-w-xl mx-auto">
              <span className="font-pixel text-[8px] text-primary-400 tracking-[0.2em] uppercase mb-4 block">{isEn ? "Let's Talk" : "Mari Bicara"}</span>
              <h2 className="font-extrabold text-primary-900 dark:text-white tracking-tight leading-[1.1] mb-4" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}>{isEn ? "Ready to Build Something Real?" : "Siap Membangun Sesuatu yang Nyata?"}</h2>
              <p className="text-[#666] dark:text-primary-300 text-[15px] leading-relaxed mb-8">{isEn ? "Tell us about your project and let's create something remarkable." : "Ceritakan proyek Anda dan mari bangun sesuatu yang luar biasa."}</p>
              <Link to={`${lp}/contact`} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-400 text-white font-bold text-[13px] hover:bg-primary-500 transition-colors">
                {isEn ? "Start a Project" : "Mulai Proyek"} <ArrowRight size={13} />
              </Link>
            </div>
          </SectionContent>
        </SectionWrapper>
      </main>

      <Footer about={about} lang={lang} />
    </div>
  );
};

export default Home;
