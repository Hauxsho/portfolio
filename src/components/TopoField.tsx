import { useEffect, useRef } from 'react';
import './TopoField.css';

interface TopoFieldProps {
  opacity?: number;
  speed?: number;
  bands?: number;
  scale?: number;
}

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_dpr;
uniform vec3 u_line_color;
uniform vec3 u_bg_color;
uniform float u_opacity;
uniform float u_bands;
uniform float u_scale;
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
  + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
    dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x / u_resolution.y;

  float gridSize = 56.0 * u_dpr;
  vec2 gridSt = gl_FragCoord.xy / gridSize;
  vec2 gridFract = fract(gridSt);
  float lineThickness = 1.0 / gridSize;
  float gridLines = step(1.0 - lineThickness, gridFract.x) + step(1.0 - lineThickness, gridFract.y);
  gridLines = clamp(gridLines, 0.0, 1.0) * 0.045;

  vec2 noisePos = st * u_scale + vec2(u_time * 0.012, u_time * 0.018);
  float n = snoise(noisePos) * 0.5 + 0.5;
  float bandVal = n * u_bands;
  float triangleWave = abs(fract(bandVal) - 0.5) * 2.0;

  float topoLines = smoothstep(0.024, 0.002, triangleWave) * 0.38;

  float totalLines = clamp(gridLines + topoLines, 0.0, 1.0) * u_opacity;
  vec3 finalColor = mix(u_bg_color, u_line_color, totalLines);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function TopoField({
  opacity = 0.5,
  speed = 1.0,
  bands = 9.0,
  scale = 1.5,
}: TopoFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: true,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uDpr = gl.getUniformLocation(program, 'u_dpr');
    const uLineColor = gl.getUniformLocation(program, 'u_line_color');
    const uBgColor = gl.getUniformLocation(program, 'u_bg_color');
    const uOpacity = gl.getUniformLocation(program, 'u_opacity');
    const uBands = gl.getUniformLocation(program, 'u_bands');
    const uScale = gl.getUniformLocation(program, 'u_scale');

    let animationFrameId: number;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    const render = () => {
      resize();

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      const style = getComputedStyle(document.documentElement);
      const parseCSSColor = (cssVal: string): [number, number, number] => {
        const hex = cssVal.trim();
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b];
      };

      const bgHex = isDark ? '#0e1013' : '#f9f9f7';
      const lineHex = style.getPropertyValue('--bp-cyan').trim() || (isDark ? '#3b82f6' : '#2563eb');

      const [bgR, bgG, bgB] = parseCSSColor(bgHex);
      const [lineR, lineG, lineB] = parseCSSColor(lineHex);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const elapsed = (performance.now() - startTime) * 0.001 * speed;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uDpr, dpr);
      gl.uniform3f(uBgColor, bgR, bgG, bgB);
      gl.uniform3f(uLineColor, lineR, lineG, lineB);
      gl.uniform1f(uOpacity, isDark ? opacity * 0.9 : opacity * 0.65);
      gl.uniform1f(uBands, bands);
      gl.uniform1f(uScale, scale);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
    };
  }, [opacity, speed, bands, scale]);

  return (
    <div className="topo-container" aria-hidden="true">
      <canvas ref={canvasRef} className="topo-canvas" />
      <div className="topo-vignette" />
    </div>
  );
}
