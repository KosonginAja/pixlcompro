import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SectionWrapper = ({
  children,
  id,
  className = "",
  bg = "bg-white dark:bg-primary-950",
  noPadding = false,
}) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const targets = ref.current.querySelectorAll(".gsap-fade");
      if (!targets.length) return;
      gsap.set(targets, { opacity: 0, y: 40 });
      targets.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    }, ref);
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => { clearTimeout(t); ctx.revert(); };
  }, []);

  return (
    <section ref={ref} id={id} className={`${bg} relative overflow-hidden transition-colors ${noPadding ? "" : "py-20 lg:py-32"} ${className}`}>
      <div className="relative z-10">{children}</div>
    </section>
  );
};

export default SectionWrapper;
