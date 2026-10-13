import React, { useEffect, useRef } from "react";
import { createGridScene, type GridSceneHandle } from "./create-grid-scene";

interface WavyGridBackgroundProps {
  className?: string;
  calm?: boolean;
  active?: boolean;
}

export function WavyGridBackground({
  className = "",
  calm = false,
  active = true,
}: WavyGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<GridSceneHandle | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handle = createGridScene(canvas, {
      segments: typeof window !== "undefined" && window.innerWidth < 768 ? 45 : 75,
      interactive: true,
      calm,
    });
    handleRef.current = handle;

    const updateSize = () => {
      if (!canvas) return;
      handle.resize(window.innerWidth, window.innerHeight);
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });

    return () => {
      window.removeEventListener("resize", updateSize);
      handle.dispose();
      handleRef.current = null;
    };
  }, [calm]);

  useEffect(() => {
    handleRef.current?.setActive(active);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
