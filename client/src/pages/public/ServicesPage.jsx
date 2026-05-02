import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../lib/supabase";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionWrapper, SectionHeader, SectionContent } from "../../components/layout";
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
    const phone = about?.contactPhone?.replace(/\D/g, "").replace(/^0/, "62") || "";
    const text = isEn ? svc.waTemplateEn || `Hi, I'm interested in ${svc.titleEn}` : svc.waTemplateId || `Halo, saya tertarik dengan ${svc.titleId}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans selection:bg-primary-500 selection:text-white transition-colors">
      <Helmet><title>{isEn ? "Services — PixlCraft Studio" : "Layanan — PixlCraft Studio"}</title></Helmet>
      <Navbar about={about} lang={lang} />
      <main className="pt-[72px]">
        <SectionWrapper bg="bg-primary-900 dark:bg-primary-50">
          <SectionContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-end gsap-fade">
              <div className="lg:col-span-3">
                <span className="text-xs font-bold text-primary-400 uppercase tracking-[0.2em] mb-4 block">SERVICES</span>
                <h1 className="text-5xl lg:text-[4rem] font-black text-white dark:text-primary-900 tracking-tight leading-[1.08] mb-5">{isEn ? "What We Build" : "Apa Yang Kami Bangun"}</h1>
                <div className="w-12 h-[3px] bg-primary-500 mb-6" />
                <p className="text-primary-300 dark:text-primary-600 text-lg leading-relaxed font-medium max-w-xl">{isEn ? "End-to-end digital solutions crafted with precision and purpose." : "Solusi digital end-to-end yang dibuat dengan presisi dan tujuan."}</p>
              </div>
              <div className="lg:col-span-2 hidden lg:flex justify-end"><span className="font-pixel text-[120px] text-primary-800/20 dark:text-primary-200/15 leading-none select-none">SV</span></div>
            </div>
          </SectionContent>
        </SectionWrapper>

        <SectionWrapper bg="bg-white dark:bg-primary-950">
          <SectionContent>
            <div className="flex flex-col gap-12">
              {services.map((s, i) => (
                <div key={s._id} className="gsap-fade border-2 border-primary-200 dark:border-primary-700 p-8 lg:p-10 hover:border-primary-400 hover:shadow-[4px_4px_0_0_#2c7cb6] dark:hover:shadow-[4px_4px_0_0_#4c97d1] transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-2">
                      <span className="font-pixel text-3xl text-primary-200 dark:text-primary-700 block mb-4">{(i + 1).toString().padStart(2, "0")}</span>
                      <h2 className="text-2xl lg:text-3xl font-black text-primary-900 dark:text-primary-50 tracking-tight leading-tight mb-3">{isEn ? s.titleEn : s.titleId}</h2>
                      <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.15em]">{isEn ? s.categoryEn : s.categoryId}</span>
                    </div>
                    <div className="lg:col-span-3">
                      <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed font-medium mb-6">{isEn ? (s.fullDescriptionEn || s.descriptionEn) : (s.fullDescriptionId || s.descriptionId)}</p>
                      {s.features?.length > 0 && (
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                          {s.features.map((f, fi) => (
                            <div key={fi} className="flex items-start gap-2 text-primary-700 dark:text-primary-300 text-sm font-medium">
                              <CheckCircle2 size={14} className="text-primary-500 shrink-0 mt-0.5" /><span>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <button onClick={() => order(s)} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-bold text-sm tracking-wide hover:bg-primary-600 transition-colors shadow-[4px_4px_0_0_#004b74]">
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
