import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../lib/supabase";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
      <main className="pt-16">
        {/* Header */}
        <SectionWrapper bg="bg-primary-900" noPadding>
          <div className="py-24 lg:py-32" style={{ background: "linear-gradient(135deg, #001d32 0%, #003352 100%)" }}>
            <SectionContent>
              <div className="max-w-2xl gsap-fade">
                <span className="eyebrow text-primary-400 mb-4 block">{isEn ? "Services" : "Layanan"}</span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">{isEn ? "What We Build" : "Apa Yang Kami Bangun"}</h1>
                <div className="section-divider mb-5" />
                <p className="text-primary-300 text-base lg:text-lg leading-relaxed">{isEn ? "End-to-end digital solutions crafted with precision and purpose." : "Solusi digital end-to-end yang dibuat dengan presisi dan tujuan."}</p>
              </div>
            </SectionContent>
          </div>
        </SectionWrapper>

        {/* Service blocks */}
        <SectionWrapper bg="bg-white dark:bg-primary-950">
          <SectionContent>
            <div className="flex flex-col gap-8">
              {services.map((s, i) => (
                <div key={s._id} className="gsap-fade rounded-lg border border-primary-100 dark:border-primary-800 p-8 lg:p-10 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-2">
                      <span className="font-pixel text-[9px] text-primary-300 dark:text-primary-600 block mb-3">{(i + 1).toString().padStart(2, "0")}</span>
                      <h2 className="text-2xl lg:text-3xl font-extrabold text-primary-900 dark:text-white tracking-tight leading-tight mb-2">{isEn ? s.titleEn : s.titleId}</h2>
                      <span className="text-[10px] font-semibold text-primary-400 uppercase tracking-[0.12em]">{isEn ? s.categoryEn : s.categoryId}</span>
                    </div>
                    <div className="lg:col-span-3">
                      <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed mb-5">{isEn ? (s.fullDescriptionEn || s.descriptionEn) : (s.fullDescriptionId || s.descriptionId)}</p>
                      {s.features?.length > 0 && (
                        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
                          {s.features.map((f, fi) => (
                            <div key={fi} className="flex items-start gap-1.5 text-primary-700 dark:text-primary-300 text-sm">
                              <CheckCircle2 size={13} className="text-primary-400 shrink-0 mt-0.5" /><span>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <button onClick={() => order(s)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-400 text-white font-bold text-sm rounded-md hover:bg-primary-500 transition-colors">
                        {isEn ? "Get Started" : "Hubungi Kami"} <ArrowRight size={14} />
                      </button>
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
