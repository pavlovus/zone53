import React, { useState, useEffect, useRef } from "react";
import {
  playMechanicalClick,
  playTelemetryPing,
  playHeavyStampSound,
  playAuthorizationChord,
  isAudioEnabled,
  setAudioEnabled as setAudioEnabledGlobal,
} from "../../utils/audio";

interface TopSecretDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TopSecretDossierModal({ isOpen, onClose }: TopSecretDossierModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    phone: "",
    investment_amount: "",
    comment: "",
    trap_website: "", // honeypot
  });

  const [step, setStep] = useState<"fill" | "biometric" | "transmitting" | "authorized">("fill");
  const [progress, setProgress] = useState(20);
  const [stampActive, setStampActive] = useState(false);
  const [biometricHolding, setBiometricHolding] = useState(false);
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    setAudioEnabled(isAudioEnabled());

    const handleAudioSync = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setAudioEnabled(customEvent.detail);
    };

    window.addEventListener("z53_audio_change", handleAudioSync);
    return () => window.removeEventListener("z53_audio_change", handleAudioSync);
  }, [isOpen]);

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    setAudioEnabledGlobal(next);
  };

  // Lifecycle states:
  // - isMounted: DOM presence (stays true during exit animation)
  // - isVisible: CSS animation classes (.is-open vs .is-closing)
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const biometricTimerRef = useRef<number | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastClickSoundTimeRef = useRef<number>(0);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Audio helper triggers respecting user sound preference
  const sndClick = (freq?: number) => {
    if (audioEnabled) playMechanicalClick(freq);
  };
  const sndPing = (up?: boolean) => {
    if (audioEnabled) playTelemetryPing(up);
  };
  const sndStamp = () => {
    if (audioEnabled) playHeavyStampSound();
  };
  const sndChord = () => {
    if (audioEnabled) playAuthorizationChord();
  };

  // Sync mounting and visibility with isOpen prop & restore focus to trigger on close
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = (document.activeElement as HTMLElement) || null;
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      setIsMounted(true);
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      // If closed externally from parent
      if (isMounted) {
        setIsVisible(false);
        exitTimerRef.current = setTimeout(() => {
          setIsMounted(false);
          triggerRef.current?.focus();
        }, 380);
        return () => {
          if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        };
      }
    }
  }, [isOpen, isMounted]);

  // Internal graceful close trigger (ESC, close buttons, backdrop click)
  const handleClose = () => {
    if (!isVisible || step === "transmitting") return;
    setIsVisible(false);
    sndClick(650);

    exitTimerRef.current = setTimeout(() => {
      setIsMounted(false);
      onClose();
      triggerRef.current?.focus();
    }, 380);
  };

  // 1. Lock background body scrolling while modal is mounted
  useEffect(() => {
    if (isMounted) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMounted]);

  // 2. Auto-focus first input when entering "fill" step
  useEffect(() => {
    if (isVisible && step === "fill") {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [isVisible, step]);

  // 3. Close on Escape and Focus Trap
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "transmitting") {
        handleClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMounted, isVisible, step]);

  // Reset form status when modal is completely unmounted
  useEffect(() => {
    if (!isMounted) {
      if (step === "authorized") {
        setStep("fill");
        setBiometricProgress(0);
        setBiometricHolding(false);
        setStampActive(false);
        setErrorMessage("");
        setCopiedReceipt(false);
      }
    }
  }, [isMounted, step]);

  // Compute Clearance Index based on filled inputs
  useEffect(() => {
    let score = 20;
    if (formData.name.trim().length > 1) score += 20;
    if (formData.email.includes("@") && formData.email.includes(".")) score += 25;
    if (formData.phone.trim().length >= 6) score += 15;
    if (formData.website.trim().length > 2) score += 10;
    if (formData.comment.trim().length > 4) score += 10;
    setProgress(Math.min(score, 100));
  }, [formData]);

  if (!isMounted) return null;

  // Throttled keyboard click with natural frequency variation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const now = Date.now();
    if (now - lastClickSoundTimeRef.current > 75) {
      const variation = (Math.random() - 0.5) * 120;
      sndClick(1250 + variation);
      lastClickSoundTimeRef.current = now;
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Strict input validation
  const validateInputs = () => {
    if (!formData.name.trim()) {
      setErrorMessage("NAME IS REQUIRED");
      sndClick(600);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage("VALID EMAIL REQUIRED // SPECIFY DOMAIN (e.g. name@domain.com)");
      sndClick(600);
      return false;
    }
    if (formData.phone.trim().length < 6) {
      setErrorMessage("PHONE MUST BE AT LEAST 6 CHARACTERS");
      sndClick(600);
      return false;
    }
    if (!formData.investment_amount.trim()) {
      setErrorMessage("PLANNED MONTHLY INVESTMENT IS REQUIRED");
      sndClick(600);
      return false;
    }
    return true;
  };

  const proceedToBiometric = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateInputs()) return;

    sndPing(true);
    setStep("biometric");
  };

  // Biometric hold mechanics (2.0s duration)
  const startBiometricHold = () => {
    if (biometricProgress >= 100) return;
    setBiometricHolding(true);
    sndClick(800);

    let current = biometricProgress;
    if (biometricTimerRef.current) clearInterval(biometricTimerRef.current);

    biometricTimerRef.current = window.setInterval(() => {
      current += 2;
      setBiometricProgress(Math.min(current, 100));
      if (Math.round(current) % 16 === 0) {
        sndClick(950 + current * 6);
      }
      if (current >= 100) {
        clearInterval(biometricTimerRef.current!);
        executeTransmission();
      }
    }, 40);
  };

  const cancelBiometricHold = () => {
    if (step === "transmitting" || step === "authorized") return;
    if (biometricProgress < 100) {
      setBiometricHolding(false);
      setBiometricProgress(0);
      if (biometricTimerRef.current) {
        clearInterval(biometricTimerRef.current);
      }
    }
  };

  // Automated seal trigger (2.0s duration)
  const triggerAutoSeal = () => {
    if (step === "transmitting" || step === "authorized") return;
    setBiometricHolding(true);
    sndClick(900);

    let current = 0;
    if (biometricTimerRef.current) clearInterval(biometricTimerRef.current);

    biometricTimerRef.current = window.setInterval(() => {
      current += 2;
      setBiometricProgress(Math.min(current, 100));
      if (Math.round(current) % 16 === 0) {
        sndClick(1000 + current * 6);
      }
      if (current >= 100) {
        clearInterval(biometricTimerRef.current!);
        executeTransmission();
      }
    }, 40);
  };

  const executeTransmission = async () => {
    setStep("transmitting");
    sndPing(true);

    // Bot trap check
    if (formData.trap_website) {
      const now = new Date().toISOString().replace("T", " // ").slice(0, 19) + " UTC [SEC-53]";
      setFormattedTime(now);
      setStep("authorized");
      setStampActive(true);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        website: formData.website.trim() || undefined,
        phone: formData.phone.trim(),
        investment_amount: formData.investment_amount.trim(),
        comment: formData.comment.trim() || undefined,
        trap_website: formData.trap_website || undefined,
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        const now = new Date().toISOString().replace("T", " // ").slice(0, 19) + " UTC [SEC-53]";
        setFormattedTime(now);
        setStep("authorized");
        setStampActive(true);
        sndStamp();
        setTimeout(() => {
          sndChord();
        }, 300);
      } else {
        setErrorMessage(data.error ? `TRANSMISSION ERROR: ${data.error}` : "COMMUNICATION FAILURE: PLEASE RETRY");
        setStep("fill");
      }
    } catch {
      setErrorMessage("NETWORK UNREACHABLE // CHECK CONNECTION & RETRY");
      setStep("fill");
    }
  };

  const handleCopyReceipt = () => {
    const text = `ZONE 53 DOSSIER TRANSMISSION RECEIPT\nCALLSIGN: ${formData.name}\nINVESTMENT: [${formData.investment_amount}]\nTELEMETRY TIME: ${formattedTime}\nSTATUS: DISPATCHED // ENCRYPTED\nFACILITY: EPIKOR WARSAW PROVING GROUNDS`;
    navigator.clipboard?.writeText(text);
    setCopiedReceipt(true);
    sndPing(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
      aria-describedby="dossier-modal-desc"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== "transmitting") {
          handleClose();
        }
      }}
      className={`dossier-backdrop ${isVisible ? "is-open" : "is-closing"}`}
    >
      {/* Background scanline effect behind content */}
      <div className="absolute inset-0 scanlines opacity-25 pointer-events-none" aria-hidden="true" />

      {/* Dossier Container with physical scale-in and graceful scale-out */}
      <div
        ref={modalRef}
        className={`dossier-window relative w-full max-w-3xl bg-[#090909] border-2 border-[#333333] shadow-[0_0_50px_rgba(0,0,0,0.95)] my-auto chamfer-dossier max-h-[90dvh] flex flex-col overflow-y-auto z-10 ${isVisible ? "is-open" : "is-closing"
          }`}
      >
        {/* Top hazard stripes */}
        <div className="caution-stripes" aria-hidden="true" />

        {/* Top Classification Header Bar */}
        <div className="bg-[#141414] border-b-2 border-[#262626] px-4 sm:px-6 py-2.5 flex items-center justify-between text-white flex-shrink-0 cascade-in cascade-delay-1 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2.5 h-2.5 bg-[#FFCC00] animate-pulse flex-shrink-0" />
            <span
              id="dossier-modal-title"
              className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#FFCC00] truncate"
            >
              RESTRICTED // EYES ONLY
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Audio Feedback Mute Toggle */}
            <button
              id="dossier-audio-toggle"
              type="button"
              onClick={handleToggleAudio}
              className="font-mono text-[10px] sm:text-xs text-white/60 hover:text-[#FFCC00] active:scale-95 px-2 py-1 bg-black/60 border border-white/20 hover:border-[#FFCC00] cursor-pointer relative z-20 transition-all select-none"
              aria-label={audioEnabled ? "Mute interface audio effects" : "Enable interface audio effects"}
              title="Toggle audio telemetry"
            >
              [{audioEnabled ? "AUDIO ON" : "MUTED"}]
            </button>

            <button
              id="dossier-close-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="font-mono text-[10px] sm:text-xs text-white/60 hover:text-[#FFCC00] active:scale-95 px-2 py-1 bg-black/60 border border-white/20 hover:border-[#FFCC00] cursor-pointer relative z-20 transition-all"
              aria-label="Close Dossier"
            >
              [CLOSE ESC]
            </button>
          </div>
        </div>

        {/* Faint Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
          <span className="font-display text-8xl md:text-9xl font-black uppercase rotate-[-30deg] whitespace-nowrap text-white">
            TOP SECRET // ZONE 53 // DECLASSIFIED
          </span>
        </div>

        {/* Clearance Index Meter */}
        <div className="bg-black/90 border-b border-[#222222] px-4 sm:px-6 py-2 flex items-center justify-between font-mono text-[11px] flex-shrink-0 cascade-in cascade-delay-2">
          <div className="flex items-center gap-2">
            <span className="text-white/50">CLEARANCE INDEX:</span>
            <span className="text-[#FFCC00] font-bold">[{progress}%]</span>
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Clearance Index Progress"
              className="w-28 sm:w-40 h-1.5 bg-[#1C1C1C] border border-[#333333] relative overflow-hidden"
            >
              <div
                className="h-full bg-[#FFCC00] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dossier Body */}
        <div className="p-4 sm:p-6 relative z-10">
          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 p-3 bg-[#FF2A2A]/15 border border-[#FF2A2A] font-mono text-xs text-[#FF2A2A] tracking-wider uppercase animate-fadeIn"
            >
              ▲ {errorMessage}
            </div>
          )}

          {/* STEP 1: FILL DOSSIER */}
          {step === "fill" && (
            <form onSubmit={proceedToBiometric} className="step-fade-in flex flex-col gap-4 sm:gap-5">
              {/* Form Header */}
              <div className="flex flex-col gap-3 pb-3 border-b border-[#222222] cascade-in cascade-delay-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="font-mono text-[10px] text-[#FFCC00] tracking-[0.2em] uppercase m-0 mb-1.5"
                      aria-hidden="true"
                    >
                      DOSSIER // FILE #Z53-2026-X
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-[0.01em] m-0">
                      CLEARANCE APPLICATION
                    </h2>
                    <p id="dossier-modal-desc" className="font-sans text-xs text-white/60 mt-1 m-0">
                      Direct application for partners, sponsors, and Warsaw hangar access.
                    </p>
                  </div>

                  {/* Mechanical stamp */}
                  <div
                    aria-hidden="true"
                    className="shrink-0 mt-1 rotate-[-4deg] border-2 border-[#FFCC00] px-2 py-1 font-mono text-[10px] sm:text-xs font-bold leading-tight tracking-widest text-center text-[#FFCC00] uppercase select-none"
                  >
                    PENDING
                    <br />
                    AUTHORIZATION
                  </div>
                </div>

                {/* Document metadata strip */}
                <div
                  aria-hidden="true"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#222222] border border-[#222222] font-mono text-[10px] uppercase tracking-wider select-none"
                >
                  {[
                    ["File No.", "Z53-2026-X"],
                    ["Classification", "Top Secret"],
                    ["Origin", "Warsaw Hangar"],
                    ["Distribution", "Eyes Only"],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-[#0A0A0A] px-2.5 py-1.5 flex flex-col gap-0.5">
                      <span className="text-white/50">{label}</span>
                      <span className="text-white font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION I: CONTACT */}
              <div className="flex flex-col gap-3 cascade-in cascade-delay-4">
                <div className="font-mono text-xs text-[#FFCC00] font-bold tracking-wider flex items-center gap-3">
                  <span>PART I // APPLICANT IDENTITY</span>
                  <span className="flex-1 h-px bg-[#222222]" aria-hidden="true" />
                  <span className="text-white/25 font-normal tracking-normal select-none" aria-hidden="true">
                    ████████ ███
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="z53-name"
                      className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                    >
                      Name *
                    </label>
                    <input
                      ref={firstInputRef}
                      id="z53-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      maxLength={100}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="h-11 px-3 bg-black border border-[#333333] hover:border-[#666666] hover:bg-[#0A0A0A] focus:border-[#FFCC00] focus:bg-black focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all cursor-text"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="z53-email"
                      className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                    >
                      Email *
                    </label>
                    <input
                      id="z53-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={150}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="h-11 px-3 bg-black border border-[#333333] hover:border-[#666666] hover:bg-[#0A0A0A] focus:border-[#FFCC00] focus:bg-black focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all cursor-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Website */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="z53-website"
                      className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                    >
                      Website
                    </label>
                    <input
                      id="z53-website"
                      name="website"
                      type="text"
                      autoComplete="url"
                      maxLength={120}
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="company.com"
                      className="h-11 px-3 bg-black border border-[#333333] hover:border-[#666666] hover:bg-[#0A0A0A] focus:border-[#FFCC00] focus:bg-black focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all cursor-text"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="z53-phone"
                      className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                    >
                      Phone *
                    </label>
                    <input
                      id="z53-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      maxLength={50}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+48 600 123 456"
                      className="h-11 px-3 bg-black border border-[#333333] hover:border-[#666666] hover:bg-[#0A0A0A] focus:border-[#FFCC00] focus:bg-black focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all cursor-text"
                    />
                  </div>
                </div>
              </div>

              {/* Bot trap honeypot field (hidden) */}
              <div className="hidden" aria-hidden="true">
                <input
                  name="trap_website"
                  type="text"
                  tabIndex={-1}
                  value={formData.trap_website}
                  onChange={handleChange}
                />
              </div>

              {/* SECTION II: CAPITAL ALLOCATION & BRIEF */}
              <div className="flex flex-col gap-3 pt-3 border-t border-[#222222] cascade-in cascade-delay-5">
                <div className="font-mono text-xs text-[#FFCC00] font-bold tracking-wider flex items-center gap-3">
                  <span>PART II // CAPITAL ALLOCATION & BRIEF</span>
                  <span className="flex-1 h-px bg-[#222222]" aria-hidden="true" />
                  <span className="text-white/25 font-normal tracking-normal select-none" aria-hidden="true">
                    ██████ ████
                  </span>
                </div>

                {/* Investment Amount Input */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="z53-investment"
                    className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                  >
                    Planned Monthly Investment *
                  </label>
                  <input
                    id="z53-investment"
                    name="investment_amount"
                    type="text"
                    required
                    maxLength={100}
                    value={formData.investment_amount}
                    onChange={handleChange}
                    placeholder="e.g. $2000/month"
                    className="h-11 px-3 bg-black border border-[#333333] hover:border-[#666666] hover:bg-[#0A0A0A] focus:border-[#FFCC00] focus:bg-black focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all cursor-text"
                  />
                </div>

                {/* Brief Project Notes */}
                <div className="flex flex-col gap-1 mt-1 cascade-in cascade-delay-6">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="z53-comment"
                      className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                    >
                      Project Brief / Notes
                    </label>
                    <span className="font-mono text-[10px] text-white/40">
                      {formData.comment.length}/500
                    </span>
                  </div>
                  <textarea
                    id="z53-comment"
                    name="comment"
                    rows={2}
                    maxLength={500}
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Briefly describe your hardware goals, pilot needs, or timeline..."
                    className="p-3 bg-black border border-[#333333] hover:border-[#666666] hover:bg-[#0A0A0A] focus:border-[#FFCC00] focus:bg-black focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all resize-none cursor-text"
                  />
                </div>
              </div>

              {/* Submit Triggers */}
              <div className="pt-3 border-t border-[#222222] flex items-center justify-end gap-3 cascade-in cascade-delay-7">
                <button
                  id="dossier-submit-btn"
                  type="submit"
                  className="group w-full px-6 sm:px-8 h-11 bg-[#FFCC00] hover:bg-[#E5B800] active:scale-[0.98] text-black font-mono font-bold text-xs tracking-widest uppercase chamfer-btn transition-transform cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>BIOMETRIC SEAL</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110" aria-hidden="true">
                    ➔
                  </span>
                </button>
              </div>

              {/* Document small print */}
              <p
                aria-hidden="true"
                className="m-0 font-mono text-[9px] sm:text-[10px] text-white/50 tracking-widest uppercase text-center select-none cascade-in cascade-delay-7"
              >
                PAGE 1 OF 1 // PROPERTY OF ZONE 53 · EPIKOR // UNAUTHORIZED DISCLOSURE IS PROHIBITED
              </p>
            </form>
          )}

          {/* STEP 2: BIOMETRIC SEAL */}
          {step === "biometric" && (
            <div className="step-fade-in flex flex-col items-center justify-center text-center py-6 sm:py-8 gap-5">
              <div className="flex flex-col gap-1.5 max-w-md cascade-in cascade-delay-1">
                <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-[0.01em] text-white m-0">
                  PRESS AND HOLD OR CLICK TO SEAL
                </h3>
                <p className="font-sans text-xs text-white/60 m-0">
                  Authorize and dispatch your application to Epikor command.
                </p>
              </div>

              {/* Biometric Interactive Touchpoint */}
              <div
                id="dossier-biometric-sensor"
                role="button"
                tabIndex={0}
                aria-label="Biometric Authorization Sensor"
                aria-description="Click or hold Space or Enter to seal and transmit dossier"
                onClick={triggerAutoSeal}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    triggerAutoSeal();
                  }
                }}
                onMouseDown={startBiometricHold}
                onMouseUp={cancelBiometricHold}
                onMouseLeave={cancelBiometricHold}
                onTouchStart={startBiometricHold}
                onTouchEnd={cancelBiometricHold}
                onTouchCancel={cancelBiometricHold}
                className={`relative w-36 h-36 sm:w-44 sm:h-44 bg-black border-2 flex flex-col items-center justify-center cursor-pointer chamfer-md transition-all select-none cascade-in cascade-delay-2 ${biometricHolding
                    ? "border-[#FFCC00] shadow-[0_0_30px_rgba(255,204,0,0.4)] scale-105"
                    : "border-[#444444] hover:border-[#FFCC00]/60 active:scale-[0.98]"
                  }`}
                title="Click or hold to authorize"
              >
                {/* Hardware-accelerated laser line scan */}
                {biometricHolding && <div className="laser-line" />}

                {/* SVG Fingerprint / Cipher Graphic */}
                <svg
                  viewBox="0 0 24 24"
                  className={`w-16 h-16 sm:w-20 sm:h-20 transition-colors pointer-events-none ${biometricHolding ? "text-[#FFCC00]" : "text-white/40"
                    }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10" />
                  <path d="M12 6a6 6 0 0 0-6 6c0 3.314 2.686 6 6 6s6-2.686 6-6" />
                  <path d="M12 10a2 2 0 0 0-2 2c0 1.105.895 2 2 2s2-.895 2-2" />
                  <circle cx="12" cy="12" r="0.5" fill="currentColor" />
                </svg>

                {/* Progress bar inside button */}
                <div
                  role="progressbar"
                  aria-valuenow={biometricProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Biometric Authorization Progress"
                  className="absolute bottom-2 left-3 right-3 h-1.5 bg-[#222222] overflow-hidden"
                >
                  <div
                    className="h-full bg-[#FFCC00] transition-all duration-75"
                    style={{ width: `${biometricProgress}%` }}
                  />
                </div>
              </div>

              <div className="font-mono text-xs text-white/70 tracking-widest uppercase cascade-in cascade-delay-3">
                {biometricHolding
                  ? `ENCRYPTING SIGNATURE... [${biometricProgress}%]`
                  : "CLICK OR HOLD SCANNER TO TRANSMIT"}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 cascade-in cascade-delay-4">
                <button
                  type="button"
                  onClick={triggerAutoSeal}
                  className="group px-8 h-11 bg-[#FFCC00] hover:bg-[#E5B800] active:scale-[0.98] text-black font-mono font-bold text-xs tracking-widest uppercase chamfer-btn transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>SEAL & TRANSMIT</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110" aria-hidden="true">
                    ➔
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep("fill")}
                  className="group font-mono text-xs text-white/50 hover:text-white underline uppercase cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1 group-hover:scale-110" aria-hidden="true">
                    ←
                  </span>
                  <span>BACK TO EDIT</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRANSMITTING SATELLITE ANIMATION */}
          {step === "transmitting" && (
            <div className="step-fade-in flex flex-col items-center justify-center text-center py-12 gap-6">
              <div className="w-16 h-16 border-2 border-[#FFCC00] border-t-transparent animate-spin chamfer-sm cascade-in cascade-delay-1" />
              <div className="flex flex-col gap-2 cascade-in cascade-delay-2">
                <span className="font-mono text-xs text-[#FFCC00] tracking-widest uppercase animate-pulse">
                  ENCRYPTING DOSSIER PACKET...
                </span>
                <h3 className="font-display text-2xl font-black uppercase tracking-[0.01em] text-white m-0">
                  DISPATCHING TO PRIVATE COMMAND
                </h3>
                <span className="font-mono text-[11px] text-white/40 tracking-wider">
                  TELEGRAM SATELLITE RELAY // WARSAW HANGAR
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: AUTHORIZED RECEIPT */}
          {step === "authorized" && (
            <div className="step-fade-in flex flex-col items-center text-center py-8 gap-6">
              {/* Dynamic Authorized Stamp */}
              <div
                className={`border-4 border-[#FFCC00] bg-[#FFCC00]/10 text-[#FFCC00] px-6 sm:px-8 py-3 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight shadow-[0_0_30px_rgba(255,204,0,0.3)] cascade-in cascade-delay-1 ${stampActive ? "stamp-active" : ""
                  }`}
              >
                [ACCESS AUTHORIZED // DISPATCHED]
              </div>

              <div className="max-w-md flex flex-col gap-2 cascade-in cascade-delay-2">
                <h3 className="font-sans text-xl sm:text-2xl font-bold uppercase text-white m-0 break-words line-clamp-2">
                  Dossier Received, {formData.name}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed m-0">
                  Your top-secret clearance application has been encrypted and transmitted directly to the executive founders at Epikor.
                </p>
              </div>

              {/* Receipt Details Box with truncation protection */}
              <div className="w-full max-w-md bg-black border border-[#222222] p-4 font-mono text-[11px] text-left text-white/70 flex flex-col gap-2.5 chamfer-sm overflow-hidden cascade-in cascade-delay-3">
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5 gap-2">
                  <span className="text-white/40 flex-shrink-0">CALLSIGN:</span>
                  <span
                    className="text-white font-bold truncate max-w-[200px] sm:max-w-[280px]"
                    title={formData.name}
                  >
                    {formData.name}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5 gap-2">
                  <span className="text-white/40 flex-shrink-0">INVESTMENT:</span>
                  <span
                    className="text-[#FFCC00] font-bold truncate max-w-[200px]"
                    title={formData.investment_amount}
                  >
                    [{formData.investment_amount}]
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5 gap-2">
                  <span className="text-white/40 flex-shrink-0">TELEMETRY TIME:</span>
                  <span className="truncate text-white/80">{formattedTime}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5 gap-2">
                  <span className="text-white/40 flex-shrink-0">ENCRYPTION:</span>
                  <span className="text-[#FFCC00] font-bold">SHA-256 // RELAY OK</span>
                </div>
                <div className="flex justify-between items-center gap-2 pt-0.5">
                  <span className="text-white/40 flex-shrink-0">STATUS:</span>
                  <span className="text-green-400 font-bold">DISPATCHED TO FOUNDERS</span>
                </div>
              </div>

              {/* Tactical Copy Receipt Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 cascade-in cascade-delay-4">
                <button
                  type="button"
                  onClick={handleCopyReceipt}
                  className="px-4 py-2 bg-black border border-[#444444] hover:border-[#FFCC00] active:scale-95 text-xs font-mono text-white/80 hover:text-[#FFCC00] tracking-wider uppercase transition-all cursor-pointer"
                >
                  {copiedReceipt ? "✓ TELEMETRY COPIED" : "[COPY DISPATCH TELEMETRY]"}
                </button>
              </div>

              <p className="font-mono text-xs text-[#FFCC00] tracking-wider m-0 cascade-in cascade-delay-4">
                We will contact you personally via your provided channel.
              </p>

              <button
                id="dossier-dismiss-btn"
                type="button"
                onClick={handleClose}
                className="mt-2 px-8 h-11 bg-white text-black font-mono font-bold text-xs tracking-widest uppercase hover:bg-[#FFCC00] active:scale-[0.98] transition-all chamfer-btn cursor-pointer cascade-in cascade-delay-4"
              >
                DISMISS [ESC]
              </button>
            </div>
          )}
        </div>

        {/* Bottom hazard stripes */}
        <div className="caution-stripes mt-auto" aria-hidden="true" />
      </div>
    </div>
  );
}
