import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../lib/supabase";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionWrapper, SectionContent } from "../../components/layout";
import AnimatedCounter from "../../components/AnimatedCounter";
import Navbar from "../../components/sections/Navbar";
import Footer from "../../components/sections/Footer";

const AboutPage = ({ lang = "en" }) => {
  const isEn = lang === "en";
  const lp = isEn ? "" : "/id";
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const f = async () => {
      const { data } = await supabase.from("about").select("*").maybeSingle();
      if (data) setAbout({ descriptionEn: data.description_en, descriptionId: data.description_id, visionEn: data.vision_en, visionId: data.vision_id, missionEn: data.mission_en, missionId: data.mission_id, founded: data.founded, clients: data.clients, projects: data.projects, teamCount: data.team_count, contactEmail: data.contact_email, contactPhone: data.contact_phone, socials: data.socials, image: data.image, logo: data.logo });
    };
    f();
  }, []);

  if (!about) return null;

  const stats = [
    { val: about.projects || "1000+", en: "Projects", id: "Proyek" },
    { val: about.clients || "500+", en: "Clients", id: "Klien" },
    { val: about.teamCount || "10+", en: "Team Members", id: "Anggota Tim" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans selection:bg-primary-500 selection:text-white transition-colors">
      <Helmet><title>{isEn ? "About — PixlCraft Studio" : "Tentang — PixlCraft Studio"}</title></Helmet>
      <Navbar about={about} lang={lang} />
      <main className="pt-[72px]">
        {/* Header */}
        <SectionWrapper bg="bg-primary-900 dark:bg-primary-50">
          <SectionContent>
            <div className="gsap-fade">
              <span className="text-xs font-bold text-primary-400 uppercase tracking-[0.2em] mb-4 block">ABOUT</span>
              <h1 className="text-5xl lg:text-[4rem] font-black text-white dark:text-primary-900 tracking-tight leading-[1.08] mb-5">{isEn ? "Who We Are" : "Siapa Kami"}</h1>
              <div className="w-12 h-[3px] bg-primary-500 mb-6" />
              <p className="text-primary-300 dark:text-primary-600 text-lg leading-relaxed font-medium max-w-xl">{isEn ? about.descriptionEn : about.descriptionId}</p>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* Zig-zag story */}
        <SectionWrapper bg="bg-white dark:bg-primary-950">
          <SectionContent>
            <div className="flex flex-col gap-24">
              {/* Row 1: text left / image right — 62/38 */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center gsap-fade">
                <div className="lg:col-span-3">
                  <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.2em] mb-4 block">{isEn ? "OUR STORY" : "CERITA KAMI"}</span>
                  <h2 className="text-3xl lg:text-4xl font-black text-primary-900 dark:text-primary-50 tracking-tight leading-tight mb-5">{isEn ? "Built from Passion for Digital Craft" : "Dibangun dari Passion Digital"}</h2>
                  <div className="w-12 h-[3px] bg-primary-500 mb-6" />
                  <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed font-medium">{isEn ? about.descriptionEn : about.descriptionId}</p>
                </div>
                <div className="lg:col-span-2">
                  {about.image ? <img src={about.image} alt="About" className="w-full aspect-[4/5] object-cover border-2 border-primary-200 dark:border-primary-700 shadow-[6px_6px_0_0_#2c7cb6] dark:shadow-[6px_6px_0_0_#4c97d1]" loading="lazy" />
                    : <div className="w-full aspect-[4/5] bg-primary-100 dark:bg-primary-800 border-2 border-primary-200 flex items-center justify-center"><span className="text-primary-400 text-sm">Image</span></div>}
                </div>
              </div>

              {/* Row 2: vision left / mission right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 gsap-fade">
                <div className="border-2 border-primary-200 dark:border-primary-700 p-8 lg:p-10 hover:border-primary-400 transition-colors">
                  <span className="font-pixel text-2xl text-primary-200 dark:text-primary-700 block mb-4">01</span>
                  <h3 className="text-2xl font-black text-primary-900 dark:text-primary-50 tracking-tight mb-4">{isEn ? "Vision" : "Visi"}</h3>
                  <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed font-medium">{isEn ? about.visionEn : about.visionId}</p>
                </div>
                <div className="border-2 border-primary-200 dark:border-primary-700 p-8 lg:p-10 hover:border-primary-400 transition-colors">
                  <span className="font-pixel text-2xl text-primary-200 dark:text-primary-700 block mb-4">02</span>
                  <h3 className="text-2xl font-black text-primary-900 dark:text-primary-50 tracking-tight mb-4">{isEn ? "Mission" : "Misi"}</h3>
                  <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed font-medium">{isEn ? about.missionEn : about.missionId}</p>
                </div>
              </div>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* Stats */}
        <SectionWrapper bg="bg-primary-900 dark:bg-primary-50">
          <SectionContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="gsap-fade border border-primary-700 dark:border-primary-300 p-10 text-center">
                  <div className="text-5xl lg:text-6xl font-black text-white dark:text-primary-900 mb-3"><AnimatedCounter value={s.val} /></div>
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-primary-400 dark:text-primary-600">{isEn ? s.en : s.id}</div>
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

export default AboutPage;
