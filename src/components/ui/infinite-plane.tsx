"use client";

import React, { FC, useRef, useEffect, useState } from "react";

export interface InfinitePlaneBgProps {
  /** Height of the infinite plane in world units */
  planeHeight?: number;
  /** Epsilon threshold for raymarch (distance hit test) */
  epsilon?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Additional container CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

const raymarchedSceneShader = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_planeHeight;
uniform float u_epsilon;
uniform float u_speed;

out vec4 fragColor;

// Signed‐distance function for an infinite plane at height h
float sdPlane(vec3 p, float h) {
  return p.y - h;
}

// Scene SDF: only the plane
float mapScene(vec3 p) {
  return sdPlane(p, u_planeHeight);
}

// Estimate normal via gradient
vec3 calcNormal(vec3 p) {
  vec2 e = vec2(u_epsilon, 0.0);
  return normalize(vec3(
    mapScene(p + e.xyy) - mapScene(p - e.xyy),
    mapScene(p + e.yxy) - mapScene(p - e.yxy),
    mapScene(p + e.yyx) - mapScene(p - e.yyx)
  ));
}

// Raymarch loop
float rayMarch(vec3 ro, vec3 rd) {
  float d = 0.0;
  for (int i = 0; i < 100; i++) {
    vec3 p = ro + rd * d;
    float dist = mapScene(p);
    if (dist < u_epsilon || d > 20.0) break;
    d += dist;
  }
  return d;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
  vec3 ro = vec3(0.0, u_planeHeight + 1.5, -1.5) * u_speed;
  vec3 rd = normalize(vec3(uv, 1.0));

  float d = rayMarch(ro, rd);
  vec3 color = vec3(0.0);

  if (d < 20.0) {
    vec3 p = ro + rd * d;
    vec3 n = calcNormal(p);
    vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));
    float diff = max(dot(n, lightDir), 0.0);

    // Moving checkered pattern
    float check = mod(floor(p.x) + floor(p.z - u_time * u_speed), 2.0);
    vec3 mat = mix(vec3(0.2), vec3(0.6), check);

    color = mat * diff;
  }

  fragColor = vec4(color, 1.0);
}
`;

const InfinitePlaneBg: FC<InfinitePlaneBgProps> = ({
  planeHeight = 0,
  epsilon = 0.001,
  speed = 1,
  className = "",
  ariaLabel = "Infinite plane shader background",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      setError("WebGL2 not supported in this browser.");
      return;
    }

    // Compile a shader and check for errors
    const compileShader = (type: GLenum, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        setError("Shader compile error (see console).");
        return null;
      }
      return sh;
    };

    // Vertex shader for full-screen quad
    const vsSrc = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const vs = compileShader(gl.VERTEX_SHADER, vsSrc);
    const fs = compileShader(gl.FRAGMENT_SHADER, raymarchedSceneShader);
    if (!vs || !fs) return;

    // Link program
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      setError("Program link error (see console).");
      return;
    }

    // Look up attribute & uniform locations
    const posLoc   = gl.getAttribLocation(program, "a_position");
    const resLoc   = gl.getUniformLocation(program, "u_resolution")!;
    const timeLoc  = gl.getUniformLocation(program, "u_time")!;
    const planeLoc = gl.getUniformLocation(program, "u_planeHeight")!;
    const epsLoc   = gl.getUniformLocation(program, "u_epsilon")!;
    const speedLoc = gl.getUniformLocation(program, "u_speed")!;

    // Full-screen quad buffer
    const quad = new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]);
    const buf  = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    // Resize handler
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    // Render loop
    let rafId: number;
    const render = (t: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      // Bind quad
      gl.enableVertexAttribArray(posLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      // Set uniforms
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, t * 0.001);
      gl.uniform1f(planeLoc, planeHeight);
      gl.uniform1f(epsLoc, epsilon);
      gl.uniform1f(speedLoc, speed);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [planeHeight, epsilon, speed]);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-white font-mono text-sm p-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default InfinitePlaneBg;
