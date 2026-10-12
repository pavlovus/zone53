import React from "react";

export function ThesisManifesto() {
  return (
    <section className="relative py-20 sm:py-32 bg-black/50 border-b border-[#222222]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* The Macro-Statement */}
        <div className="max-w-5xl mb-16 sm:mb-24">
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
          <div className="bg-[#0C0C0C]/90 p-8 sm:p-10 flex flex-col justify-between group hover:bg-[#141414] transition-colors relative">
            <div>
              <span className="font-display text-2xl font-black text-[#FFCC00] block mb-4">
                01
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mb-4 uppercase">
                Beyond Flat Glass
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#D4D4D4] leading-relaxed font-normal">
                For half a century, computing has been trapped behind two-dimensional flat glass screens. Robotics liberates computation into physical matter — moving objects, inspecting infrastructure, and operating autonomously in the real world.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0C0C0C]/90 p-8 sm:p-10 flex flex-col justify-between group hover:bg-[#141414] transition-colors relative">
            <div>
              <span className="font-display text-2xl font-black text-[#FFCC00] block mb-4">
                02
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mb-4 uppercase">
                The Natural Interface
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#D4D4D4] leading-relaxed font-normal">
                Instead of a keyboard and cursor, you command robotic fleets with a glance, a gesture, or an intention projected through augmented reality lenses. Humans supervise at the speed of thought.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0C0C0C]/90 p-8 sm:p-10 flex flex-col justify-between group hover:bg-[#141414] transition-colors relative">
            <div>
              <span className="font-display text-2xl font-black text-[#FFCC00] block mb-4">
                03
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mb-4 uppercase">
                Physical Convergence
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#D4D4D4] leading-relaxed font-normal">
                To turn this thesis into industrial reality, Epikor brought together Eastern Europe's fiercest hardware engineers, drone operators, and robotics founders into{" "}
                <span className="text-[#FFCC00] font-semibold">one permanent testing hangar near Warsaw.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
