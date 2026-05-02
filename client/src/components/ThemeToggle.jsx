import { useTheme } from "../context/ThemeContext";

/* SVG icons — no emoji, no Font Awesome dependency */
const SunIcon = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 16, height: 16, ...style }}
  >
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2"  x2="12" y2="5"  />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="2"  y1="12" x2="5"  y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" />
    <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  />
  </svg>
);

const MoonIcon = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 16, height: 16, ...style }}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ThemeToggle = () => {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="fixed bottom-6 right-6 z-[100] group pixel-shift-hover"
    >
      {/* Outer pill */}
      <div
        className="relative flex items-center gap-3 px-4 py-2.5 border-2 select-none"
        style={{
          background:  dark ? "#001d32" : "#e7f2ff",
          borderColor: dark ? "#4c97d1" : "#2c7cb6",
          boxShadow:   dark ? "4px 4px 0 0 #4c97d1" : "4px 4px 0 0 #004b74",
          transition:  "background 0.35s ease, border-color 0.35s ease, box-shadow 0.25s ease",
        }}
      >
        {/* Sun SVG */}
        <SunIcon
          style={{
            color:      "#f0a500",
            opacity:    dark ? 0.3 : 1,
            transform:  dark ? "scale(0.7) rotate(-30deg)" : "scale(1) rotate(0deg)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
            flexShrink: 0,
          }}
        />

        {/* Track */}
        <div
          className="relative border-2"
          style={{
            width:       40,
            height:      20,
            flexShrink:  0,
            borderColor: dark ? "#4c97d1" : "#2c7cb6",
            background:  dark ? "#003352" : "#cde5ff",
            transition:  "background 0.35s ease, border-color 0.35s ease",
          }}
        >
          {/* Thumb */}
          <div
            style={{
              position:   "absolute",
              top:        2,
              width:      12,
              height:     12,
              left:       dark ? "calc(100% - 14px)" : 2,
              background: dark ? "#4c97d1" : "#2c7cb6",
              transition: "left 0.35s cubic-bezier(0.77, 0, 0.175, 1), background 0.35s ease",
            }}
          />
        </div>

        {/* Moon SVG */}
        <MoonIcon
          style={{
            color:      dark ? "#94ccff" : "#4c97d1",
            opacity:    dark ? 1 : 0.3,
            transform:  dark ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(30deg)",
            transition: "opacity 0.35s ease, transform 0.35s ease, color 0.35s ease",
            flexShrink: 0,
          }}
        />

        {/* Pixel label */}
        <span
          className="font-pixel text-[6px] uppercase tracking-widest leading-none"
          style={{
            color:      dark ? "#4c97d1" : "#2c7cb6",
            transition: "color 0.35s ease",
            minWidth:   28,
          }}
        >
          {dark ? "DARK" : "LIGHT"}
        </span>
      </div>

      {/* Hover tooltip */}
      <span
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 font-pixel text-[7px] uppercase tracking-widest whitespace-nowrap border-2 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background:  dark ? "#001d32" : "#e7f2ff",
          color:       dark ? "#94ccff" : "#004b74",
          borderColor: dark ? "#4c97d1" : "#2c7cb6",
          boxShadow:   "2px 2px 0 0 #2c7cb6",
          transition:  "opacity 0.2s ease",
        }}
      >
        {dark ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;
