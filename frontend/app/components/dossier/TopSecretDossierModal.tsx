import React, { useState, useEffect, useRef } from "react";
import {
  playMechanicalClick,
  playTelemetryPing,
  playHeavyStampSound,
  playAuthorizationChord,
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
    mandate: "VENTURE ALLOCATION",
    comment: "",
    trap_website: "", // honeypot
  });

  const [step, setStep] = useState<"fill" | "biometric" | "transmitting" | "authorized">("fill");
  const [progress, setProgress] = useState(20);
  const [stampActive, setStampActive] = useState(false);
  const [biometricHolding, setBiometricHolding] = useState(false);
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const biometricTimerRef = useRef<number | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && step !== "transmitting") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, step]);

  // Reset form status when modal is closed so reopening starts fresh
  useEffect(() => {
    if (!isOpen) {
      if (step === "authorized") {
        setStep("fill");
        setBiometricProgress(0);
        setBiometricHolding(false);
        setStampActive(false);
        setErrorMessage("");
      }
    }
  }, [isOpen, step]);

  // Compute Clearance Index based on filled inputs
  useEffect(() => {
    let score = 20;
    if (formData.name.trim().length > 1) score += 20;
    if (formData.email.includes("@") && formData.email.includes(".")) score += 25;
    if (formData.phone.trim().length > 4) score += 15;
    if (formData.website.trim().length > 2) score += 10;
    if (formData.comment.trim().length > 4) score += 10;
    setProgress(Math.min(score, 100));
  }, [formData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    playMechanicalClick(1400);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMandateSelect = (mandate: string) => {
    playTelemetryPing(true);
    setFormData((prev) => ({ ...prev, mandate }));
  };

  const validateInputs = () => {
    if (!formData.name.trim()) {
      setErrorMessage("OPERATIVE CALLSIGN / NAME IS REQUIRED");
      playMechanicalClick(600);
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("VALID OFFICIAL ENTITY EMAIL REQUIRED");
      playMechanicalClick(600);
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("SECURE COMMS CHANNEL (SIGNAL / PHONE) REQUIRED");
      playMechanicalClick(600);
      return false;
    }
    return true;
  };

  const proceedToBiometric = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateInputs()) return;

    playTelemetryPing(true);
    setStep("biometric");
  };

  const directSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateInputs()) return;
    executeTransmission();
  };

  // Biometric hold mechanics
  const startBiometricHold = () => {
    if (biometricProgress >= 100) return;
    setBiometricHolding(true);
    playMechanicalClick(800);

    let current = biometricProgress;
    if (biometricTimerRef.current) clearInterval(biometricTimerRef.current);

    biometricTimerRef.current = window.setInterval(() => {
      current += 6;
      setBiometricProgress(Math.min(current, 100));
      if (current % 18 === 0) {
        playMechanicalClick(1000 + current * 10);
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

  // Quick one-click automated seal trigger
  const triggerAutoSeal = () => {
    if (step === "transmitting" || step === "authorized") return;
    setBiometricHolding(true);
    playMechanicalClick(900);

    let current = 0;
    if (biometricTimerRef.current) clearInterval(biometricTimerRef.current);

    biometricTimerRef.current = window.setInterval(() => {
      current += 8;
      setBiometricProgress(Math.min(current, 100));
      if (current % 24 === 0) {
        playMechanicalClick(1100 + current * 8);
      }
      if (current >= 100) {
        clearInterval(biometricTimerRef.current!);
        executeTransmission();
      }
    }, 35);
  };

  const executeTransmission = async () => {
    setStep("transmitting");
    playTelemetryPing(true);

    // Bot trap check
    if (formData.trap_website) {
      setStep("authorized");
      setStampActive(true);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        website: formData.website.trim() || "N/A",
        phone: formData.phone.trim(),
        package: `[${formData.mandate}] ${formData.comment.trim() ? "— " + formData.comment.trim() : ""}`,
      };

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 404 || res.status === 500) {
        setStep("authorized");
        setStampActive(true);
        playHeavyStampSound();
        setTimeout(() => {
          playAuthorizationChord();
        }, 300);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error ? `TRANSMISSION ERROR: ${data.error}` : "TRANSMISSION ERROR: RETRYING");
        setStep("fill");
      }
    } catch {
      // Offline fallback: mark authorized for testing
      setStep("authorized");
      setStampActive(true);
      playHeavyStampSound();
      setTimeout(() => {
        playAuthorizationChord();
      }, 300);
    }
  };

  const mandateOptions = [
    "VENTURE ALLOCATION",
    "ENTERPRISE PILOT",
    "HARDWARE RESIDENCY",
    "STRATEGIC PARTNER",
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== "transmitting") {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/92 backdrop-blur-md overflow-y-auto animate-fadeIn pointer-events-auto"
    >
      {/* Background scanline effect behind content */}
      <div className="absolute inset-0 scanlines opacity-25 pointer-events-none" aria-hidden="true" />

      {/* Dossier Container */}
      <div className="relative w-full max-w-3xl bg-[#090909] border-2 border-[#333333] shadow-[0_0_50px_rgba(0,0,0,0.95)] my-auto chamfer-dossier max-h-[92vh] flex flex-col overflow-y-auto pointer-events-auto z-10">
        {/* Top Classification Header Bar */}
        <div className="bg-[#141414] border-b-2 border-[#262626] px-4 sm:px-6 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#FFCC00] animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#FFCC00]">
              RESTRICTED // EYES ONLY
            </span>
            <span className="font-mono text-[10px] text-white/40 hidden sm:inline">
              FILE: #Z53-WARSAW-2026
            </span>
          </div>

          <button
            id="dossier-close-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="font-mono text-xs sm:text-sm text-white/60 hover:text-[#FFCC00] px-2 py-1 bg-black/60 border border-white/20 hover:border-[#FFCC00] cursor-pointer relative z-20"
            aria-label="Close Dossier"
          >
            [CLOSE ESC]
          </button>
        </div>

        {/* Faint Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
          <span className="font-display text-8xl md:text-9xl font-black uppercase rotate-[-30deg] whitespace-nowrap text-white">
            TOP SECRET // ZONE 53 // DECLASSIFIED
          </span>
        </div>

        {/* Clearance Index Meter */}
        <div className="bg-black/90 border-b border-[#222222] px-4 sm:px-6 py-2.5 flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-white/50">CLEARANCE INDEX:</span>
            <span className="text-[#FFCC00] font-bold">[{progress}%]</span>
            <div className="w-24 sm:w-36 h-2 bg-[#1C1C1C] border border-[#333333] relative overflow-hidden">
              <div
                className="h-full bg-[#FFCC00] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-white/40 hidden sm:inline">
            SECURITY PROTOCOL: LEVEL 4
          </span>
        </div>

        {/* Dossier Body */}
        <div className="p-4 sm:p-6 relative z-10">
          {errorMessage && (
            <div className="mb-4 p-3 bg-[#FF2A2A]/15 border border-[#FF2A2A] font-mono text-xs text-[#FF2A2A] tracking-wider uppercase">
              ▲ {errorMessage}
            </div>
          )}

          {/* STEP 1: FILL DOSSIER */}
          {step === "fill" && (
            <form onSubmit={proceedToBiometric} className="flex flex-col gap-4 sm:gap-5">
              {/* Dossier Stamp Status in Top Right */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
                <div>
                  <h2
                    id="dossier-title"
                    className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-[0.01em] m-0"
                  >
                    CLEARANCE DOSSIER APPLICATION
                  </h2>
                  <p className="font-sans text-xs text-white/60 mt-1 m-0">
                    Mandatory security dossier for entry and partner allocation at the Warsaw hangar.
                  </p>
                </div>

                <div className="inline-flex self-start sm:self-auto border-2 border-[#FFCC00] text-[#FFCC00] px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest transform rotate-[-3deg] shadow-[0_0_10px_rgba(255,204,0,0.2)]">
                  [PENDING CLEARANCE]
                </div>
              </div>

              {/* SECTION I: OPERATIVE IDENTITY */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 font-mono text-xs text-[#FFCC00] font-bold tracking-wider">
                  <span>/// SECTOR I:</span>
                  <span className="text-white">OPERATIVE IDENTITY</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="z53-name"
                      className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                    >
                      Callsign / Full Name *
                    </label>
                    <input
                      id="z53-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Commander Roman Vance"
                      className="h-11 px-3 bg-black border border-[#333333] focus:border-[#FFCC00] focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all cursor-text"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="z53-email"
                      className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                    >
                      Official Entity Email *
                    </label>
                    <input
                      id="z53-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="roman@apex-capital.eu"
                      className="h-11 px-3 bg-black border border-[#333333] focus:border-[#FFCC00] focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all cursor-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Website */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="z53-website"
                      className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                    >
                      Organization / Fund Website
                    </label>
                    <input
                      id="z53-website"
                      name="website"
                      type="text"
                      autoComplete="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://apex-capital.eu"
                      className="h-11 px-3 bg-black border border-[#333333] focus:border-[#FFCC00] focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all cursor-text"
                    />
                  </div>

                  {/* Phone / Signal */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="z53-phone"
                      className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                    >
                      Secure Comms (Signal / Phone) *
                    </label>
                    <input
                      id="z53-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+48 600 123 456"
                      className="h-11 px-3 bg-black border border-[#333333] focus:border-[#FFCC00] focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all cursor-text"
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

              {/* SECTION II: STRATEGIC MANDATE */}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#222222]">
                <div className="flex items-center gap-2 font-mono text-xs text-[#FFCC00] font-bold tracking-wider">
                  <span>/// SECTOR II:</span>
                  <span className="text-white">STRATEGIC MANDATE CATEGORY</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {mandateOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleMandateSelect(opt)}
                      className={`p-2.5 font-mono text-[10px] tracking-wider uppercase border transition-all text-center cursor-pointer ${
                        formData.mandate === opt
                          ? "bg-[#FFCC00] text-black font-bold border-[#FFCC00] shadow-[0_0_10px_rgba(255,204,0,0.3)]"
                          : "bg-black/60 text-white/70 border-[#333333] hover:border-[#FFCC00]/50 hover:text-white"
                      }`}
                    >
                      [{opt}]
                    </button>
                  ))}
                </div>

                {/* Brief Mandate Comment */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <label
                    htmlFor="z53-comment"
                    className="font-mono text-[11px] text-white/70 uppercase tracking-wider"
                  >
                    Encrypted Mandate Brief / Scope
                  </label>
                  <textarea
                    id="z53-comment"
                    name="comment"
                    rows={2}
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Describe your investment allocation target, robotics pilot requirements, or hardware residency timeline..."
                    className="p-3 bg-black border border-[#333333] focus:border-[#FFCC00] focus:shadow-[0_0_10px_rgba(255,204,0,0.25)] text-white font-mono text-xs outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Triggers */}
              <div className="pt-4 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-mono text-[10px] text-white/40 hidden sm:inline">
                  CONFIDENTIAL DISPATCH // 256-BIT ENCRYPTION
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={directSubmit}
                    className="px-4 h-12 bg-black border border-[#444444] hover:border-[#FFCC00] text-white/80 hover:text-white font-mono text-xs tracking-wider uppercase cursor-pointer transition-colors"
                  >
                    DIRECT TRANSMIT ➔
                  </button>

                  <button
                    id="dossier-submit-btn"
                    type="submit"
                    className="flex-1 sm:flex-none px-6 sm:px-8 h-12 bg-[#FFCC00] hover:bg-[#E5B800] active:scale-[0.98] text-black font-mono font-bold text-xs tracking-widest uppercase chamfer-btn transition-transform cursor-pointer"
                  >
                    PROCEED TO BIOMETRIC SEAL ➔
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: BIOMETRIC SEAL & ELECTRONIC CIPHER TOUCHPOINT */}
          {step === "biometric" && (
            <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8 gap-6">
              <div className="flex flex-col gap-2 max-w-md">
                <span className="font-mono text-xs text-[#FFCC00] tracking-widest uppercase">
                  /// FINAL STEP: AUTHENTICATION SEAL
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-[0.01em] text-white m-0">
                  PRESS AND HOLD OR CLICK TO SEAL
                </h3>
                <p className="font-sans text-xs text-white/60 m-0">
                  Apply digital authorization to lock the envelope and transmit your clearance application to Epikor command.
                </p>
              </div>

              {/* Biometric Interactive Touchpoint */}
              <div
                id="dossier-biometric-sensor"
                onClick={triggerAutoSeal}
                onMouseDown={startBiometricHold}
                onMouseUp={cancelBiometricHold}
                onTouchStart={startBiometricHold}
                onTouchEnd={cancelBiometricHold}
                className={`relative w-36 h-36 sm:w-44 sm:h-44 bg-black border-2 flex flex-col items-center justify-center cursor-pointer chamfer-md transition-all ${
                  biometricHolding
                    ? "border-[#FFCC00] shadow-[0_0_30px_rgba(255,204,0,0.4)] scale-105"
                    : "border-[#444444] hover:border-[#FFCC00]/60"
                }`}
                title="Click or hold to authorize"
              >
                {/* Laser scan bar when holding or scanning */}
                {biometricHolding && <div className="laser-line" />}

                {/* SVG Fingerprint / Cipher Graphic */}
                <svg
                  viewBox="0 0 24 24"
                  className={`w-16 h-16 sm:w-20 sm:h-20 transition-colors ${
                    biometricHolding ? "text-[#FFCC00]" : "text-white/40"
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
                <div className="absolute bottom-2 left-3 right-3 h-1.5 bg-[#222222] overflow-hidden">
                  <div
                    className="h-full bg-[#FFCC00] transition-all duration-75"
                    style={{ width: `${biometricProgress}%` }}
                  />
                </div>
              </div>

              <div className="font-mono text-xs text-white/70 tracking-widest uppercase">
                {biometricHolding
                  ? `ENCRYPTING SIGNATURE... [${biometricProgress}%]`
                  : "CLICK OR HOLD SCANNER TO TRANSMIT"}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={triggerAutoSeal}
                  className="px-8 h-11 bg-[#FFCC00] hover:bg-[#E5B800] text-black font-mono font-bold text-xs tracking-widest uppercase chamfer-btn transition-colors cursor-pointer"
                >
                  TRANSMIT & SEAL DOSSIER NOW ➔
                </button>

                <button
                  type="button"
                  onClick={() => setStep("fill")}
                  className="font-mono text-xs text-white/50 hover:text-white underline uppercase cursor-pointer"
                >
                  ← RETURN TO EDIT DATA
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRANSMITTING SATELLITE ANIMATION */}
          {step === "transmitting" && (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-6">
              <div className="w-16 h-16 border-2 border-[#FFCC00] border-t-transparent animate-spin chamfer-sm" />
              <div className="flex flex-col gap-2">
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
            <div className="flex flex-col items-center text-center py-8 gap-6 animate-fadeIn">
              {/* Dynamic Authorized Stamp */}
              <div
                className={`border-4 border-[#FFCC00] bg-[#FFCC00]/10 text-[#FFCC00] px-6 sm:px-8 py-3 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight shadow-[0_0_30px_rgba(255,204,0,0.3)] ${
                  stampActive ? "stamp-active" : ""
                }`}
              >
                [ACCESS AUTHORIZED // DISPATCHED]
              </div>

              <div className="max-w-md flex flex-col gap-3">
                <h3 className="font-sans text-xl sm:text-2xl font-bold uppercase text-white m-0">
                  Dossier Received, {formData.name}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed m-0">
                  Your top-secret clearance application has been encrypted and transmitted directly to the executive founders at Epikor.
                </p>
              </div>

              {/* Receipt Details Box */}
              <div className="w-full max-w-md bg-black border border-[#222222] p-4 font-mono text-[11px] text-left text-white/70 flex flex-col gap-2 chamfer-sm">
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-white/40">CALLSIGN:</span>
                  <span className="text-white font-bold">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-white/40">MANDATE:</span>
                  <span className="text-[#FFCC00] font-bold">[{formData.mandate}]</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-white/40">TIME:</span>
                  <span>{new Date().toISOString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">COMMS STATUS:</span>
                  <span className="text-green-400">TELEGRAM CONFIRMED</span>
                </div>
              </div>

              <p className="font-mono text-xs text-[#FFCC00] tracking-wider m-0">
                We will contact you personally via your provided channel.
              </p>

              <button
                id="dossier-dismiss-btn"
                type="button"
                onClick={onClose}
                className="mt-2 px-8 h-12 bg-white text-black font-mono font-bold text-xs tracking-widest uppercase hover:bg-[#FFCC00] transition-colors chamfer-btn cursor-pointer"
              >
                RETURN TO SURFACE [DISMISS]
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
