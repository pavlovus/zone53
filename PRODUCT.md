# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19, TypeScript 5.8+, React Router v7 in Framework Mode (powered by Vite 6), Tailwind CSS v4, custom lightweight Express SSR server (`server.js`).

## Users

* **Primary**: Venture capital partners, technology angel investors, deep-tech syndicates, and family offices evaluating high-growth European hardware/robotics opportunities.
* **Secondary**: Corporate industrial R&D leaders, manufacturing executives, and enterprise innovation directors seeking automation partnerships, custom robotics pilot deployments, and elite engineering talent.
* **Tertiary**: Hardware founders and robotics teams seeking residency in the permanent facility following the Alien Bazaar movement.

## Product Purpose

ZONE 53 is the public-facing gateway and high-impact investor portal for the world's first **AR-Robotics lab and hardware startup hangar** near Warsaw, Poland. 

The site's purpose is to:
1. Establish visceral credibility through real physical infrastructure (the actual hangar in Poland).
2. Articulate the paradigm-shifting thesis: *"The robot is the next personal computer, and AR is its keyboard and mouse."*
3. Showcase the 8 enterprise-grade benefits for strategic partners and investors.
4. Convert qualified capital allocators via a frictionless, high-touch investment inquiry pipeline into a private Telegram command channel.

## Positioning

ZONE 53 is **not** a generic software incubator, a virtual accelerator, or a SaaS product. It is the physical, classified **skunkworks laboratory of Epikor** ([epikor.eu](https://epikor.eu/)) and the permanent home of Europe's craziest hardware movement born at **Alien Bazaar** ([alienbazaar.com](https://www.alienbazaar.com/)). 

Unlike software-only platforms, ZONE 53 is anchored in heavy physical reality: a physical yellow hangar surrounded by open testing fields, equipped with real robotics hardware, drone testing zones, and an unreleased hardware cluster.

## Operating Context

Visitors view the site on high-resolution desktop displays (investor pitch reviews, office workstations) and mobile devices (quick evaluation following direct links in WhatsApp/Telegram/LinkedIn). They require instant load times, zero layout shifts, legible typography, and a cinematic experience that conveys institutional-grade execution without corporate blandness.

## Capabilities and Constraints

* **Rendering & Performance**: Hybrid architecture with static pre-rendering (SSG) for SEO-critical routes (`/`, `/privacy`, `/terms`) combined with lightweight Express SSR for dynamic runtime.
* **No SaaS Subscription Tiers**: Legacy pricing packages ($1,500 / $3,000 / $7,500 per month) are permanently removed. Engagement is structured as direct investment tickets and strategic enterprise partnerships.
* **Stateless Backend Pipeline**: Lead submissions trigger immediate schema validation (Zod), rate-limiting, honeypot bot filtering, and encrypted forwarding to the team's private Telegram chat. No user database is maintained.
* **Language Constraint**: Exclusively English (`en`) for international venture capital and global deep-tech standards.
* **Mandatory Physical Anchor**: The actual photography of the hangar (`assets/house.webp`) must be prominently featured as proof of tangible reality.

## User Journeys & Conversion Flow

The primary conversion pathway is built with duplicated, strategic touchpoints:
1. **The First Impression**: The visitor lands on the classified, high-contrast Hero scene featuring the Warsaw hangar, Druk Heavy typography, and an immediate primary CTA: `REQUEST ACCESS`.
2. **The Thesis & Vision**: The visitor scrolls through the foundational AR-Robotics thesis, revealing the vision of unified robotic intelligence and the lab's skunkworks history.
3. **The Facility & Hardware Cluster**: Exploration of the testing hangar, equipment specs (drones, robodogs, robotic manipulators, telepresence), and video showcase.
4. **The 8 Strategic Benefits**: Direct breakdown of partner privileges (24/7 access, private events, startup communication, talent scouting, R&D consulting, GTM in EU). Secondary CTA: `BECOME A PARTNER`.
5. **The Gamified Top-Secret Clearance Dossier (Core Experience)**: Clicking any CTA initiates the declassification clearance flow. Visually framed as a classified government/military clearance file (`DOSSIER // FILE #Z53-2026-X`), the user fills out a top-secret document featuring animated official security stamps (`[CLEARANCE: PENDING]` -> `[AUTHORIZED]`), redacted declassifying text bars that unscramble in real time, interactive biometric authorization, and a multi-part clearance protocol (`PART I: OPERATIVE IDENTITY`, `PART II: STRATEGIC MANDATE`, `PART III: DIRECT TRANSMISSION`).
6. **Seal & Transmission Telemetry**: Completing the dossier triggers a mechanical stamp imprint animation, visual/audio telemetry confirmation (*"TRANSMISSION ENCRYPTED // DISPATCHED TO SATELLITE RELAY"*), and instant delivery into the team's private Telegram command channel.

## Brand Commitments

* **Heritage & Lore**: Zone 53 is Epikor's birthplace of inventions — the laboratory where the iconic Mask and integrated robotics cluster originated, and the genesis point for the future city of Herma.
* **Color Palette**: Uncompromising tricolor: Deep Black (`#000000`), Stark White (`#FFFFFF`), and Epikor Signature Yellow (`#FFCC00`).
* **Tone of Voice**: Direct, fearless, technologically uncompromising, confident, classified yet accessible to qualified partners.

## Evidence on Hand

* High-resolution photographic assets of the physical hangar: `legacy/assets/house.webp`, `legacy/assets/house-m.webp`.
* High-resolution laboratory interior captures: `legacy/assets/interior.webp`, `legacy/assets/interior-m.webp`.
* Sky and environment assets: `legacy/assets/sky.webp`, `legacy/assets/sky-m.webp`.
* High-bitrate laboratory demonstration video: `legacy/assets/video.mp4` with poster `legacy/assets/video-poster.webp`.
* Authentic vector branding: Multi-layered SVG logo (`core`, `halo`, `outline`).
* Validated production fonts: `Druk-Heavy-subset.woff2`, `HelveticaNeueCyr` (Bold, Roman, Light, Italic).

## Product Principles

1. **Physical Reality Over Vaporware**: Never hide behind abstract 3D renders or generic graphics; lead with the real hangar, real hardware, and physical robots.
2. **Speed as a Signal of Competence**: Pages must deliver full semantic HTML instantly (LCP < 1.0s, zero CLS) to signal elite engineering quality to investors.
3. **Classified Exclusivity Without Obscurity**: Maintain the high-clearance aura of a top-secret skunkworks lab while giving investors complete clarity on value, infrastructure, and partnership opportunities.
4. **Weight & Substance in Motion**: Every interaction must feel deliberate, heavy, and mechanical — mirroring heavy industrial machinery rather than lightweight consumer apps.
