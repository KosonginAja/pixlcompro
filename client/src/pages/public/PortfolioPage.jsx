import { useState, useEffect, useRef, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../lib/supabase";
import { ArrowUpRight, Box } from "lucide-react";
import { SectionWrapper, SectionContent } from "../../components/layout";
import Navbar from "../../components/sections/Navbar";
import Footer from "../../components/sections/Footer";

const Card = ({ p, isEn, large = false }) => {
  const ref = useRef(null);
  return (
    <div className="group border-2 border-primary-200 dark:border-primary-700 overflow-hidden cursor-pointer hover:border-primary-400 hover:shadow-[6px_6px_0_0_#2c7cb6] dark:hover:shadow-[4px_4px_0_0_#4c97d1] transition-all duration-300"
      onClick={() => p.url && window.open(p.url.startsWith("http") ? p.url : `https://${p.url}`, "_blank")}
      onMouseEnter={() => { if (ref.current) ref.current.style.clipPath = "circle(150% at 50% 50%)"; }}
      onMouseLeave={() => { if (ref.current) ref.current.style.clipPath = "circle(0% at 50% 50%)"; }}>
      <div className={`relative overflow-hidden ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {p.image ? <img src={p.image} alt={isEn ? p.titleEn : p.titleId} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          : <div className="w-full h-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center"><Box size={32} className="text-primary-300" /></div>}
        <div ref={ref} className="absolute inset-0 bg-primary-900/85 flex flex-col items-center justify-center gap-3 pointer-events-none" style={{ clipPath: "circle(0% at 50% 50%)", transition: "clip-path 0.4s cubic-bezier(0.77,0,0.175,1)" }}>
          <ArrowUpRight size={24} className="text-white" /><span className="text-xs font-bold text-white tracking-widest uppercase">{isEn ? "View Project" : "Lihat Proyek"}</span>
        </div>
      </div>
      <div className="p-5">
        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.15em] block mb-1">{isEn ? p.categoryEn : p.categoryId}</span>
        <h3 className="font-black text-primary-900 dark:text-primary-50 text-base leading-tight">{isEn ? p.titleEn : p.titleId}</h3>
      </div>
    </div>
  );
};

const PortfolioPage = ({ lang = "en" }) => {
  const isEn = lang === "en";
  const [portfolio, setPortfolio] = useState([]);
  const [about, setAbout] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const f = async () => {
      const [p, a] = await Promise.all([
        supabase.from("portfolio").select("*").order("order", { ascending: true }),
        supabase.from("about").select("*").maybeSingle(),
      ]);
      if (p.data) setPortfolio(p.data.map(x => ({ _id: x.id, titleEn: x.title_en, titleId: x.title_id, descriptionEn: x.description_en, descriptionId: x.description_id, url: x.url, categoryEn: x.category_en, categoryId: x.category_id, image: x.image })));
      if (a.data) setAbout({ contactEmail: a.data.contact_email, contactPhone: a.data.contact_phone, socials: a.data.socials, logo: a.data.logo, image: a.data.image, descriptionEn: a.data.description_en, descriptionId: a.data.description_id, founded: a.data.founded, clients: a.data.clients, projects: a.data.projects, teamCount: a.data.team_count, visionEn: a.data.vision_en, visionId: a.data.vision_id, missionEn: a.data.mission_en, missionId: a.data.mission_id });
    };
    f();
  }, []);

  const cats = useMemo(() => ["All", ...new Set(portfolio.map(p => isEn ? p.categoryEn : p.categoryId).filter(Boolean))], [portfolio, isEn]);
  const filtered = filter === "All" ? portfolio : portfolio.filter(p => (isEn ? p.categoryEn : p.categoryId) === filter);

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans selection:bg-primary-500 selection:text-white transition-colors">
      <Helmet><title>{isEn ? "Portfolio — PixlCraft Studio" : "Portofolio — PixlCraft Studio"}</title></Helmet>
      <Navbar about={about} lang={lang} />
      <main className="pt-[72px]">
        <SectionWrapper bg="bg-primary-900 dark:bg-primary-50">
          <SectionContent>
            <div className="gsap-fade">
              <span className="text-xs font-bold text-primary-400 uppercase tracking-[0.2em] mb-4 block">PORTFOLIO</span>
              <h1 className="text-5xl lg:text-[4rem] font-black text-white dark:text-primary-900 tracking-tight leading-[1.08] mb-5">{isEn ? "Our Work" : "Karya Kami"}</h1>
              <div className="w-12 h-[3px] bg-primary-500 mb-6" />
              <p className="text-primary-300 dark:text-primary-600 text-lg leading-relaxed font-medium max-w-xl">{isEn ? "A showcase of projects we've brought to life." : "Kumpulan proyek yang telah kami wujudkan."}</p>
            </div>
          </SectionContent>
        </SectionWrapper>

        <SectionWrapper bg="bg-white dark:bg-primary-950">
          <SectionContent>
            <div className="flex flex-wrap gap-3 mb-12 gsap-fade">
              {cats.map(c => (
                <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-all ${filter === c ? "bg-primary-500 border-primary-500 text-white shadow-[3px_3px_0_0_#004b74]" : "border-primary-300 dark:border-primary-600 text-primary-600 dark:text-primary-300 hover:bg-primary-500 hover:text-white hover:border-primary-500"}`}>{c}</button>
              ))}
            </div>
            {/* Featured */}
            {filtered.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {filtered.slice(0, 2).map(p => <div key={p._id} className="gsap-fade"><Card p={p} isEn={isEn} large /></div>)}
              </div>
            )}
            {/* Grid — mixed sizes */}
            {filtered.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.slice(2).map((p, i) => (
                  <div key={p._id} className={`gsap-fade ${i % 5 === 0 ? "md:col-span-2" : ""}`}><Card p={p} isEn={isEn} large={i % 5 === 0} /></div>
                ))}
              </div>
            )}
          </SectionContent>
        </SectionWrapper>
      </main>
      <Footer about={about} lang={lang} />
    </div>
  );
};

export default PortfolioPage;
