import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
    { val: about.teamCount || "10+", en: "Team", id: "Tim" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans transition-colors">
      <Helmet><title>{isEn ? "About — PixlCraft Studio" : "Tentang — PixlCraft Studio"}</title></Helmet>
      <Navbar about={about} lang={lang} />
      <main className="pt-16">
        {/* Header */}
        <SectionWrapper bg="bg-primary-900" noPadding>
          <div className="py-24 lg:py-32" style={{ background: "linear-gradient(135deg, #001d32 0%, #003352 100%)" }}>
            <SectionContent>
              <div className="max-w-2xl gsap-fade">
                <span className="eyebrow text-primary-400 mb-4 block">{isEn ? "About" : "Tentang"}</span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">{isEn ? "Who We Are" : "Siapa Kami"}</h1>
                <div className="section-divider mb-5" />
                <p className="text-primary-300 text-base lg:text-lg leading-relaxed">{isEn ? about.descriptionEn : about.descriptionId}</p>
              </div>
            </SectionContent>
          </div>
        </SectionWrapper>

        {/* Story — zig-zag: text left / image right */}
        <SectionWrapper bg="bg-white dark:bg-primary-950">
          <SectionContent>
            <div className="flex flex-col gap-24">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center gsap-fade">
                <div className="lg:col-span-3">
                  <span className="eyebrow mb-4 block">{isEn ? "Our Story" : "Cerita Kami"}</span>
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-primary-900 dark:text-white tracking-tight leading-[1.15] mb-4">{isEn ? "Built from Passion for Digital Craft" : "Dibangun dari Passion Digital"}</h2>
                  <div className="section-divider mb-5" />
                  <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed mb-6">{isEn ? about.descriptionEn : about.descriptionId}</p>
                  <p className="text-primary-500 dark:text-primary-400 text-sm leading-relaxed italic">
                    {isEn ? "We believe a website should work as hard as it looks. Every pixel, every interaction — crafted to convert." : "Kami percaya website harus bekerja sekeras tampilannya. Setiap piksel, setiap interaksi — dirancang untuk mengkonversi."}
                  </p>
                </div>
                <div className="lg:col-span-2">
                  {about.image ? <img src={about.image} alt="About" className="w-full aspect-[4/5] object-cover rounded-lg" loading="lazy" />
                    : <div className="w-full aspect-[4/5] bg-primary-100 dark:bg-primary-800 rounded-lg" />}
                </div>
              </div>

              {/* Vision / Mission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gsap-fade">
                <div className="p-8 rounded-lg border border-primary-100 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-800/20">
                  <span className="font-pixel text-[9px] text-primary-300 dark:text-primary-600 block mb-3">01</span>
                  <h3 className="text-xl font-extrabold text-primary-900 dark:text-white mb-3">{isEn ? "Vision" : "Visi"}</h3>
                  <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed">{isEn ? about.visionEn : about.visionId}</p>
                </div>
                <div className="p-8 rounded-lg border border-primary-100 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-800/20">
                  <span className="font-pixel text-[9px] text-primary-300 dark:text-primary-600 block mb-3">02</span>
                  <h3 className="text-xl font-extrabold text-primary-900 dark:text-white mb-3">{isEn ? "Mission" : "Misi"}</h3>
                  <p className="text-primary-600 dark:text-primary-300 text-base leading-relaxed">{isEn ? about.missionEn : about.missionId}</p>
                </div>
              </div>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* Stats */}
        <SectionWrapper bg="bg-primary-900">
          <SectionContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="gsap-fade p-8 text-center rounded-lg bg-white/5 border border-white/10">
                  <div className="text-5xl font-extrabold text-white mb-2"><AnimatedCounter value={s.val} /></div>
                  <div className="text-xs font-medium text-primary-400 tracking-wide uppercase">{isEn ? s.en : s.id}</div>
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
