const SectionHeader = ({ label, title, description, align = "left", className = "" }) => {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-8 mb-14 lg:mb-20 flex flex-col ${alignClass} gsap-fade ${className}`}>
      {label && (
        <span className="text-xs font-bold text-primary-500 uppercase tracking-[0.2em] mb-4 inline-block">
          {label}
        </span>
      )}
      {title && (
        <h2 className="text-4xl lg:text-[3.5rem] font-black text-primary-900 dark:text-primary-50 tracking-tight leading-[1.1] mb-5">
          {title}
        </h2>
      )}
      {description && (
        <>
          <div className="w-12 h-[3px] bg-primary-500 mb-6" />
          <p className="text-primary-600 dark:text-primary-300 text-base lg:text-lg leading-relaxed font-medium max-w-2xl">
            {description}
          </p>
        </>
      )}
    </div>
  );
};

export default SectionHeader;
