import React from "react";

export function EpikorEcosystem() {
  const pillars = [
    {
      index: "01",
      title: "EPIKOR DEEP TECH FOUNDRY",
      tagline: "The Parent Architecture",
      desc: "The European deep-tech venture foundry backing high-risk, high-conviction physical computing, sovereign hardware, and robotics infrastructure.",
      link: "https://epikor.eu/",
    },
    {
      index: "02",
      title: "ZONE 53 WARSAW HANGAR",
      tagline: "The Permanent Proving Ground",
      desc: "Epikor's 1,200 sqm flagship robotics laboratory near Warsaw. Combining spatial computing calibration grids, heavy flight arenas, and hardware prototyping.",
      link: "https://epikor.eu/",
    },
    {
      index: "03",
      title: "INDUSTRIAL SCALING & RESIDENCY",
      tagline: "From Prototype to Fleet",
      desc: "Providing elite engineering cohorts, sovereign defense innovators, and institutional allocators the physical grounds to validate unreleased hardware.",
      link: "https://epikor.eu/",
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 bg-black/50 border-b border-[#222222]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Narrative Banner with Epikor Badge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16 sm:mb-20">
          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight leading-[0.9] mb-6">
              THE HARDWARE PROVING GROUNDS <br />
              <span className="text-[#FFCC00]">POWERED BY EPIKOR.</span>
            </h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-white/80 max-w-2xl font-normal leading-relaxed m-0">
              Zone 53 is the tactical skunkworks and permanent physical proving ground of{" "}
              <a
                href="https://epikor.eu/"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-[#FFCC00] underline font-semibold transition-colors"
              >
                Epikor
              </a>
              . Built to give Europe's fiercest hardware engineers an unconstrained physical facility to build, crash, and iterate the autonomous machines of tomorrow.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <a
              href="https://epikor.eu/"
              target="_blank"
              rel="noreferrer"
              className="relative bg-[#0A0A0A]/90 border border-[#333333] hover:border-[#FFCC00] p-4 chamfer-md max-w-xs w-full flex items-center gap-4 transition-colors group no-underline"
            >
              <img
                src="/media/epikor_icon.jpg"
                alt="Epikor Emblem"
                className="w-14 h-14 object-cover chamfer-sm border border-[#FFCC00]/40 group-hover:border-[#FFCC00] transition-colors"
              />
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-white group-hover:text-[#FFCC00] tracking-wider transition-colors">
                  POWERED BY EPIKOR ↗
                </span>
                <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
                  DEEP TECH FOUNDRY
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* 3-Pillar Vector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-[#222222] border border-[#222222]">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-[#0C0C0C]/90 p-8 sm:p-10 flex flex-col justify-between hover:bg-[#141414] transition-colors relative"
            >
              <div>
                <span className="font-display text-2xl font-black text-[#FFCC00] block mb-2">
                  {pillar.index}
                </span>

                <h3 className="font-sans text-xl font-bold text-white mb-1 uppercase">
                  {pillar.title}
                </h3>

                <span className="font-mono text-xs text-[#FFCC00] tracking-wider block mb-4">
                  {pillar.tagline}
                </span>

                <p className="font-sans text-sm text-[#D4D4D4] leading-relaxed font-normal mb-6">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <a
                  href={pillar.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-white hover:text-[#FFCC00] tracking-wider inline-flex items-center gap-1 transition-colors"
                >
                  LEARN MORE ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
