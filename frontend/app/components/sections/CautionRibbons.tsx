import React, { useEffect, useRef, useState } from "react";

export function CautionRibbons() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            // Optional: reset if scrolled far above/below so it can re-fly in
            if (entry.boundingClientRect.top > window.innerHeight) {
              setIsInView(false);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    // Initial check on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsInView(true);
    }

    return () => observer.disconnect();
  }, []);

  const ribbonsData = [
    {
      r: "0",
      text: "UNRELEASED TECH // UNRELEASED TECH // UNRELEASED TECH // UNRELEASED TECH",
    },
    {
      r: "1",
      text: "CLOSED EVENTS // CLOSED EVENTS // CLOSED EVENTS // CLOSED EVENTS",
    },
    {
      r: "2",
      text: "WORLDWIDE NETWORK // WORLDWIDE NETWORK // WORLDWIDE NETWORK",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="ribbon-stage relative py-16 sm:py-28 bg-black/50 overflow-hidden"
      aria-label="Industrial Caution Ribbons"
    >
      <div className="flex flex-col gap-6 sm:gap-10 -my-6 sm:-my-10 relative z-10">
        {ribbonsData.map((item) => (
          <div
            key={item.r}
            data-r={item.r}
            className={`legacy-ribbon w-[250vw] sm:w-[200vw] -ml-[50vw] sm:-ml-[25vw] py-3 sm:py-5 ${
              isInView ? "in" : ""
            }`}
          >
            <div className="flex items-center whitespace-nowrap overflow-hidden font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.02em] text-black">
              <span className="inline-block px-4">
                {item.text} // {item.text}
              </span>
              <span className="inline-block px-4" aria-hidden="true">
                {item.text} // {item.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
