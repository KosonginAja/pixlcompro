import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../lib/supabase";
import { ArrowRight, Check } from "lucide-react";
import { SectionWrapper, SectionContent } from "../../components/layout";
import Navbar from "../../components/sections/Navbar";
import Footer from "../../components/sections/Footer";

const ServicesPage = ({ lang = "en" }) => {
  const isEn = lang === "en";
  const [services, setServices] = useState([]);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const f = async () => {
      const [s, a] = await Promise.all([
        supabase.from("services").select("*").order("order", { ascending: true }),
        supabase.from("about").select("*").maybeSingle(),
      ]);
      if (s.data) setServices(s.data.map(x => ({ _id: x.id, titleEn: x.title_en, titleId: x.title_id, descriptionEn: x.description_en, descriptionId: x.description_id, fullDescriptionEn: x.full_description_en, fullDescriptionId: x.full_description_id, features: x.features || [], waTemplateEn: x.wa_template_en, waTemplateId: x.wa_template_id, categoryEn: x.category_en, categoryId: x.category_id })));
      if (a.data) setAbout({ contactEmail: a.data.contact_email, contactPhone: a.data.contact_phone, socials: a.data.socials, logo: a.data.logo, image: a.data.image, descriptionEn: a.data.description_en, descriptionId: a.data.description_id, founded: a.data.founded, clients: a.data.clients, projects: a.data.projects, teamCount: a.data.team_count, visionEn: a.data.vision_en, visionId: a.data.vision_id, missionEn: a.data.mission_en, missionId: a.data.mission_id });
    };
    f();
  }, []);

  const order = (svc) => {
    const ph = about?.contactPhone?.replace(/\D/g, "").replace(/^0/, "62") || "";
    const txt = isEn ? svc.waTemplateEn || `Hi, I'm interested in ${svc.titleEn}` : svc.waTemplateId || `Halo, saya tertarik dengan ${svc.titleId}`;
    window.open(`https://wa.me/${ph}?text=${encodeURIComponent(txt)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans transition-colors">
      <Helmet><title>{isEn ? "Services — PixlCraft Studio" : "Layanan — PixlCraft Studio"}</title></Helmet>
      <Navbar about={about} lang={lang} />

      <main className="pt-[55px]">
        {/* Page header */}
        <section className="surface-hero py-[55px] lg:py-[89px]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <span className="font-pixel text-[8px] text-primary-300 tracking-[0.2em] uppercase mb-4 block">{isEn ? "Services" : "Layanan"}</span>
            <h1 className="font-extrabold text-white tracking-tight leading-[1.08] mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>{isEn ? "What We Build" : "Apa Yang Kami Bangun"}</h1>
            <p className="text-primary-200 text-[15px] leading-relaxed max-w-md">{isEn ? "End-to-end digital solutions crafted with precision and purpose." : "Solusi digital end-to-end yang dibuat dengan presisi dan tujuan."}</p>
          </div>
        </section>

        {/* Service blocks */}
        <SectionWrapper surface="surface-base">
          <SectionContent>
            <div className="space-y-0">
              {services.map((s, i) => (
                <div key={s._id} className="gsap-fade border-b border-primary-100 dark:border-primary-800 py-[34px] lg:py-[55px] first:border-t">
                  {/* 62/38 split */}
                  <div className="grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-[21px] lg:gap-[55px]">
                    {/* Left — title & meta */}
                    <div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="font-pixel text-[8px] text-primary-300 dark:text-primary-600 tracking-[0.15em]">{(i + 1).toString().padStart(2, "0")}</span>
                        <span className="text-[10px] font-semibold text-primary-400 uppercase tracking-[0.12em]">{isEn ? s.categoryEn : s.categoryId}</span>
                      </div>
                      <h2 className="font-extrabold text-primary-900 dark:text-white tracking-tight leading-[1.1] mb-3" style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>{isEn ? s.titleEn : s.titleId}</h2>
                      <button onClick={() => order(s)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-400 text-white font-bold text-[12px] hover:bg-primary-500 transition-colors mt-3">
                        {isEn ? "Get Started" : "Hubungi Kami"} <ArrowRight size={12} />
                      </button>
                    </div>
                    {/* Right — description & features */}
                    <div>
                      <p className="text-[#666] dark:text-primary-300 text-[15px] leading-relaxed mb-5">{isEn ? (s.fullDescriptionEn || s.descriptionEn) : (s.fullDescriptionId || s.descriptionId)}</p>
                      {s.features?.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {s.features.map((f, fi) => (
                            <div key={fi} className="flex items-start gap-2 text-primary-700 dark:text-primary-300 text-[13px]">
                              <Check size={12} className="text-primary-400 shrink-0 mt-0.5" /><span>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
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

export default ServicesPage;
