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
      <main className="pt-16">
        {/* Header */}
        <SectionWrapper bg="bg-primary-900" noPadding>
          <div className="py-24 lg:py-32" style={{ background: "linear-gradient(135deg, #001d32 0%, #003352 100%)" }}>
            <SectionContent>
              <div className="max-w-2xl gsap-fade">
                <span className="eyebrow text-primary-400 mb-4 block">{isEn ? "Contact" : "Kontak"}</span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">{isEn ? "Get In Touch" : "Hubungi Kami"}</h1>
                <div className="section-divider mb-5" />
                <p className="text-primary-300 text-base lg:text-lg leading-relaxed">{isEn ? "Tell us about your project and let's build something remarkable." : "Ceritakan proyek Anda dan mari bangun sesuatu yang luar biasa."}</p>
              </div>
            </SectionContent>
          </div>
        </SectionWrapper>

        {/* Form: 40/60 */}
        <SectionWrapper bg="bg-white dark:bg-primary-950">
          <SectionContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
              {/* Left — contact info */}
              <div className="lg:col-span-2 gsap-fade">
                <h2 className="text-xl font-extrabold text-primary-900 dark:text-white mb-6">{isEn ? "Contact Information" : "Informasi Kontak"}</h2>
                <div className="space-y-5 mb-8">
                  {about?.contactEmail && (
                    <a href={`mailto:${about.contactEmail}`} className="flex items-start gap-3 group pb-4 border-b border-primary-100 dark:border-primary-800 hover:border-primary-300 transition-colors">
                      <span className="text-[10px] font-semibold text-primary-400 shrink-0 w-10 mt-0.5">EMAIL</span>
                      <span className="font-semibold text-primary-900 dark:text-white text-sm group-hover:text-primary-400 transition-colors">{about.contactEmail}</span>
                    </a>
                  )}
                  {about?.contactPhone && (
                    <a href={waNum ? `https://wa.me/${waNum}` : "#"} target="_blank" rel="noreferrer" className="flex items-start gap-3 group pb-4 border-b border-primary-100 dark:border-primary-800 hover:border-primary-300 transition-colors">
                      <span className="text-[10px] font-semibold text-primary-400 shrink-0 w-10 mt-0.5">PHONE</span>
                      <span className="font-semibold text-primary-900 dark:text-white text-sm group-hover:text-primary-400 transition-colors">{about.contactPhone}</span>
                    </a>
                  )}
                </div>
                {about?.socials?.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-primary-400 uppercase tracking-[0.12em] mb-3 block">{isEn ? "Follow Us" : "Ikuti Kami"}</span>
                    <div className="flex gap-2">
                      {about.socials.map(({ label, href, url, icon }) => (
                        <a key={label} href={href || url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-md flex items-center justify-center text-primary-400 hover:text-primary-900 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-primary-800 transition-all text-sm" aria-label={label}>
                          <i className={icon}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right — form */}
              <div className="lg:col-span-3 gsap-fade">
                <div className="rounded-lg border border-primary-100 dark:border-primary-800 p-8 lg:p-10 bg-primary-50/30 dark:bg-primary-800/10">
                  <h3 className="text-xs font-semibold text-primary-400 uppercase tracking-[0.12em] mb-8">{isEn ? "Send a message" : "Kirim pesan"}</h3>
                  <div className="hidden"><input type="text" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} tabIndex="-1" autoComplete="off" /></div>
                  <form onSubmit={submit} className="space-y-6">
                    {[
                      { l: isEn ? "Name" : "Nama", k: "name", t: "text", ph: "John Doe" },
                      { l: "Email", k: "email", t: "email", ph: "john@company.com" },
                      { l: isEn ? "Subject" : "Subjek", k: "subject", t: "text", ph: isEn ? "Project inquiry" : "Tanya proyek" },
                    ].map(({ l, k, t, ph }) => (
                      <div key={k}>
                        <label className="block text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-[0.1em] mb-2">{l}</label>
                        <input type={t} required value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph} className="w-full bg-transparent border-b border-primary-200 dark:border-primary-700 focus:border-primary-400 outline-none text-primary-900 dark:text-white placeholder:text-primary-300 dark:placeholder:text-primary-600 text-base pb-2 transition-colors" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-[0.1em] mb-2">{isEn ? "Message" : "Pesan"}</label>
                      <textarea required rows="4" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={isEn ? "Tell us about your project..." : "Ceritakan proyek Anda..."} className="w-full bg-transparent border-b border-primary-200 dark:border-primary-700 focus:border-primary-400 outline-none resize-none text-primary-900 dark:text-white placeholder:text-primary-300 dark:placeholder:text-primary-600 text-base pb-2 transition-colors" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-400 text-white font-bold text-sm rounded-md hover:bg-primary-500 transition-colors disabled:opacity-50">
                      {loading ? (isEn ? "Sending..." : "Mengirim...") : (isEn ? "Send Message" : "Kirim Pesan")} {!loading && <ArrowRight size={14} />}
                    </button>
                  </form>
                </div>
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
