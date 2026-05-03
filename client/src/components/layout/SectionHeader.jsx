const SectionHeader = ({ eyebrow, title, description, align = "left", dark = false, className = "" }) => {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  const titleColor = dark ? "text-white" : "text-primary-900 dark:text-white";
  const descColor = dark ? "text-primary-200" : "text-[#666] dark:text-primary-300";
  const eyebrowColor = dark ? "text-primary-300" : "text-primary-400";

  return (
    <div className={`max-w-7xl mx-auto px-5 md:px-8 mb-[34px] lg:mb-[55px] flex flex-col gap-3 ${alignment} gsap-fade ${className}`}>
      {eyebrow && (
        <span className={`font-pixel text-[8px] tracking-[0.2em] uppercase ${eyebrowColor}`}>{eyebrow}</span>
      )}
      {title && (
        <h2 className={`font-extrabold tracking-tight leading-[1.1] ${titleColor}`} style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)" }}>{title}</h2>
      )}
      {description && (
        <p className={`text-[15px] leading-relaxed max-w-lg ${descColor}`}>{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
