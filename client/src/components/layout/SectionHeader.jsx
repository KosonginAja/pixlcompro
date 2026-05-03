const SectionHeader = ({ label, title, description, align = "left", className = "" }) => {
  const a = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-8 mb-16 flex flex-col ${a} gsap-fade ${className}`}>
      {label && <span className="eyebrow mb-4">{label}</span>}
      {title && <h2 className="text-3xl lg:text-5xl font-extrabold text-primary-900 dark:text-white tracking-tight leading-[1.15] mb-4">{title}</h2>}
      {description && (
        <>
          <div className="section-divider mb-5" />
          <p className="text-primary-600 dark:text-primary-300 text-base lg:text-lg leading-relaxed max-w-2xl">{description}</p>
        </>
      )}
    </div>
  );
};

export default SectionHeader;
