import React from "react";
import { Button } from "../ui/Button";
import { Zone53Logo } from "../ui/Zone53Logo";

interface HeroProps {
  onRequestAccess: () => void;
  onExploreFacility: () => void;
}

export function Hero({ onRequestAccess, onExploreFacility }: HeroProps) {
  return (
    <section className="relative lg:min-h-screen w-full flex flex-col justify-start lg:justify-between pt-16 sm:pt-20 lg:pt-28 pb-12 overflow-hidden bg-black">
      {/* 1a. Mobile/tablet: tall portrait scene filling almost the whole screen (below the fixed navbar,
          leaving a peek of the content card). The image is zoomed 125% from the top so the hangar is large,
          and the ZONE 53 title is rotated 90° above the roof so it can use the full height. */}
      <div className="relative lg:hidden w-full h-[calc(100svh-9rem)] sm:h-[calc(100svh-10rem)] min-h-[26rem] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[125%]">
          <img
            src="/media/sky-m.webp"
            alt="Zone 53 Warsaw Hangar Laboratory"
            className="w-full h-full object-cover object-top"
            fetchPriority="high"
          />
        </div>
        <div className="absolute inset-x-0 top-3 bottom-[42%] flex justify-center text-white/85 pointer-events-none">
          <Zone53Logo vertical className="h-full w-auto" />
        </div>
      </div>

      {/* 1b. Desktop: wide artwork with the ZONE 53 wordmark baked in. Starts below the fixed navbar (h-20)
          so the wordmark is never covered by it. */}
      <div className="hidden lg:block absolute inset-x-0 bottom-0 top-20 z-0 pointer-events-none">
        <img
          src="/media/sky.webp"
          alt="Zone 53 Warsaw Hangar Laboratory"
          className="w-full h-auto [mask-image:linear-gradient(to_bottom,black_90%,transparent)]"
          loading="lazy"
        />
      </div>

      {/* 2. Desktop spacer: tracks the image height (36.5vw ≈ hangar base of the 1920:1000 artwork) so the
          card may overlap the foreground grass but stays below the hangar. */}
      <div className="hidden lg:block lg:flex-1 lg:min-h-[calc(36.5vw-2rem)]" />

      {/* 4. Hero Bottom Content: Headline, Manifesto & Action Call */}
      <div className="relative z-20 max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-white/15 pt-6 sm:pt-8 bg-black/70 backdrop-blur-md p-6 sm:p-8 chamfer-md">
          {/* Left: Headline and Description */}
          <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4">
            <h1 className="font-display uppercase text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] tracking-[0.01em] text-white m-0">
              FIRST IN THE WORLD <br />
              <span className="text-[#FFCC00]">ROBOTICS & AR LAB.</span>
            </h1>

            <p className="font-sans text-sm sm:text-base md:text-lg text-white/80 max-w-xl font-normal leading-relaxed m-0">
              A high-security hardware hangar near Warsaw, Poland. Where unreleased spatial interfaces and physical robotics unite under one roof.
            </p>
          </div>

          {/* Right: Primary Actions */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end justify-end">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Button
                id="hero-request-access-btn"
                variant="primary"
                size="lg"
                onClick={onRequestAccess}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                REQUEST ACCESS [DOSSIER] ↗
              </Button>

              <Button
                id="hero-explore-facility-btn"
                variant="secondary"
                size="lg"
                onClick={onExploreFacility}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                FACILITY TOUR ↓
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
