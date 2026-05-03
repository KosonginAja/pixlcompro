import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SectionWrapper = ({ children, id, className = "", surface = "surface-base", noPadding = false }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const els = ref.current.querySelectorAll(".gsap-fade");
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: 24 });
      els.forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, ref);
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => { clearTimeout(t); ctx.revert(); };
  }, []);

  return (
    <section ref={ref} id={id} className={`${surface} relative ${noPadding ? "" : "py-[55px] lg:py-[89px]"} ${className}`}>
      {children}
    </section>
  );
};

export default SectionWrapper;
