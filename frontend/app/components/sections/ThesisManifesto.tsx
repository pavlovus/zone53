import React from "react";
import { TelemetryBadge } from "../ui/TelemetryBadge";

interface ThesisManifestoProps {
  onRequestAccess: () => void;
}

export function ThesisManifesto({ onRequestAccess }: ThesisManifestoProps) {
  return (
    <section className="relative py-20 sm:py-32 bg-black/50 border-b border-[#222222]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* The Macro-Statement */}
        <div data-reveal className="max-w-5xl mb-16 sm:mb-24">
          <div className="mb-4">
            <TelemetryBadge label="PARADIGM SHIFT // THESIS" status="classified" />
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase leading-[0.98] text-white mb-8">
            The robot is the next personal computer. <br />
            <span className="text-[#FFCC00] italic">
              And AR is its keyboard and mouse.
            </span>
          </h2>
          <div className="h-1 w-24 bg-[#FFCC00]" />
        </div>

        {/* Detailed 3-Column Tactical Briefing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-[#222222] border border-[#222222]">
          {/* Card 1 */}
          <div
            data-reveal
            className="cnc-card p-8 sm:p-10 flex flex-col justify-between group"
          >
            <span className="cnc-crosshair">+</span>
            <div>
              <span className="font-display text-2xl font-black text-[#FFCC00] block mb-4">
                01
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mb-4 uppercase group-hover:text-[#FFCC00] transition-colors">
                Our Mission
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#D4D4D4] leading-relaxed font-normal">
                We’re starting to build an infrastructure that will bring together talent, technology, and capital from around the world in one place. Our goal is to foster new robotics startups that will{" "}
                <span className="text-[#FFCC00] font-semibold">change the world of atoms.</span>
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            data-reveal
            className="reveal-stagger-1 cnc-card p-8 sm:p-10 flex flex-col justify-between group"
          >
            <span className="cnc-crosshair">+</span>
            <div>
              <span className="font-display text-2xl font-black text-[#FFCC00] block mb-4">
                02
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mb-4 uppercase group-hover:text-[#FFCC00] transition-colors">
                How Can You Join Us?
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#D4D4D4] leading-relaxed font-normal">
                You’ll need to get a special access card that serves as the key to the Hangar. There are only two ways to get one: become a{" "}
                <button
                  type="button"
                  onClick={onRequestAccess}
                  className="text-[#FFCC00] font-semibold underline underline-offset-4 decoration-[#FFCC00]/50 hover:decoration-[#FFCC00] bg-transparent border-0 p-0 cursor-pointer font-[inherit]"
                >
                  sponsor or a partner
                </button>
                , or successfully pitch your robotics solution idea to{" "}
                <a
                  href="https://www.linkedin.com/in/tymofii-gusak-941271350/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FFCC00] font-semibold underline underline-offset-4 decoration-[#FFCC00]/50 hover:decoration-[#FFCC00]"
                >
                  Tymofii Gusak<span className="sr-only"> (opens in new tab)</span>
                </a>
                . There are only 53 places available for now.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            data-reveal
            className="reveal-stagger-2 cnc-card p-8 sm:p-10 flex flex-col justify-between group"
          >
            <span className="cnc-crosshair">+</span>
            <div>
              <span className="font-display text-2xl font-black text-[#FFCC00] block mb-4">
                03
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mb-4 uppercase group-hover:text-[#FFCC00] transition-colors">
                How Are We Different From Other Robotics Labs?
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#D4D4D4] leading-relaxed font-normal">
                We focus on radical innovation — that is, combining technologies in unconventional ways — and on the design of the technologies we create. We believe that an unconventional combination of technology and design is key to building robots. We’ll leave fundamental innovation to companies that build software;{" "}
                <span className="text-[#FFCC00] font-semibold">we’re here to build hardware.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
