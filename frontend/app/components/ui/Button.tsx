import React from "react";
import { playMechanicalClick, playTelemetryPing } from "../../utils/audio";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  chamfer?: boolean;
  sound?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      chamfer = true,
      sound = true,
      className = "",
      onClick,
      onMouseEnter,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound && !disabled) {
        playMechanicalClick(1600);
      }
      onMouseEnter?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound && !disabled) {
        playTelemetryPing(true);
      }
      onClick?.(e);
    };

    const baseStyles =
      "group relative inline-flex items-center justify-center font-mono uppercase font-bold tracking-wider transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

    const variantStyles = {
      primary:
        "bg-[#FFCC00] text-black hover:bg-[#E5B800] active:bg-[#CC9900] shadow-[0_0_18px_rgba(255,204,0,0.3)] border-0",
      secondary:
        "bg-[#141414] text-white hover:bg-[#1C1C1C] hover:text-[#FFCC00] active:bg-[#0A0A0A] border border-[#333333] hover:border-[#FFCC00]/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
      danger:
        "bg-[#FF2A2A] text-white hover:bg-[#D61818] active:bg-[#A80E0E] border-0",
      ghost:
        "bg-transparent text-white/80 hover:text-white hover:bg-white/5 active:bg-white/10 border border-transparent",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs tracking-widest",
      md: "h-12 px-6 text-sm tracking-wider",
      lg: "h-14 px-8 text-base tracking-widest font-extrabold",
    };

    const chamferClass = chamfer ? "chamfer-btn" : "";

    // Kinetic Button-in-Button trailing capsule architecture
    let content = children;
    if (typeof children === "string") {
      const match = children.match(/^(.*?)\s*([↗→↓←▲▼➔])\s*$/);
      if (match) {
        const label = match[1];
        const icon = match[2];
        const isUpRight = icon === "↗";
        const isDown = icon === "↓";
        const isUp = icon === "▲";
        const isLeft = icon === "←";
        const isRight = icon === "→" || icon === "➔";

        const transformClass = isUpRight
          ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110"
          : isDown
          ? "group-hover:translate-y-0.5 group-hover:scale-110"
          : isUp
          ? "group-hover:-translate-y-0.5 group-hover:scale-110"
          : isLeft
          ? "group-hover:-translate-x-1 group-hover:scale-110"
          : isRight
          ? "group-hover:translate-x-1 group-hover:scale-110"
          : "group-hover:translate-x-0.5 group-hover:scale-110";

        content = (
          <span className="inline-flex items-center gap-1.5">
            <span>{label}</span>
            <span
              className={`inline-block transition-transform duration-200 ${transformClass}`}
              aria-hidden="true"
            >
              {icon}
            </span>
          </span>
        );
      }
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${chamferClass} ${className}`}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
