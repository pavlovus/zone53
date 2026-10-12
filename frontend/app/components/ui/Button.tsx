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
      "relative inline-flex items-center justify-center font-mono uppercase font-bold tracking-wider transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

    const variantStyles = {
      primary:
        "bg-[#FFCC00] text-black hover:bg-[#E5B800] active:bg-[#CC9900] shadow-[0_0_15px_rgba(255,204,0,0.25)] border-0",
      secondary:
        "bg-[#141414] text-white hover:bg-[#1E1E1E] hover:text-[#FFCC00] active:bg-[#0A0A0A] border border-[#333333] hover:border-[#FFCC00]/50",
      danger:
        "bg-[#FF2A2A] text-white hover:bg-[#D61818] active:bg-[#A80E0E] border-0",
      ghost:
        "bg-transparent text-white/80 hover:text-white hover:bg-white/5 active:bg-white/10 border border-transparent",
    };

    const sizeStyles = {
      sm: "h-9 px-4 text-xs tracking-widest",
      md: "h-12 px-6 text-sm tracking-wider",
      lg: "h-14 px-8 text-base tracking-widest font-extrabold",
    };

    const chamferClass = chamfer ? "chamfer-btn" : "";

    return (
      <button
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${chamferClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
