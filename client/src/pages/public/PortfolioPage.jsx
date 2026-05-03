import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../lib/supabase";
import { ArrowUpRight, Box } from "lucide-react";
import { SectionWrapper, SectionContent } from "../../components/layout";
import Navbar from "../../components/sections/Navbar";
import Footer from "../../components/sections/Footer";

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

      <main className="pt-[55px]">
        {/* Page header */}
        <section className="surface-hero py-[55px] lg:py-[89px]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <span className="font-pixel text-[8px] text-primary-300 tracking-[0.2em] uppercase mb-4 block">{isEn ? "Portfolio" : "Portofolio"}</span>
            <h1 className="font-extrabold text-white tracking-tight leading-[1.08] mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>{isEn ? "Our Work" : "Karya Kami"}</h1>
            <p className="text-primary-200 text-[15px] leading-relaxed max-w-md">{isEn ? "A showcase of projects we've brought to life." : "Kumpulan proyek yang telah kami wujudkan."}</p>
          </div>
        </section>

        {/* Filter + grid */}
        <SectionWrapper surface="surface-base">
          <SectionContent>
            {/* Filters — text-only tabs */}
            <div className="flex flex-wrap gap-5 mb-[34px] gsap-fade border-b border-primary-100 dark:border-primary-800 pb-4">
              {cats.map(c => (
                <button key={c} onClick={() => setFilter(c)} className={`text-[13px] font-medium transition-colors pb-1 relative ${filter === c ? "text-primary-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-primary-400" : "text-[#999] dark:text-primary-500 hover:text-primary-900 dark:hover:text-white"}`}>{c}</button>
              ))}
            </div>

            {/* Grid — asymmetric */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filtered.map((p, i) => (
                <div key={p._id} className={`gsap-fade group cursor-pointer ${i === 0 ? "lg:col-span-2" : ""}`}
                  onClick={() => p.url && window.open(p.url.startsWith("http") ? p.url : `https://${p.url}`, "_blank")}>
                  <div className={`relative overflow-hidden mb-3 ${i === 0 ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
                    {p.image ? <img src={p.image} alt={isEn ? p.titleEn : p.titleId} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" loading="lazy" />
                      : <div className="w-full h-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center"><Box size={24} className="text-primary-200" /></div>}
                    <div className="absolute top-3 right-3 w-7 h-7 bg-white/90 dark:bg-primary-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight size={13} className="text-primary-900 dark:text-white" /></div>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <span className="font-pixel text-[7px] text-primary-400 tracking-[0.2em] uppercase">{isEn ? p.categoryEn : p.categoryId}</span>
                      <h3 className="font-bold text-primary-900 dark:text-white text-[15px] mt-0.5">{isEn ? p.titleEn : p.titleId}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionContent>
        </SectionWrapper>
      </main>

      <Footer about={about} lang={lang} />
    </div>
  );
};

export default PortfolioPage;
