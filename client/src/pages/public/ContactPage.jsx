import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import { SectionWrapper, SectionContent } from "../../components/layout";
import Navbar from "../../components/sections/Navbar";
import Footer from "../../components/sections/Footer";

const ContactPage = ({ lang = "en" }) => {
  const isEn = lang === "en";
  const [about, setAbout] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const f = async () => {
      const { data } = await supabase.from("about").select("*").maybeSingle();
      if (data) setAbout({ contactEmail: data.contact_email, contactPhone: data.contact_phone, socials: data.socials, logo: data.logo, image: data.image, descriptionEn: data.description_en, descriptionId: data.description_id, founded: data.founded, clients: data.clients, projects: data.projects, teamCount: data.team_count, visionEn: data.vision_en, visionId: data.vision_id, missionEn: data.mission_en, missionId: data.mission_id });
    };
    f();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (form.website) { setForm({ name: "", email: "", subject: "", message: "", website: "" }); toast.success(isEn ? "Sent!" : "Terkirim!"); return; }
    const last = localStorage.getItem("pixl_last_submit");
    const now = Date.now();
    if (last && now - parseInt(last) < 60000) { toast.error(isEn ? `Wait ${Math.ceil((60000 - (now - parseInt(last))) / 1000)}s` : `Tunggu ${Math.ceil((60000 - (now - parseInt(last))) / 1000)} detik`); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from("contacts").insert([{ name: form.name, email: form.email, phone: form.subject, message: form.message, is_read: false }]);
      if (error) throw error;
      toast.success(isEn ? "Message sent! We'll be in touch soon." : "Pesan berhasil dikirim!");
      localStorage.setItem("pixl_last_submit", now.toString());
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (e) { console.error(e); toast.error(isEn ? "Failed." : "Gagal."); }
    finally { setLoading(false); }
  };

  const waNum = about?.contactPhone?.replace(/\D/g, "").replace(/^0/, "62") || "";

  return (
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans transition-colors">
      <Helmet><title>{isEn ? "Contact — PixlCraft Studio" : "Kontak — PixlCraft Studio"}</title></Helmet>
      <Navbar about={about} lang={lang} />

      <main className="pt-[55px]">
        {/* Page header */}
        <section className="surface-hero py-[55px] lg:py-[89px]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <span className="font-pixel text-[8px] text-primary-300 tracking-[0.2em] uppercase mb-4 block">{isEn ? "Contact" : "Kontak"}</span>
            <h1 className="font-extrabold text-white tracking-tight leading-[1.08] mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>{isEn ? "Get In Touch" : "Hubungi Kami"}</h1>
            <p className="text-primary-200 text-[15px] leading-relaxed max-w-md">{isEn ? "Tell us about your project and let's build something remarkable." : "Ceritakan proyek Anda dan mari bangun sesuatu yang luar biasa."}</p>
          </div>
        </section>

        {/* Form: 38/62 (info / form) */}
        <SectionWrapper surface="surface-base">
          <SectionContent>
            <div className="grid grid-cols-1 lg:grid-cols-[38fr_62fr] gap-[34px] lg:gap-[55px] items-start">
              {/* Left — contact info */}
              <div className="gsap-fade">
                <h2 className="font-extrabold text-primary-900 dark:text-white text-[18px] mb-[21px]">{isEn ? "Contact Details" : "Detail Kontak"}</h2>

                <div className="space-y-0 border-t border-primary-100 dark:border-primary-800">
                  {about?.contactEmail && (
                    <a href={`mailto:${about.contactEmail}`} className="flex items-baseline gap-3 py-4 border-b border-primary-100 dark:border-primary-800 group">
                      <span className="text-[10px] font-semibold text-[#999] dark:text-primary-500 uppercase tracking-[0.12em] shrink-0 w-[50px]">Email</span>
                      <span className="font-semibold text-primary-900 dark:text-white text-[14px] group-hover:text-primary-400 transition-colors">{about.contactEmail}</span>
                    </a>
                  )}
                  {about?.contactPhone && (
                    <a href={waNum ? `https://wa.me/${waNum}` : "#"} target="_blank" rel="noreferrer" className="flex items-baseline gap-3 py-4 border-b border-primary-100 dark:border-primary-800 group">
                      <span className="text-[10px] font-semibold text-[#999] dark:text-primary-500 uppercase tracking-[0.12em] shrink-0 w-[50px]">Phone</span>
                      <span className="font-semibold text-primary-900 dark:text-white text-[14px] group-hover:text-primary-400 transition-colors">{about.contactPhone}</span>
                    </a>
                  )}
                </div>

                {about?.socials?.length > 0 && (
                  <div className="mt-8">
                    <span className="font-pixel text-[7px] text-primary-400 tracking-[0.2em] uppercase mb-3 block">Social</span>
                    <div className="flex gap-3">
                      {about.socials.map(({ label, href, url, icon }) => (
                        <a key={label} href={href || url} target="_blank" rel="noreferrer" className="text-[#999] hover:text-primary-400 transition-colors text-sm" aria-label={label}>
                          <i className={icon}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right — form */}
              <div className="gsap-fade">
                <span className="font-pixel text-[7px] text-primary-400 tracking-[0.2em] uppercase mb-[21px] block">{isEn ? "Send a message" : "Kirim pesan"}</span>
                <div className="hidden"><input type="text" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} tabIndex="-1" autoComplete="off" /></div>
                <form onSubmit={submit} className="space-y-6">
                  {[
                    { l: isEn ? "Name" : "Nama", k: "name", t: "text", ph: "John Doe" },
                    { l: "Email", k: "email", t: "email", ph: "john@company.com" },
                    { l: isEn ? "Subject" : "Subjek", k: "subject", t: "text", ph: isEn ? "Project inquiry" : "Tanya proyek" },
                  ].map(({ l, k, t, ph }) => (
                    <div key={k}>
                      <label className="block text-[10px] font-semibold text-[#999] dark:text-primary-500 uppercase tracking-[0.12em] mb-2">{l}</label>
                      <input type={t} required value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph} className="w-full bg-transparent border-b border-primary-200 dark:border-primary-700 focus:border-primary-400 outline-none text-primary-900 dark:text-white placeholder:text-primary-200 dark:placeholder:text-primary-600 text-[15px] pb-3 transition-colors" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] font-semibold text-[#999] dark:text-primary-500 uppercase tracking-[0.12em] mb-2">{isEn ? "Message" : "Pesan"}</label>
                    <textarea required rows="4" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={isEn ? "Tell us about your project..." : "Ceritakan proyek Anda..."} className="w-full bg-transparent border-b border-primary-200 dark:border-primary-700 focus:border-primary-400 outline-none resize-none text-primary-900 dark:text-white placeholder:text-primary-200 dark:placeholder:text-primary-600 text-[15px] pb-3 transition-colors" />
                  </div>
                  <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-400 text-white font-bold text-[13px] hover:bg-primary-500 transition-colors disabled:opacity-50">
                    {loading ? (isEn ? "Sending..." : "Mengirim...") : (isEn ? "Send Message" : "Kirim Pesan")} {!loading && <ArrowRight size={13} />}
                  </button>
                </form>
              </div>
            </div>
          </SectionContent>
        </SectionWrapper>
      </main>

      <Footer about={about} lang={lang} />
    </div>
  );
};

export default ContactPage;
