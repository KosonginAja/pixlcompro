import { useState, useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

import Navbar from "../../components/sections/Navbar";
import HeroSection from "../../components/sections/HeroSection";
import AboutSection from "../../components/sections/AboutSection";

// Lazy load sections below the fold for better FCP/LCP
const ServicesSection = lazy(() => import("../../components/sections/ServicesSection"));
const PortfolioSection = lazy(() => import("../../components/sections/PortfolioSection"));
const ClientsSection = lazy(() => import("../../components/sections/ClientsSection"));
const ContactSection = lazy(() => import("../../components/sections/ContactSection"));
const Footer = lazy(() => import("../../components/sections/Footer"));

import ThemeToggle from "../../components/ThemeToggle";

const Home = ({ lang = "en" }) => {
  const [hero, setHero] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [about, setAbout] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchCriticalData = async () => {
      try {
        const [hRes, aRes] = await Promise.all([
          supabase.from("hero").select("*").maybeSingle(),
          supabase.from("about").select("*").maybeSingle(),
        ]);

        if (hRes.data) {
          setHero({
            headlineEn: hRes.data.headline_en,
            headlineId: hRes.data.headline_id,
            subheadlineEn: hRes.data.subheadline_en,
            subheadlineId: hRes.data.subheadline_id,
            ctaTextEn: hRes.data.cta_text_en,
            ctaTextId: hRes.data.cta_text_id,
            ctaLink: hRes.data.cta_link,
            badgeTextEn: hRes.data.badge_text_en,
            badgeTextId: hRes.data.badge_text_id,
            bgImage: hRes.data.bg_image,
          });
        }

        if (aRes.data) {
          setAbout({
            descriptionEn: aRes.data.description_en,
            descriptionId: aRes.data.description_id,
            visionEn: aRes.data.vision_en,
            visionId: aRes.data.vision_id,
            missionEn: aRes.data.mission_en,
            missionId: aRes.data.mission_id,
            founded: aRes.data.founded,
            clients: aRes.data.clients,
            projects: aRes.data.projects,
            teamCount: aRes.data.team_count,
            contactEmail: aRes.data.contact_email,
            contactPhone: aRes.data.contact_phone,
            socials: aRes.data.socials,
            image: aRes.data.image,
            logo: aRes.data.logo,
          });
        }
      } catch (err) {
        console.error("Critical fetch error", err);
      } finally {
        setPageLoading(false);
      }
    };

    const fetchOtherData = async () => {
      try {
        const [sRes, pRes, tRes] = await Promise.all([
          supabase.from("services").select("*").order("order", { ascending: true }),
          supabase.from("portfolio").select("*").order("order", { ascending: true }),
          supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
        ]);

        if (sRes.data) {
          setServices(sRes.data.map((s) => ({
            _id: s.id,
            titleEn: s.title_en,
            titleId: s.title_id,
            descriptionEn: s.description_en,
            descriptionId: s.description_id,
            fullDescriptionEn: s.full_description_en,
            fullDescriptionId: s.full_description_id,
            waTemplateEn: s.wa_template_en,
            waTemplateId: s.wa_template_id,
            features: s.features || [],
            icon: s.icon,
            color: s.color,
            categoryEn: s.category_en,
            categoryId: s.category_id,
            spotlight_items: s.spotlight_items || [],
          })));
        }

        if (pRes.data) {
          setPortfolio(pRes.data.map((p) => ({
            _id: p.id,
            titleEn: p.title_en,
            titleId: p.title_id,
            descriptionEn: p.description_en,
            descriptionId: p.description_id,
            tags: p.tags,
            url: p.url,
            categoryEn: p.category_en,
            categoryId: p.category_id,
            image: p.image,
          })));
        }

        if (tRes.data) {
          setTestimonials(tRes.data.map((t) => ({
            _id: t.id,
            name: t.name,
            avatar: t.image,
          })));
        }
      } catch (err) {
        console.error("Secondary fetch error", err);
      }
    };

    fetchCriticalData();
    fetchOtherData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Honeypot Anti-Spam Check
    if (contactForm.website) {
      console.log("Spam detected!");
      setContactForm({ name: "", email: "", phone: "", message: "", website: "" });
      toast.success(lang === "en" ? "Message sent!" : "Pesan dikirim!");
      return;
    }

    // Rate Limit Check (1 minute)
    const lastSubmit = localStorage.getItem("pixl_last_submit");
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit) < 60000) {
      const waitTime = Math.ceil((60000 - (now - parseInt(lastSubmit))) / 1000);
      toast.error(
        lang === "en"
          ? `Please wait ${waitTime}s before sending another message.`
          : `Mohon tunggu ${waitTime} detik sebelum mengirim pesan lagi.`,
      );
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.from("contacts").insert([
        {
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message,
          is_read: false,
        },
      ]);
      if (error) throw error;

      toast.success(
        lang === "en"
          ? "Message sent! We'll be in touch soon."
          : "Pesan berhasil dikirim! Kami akan segera menghubungi Anda.",
      );
      localStorage.setItem("pixl_last_submit", Date.now().toString());
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        website: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(
        lang === "en"
          ? "Failed to send. Please try again."
          : "Gagal mengirim pesan. Coba lagi nanti.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50 dark:bg-primary-900">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-700 border-b-primary-500 animate-spin" />
          <p className="font-pixel text-[9px] text-primary-400 dark:text-primary-600 uppercase tracking-widest">
            {lang === "en" ? "Loading..." : "Memuat..."}
          </p>
        </div>
      </div>
    );

  const pageTitle =
    lang === "en"
      ? "PixlCraft Studio — Creative Digital Agency"
      : "PixlCraft Studio — Agensi Kreatif Digital";
  const metaDesc = lang === "en" ? about?.descriptionEn : about?.descriptionId;
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : lang === "en"
        ? "/"
        : "/id";

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900 font-sans selection:bg-primary-500 selection:text-white transition-colors duration-300">
      <Helmet>
        <html lang={lang === "en" ? "en-US" : "id-ID"} />
        <title>{pageTitle}</title>
        <link rel="canonical" href={currentUrl} />
        {metaDesc && (
          <meta name="description" content={metaDesc.substring(0, 160)} />
        )}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc?.substring(0, 160)} />
        <meta property="og:image" content={about?.logo || "/og-image.jpg"} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta
          property="twitter:description"
          content={metaDesc?.substring(0, 160)}
        />
        <meta property="twitter:image" content={about?.logo || "/og-image.jpg"} />

        <meta name="google-site-verification" content="ADD_YOUR_GSC_KEY_HERE" />
        <meta name="msvalidate.01" content="ADD_YOUR_BING_KEY_HERE" />
      </Helmet>

      <Navbar about={about} lang={lang} />
      <main id="main-content">
        {hero && <HeroSection hero={hero} about={about} lang={lang} />}
        {about && <AboutSection about={about} lang={lang} />}
        <Suspense fallback={null}>
          <ServicesSection services={services} about={about} lang={lang} />
          <PortfolioSection portfolio={portfolio} lang={lang} />
          <ClientsSection testimonials={testimonials} about={about} lang={lang} />
          <ContactSection
            about={about}
            contactForm={contactForm}
            setContactForm={setContactForm}
            handleContactSubmit={handleContactSubmit}
            loading={loading}
            lang={lang}
          />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer about={about} lang={lang} />
      </Suspense>
      <ThemeToggle />
    </div>
  );
};

export default Home;
