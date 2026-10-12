import React from "react";

interface TelemetryBadgeProps {
  label: string;
  status?: "active" | "classified" | "pending" | "alert";
  pulse?: boolean;
  className?: string;
}

export function TelemetryBadge({
  label,
  status = "active",
  pulse = true,
  className = "",
}: TelemetryBadgeProps) {
  const dotColor = {
    active: "bg-[#FFCC00] shadow-[0_0_8px_#FFCC00]",
    classified: "bg-[#FFCC00] shadow-[0_0_8px_#FFCC00]",
    pending: "bg-white/70 shadow-[0_0_8px_white]",
    alert: "bg-[#FF2A2A] shadow-[0_0_8px_#FF2A2A]",
  }[status];

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 bg-black/80 border border-[#262626] text-[11px] font-mono tracking-widest uppercase text-white/90 select-none ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full opacity-75 ${dotColor}`}
          />
          <span className={`relative inline-flex h-2 w-2 ${dotColor}`} />
        </span>
      )}
      <span className="text-white/60">[</span>
      <span className="font-semibold text-white/90">{label}</span>
      <span className="text-white/60">]</span>
    </div>
  );
}
