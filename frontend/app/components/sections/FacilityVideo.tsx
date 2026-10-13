import React, { useRef, useState } from "react";
import { duckSoundtrack, playMechanicalClick, playTelemetryPing } from "../../utils/audio";
import { TelemetryBadge } from "../ui/TelemetryBadge";

export function FacilityVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      if (!isMuted) duckSoundtrack(true);
      playTelemetryPing(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      duckSoundtrack(false);
      playMechanicalClick(900);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    duckSoundtrack(!nextMuted && isPlaying);
    playMechanicalClick(1400);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const sectors = [
    {
      index: "01",
      title: "Autonomous Drone Flight Arena",
      desc: "Reinforced 8-meter high ceiling cages with optical motion tracking cameras for testing high-speed autonomous swarm flight algorithms.",
    },
    {
      index: "02",
      title: "Heavy Robotic Arm Testing Bays",
      desc: "Anchored industrial concrete pads for high-torque robotic manipulators, teleoperation haptic rigs, and load testing.",
    },
    {
      index: "03",
      title: "Spatial Computing & AR Sandbox",
      desc: "Physical obstacle obstacles, LiDAR mapping corridors, and dedicated mixed-reality visual calibration grids for headset tracking.",
    },
    {
      index: "04",
      title: "Rapid Prototyping Bay",
      desc: "5-axis CNC mills, carbon fiber autoclaves, automated SMT pick-and-place electronics lines, and custom silicon debugging.",
    },
  ];

  return (
    <section
      id="facility-recon"
      className="relative py-20 sm:py-32 bg-black/50 border-b border-[#222222]"
      aria-label="Warsaw Hangar Reconnaissance"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div data-reveal className="mb-10 sm:mb-14">
          <div className="mb-4">
            <TelemetryBadge label="WARSAW HANGAR // CAM-01 LIVE" status="active" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-[0.01em] leading-[0.95] m-0">
            WARSAW HANGAR <br />
            <span className="text-[#FFCC00]">PROJECT DEMOS.</span>
          </h2>
        </div>

        {/* Video Player Container */}
        <div
          id="facility-video-frame"
          data-reveal="scale"
          className="relative w-full max-w-6xl mx-auto mb-16 sm:mb-20"
        >
          <div className="relative bg-[#080808] border border-[#333333] chamfer-md overflow-hidden group">
            {/* Top Hairline Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/60 overflow-hidden z-20">
              <div
                className="h-full bg-[#FFCC00] shadow-[0_0_8px_#FFCC00] transition-[width] duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Video Element with Accessible Keyboard & Click Trigger */}
            <div
              role="button"
              tabIndex={0}
              aria-label={isPlaying ? "Pause facility video" : "Play facility video"}
              className="relative aspect-[16/9] w-full bg-black cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]"
              onClick={togglePlay}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  togglePlay();
                }
              }}
            >
              <video
                ref={videoRef}
                id="facility-demo-video"
                src="/media/video.MP4"
                preload="metadata"
                loop
                autoPlay
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover block"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play Overlay if paused */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px] transition-opacity">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FFCC00] text-black flex items-center justify-center chamfer-btn shadow-[0_0_30px_rgba(255,204,0,0.5)] transform transition-transform group-hover:scale-105 active:scale-95">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 fill-black ml-1" aria-hidden="true">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                    CLICK TO RESUME VIDEO
                  </span>
                </div>
              )}
            </div>

            {/* Video Tactical Bottom Control Bar */}
            <div className="bg-[#0D0D0D] border-t border-[#222222] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-3 py-1 bg-black border border-[#333333] hover:border-[#FFCC00] text-xs font-mono text-white tracking-wider cursor-pointer transition-colors"
                >
                  {isPlaying ? "PAUSE [II]" : "PLAY [►]"}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="px-3 py-1 bg-black border border-[#333333] hover:border-[#FFCC00] text-xs font-mono text-white tracking-wider cursor-pointer transition-colors"
                >
                  {isMuted ? "UNMUTE AUDIO" : "MUTE AUDIO"}
                </button>

                <span className="hidden sm:inline font-mono text-[10px] sm:text-xs text-[#FFCC00] font-bold tracking-wider">
                  [TC {formatTime(currentTime)} / {formatTime(duration || 88)}]
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] sm:text-xs text-white/70 tracking-wider truncate">
                  G1-Ray Team: Javi, Ivan, Vishal, Stan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Infrastructure Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-[#222222] border border-[#222222]">
          {sectors.map((sector, index) => (
            <div
              key={sector.index}
              data-reveal
              style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
              className="cnc-card p-6 sm:p-8 flex flex-col justify-between group"
            >
              <span className="cnc-crosshair">+</span>
              <div>
                <span className="font-display text-2xl font-black text-[#FFCC00] block mb-3">
                  {sector.index}
                </span>

                <h3 className="font-sans text-lg sm:text-xl font-bold text-white mb-3 uppercase group-hover:text-[#FFCC00] transition-colors">
                  {sector.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#D4D4D4] leading-relaxed font-normal">
                  {sector.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
