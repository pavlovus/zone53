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

  // Each ribbon repeats one phrase an odd number of times so that the middle repetition is a whole phrase,
  // which lets the text be centered on a complete word group on narrow (mobile) screens.
  const ribbonsData = [
    { r: "0", text: Array(9).fill("UNRELEASED TECH").join(" // ") },
    { r: "1", text: Array(9).fill("CLOSED EVENTS").join(" // ") },
    { r: "2", text: Array(9).fill("WORLDWIDE NETWORK").join(" // ") },
  ];

  return (
    <section
      ref={sectionRef}
      className="ribbon-stage relative py-24 sm:py-44 bg-black/50"
      aria-label="Industrial Caution Ribbons"
    >
      <div className="flex flex-col gap-6 sm:gap-10 -my-6 sm:-my-10 relative z-10">
        {ribbonsData.map((item) => (
          <div
            key={item.r}
            data-r={item.r}
            className={`legacy-ribbon w-[160vw] sm:w-[200vw] -ml-[30vw] sm:-ml-[25vw] py-3 sm:py-5 ${
              isInView ? "in" : ""
            }`}
          >
            <div className="flex items-center justify-center sm:justify-start whitespace-nowrap overflow-hidden font-display text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.02em] text-black">
              <span className="inline-block px-4">{item.text}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
