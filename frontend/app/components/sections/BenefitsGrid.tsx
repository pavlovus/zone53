import React from "react";
import { Button } from "../ui/Button";
import { TelemetryBadge } from "../ui/TelemetryBadge";

interface BenefitsGridProps {
  onRequestAccess: () => void;
}

export function BenefitsGrid({ onRequestAccess }: BenefitsGridProps) {
  const privileges = [
    {
      index: "01",
      title: "Chat with all startups",
      desc: "Get a direct line to every startup in the hangar, plus the private chat with other partners.",
    },
    {
      index: "02",
      title: "24/7 hangar access",
      desc: "Come to the hangar any time, day or night.",
    },
    {
      index: "03",
      title: "Access to all events",
      desc: "Join every event we run, including the closed demos and showcases.",
    },
    {
      index: "04",
      title: "Host your own event",
      desc: "Organise your own event together with our team.",
    },
    {
      index: "05",
      title: "Closed media channels",
      desc: "Get news and updates from our private media channels.",
    },
    {
      index: "06",
      title: "Find top engineers",
      desc: "We help you search for top engineers for your consumer robotics team.",
    },
    {
      index: "07",
      title: "Consumer robotics & AR consulting",
      desc: "Get advice and hands-on help to build a consumer robotics or AR product, or to bring one to your customers.",
    },
    {
      index: "08",
      title: "Launch in Poland",
      desc: "Get help to launch and sell your consumer robotics product in Poland.",
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
        <div data-reveal className="max-w-4xl mb-12 sm:mb-16">
          <div className="mb-4">
            <TelemetryBadge label="RESTRICTED // 8 STRATEGIC PRIVILEGES" status="classified" />
          </div>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-[0.01em] leading-[0.9] mb-6">
            JOIN THE FUTURE <br />
            <span className="text-[#FFCC00]">WHEN IT'S STILL CLASSIFIED.</span>
          </h2>
          <p className="font-sans text-sm sm:text-lg text-white/80 max-w-2xl font-normal leading-relaxed m-0">
            Here is everything your subscription includes: 8 benefits, listed below, from 24/7 hangar access to launching in Poland.
          </p>
        </div>

        {/* The 8 Privileges Grid (Rigid 1px hairline dividing borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-[#222222] border border-[#222222] mb-12 sm:mb-16">
          {privileges.map((item, index) => (
            <div
              key={item.index}
              data-reveal
              style={{
                "--reveal-delay": `${(index % 4) * 60 + Math.floor(index / 4) * 40}ms`,
              } as React.CSSProperties}
              className="cnc-card p-6 sm:p-8 flex flex-col justify-between group"
            >
              <span className="cnc-crosshair">+</span>
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
        <div
          data-reveal
          className="p-8 sm:p-10 cnc-card border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-6 chamfer-md"
        >
          <div className="flex flex-col gap-2 max-w-xl">
            <h3 className="font-sans text-xl sm:text-2xl font-bold uppercase text-white m-0">
              ALLOCATION APERTURE IS STRICTLY LIMITED
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/70 m-0">
              Only approved partner entities, venture syndicates, and consumer robotics hardware teams gain access to the Warsaw hangar.
            </p>
          </div>

          <Button
            id="privileges-request-access-btn"
            variant="primary"
            size="lg"
            onClick={onRequestAccess}
            className="w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap"
          >
            BECOME A SPONSOR ↗
          </Button>
        </div>
      </div>
    </section>
  );
}
