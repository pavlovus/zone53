import React from "react";
import { playMechanicalClick } from "../../utils/audio";

export function Footer() {
  const scrollToTop = () => {
    playMechanicalClick(1800);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-black/50 border-t border-[#222222] py-16 sm:py-20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-16 pb-12 border-b border-[#222222]">
          {/* Brand Col */}
          <div className="md:col-span-6 flex flex-col gap-4">
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
              Europe's flagship robotics and AR proving hangar near Warsaw, Poland. A deep-tech hardware initiative of Epikor.
            </p>
          </div>

          {/* Links Col 1: Epikor Ecosystem */}
          <div className="md:col-span-3 flex flex-col gap-3 font-mono text-xs tracking-wider">
            <span className="text-white/40 uppercase font-bold mb-2">[FOUNDRY]</span>
            <a
              href="https://epikor.eu/"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 hover:text-[#FFCC00] transition-colors inline-flex items-center gap-1"
            >
              EPIKOR FOUNDRY ↗
            </a>
            <span className="text-white/50">WARSAW HANGAR LABORATORY</span>
          </div>

          {/* Links Col 2: Action */}
          <div className="md:col-span-3 flex flex-col gap-3 font-mono text-xs tracking-wider md:items-end">
            <button
              type="button"
              onClick={scrollToTop}
              className="px-4 py-2 bg-[#141414] hover:bg-[#1E1E1E] border border-[#333333] hover:border-[#FFCC00] text-[#FFCC00] text-[11px] tracking-widest uppercase chamfer-sm cursor-pointer transition-colors"
            >
              ▲ RETURN TO APEX
            </button>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/40">
          <div>
            © {new Date().getFullYear()} ZONE 53. ALL RIGHTS RESERVED. OPERATED BY EPIKOR.
          </div>
          <div>WARSAW, POLAND // ROBOTICS & AR PROVING GROUNDS</div>
        </div>
      </div>
    </footer>
  );
}
