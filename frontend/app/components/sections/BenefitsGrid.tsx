import React from "react";
import { Button } from "../ui/Button";

interface BenefitsGridProps {
  onRequestAccess: () => void;
}

export function BenefitsGrid({ onRequestAccess }: BenefitsGridProps) {
  const privileges = [
    {
      index: "01",
      title: "Permanent Warsaw Hangar Flight Access",
      desc: "Deploy unreleased aerial and ground autonomous robotics inside a controlled 1,200 m² indoor facility without regulatory airspace red-tape.",
    },
    {
      index: "02",
      title: "First-Look Deep Tech Dealflow",
      desc: "Direct allocation rights in high-conviction robotics, defense, and spatial computing rounds before institutional syndicate announcements.",
    },
    {
      index: "03",
      title: "Closed Founder & Allocator Demo Days",
      desc: "Invitation-only live flight showcases, hardware stress tests, and unrecorded technical deep-dives behind closed doors.",
    },
    {
      index: "04",
      title: "Hardware Residency for Elite Engineers",
      desc: "Dedicated bench space, industrial power, rapid carbon prototyping, CNC machinery, and high-bandwidth telemetry rigs.",
    },
    {
      index: "05",
      title: "Shared Sensor & Compute Fleet",
      desc: "Access to high-speed optical motion capture, LiDAR corridors, RTK GPS repeaters, and edge GPU clusters for model fine-tuning.",
    },
    {
      index: "06",
      title: "Private Command Network",
      desc: "Direct encrypted communications with foundry partners, defense innovators, and top spatial software architects across Europe.",
    },
    {
      index: "07",
      title: "Epikor Foundry Hardware Sourcing",
      desc: "Pre-negotiated industrial component supply chains, rapid PCB fab turnarounds, custom silicon procurement, and chassis machining.",
    },
    {
      index: "08",
      title: "Custom AR Systems Co-Development",
      desc: "Dedicated engineering advisory and joint prototyping to integrate spatial augmented reality interfaces into your industrial robotics fleet.",
    },
  ];

  return (
    <section
      id="strategic-privileges"
      className="relative py-20 sm:py-32 bg-black/50 border-b border-[#222222]"
      aria-label="8 Strategic Privileges for Partners and Allocators"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Title */}
        <div className="max-w-4xl mb-12 sm:mb-16">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-[0.9] mb-6">
            JOIN THE FUTURE <br />
            <span className="text-[#FFCC00]">WHEN IT'S STILL CLASSIFIED.</span>
          </h2>
          <p className="font-sans text-sm sm:text-lg text-white/80 max-w-2xl font-normal leading-relaxed m-0">
            We do not sell SaaS subscription tiers. We assemble an unassailable consortium of venture allocators and industrial enterprise leaders who shape physical reality.
          </p>
        </div>

        {/* The 8 Privileges Grid (Rigid 1px hairline dividing borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-[#222222] border border-[#222222] mb-12 sm:mb-16">
          {privileges.map((item) => (
            <div
              key={item.index}
              className="bg-[#0C0C0C]/90 p-6 sm:p-8 flex flex-col justify-between hover:bg-[#141414] transition-colors relative group"
            >
              <div>
                <span className="font-display text-2xl font-black text-[#FFCC00] block mb-4">
                  {item.index}
                </span>

                <h3 className="font-sans text-lg sm:text-xl font-bold text-white mb-3 uppercase group-hover:text-[#FFCC00] transition-colors">
                  {item.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#D4D4D4] leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Directive & CTA Trigger */}
        <div className="p-8 sm:p-10 bg-[#0E0E0E]/90 border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-6 chamfer-md">
          <div className="flex flex-col gap-2 max-w-xl">
            <h3 className="font-sans text-xl sm:text-2xl font-bold uppercase text-white m-0">
              ALLOCATION APERTURE IS STRICTLY LIMITED
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/70 m-0">
              Only approved partner entities, venture syndicates, and hardware teams gain access to the Warsaw hangar.
            </p>
          </div>

          <Button
            id="privileges-request-access-btn"
            variant="primary"
            size="lg"
            onClick={onRequestAccess}
            className="w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap"
          >
            SUBMIT CLEARANCE APPLICATION ↗
          </Button>
        </div>
      </div>
    </section>
  );
}
