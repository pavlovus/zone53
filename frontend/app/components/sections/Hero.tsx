import React from "react";
import { Button } from "../ui/Button";

interface HeroProps {
  onRequestAccess: () => void;
  onExploreFacility: () => void;
}

export function Hero({ onRequestAccess, onExploreFacility }: HeroProps) {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-12 overflow-hidden bg-black">
      {/* 1. Fullscreen Sky & Warsaw Hangar Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <picture className="block h-full">
          <source media="(max-width: 640px)" srcSet="/media/sky-m.webp" type="image/webp" />
          {/* Mobile: image is capped to the upper part of the hero so the hangar stays above the content card */}
          <img
            src="/media/sky.webp"
            alt="Zone 53 Warsaw Hangar Laboratory"
            className="w-full h-[calc(6rem+40vh)] sm:h-[calc(7rem+50vh)] lg:h-auto lg:max-h-full object-cover object-[center_25%] lg:object-top opacity-90"
            fetchPriority="high"
          />
        </picture>
        {/* Cinematic gradient overlays for contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 via-65% to-black/60 pointer-events-none" />
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
      </div>

      {/* 2. Spacer: the ZONE 53 wordmark is part of the hero image, so this keeps the hangar clear of the card */}
      <div className="flex-1 min-h-[40vh] sm:min-h-[50vh]" />

      {/* 4. Hero Bottom Content: Headline, Manifesto & Action Call */}
      <div className="relative z-20 max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-white/15 pt-6 sm:pt-8 bg-black/70 backdrop-blur-md p-6 sm:p-8 chamfer-md">
          {/* Left: Headline and Description */}
          <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4">
            <h1 className="font-display uppercase text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] tracking-tight text-white m-0">
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
