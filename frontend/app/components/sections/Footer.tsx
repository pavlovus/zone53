import React from "react";
import { playMechanicalClick } from "../../utils/audio";

export function Footer() {
  const scrollToTop = () => {
    playMechanicalClick(1800);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <footer className="relative bg-black/50 border-t border-[#222222] py-16 sm:py-20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-16 pb-12 border-b border-[#222222]">
          {/* Brand Col */}
          <div data-reveal className="md:col-span-6 flex flex-col gap-4">
            <div className="flex items-center">
              <img
                src="/media/logo.webp"
                alt="ZONE 53"
                width={256}
                height={256}
                className="block w-14 h-14 -ml-[5px] object-contain"
              />
            </div>

            <p className="font-sans text-xs sm:text-sm text-white/70 max-w-md font-normal leading-relaxed m-0">
              Let's build FCKN FUTURE together
            </p>
          </div>

          {/* Links Col 1: Epikor Ecosystem & Engineering */}
          <div data-reveal className="reveal-stagger-1 md:col-span-3 flex flex-col gap-3 font-mono text-xs tracking-wider">
            <a
              href="https://epikor.eu/"
              target="_blank"
              rel="noreferrer"
              className="group text-white/80 hover:text-[#FFCC00] transition-colors inline-flex items-center gap-1.5"
            >
              <span>EPIKOR WEBSITE</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110" aria-hidden="true">
                ↗
              </span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <span className="text-white/60">WARSAW HANGAR LABORATORY</span>
          </div>

          {/* Links Col 2: Action */}
          <div data-reveal className="reveal-stagger-2 md:col-span-3 flex flex-col gap-3 font-mono text-xs tracking-wider md:items-end">
            <button
              type="button"
              onClick={scrollToTop}
              className="group px-4 py-2 bg-[#141414] hover:bg-[#1E1E1E] border border-[#333333] hover:border-[#FFCC00] text-[#FFCC00] text-[11px] tracking-widest uppercase chamfer-sm cursor-pointer transition-colors inline-flex items-center gap-1.5"
            >
              <span className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" aria-hidden="true">
                ▲
              </span>
              <span>RETURN TO APEX</span>
            </button>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div data-reveal className="reveal-stagger-1 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/60">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} ZONE 53. ALL RIGHTS RESERVED. OPERATED BY EPIKOR.</span>
            <span className="hidden sm:inline text-white/30">•</span>
            <a
              href="https://www.linkedin.com/in/pavlo-vus-011747390"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-[#FFCC00] transition-colors inline-flex items-center gap-1 no-underline group"
              aria-label="Website Developed by Pavlo Vus on LinkedIn (opens in new tab)"
            >
              <span>WEBSITE BY PAVLO VUS</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
          <div>WARSAW, POLAND // ROBOTICS & AR PROVING GROUNDS</div>
        </div>
      </div>
    </footer>
  );
}
