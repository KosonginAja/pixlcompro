import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";

const ContactSection = ({
  about,
  contactForm,
  setContactForm,
  handleContactSubmit,
  loading,
  lang,
}) => {
  const isEn = lang === "en";
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".contact-left", {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        duration: 0.9,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
      gsap.from(".contact-right", {
        clipPath: "inset(0 0 0 100%)",
        opacity: 0,
        duration: 0.9,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef },
  );

  const contactLinks = (() => {
    const rawPhone = about?.contactPhone || "";
    const waNumber = rawPhone.replace(/\D/g, "").replace(/^0/, "62");
    const waText = encodeURIComponent(
      isEn
        ? "Hello! I'd like to discuss a project."
        : "Halo! Saya ingin mendiskusikan sebuah proyek.",
    );
    const links = [
      {
        label: "Email",
        val: about?.contactEmail || "hello@pixlcraft.studio",
        href: `mailto:${about?.contactEmail || ""}`,
        prefix: "[EMAIL]",
      },
      {
        label: "WhatsApp",
        val: about?.contactPhone || "+62 xxx xxxx xxxx",
        href: waNumber ? `https://wa.me/${waNumber}?text=${waText}` : "#",
        prefix: "[WA]",
      },
    ];
    return links;
  })();

  const formFields = [
    {
      label: isEn ? "Name" : "Nama",
      key: "name",
      type: "text",
      placeholder: "John Doe",
    },
    {
      label: "Email",
      key: "email",
      type: "email",
      placeholder: "john@company.com",
    },
    {
      label: isEn ? "Phone (optional)" : "Telepon (opsional)",
      key: "phone",
      type: "tel",
      placeholder: "0812-3456-7890",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="contact"
      className="py-24 bg-white dark:bg-primary-950 transition-colors border-t-2 border-primary-200 dark:border-primary-700 relative overflow-hidden scanlines"
    >
      <div className="absolute inset-0 bg-pixel-grid pointer-events-none" />
      <div className="section-stripe" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="contact-grid grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* ── Left: Info ── */}
          <div
            className="contact-left lg:col-span-2"
            style={{ clipPath: "inset(0 0% 0 0)" }}
          >
            <span className="brut-label text-primary-500 border-primary-400 mb-6 inline-block">
              {">"} {isEn ? "CONTACT" : "KONTAK"}
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-primary-900 dark:text-primary-50 tracking-tight leading-tight mb-5 whitespace-pre-line">
              {isEn
                ? "Let's Create\nSomething\nAmazing."
                : "Mari Ciptakan\nSesuatu yang\nLuar Biasa."}
            </h2>
            <div className="w-16 h-1.5 bg-primary-500 mb-8" />
            <p className="text-primary-600 dark:text-primary-400 text-sm leading-relaxed mb-10 font-medium max-w-sm">
              {isEn
                ? "Whether it's a website, design, or video — tell us your idea and we'll make it real."
                : "Baik itu website, desain, atau video — ceritakan ide Anda dan kami wujudkan."}
            </p>

            {/* Contact links */}
            <div className="space-y-4">
              {contactLinks.map(({ label, val, href, prefix }) => (
                <a
                  key={label}
                  href={href}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="contact-link flex items-center gap-4 group border-b-2 border-primary-100 dark:border-primary-800 pb-4 hover:border-primary-400 transition-all accent-line"
                >
                  <span className="font-pixel text-[9px] text-primary-500 shrink-0 w-14">
                    {prefix}
                  </span>
                  <div>
                    <p className="font-black text-primary-900 dark:text-primary-100 text-sm group-hover:text-primary-500 transition-colors">
                      {val}
                    </p>
                    <p className="text-[10px] text-primary-400 dark:text-primary-500 uppercase tracking-wider font-medium">
                      {label}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="ml-auto text-primary-200 dark:text-primary-700 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* ── Right: Form — slightly rotated ── */}
          <div
            className="contact-right lg:col-span-3"
            style={{
              clipPath: "inset(0 0% 0 0)",
              transform: "rotate(-0.5deg)",
            }}
          >
            <div className="border-4 border-primary-400 dark:border-primary-500 shadow-[8px_8px_0_0_#004b74] dark:shadow-[8px_8px_0_0_#4c97d1] bg-primary-50 dark:bg-primary-900 p-8 lg:p-10">
              <div className="border-b-2 border-primary-100 dark:border-primary-700 pb-6 mb-8">
                <span className="font-pixel text-[9px] text-primary-400 dark:text-primary-500 uppercase tracking-widest">
                  {isEn ? "Send a message" : "Kirim pesan"}
                </span>
              </div>

              {/* Honeypot */}
              <div className="hidden">
                <input
                  type="text"
                  value={contactForm.website}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, website: e.target.value })
                  }
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-8">
                {formFields.map(({ label, key, type, placeholder }) => (
                  <div key={key} className="form-field group">
                    <label className="block font-pixel text-[8px] text-primary-500 dark:text-primary-400 uppercase tracking-widest mb-3">
                      {label}
                    </label>
                    <input
                      type={type}
                      required={key !== "phone"}
                      value={contactForm[key]}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={placeholder}
                      className="w-full bg-transparent border-b-2 border-primary-200 dark:border-primary-700 focus:border-primary-500 outline-none text-primary-900 dark:text-primary-100 placeholder:text-primary-200 dark:placeholder:text-primary-700 text-base font-medium pb-2 transition-colors glow-focus"
                    />
                  </div>
                ))}

                {/* Message */}
                <div className="form-field">
                  <label className="block font-pixel text-[8px] text-primary-500 dark:text-primary-400 uppercase tracking-widest mb-3">
                    {isEn ? "Message" : "Pesan"}
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    placeholder={
                      isEn
                        ? "Tell us about your project..."
                        : "Ceritakan tentang proyek Anda..."
                    }
                    className="w-full bg-transparent border-b-2 border-primary-200 dark:border-primary-700 focus:border-primary-500 outline-none resize-none text-primary-900 dark:text-primary-100 placeholder:text-primary-200 dark:placeholder:text-primary-700 text-base font-medium pb-2 transition-colors glow-focus"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full brut-btn justify-center disabled:opacity-50 disabled:cursor-not-allowed pixel-shift-hover"
                >
                  <span className="font-pixel text-[9px]">
                    {loading
                      ? isEn
                        ? "Sending..."
                        : "Mengirim..."
                      : isEn
                        ? "Send Message"
                        : "Kirim Pesan"}
                  </span>
                  {!loading && <ArrowRight size={14} strokeWidth={3} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
