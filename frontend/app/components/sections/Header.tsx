import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { isAudioEnabled, toggleAudio } from "../../utils/audio";

interface HeaderProps {
  onRequestAccess: () => void;
}

export function Header({ onRequestAccess }: HeaderProps) {
  const [audioState, setAudioState] = useState(true);

  useEffect(() => {
    setAudioState(isAudioEnabled());
  }, []);

  const handleToggleAudio = () => {
    const nextState = toggleAudio();
    setAudioState(nextState);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-md border-b border-[#222222]">
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
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleToggleAudio}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-[#333333] hover:border-[#FFCC00]/50 text-[10px] font-mono tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle synthesized audio effects"
            title="Toggle synthesized audio effects"
          >
            <span className={audioState ? "text-[#FFCC00]" : "text-white/40"}>
              {audioState ? "AUDIO [ON]" : "AUDIO [MUTED]"}
            </span>
          </button>

          <Button
            id="header-request-access-btn"
            variant="primary"
            size="sm"
            onClick={onRequestAccess}
            className="text-[11px] sm:text-xs"
          >
            REQUEST ACCESS ↗
          </Button>
        </div>
      </div>
    </header>
  );
}
