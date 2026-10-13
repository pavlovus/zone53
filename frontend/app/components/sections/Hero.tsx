import React from "react";
import { Button } from "../ui/Button";
import { Zone53Paths } from "../ui/Zone53Logo";

interface HeroProps {
  onRequestAccess: () => void;
  onExploreFacility: () => void;
}

// Mobile hero photo (sky-m.webp) intrinsic size, used as the SVG overlay's coordinate space.
const ART_W = 942;
const ART_H = 1433;
// Zoom of the photo relative to "cover by width" (1 = photo exactly as wide as the screen).
const ART_ZOOM = 1.136;
// Wordmark: spans 90% of the visible photo width, with its baseline just behind the hangar roof (photo coords).
const WORDMARK_W = 1864;
const WORDMARK_H = 590;
const WORDMARK_BASELINE_Y = 765;
const VISIBLE_W = ART_W / ART_ZOOM;
const WORD_W = VISIBLE_W * 0.9;
const WORD_SCALE = WORD_W / WORDMARK_W;
const WORD_TRANSFORM = `translate(${(ART_W - WORD_W) / 2} ${WORDMARK_BASELINE_Y - WORDMARK_H * WORD_SCALE}) scale(${WORD_SCALE})`;

export function Hero({ onRequestAccess, onExploreFacility }: HeroProps) {
  return (
    <section className="relative h-svh min-h-[40rem] lg:h-auto lg:min-h-screen w-full flex flex-col justify-start lg:justify-between pt-16 sm:pt-20 lg:pt-28 pb-8 sm:pb-12 overflow-hidden bg-black">
      {/* 1a. Mobile/tablet: the scene takes exactly the space left above the headline card, so the title and
          both buttons are always inside the first screen. The photo is sized and offset in container units
          (cqw/cqh): zoomed 113.6% of the screen width, centred, with the top of the sky cropped so the horizon
          sits ~60% down the box (the offset is raised only when a short box would otherwise push the hangar out).
          The ZONE 53 wordmark sits horizontally in the sky *behind* the hangar: the SVG overlay shares the
          photo's own coordinate space, draws the wordmark, then re-draws the hangar silhouette from the same
          photo on top of it. */}
      <div className="relative lg:hidden w-full flex-1 min-h-0 overflow-hidden [container-type:size]">
        <div
          className="absolute hero-art-enter"
          style={{
            width: `${ART_ZOOM * 100}cqw`,
            aspectRatio: `${ART_W} / ${ART_H}`,
            left: `${((1 - ART_ZOOM) / 2) * 100}cqw`,
            top: "calc(-1 * max(35.9cqw, 96.47cqw - 62cqh))",
          }}
        >
          <img
            src="/media/sky-m.webp"
            alt="Zone 53 Warsaw Hangar Laboratory"
            className="block w-full h-full"
            fetchPriority="high"
          />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${ART_W} ${ART_H}`}
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <clipPath id="z53-hangar-clip">
                <polygon points="318,745 471,691 624,745 624,834 318,834" />
              </clipPath>
              {/* Dims the sky everywhere except inside the letters (knock-out), fading out toward the horizon. */}
              <mask id="z53-letter-knockout" maskUnits="userSpaceOnUse" x="0" y="0" width={ART_W} height={ART_H}>
                <rect x="0" y="0" width={ART_W} height={ART_H} fill="white" />
                <g transform={WORD_TRANSFORM} fill="black">
                  <Zone53Paths />
                </g>
              </mask>
              <linearGradient id="z53-sky-dim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="black" stopOpacity="0.58" />
                <stop offset="0.72" stopColor="black" stopOpacity="0.58" />
                <stop offset="1" stopColor="black" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Same "window into a brighter sky" look as the desktop artwork: the sky around the wordmark is dimmed,
                the letters reveal the bright clouds (slightly lifted), and a thin cool-white outline edges them. */}
            <rect
              x="0"
              y="0"
              width={ART_W}
              height={WORDMARK_BASELINE_Y + 45}
              fill="url(#z53-sky-dim)"
              mask="url(#z53-letter-knockout)"
            />
            <g
              transform={WORD_TRANSFORM}
              fill="white"
              fillOpacity="0.34"
              style={{ mixBlendMode: "screen" }}
            >
              <Zone53Paths />
            </g>
            <g
              transform={WORD_TRANSFORM}
              fill="none"
              stroke="#dcebff"
              strokeOpacity="0.85"
              strokeWidth="5"
              strokeLinejoin="round"
            >
              <Zone53Paths />
            </g>
            <image
              href="/media/sky-m.webp"
              width={ART_W}
              height={ART_H}
              clipPath="url(#z53-hangar-clip)"
            />
          </svg>
        </div>
      </div>

      {/* 1b. Desktop: wide artwork with the ZONE 53 wordmark baked in. Starts below the fixed navbar (h-20)
          so the wordmark is never covered by it. */}
      <div className="hidden lg:block absolute inset-x-0 bottom-0 top-20 z-0 pointer-events-none hero-art-enter">
        <img
          src="/media/sky.webp"
          alt="Zone 53 Warsaw Hangar Laboratory"
          className="w-full h-auto [mask-image:linear-gradient(to_bottom,black_90%,transparent)]"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* 2. Desktop spacer: tracks the image height (36.5vw ≈ hangar base of the 1920:1000 artwork) so the
          card may overlap the foreground grass but stays below the hangar. */}
      <div className="hidden lg:block lg:flex-1 lg:min-h-[calc(36.5vw-2rem)]" />

      {/* 4. Hero Bottom Content: Headline, Manifesto & Action Call */}
      <div className="relative z-20 max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-white/15 pt-6 sm:pt-8 bg-black/70 backdrop-blur-md p-6 sm:p-8 chamfer-md hero-card-enter lg:[container-type:inline-size]">
          {/* Left: Headline. Desktop size is fluid: the headline column is 7/12 of the card, and each of the two
              lines is ~6.34em wide, so font-size = column / 6.34 * 0.95 = 8.75cqw - 2px (cqw = card content width),
              capped at 8rem. This keeps both lines on one row at every width (the old stepped sizes wrapped to
              four lines at ~1536px). */}
          <div className="lg:col-span-7 flex flex-col hero-headline-enter">
            <h1 className="font-display uppercase text-4xl sm:text-6xl md:text-7xl lg:text-[length:clamp(4rem,calc(8.75cqw-2px),8rem)] lg:whitespace-nowrap leading-[0.92] tracking-[0.01em] text-white m-0">
              FIRST IN THE WORLD <br />
              <span className="text-[#FFCC00]">ROBOTICS & AR LAB.</span>
            </h1>
          </div>

          {/* Right: Primary Actions */}
          {/* Desktop: lifted ~0.1em of the headline size so the buttons line up with the headline's bottom line
              (its text box extends a little below the visible glyph baseline). */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end justify-end lg:mb-[min(calc(0.875cqw-0.2px),12.8px)] hero-actions-enter">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Button
                id="hero-request-access-btn"
                variant="primary"
                size="lg"
                onClick={onRequestAccess}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                BECOME A SPONSOR ↗
              </Button>

              <Button
                id="hero-explore-facility-btn"
                variant="secondary"
                size="lg"
                onClick={onExploreFacility}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                SEE DEMO ↓
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
