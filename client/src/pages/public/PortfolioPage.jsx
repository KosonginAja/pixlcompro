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
    <div className="group rounded-lg overflow-hidden cursor-pointer border border-primary-100 dark:border-primary-800 bg-white dark:bg-primary-800/20 hover:shadow-md transition-all duration-300"
      onClick={() => p.url && window.open(p.url.startsWith("http") ? p.url : `https://${p.url}`, "_blank")}
      onMouseEnter={() => { if (ref.current) ref.current.style.opacity = "1"; }}
      onMouseLeave={() => { if (ref.current) ref.current.style.opacity = "0"; }}>
      <div className={`relative overflow-hidden ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
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
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans transition-colors">
      <Helmet><title>{isEn ? "Portfolio — PixlCraft Studio" : "Portofolio — PixlCraft Studio"}</title></Helmet>
      <Navbar about={about} lang={lang} />
      <main className="pt-16">
        <SectionWrapper bg="bg-primary-900" noPadding>
          <div className="py-24 lg:py-32" style={{ background: "linear-gradient(135deg, #001d32 0%, #003352 100%)" }}>
            <SectionContent>
              <div className="max-w-2xl gsap-fade">
                <span className="eyebrow text-primary-400 mb-4 block">{isEn ? "Portfolio" : "Portofolio"}</span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">{isEn ? "Our Work" : "Karya Kami"}</h1>
                <div className="section-divider mb-5" />
                <p className="text-primary-300 text-base lg:text-lg leading-relaxed">{isEn ? "A showcase of projects we've brought to life." : "Kumpulan proyek yang telah kami wujudkan."}</p>
              </div>
            </SectionContent>
          </div>
        </SectionWrapper>

        <SectionWrapper bg="bg-white dark:bg-primary-950">
          <SectionContent>
            <div className="flex flex-wrap gap-2 mb-10 gsap-fade">
              {cats.map(c => (
                <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${filter === c ? "bg-primary-400 text-white" : "bg-primary-50 dark:bg-primary-800 text-primary-600 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-700"}`}>{c}</button>
              ))}
            </div>
            {filtered.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {filtered.slice(0, 2).map(p => <div key={p._id} className="gsap-fade"><Card p={p} isEn={isEn} large /></div>)}
              </div>
            )}
            {filtered.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
