import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SectionWrapper = ({ children, id, className = "", bg = "", noPadding = false }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const els = ref.current.querySelectorAll(".gsap-fade");
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: 30 });
      els.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.6, delay: i * 0.08, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    }, ref);
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => { clearTimeout(t); ctx.revert(); };
  }, []);

  return (
    <section ref={ref} id={id} className={`${bg} relative transition-colors ${noPadding ? "" : "py-24 lg:py-32"} ${className}`}>
      {children}
    </section>
  );
};

export default SectionWrapper;
