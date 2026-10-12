import React, { useEffect, useRef, useState } from "react";

interface LidarTerrainProps {
  className?: string;
  density?: number;
}

export function LidarTerrain({ className = "", density = 45 }: LidarTerrainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: true }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    // Vertex Shader
    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uProjection;
      uniform mat4 uModelView;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uLaserY;

      varying float vDistToMouse;
      varying float vLaserDist;
      varying float vDepth;

      void main() {
        vec3 pos = aPosition;

        // Wave elevation based on coordinate field
        float wave = sin(pos.x * 2.2 + uTime * 0.8) * cos(pos.z * 1.8 + uTime * 0.6) * 0.12;
        pos.y += wave;

        // Interactive mouse displacement
        float distToMouse = distance(pos.xz, uMouse);
        if (distToMouse < 0.6) {
          float push = (0.6 - distToMouse) * 0.28;
          pos.y += sin(distToMouse * 10.0 - uTime * 3.0) * push;
        }

        vDistToMouse = distToMouse;
        vLaserDist = abs(pos.z - uLaserY);

        vec4 mvPosition = uModelView * vec4(pos, 1.0);
        gl_Position = uProjection * mvPosition;

        // Point size attenuation
        float pSize = (1.0 / -mvPosition.z) * 14.0;
        gl_PointSize = clamp(pSize, 1.5, 5.0);
        vDepth = -mvPosition.z;
      }
    `;

    // Fragment Shader
    const fsSource = `
      precision mediump float;

      varying float vDistToMouse;
      varying float vLaserDist;
      varying float vDepth;

      void main() {
        // Render point as rounded circle
        vec2 coord = gl_PointCoord - vec2(0.5);
        if (length(coord) > 0.5) discard;

        // Base color: pale technical white-gray
        vec3 baseColor = vec3(0.55, 0.55, 0.6);
        float alpha = clamp(1.2 - vDepth * 0.35, 0.15, 0.85);

        // Yellow Epikor laser scanline effect
        if (vLaserDist < 0.18) {
          float intensity = (0.18 - vLaserDist) / 0.18;
          baseColor = mix(baseColor, vec3(1.0, 0.8, 0.0), intensity * 0.95);
          alpha += intensity * 0.5;
        }

        // Mouse hover interaction highlight
        if (vDistToMouse < 0.5) {
          float mIntensity = (0.5 - vDistToMouse) / 0.5;
          baseColor = mix(baseColor, vec3(1.0, 0.85, 0.1), mIntensity * 0.8);
          alpha += mIntensity * 0.4;
        }

        gl_FragColor = vec4(baseColor, alpha * 0.65);
      }
    `;

    // Compile Shader helper
    function compileShader(type: number, source: string): WebGLShader | null {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) {
      setWebglSupported(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setWebglSupported(false);
      return;
    }

    gl.useProgram(program);

    // Uniform locations
    const uProjLoc = gl.getUniformLocation(program, "uProjection");
    const uMvLoc = gl.getUniformLocation(program, "uModelView");
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uMouseLoc = gl.getUniformLocation(program, "uMouse");
    const uLaserYLoc = gl.getUniformLocation(program, "uLaserY");
    const aPosLoc = gl.getAttribLocation(program, "aPosition");

    // Generate topographic grid points
    const rows = density;
    const cols = density;
    const vertices: number[] = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = (j / (cols - 1)) * 3.6 - 1.8;
        const z = (i / (rows - 1)) * 3.6 - 1.8;
        const y = 0.0;
        vertices.push(x, y, z);
      }
    }

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 0, 0);

    // State
    let animationFrameId: number;
    let isVisible = true;
    let startTime = performance.now();
    const mousePos = { x: 99.0, y: 99.0 };

    // Set canvas dimensions
    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth * dpr;
      const height = canvas.clientHeight * dpr;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    // Matrix helpers
    function createPerspective(fovRad: number, aspect: number, near: number, far: number): Float32Array {
      const f = Math.tan(Math.PI * 0.5 - 0.5 * fovRad);
      const rangeInv = 1.0 / (near - far);
      return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0,
      ]);
    }

    function createLookAt(
      eyeX: number, eyeY: number, eyeZ: number,
      targetX: number, targetY: number, targetZ: number,
      upX: number, upY: number, upZ: number
    ): Float32Array {
      let z0 = eyeX - targetX, z1 = eyeY - targetY, z2 = eyeZ - targetZ;
      let len = 1 / Math.hypot(z0, z1, z2);
      z0 *= len; z1 *= len; z2 *= len;

      let x0 = upY * z2 - upZ * z1, x1 = upZ * z0 - upX * z2, x2 = upX * z1 - upY * z0;
      len = 1 / Math.hypot(x0, x1, x2);
      x0 *= len; x1 *= len; x2 *= len;

      const y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;

      return new Float32Array([
        x0, y0, z0, 0,
        x1, y1, z1, 0,
        x2, y2, z2, 0,
        -(x0 * eyeX + x1 * eyeY + x2 * eyeZ),
        -(y0 * eyeX + y1 * eyeY + y2 * eyeZ),
        -(z0 * eyeX + z1 * eyeY + z2 * eyeZ),
        1,
      ]);
    }

    // Intersection observer to pause rendering when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    // Mouse tracking over container
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 3.6 - 1.8;
      const normZ = ((e.clientY - rect.top) / rect.height) * 3.6 - 1.8;
      mousePos.x = normX;
      mousePos.y = normZ;
    };

    const handleMouseLeave = () => {
      mousePos.x = 99.0;
      mousePos.y = 99.0;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    resize();

    // Render loop
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function render() {
      if (isVisible && gl) {
        const time = (performance.now() - startTime) * 0.001;
        const aspect = canvas ? canvas.width / Math.max(canvas.height, 1) : 1;

        // Camera matrices
        const proj = createPerspective((45 * Math.PI) / 180, aspect, 0.1, 10.0);
        // Slanted isometric bird's-eye view looking toward Warsaw hangar horizon
        const mv = createLookAt(0, 1.4, 2.2, 0, -0.2, 0, 0, 1, 0);

        // Animated laser line sweeping across Z axis
        const laserY = Math.sin(time * 0.8) * 1.5;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniformMatrix4fv(uProjLoc, false, proj);
        gl.uniformMatrix4fv(uMvLoc, false, mv);
        gl.uniform1f(uTimeLoc, time);
        gl.uniform2f(uMouseLoc, mousePos.x, mousePos.y);
        gl.uniform1f(uLaserYLoc, laserY);

        gl.drawArrays(gl.POINTS, 0, rows * cols);
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, [density]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {webglSupported ? (
        <canvas ref={canvasRef} className="w-full h-full block" />
      ) : (
        /* Fallback SVG technical grid */
        <div className="w-full h-full opacity-20 bg-[linear-gradient(to_right,#333333_1px,transparent_1px),linear-gradient(to_bottom,#333333_1px,transparent_1px)] bg-[size:32px_32px]" />
      )}
    </div>
  );
}
