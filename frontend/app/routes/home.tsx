import React, { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import { Header } from "../components/sections/Header";
import { Hero } from "../components/sections/Hero";
import { CautionRibbons } from "../components/sections/CautionRibbons";
import { ThesisManifesto } from "../components/sections/ThesisManifesto";
import { FacilityVideo } from "../components/sections/FacilityVideo";
import { BenefitsGrid } from "../components/sections/BenefitsGrid";
import { EpikorEcosystem } from "../components/sections/EpikorEcosystem";
import { Footer } from "../components/sections/Footer";
import { TopSecretDossierModal } from "../components/dossier/TopSecretDossierModal";
import { WavyGridBackground } from "../components/webgl/WavyGridBackground";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ZONE 53 — Europe's Flagship Robotics & AR Hangar Laboratory" },
    {
      name: "description",
      content:
        "The world's first Robotics & AR proving hangar near Warsaw, Poland. A classified deep-tech initiative of Epikor. 1,200 sqm of physical testing grounds for unreleased autonomous hardware.",
    },
    {
      name: "keywords",
      content:
        "Robotics, Augmented Reality, Hardware Incubator, Warsaw Robotics Lab, Epikor, Alien Bazaar, Deep Tech Hangar, Autonomous Robotics Poland, Europe Hardware VC, Robotics Proving Grounds",
    },
    { name: "author", content: "Epikor" },
    {
      name: "robots",
      content:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    { name: "theme-color", content: "#000000" },
    // Canonical link
    { tagName: "link", rel: "canonical", href: "https://zone53.com/" },
    // Open Graph Social Meta
    { property: "og:site_name", content: "ZONE 53" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://zone53.com/" },
    {
      property: "og:title",
      content: "ZONE 53 — Europe's Flagship Robotics & AR Hangar Laboratory",
    },
    {
      property: "og:description",
      content:
        "Where robots meet augmented reality in the physical world. 1,200 sqm proving grounds near Warsaw, Poland. Permanent facility of Epikor.",
    },
    { property: "og:image", content: "https://zone53.com/media/sky.webp" },
    { property: "og:image:width", content: "1920" },
    { property: "og:image:height", content: "1080" },
    {
      property: "og:image:alt",
      content: "ZONE 53 Robotics and AR Proving Hangar Laboratory near Warsaw",
    },
    { property: "og:locale", content: "en_US" },
    // Twitter / X Large Summary Card
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "ZONE 53 — Europe's Flagship Robotics & AR Hangar Laboratory",
    },
    {
      name: "twitter:description",
      content:
        "Where robots meet augmented reality in the physical world. 1,200 sqm proving grounds near Warsaw, Poland. Permanent facility of Epikor.",
    },
    { name: "twitter:image", content: "https://zone53.com/media/sky.webp" },
    {
      name: "twitter:image:alt",
      content: "ZONE 53 Robotics and AR Proving Hangar Laboratory near Warsaw",
    },
  ];
}

export default function Home() {
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08,
      }
    );

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const openDossier = () => setIsDossierOpen(true);
  const closeDossier = () => setIsDossierOpen(false);

  const scrollToFacility = () => {
    const el =
      document.getElementById("facility-video-frame") ||
      document.getElementById("facility-demo-video");
    if (el) {
      const rect = el.getBoundingClientRect();
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : window.innerWidth >= 640 ? 80 : 64;
      const visibleCenter = headerHeight + (window.innerHeight - headerHeight) / 2;
      const elementCenter = rect.top + rect.height / 2;
      const targetScrollY = window.scrollY + elementCenter - visibleCenter;

      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    } else {
      const fallback = document.getElementById("facility-recon");
      if (fallback) fallback.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const schemaStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ResearchOrganization",
        "@id": "https://zone53.com/#organization",
        "name": "ZONE 53",
        "url": "https://zone53.com/",
        "logo": "https://zone53.com/media/logo.webp",
        "image": "https://zone53.com/media/sky.webp",
        "description":
          "The world's first Robotics & AR proving hangar near Warsaw, Poland. A classified deep-tech initiative of Epikor.",
        "parentOrganization": {
          "@type": "Organization",
          "name": "Epikor",
          "url": "https://epikor.eu",
        },
        "sameAs": ["https://epikor.eu", "https://alienbazaar.com"],
      },
      {
        "@type": "Place",
        "@id": "https://zone53.com/#facility",
        "name": "ZONE 53 Proving Grounds",
        "description":
          "1,200 sqm testing grounds for unreleased autonomous robotics and augmented reality hardware.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Warsaw",
          "addressCountry": "PL",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 52.2297,
          "longitude": 21.0122,
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://zone53.com/#website",
        "url": "https://zone53.com/",
        "name": "ZONE 53 — Europe's Flagship Robotics & AR Hangar Laboratory",
        "publisher": {
          "@id": "https://zone53.com/#organization",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col selection:bg-[#FFCC00] selection:text-black">
      {/* Schema.org Structured Data (JSON-LD) for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaStructuredData),
        }}
      />

      {/* Interactive WebGL Wavy Grid Canvas spanning the entire page (paused when modal open) */}
      <WavyGridBackground active={!isDossierOpen} />

      {/* Tactile Analog 35mm Film Grain / Titanium Material Texture Overlay */}
      <div className="tactical-noise" aria-hidden="true" />

      {/* Top Tactical HUD Header */}
      <Header onRequestAccess={openDossier} />

      {/* Main Flow Content */}
      <main id="main-content" className="flex-1 w-full flex flex-col relative z-10">
        {/* 1. Hero Scene: Fullscreen Warsaw Hangar Sky */}
        <Hero onRequestAccess={openDossier} onExploreFacility={scrollToFacility} />

        {/* 2. Industrial Caution Ribbons: Legacy Angled Slide-in */}
        <CautionRibbons />

        {/* 3. The AR-Robotics Thesis: Hardware Paradigm Shift */}
        <ThesisManifesto />

        {/* 4. Facility Reconnaissance: Video Player & 4-Sector Capabilities */}
        <FacilityVideo />

        {/* 5. The 8 Strategic Privileges: Institutional Partner Mandates */}
        <BenefitsGrid onRequestAccess={openDossier} />

        {/* 6. Epikor Ecosystem: Warsaw Hardware Foundry */}
        <EpikorEcosystem />
      </main>

      {/* Footer Colophon */}
      <Footer />

      {/* Flagship Conversion: Top-Secret Clearance Dossier Modal */}
      <TopSecretDossierModal isOpen={isDossierOpen} onClose={closeDossier} />
    </div>
  );
}
