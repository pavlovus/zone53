import React from "react";
import { TelemetryBadge } from "../ui/TelemetryBadge";

export function EpikorEcosystem() {
  return (
    <section className="relative py-20 sm:py-32 bg-black/50 border-b border-[#222222]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Narrative Banner with Epikor Badge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6 items-stretch">
          <div data-reveal className="lg:col-span-12">
            <TelemetryBadge label="HARDWARE LAB // EPIKOR FOUNDRY" status="active" />
          </div>

          {/* Title row: the Epikor block stretches to exactly the title's height */}
          <div data-reveal className="lg:col-span-8">
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-[0.01em] leading-[0.9] m-0">
              THE HARDWARE PROVING GROUNDS <br />
              <span className="text-[#FFCC00]">POWERED BY EPIKOR.</span>
            </h2>
          </div>

          <div
            data-reveal
            className="reveal-stagger-1 lg:col-span-4 flex justify-start lg:justify-end order-last lg:order-none"
          >
            <a
              href="https://epikor.eu/"
              target="_blank"
              rel="noreferrer"
              className="relative bg-[#0A0A0A]/90 border border-[#333333] hover:border-[#FFCC00] p-3 chamfer-md w-full max-w-md flex items-center gap-4 sm:gap-5 transition-colors group no-underline"
            >
              <div className="relative shrink-0 h-16 w-16 sm:h-20 sm:w-20 lg:h-full lg:w-auto lg:aspect-square rounded-full overflow-hidden border border-[#FFCC00]/40 group-hover:border-[#FFCC00] transition-colors bg-black">
                <img
                  src="/media/epikor_icon.jpg"
                  alt="Epikor Emblem"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.02] block"
                />
              </div>
              <span className="font-mono text-sm sm:text-base font-bold text-white group-hover:text-[#FFCC00] tracking-wider transition-colors inline-flex items-center gap-1.5">
                <span>POWERED BY EPIKOR</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110" aria-hidden="true">
                  ↗
                </span>
              </span>
            </a>
          </div>

          <div data-reveal className="lg:col-span-8">
            <p className="font-sans text-sm sm:text-base md:text-lg text-white/80 max-w-2xl font-normal leading-relaxed m-0">
              Zone 53 is the secret hardware lab and permanent physical proving ground of{" "}
              <a
                href="https://epikor.eu/"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-[#FFCC00] underline font-semibold transition-colors"
              >
                Epikor
                <span className="sr-only"> (opens in new tab)</span>
              </a>
              . Built to give Europe a chance to lead the consumer robotics market and move it forward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
