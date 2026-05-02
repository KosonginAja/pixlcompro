const OffsetBox = ({
  children,
  className = "",
  rotate = "-1",
  shadow = "6px_6px_0_0_#2c7cb6",
  shadowDark = "6px_6px_0_0_#4c97d1",
  border = "border-primary-400",
}) => (
  <div
    className={`border-4 ${border} bg-white dark:bg-primary-900 shadow-[${shadow}] dark:shadow-[${shadowDark}] ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </div>
);

export default OffsetBox;
