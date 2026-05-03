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
    { val: about.teamCount || "10+", en: "Team Members", id: "Anggota Tim" },
    { val: about.founded || "2015", en: "Established", id: "Berdiri" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans transition-colors">
      <Helmet><title>{isEn ? "About — PixlCraft Studio" : "Tentang — PixlCraft Studio"}</title></Helmet>
      <Navbar about={about} lang={lang} />

      <main className="pt-[55px]">
        {/* Page header */}
        <section className="surface-hero py-[55px] lg:py-[89px]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <span className="font-pixel text-[8px] text-primary-300 tracking-[0.2em] uppercase mb-4 block">{isEn ? "About" : "Tentang"}</span>
            <h1 className="font-extrabold text-white tracking-tight leading-[1.08] mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>{isEn ? "Who We Are" : "Siapa Kami"}</h1>
            <p className="text-primary-200 text-[15px] leading-relaxed max-w-lg">{isEn ? about.descriptionEn : about.descriptionId}</p>
          </div>
        </section>

        {/* Stats strip */}
        <section className="surface-accent border-y border-primary-100 dark:border-primary-800">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
              {stats.map((s, i) => (
                <div key={i} className={`py-6 text-center ${i < stats.length - 1 ? "border-r border-primary-100 dark:border-primary-800" : ""}`}>
                  <div className="text-2xl font-extrabold text-primary-900 dark:text-white leading-none mb-0.5"><AnimatedCounter value={s.val} /></div>
                  <div className="text-[10px] font-medium text-[#999] dark:text-primary-400 tracking-wide uppercase">{isEn ? s.en : s.id}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story — zig-zag 62/38 */}
        <SectionWrapper surface="surface-base">
          <SectionContent>
            <div className="grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-[34px] lg:gap-[55px] items-center gsap-fade">
              <div>
                <span className="font-pixel text-[8px] text-primary-400 tracking-[0.2em] uppercase mb-4 block">{isEn ? "Our Story" : "Cerita Kami"}</span>
                <h2 className="font-extrabold text-primary-900 dark:text-white tracking-tight leading-[1.1] mb-4" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }}>{isEn ? "Built from Passion for Digital Craft" : "Dibangun dari Passion untuk Digital"}</h2>
                <p className="text-[#666] dark:text-primary-300 text-[15px] leading-relaxed mb-5">{isEn ? about.descriptionEn : about.descriptionId}</p>
                <blockquote className="border-l-2 border-primary-400 pl-4 text-[14px] italic text-[#999] dark:text-primary-400 leading-relaxed">
                  {isEn ? "We believe a website should work as hard as it looks. Every pixel, every interaction — crafted to convert." : "Kami percaya website harus bekerja sekeras tampilannya. Setiap piksel, setiap interaksi — dirancang untuk mengkonversi."}
                </blockquote>
              </div>
              <div>
                {about.image ? <img src={about.image} alt="About" className="w-full aspect-[3/4] object-cover" loading="lazy" />
                  : <div className="w-full aspect-[3/4] bg-primary-100 dark:bg-primary-800" />}
              </div>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* Vision / Mission — structured blocks */}
        <SectionWrapper surface="surface-raised">
          <SectionContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-primary-100 dark:border-primary-800 gsap-fade">
              <div className="py-[34px] pr-8 lg:border-r border-primary-100 dark:border-primary-800">
                <span className="font-pixel text-[8px] text-primary-400 tracking-[0.2em] uppercase mb-3 block">01</span>
                <h3 className="font-extrabold text-primary-900 dark:text-white text-[18px] mb-3">{isEn ? "Vision" : "Visi"}</h3>
                <p className="text-[#666] dark:text-primary-300 text-[15px] leading-relaxed">{isEn ? about.visionEn : about.visionId}</p>
              </div>
              <div className="py-[34px] lg:pl-8 border-t lg:border-t-0 border-primary-100 dark:border-primary-800">
                <span className="font-pixel text-[8px] text-primary-400 tracking-[0.2em] uppercase mb-3 block">02</span>
                <h3 className="font-extrabold text-primary-900 dark:text-white text-[18px] mb-3">{isEn ? "Mission" : "Misi"}</h3>
                <p className="text-[#666] dark:text-primary-300 text-[15px] leading-relaxed">{isEn ? about.missionEn : about.missionId}</p>
              </div>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* CTA */}
        <SectionWrapper surface="surface-deep">
          <SectionContent>
            <div className="gsap-fade text-center max-w-lg mx-auto">
              <h2 className="font-extrabold text-white tracking-tight leading-[1.1] mb-4" style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }}>{isEn ? "Let's Build Together" : "Mari Membangun Bersama"}</h2>
              <p className="text-primary-300 text-[15px] leading-relaxed mb-6">{isEn ? "We'd love to hear about your project." : "Kami ingin mendengar tentang proyek Anda."}</p>
              <Link to={`${lp}/contact`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-400 text-white font-bold text-[13px] hover:bg-primary-500 transition-colors">
                {isEn ? "Get In Touch" : "Hubungi Kami"} <ArrowRight size={13} />
              </Link>
            </div>
          </SectionContent>
        </SectionWrapper>
      </main>

      <Footer about={about} lang={lang} />
    </div>
  );
};

export default AboutPage;
