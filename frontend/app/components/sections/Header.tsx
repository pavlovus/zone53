import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { isAudioEnabled, toggleAudio } from "../../utils/audio";

interface HeaderProps {
  onRequestAccess: () => void;
}

export function Header({ onRequestAccess }: HeaderProps) {
  const [audioState, setAudioState] = useState(false);

  useEffect(() => {
    setAudioState(isAudioEnabled());

    const handleAudioChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setAudioState(customEvent.detail);
    };

    window.addEventListener("z53_audio_change", handleAudioChange);
    return () => window.removeEventListener("z53_audio_change", handleAudioChange);
  }, []);

  const handleToggleAudio = () => {
    const nextState = toggleAudio();
    setAudioState(nextState);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-md border-b border-[#222222] pt-[env(safe-area-inset-top,0px)] header-entrance">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Epikor / Zone 53 Identity */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="/"
            className="flex items-center gap-3 text-white no-underline group focus-visible:outline-none"
            aria-label="ZONE 53 — Return to Top"
          >
            <img
              src="/media/logo.webp"
              alt="ZONE 53"
              width={256}
              height={256}
              className="block w-12 h-12 sm:w-14 sm:h-14 object-contain"
            />
          </a>
        </div>

        {/* Right: Audio toggle + Primary Access CTA */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-black/70 border ${
              audioState ? "border-[#FFCC00]/70 text-[#FFCC00]" : "border-[#333333] text-white/60 hover:text-white"
            } hover:border-[#FFCC00] text-[10px] font-mono tracking-widest transition-colors cursor-pointer select-none chamfer-sm`}
            aria-label={audioState ? "Mute soundtrack and telemetry audio" : "Enable Epikor soundtrack and telemetry audio"}
            title={audioState ? "Mute soundtrack and telemetry audio" : "Enable Epikor soundtrack and telemetry audio"}
          >
            <span className={`eq-container ${audioState ? "is-active text-[#FFCC00]" : "text-white/40"}`} aria-hidden="true">
              <span className="eq-bar" />
              <span className="eq-bar" />
              <span className="eq-bar" />
            </span>
            <span>
              {audioState ? "AUDIO [ON]" : "AUDIO [OFF]"}
            </span>
          </button>

          <a
            href="https://www.linkedin.com/in/pavlo-vus-011747390"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-black/70 border border-[#333333] hover:border-[#FFCC00] text-white/60 hover:text-[#FFCC00] text-[10px] font-mono tracking-widest transition-colors cursor-pointer select-none chamfer-sm no-underline group"
            aria-label="Website Developed by Pavlo Vus on LinkedIn (opens in new tab)"
            title="Website Developed by Pavlo Vus"
          >
            <span>DEV // PAVLO VUS</span>
            <span
              className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>

          <Button
            id="header-request-access-btn"
            variant="primary"
            size="sm"
            onClick={onRequestAccess}
            className="text-[11px] sm:text-xs"
          >
            BECOME A SPONSOR ↗
          </Button>
        </div>
      </div>
    </header>
  );
}
