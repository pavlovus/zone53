import React, { useState } from "react";
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
    { name: "theme-color", content: "#000000" },
    { property: "og:title", content: "ZONE 53 — Robotics & AR Laboratory (Warsaw)" },
    {
      property: "og:description",
      content:
        "Where robots meet augmented reality in the physical world. 1,200 sqm testing grounds near Warsaw, Poland. Permanent facility of Epikor.",
    },
    { property: "og:image", content: "/media/sky.webp" },
  ];
}

export default function Home() {
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const openDossier = () => setIsDossierOpen(true);
  const closeDossier = () => setIsDossierOpen(false);

  const scrollToFacility = () => {
    const el = document.getElementById("facility-recon");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col selection:bg-[#FFCC00] selection:text-black">
      {/* Interactive WebGL Wavy Grid Canvas spanning the entire page */}
      <WavyGridBackground />

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
