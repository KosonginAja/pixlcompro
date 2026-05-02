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
    <div className="min-h-screen bg-white dark:bg-primary-900 font-sans selection:bg-primary-500 selection:text-white transition-colors">
      <Helmet><title>{isEn ? "Contact — PixlCraft Studio" : "Kontak — PixlCraft Studio"}</title></Helmet>
      <Navbar about={about} lang={lang} />
      <main className="pt-[72px]">
        <SectionWrapper bg="bg-primary-900 dark:bg-primary-50">
          <SectionContent>
            <div className="gsap-fade">
              <span className="text-xs font-bold text-primary-400 uppercase tracking-[0.2em] mb-4 block">CONTACT</span>
              <h1 className="text-5xl lg:text-[4rem] font-black text-white dark:text-primary-900 tracking-tight leading-[1.08] mb-5">{isEn ? "Get In Touch" : "Hubungi Kami"}</h1>
              <div className="w-12 h-[3px] bg-primary-500 mb-6" />
              <p className="text-primary-300 dark:text-primary-600 text-lg leading-relaxed font-medium max-w-xl">{isEn ? "Tell us about your project and let's build something remarkable." : "Ceritakan proyek Anda dan mari bangun sesuatu yang luar biasa."}</p>
            </div>
          </SectionContent>
        </SectionWrapper>

        {/* 62/38 grid */}
        <SectionWrapper bg="bg-white dark:bg-primary-950">
          <SectionContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
              {/* Left — 2/5 contact info */}
              <div className="lg:col-span-2 gsap-fade">
                <h2 className="text-xl font-black text-primary-900 dark:text-primary-50 mb-8">{isEn ? "Contact Information" : "Informasi Kontak"}</h2>
                <div className="space-y-6 mb-10">
                  {about?.contactEmail && (
                    <a href={`mailto:${about.contactEmail}`} className="flex items-start gap-4 group border-b border-primary-100 dark:border-primary-800 pb-4 hover:border-primary-400 transition-all">
                      <span className="text-[10px] font-bold text-primary-500 shrink-0 w-12 mt-0.5">EMAIL</span>
                      <span className="font-semibold text-primary-900 dark:text-primary-100 text-sm group-hover:text-primary-500 transition-colors">{about.contactEmail}</span>
                    </a>
                  )}
                  {about?.contactPhone && (
                    <a href={waNum ? `https://wa.me/${waNum}` : "#"} target="_blank" rel="noreferrer" className="flex items-start gap-4 group border-b border-primary-100 dark:border-primary-800 pb-4 hover:border-primary-400 transition-all">
                      <span className="text-[10px] font-bold text-primary-500 shrink-0 w-12 mt-0.5">PHONE</span>
                      <span className="font-semibold text-primary-900 dark:text-primary-100 text-sm group-hover:text-primary-500 transition-colors">{about.contactPhone}</span>
                    </a>
                  )}
                </div>
                {about?.socials?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-primary-500 uppercase tracking-[0.15em] mb-4">{isEn ? "Follow Us" : "Ikuti Kami"}</h3>
                    <div className="flex gap-3">
                      {about.socials.map(({ label, href, url, icon }) => (
                        <a key={label} href={href || url} target="_blank" rel="noreferrer" className="w-9 h-9 border border-primary-300 dark:border-primary-600 flex items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all text-sm" aria-label={label}><i className={icon}></i></a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right — 3/5 form */}
              <div className="lg:col-span-3 gsap-fade">
                <div className="border-2 border-primary-200 dark:border-primary-700 shadow-[6px_6px_0_0_#2c7cb6] dark:shadow-[6px_6px_0_0_#4c97d1] p-8 lg:p-10 bg-white dark:bg-primary-900">
                  <div className="border-b border-primary-100 dark:border-primary-800 pb-5 mb-8">
                    <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.15em]">{isEn ? "Send a message" : "Kirim pesan"}</span>
                  </div>
                  <div className="hidden"><input type="text" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} tabIndex="-1" autoComplete="off" /></div>
                  <form onSubmit={submit} className="space-y-7">
                    {[
                      { l: isEn ? "Name" : "Nama", k: "name", t: "text", ph: "John Doe" },
                      { l: "Email", k: "email", t: "email", ph: "john@company.com" },
                      { l: isEn ? "Subject" : "Subjek", k: "subject", t: "text", ph: isEn ? "Project inquiry" : "Tanya proyek" },
                    ].map(({ l, k, t, ph }) => (
                      <div key={k}>
                        <label className="block text-xs font-semibold text-primary-500 uppercase tracking-[0.12em] mb-3">{l}</label>
                        <input type={t} required value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph} className="w-full bg-transparent border-b-2 border-primary-200 dark:border-primary-700 focus:border-primary-500 outline-none text-primary-900 dark:text-primary-100 placeholder:text-primary-300 dark:placeholder:text-primary-600 text-base font-medium pb-2 transition-colors" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-primary-500 uppercase tracking-[0.12em] mb-3">{isEn ? "Message" : "Pesan"}</label>
                      <textarea required rows="4" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={isEn ? "Tell us about your project..." : "Ceritakan proyek Anda..."} className="w-full bg-transparent border-b-2 border-primary-200 dark:border-primary-700 focus:border-primary-500 outline-none resize-none text-primary-900 dark:text-primary-100 placeholder:text-primary-300 dark:placeholder:text-primary-600 text-base font-medium pb-2 transition-colors" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary-500 text-white font-bold text-sm tracking-wide hover:bg-primary-600 transition-colors shadow-[4px_4px_0_0_#004b74] disabled:opacity-50">
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
