import { useEffect, useRef } from 'react'
import { pointer } from '@/lib/pointer'

/**
 * A soft "chrome" background — a slow, creamy liquid-metal flow that ripples
 * toward the cursor. Pure WebGL, monochrome, very subtle. Falls back silently
 * to the flat page background if WebGL is unavailable.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_base;
uniform vec3 u_light;
uniform vec3 u_dark;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.0 + 1.7; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float t = u_time;

  // liquid domain warp → flowing chrome
  vec2 w = vec2(fbm(p * 1.5 + vec2(0.0, t * 0.045)), fbm(p * 1.5 + vec2(t * 0.038, 2.1)));
  float n = fbm(p * 2.4 + w * 1.3);

  // broad soft waves blended with a finer ripple for reflective depth
  float waves = 0.5 + 0.5 * sin((n * 3.2 + w.x * 1.5) * 3.14159 + t * 0.12);
  float fine = 0.5 + 0.5 * sin((n * 7.5 + w.y * 2.0) * 3.14159 - t * 0.16);
  waves = smoothstep(0.22, 0.78, waves);
  waves = mix(waves, fine, 0.2);

  // soft metallic sheen riding the crests
  float sheen = smoothstep(0.74, 0.99, waves);

  // cursor — soft brighten + gentle ripple
  vec2 m = vec2(u_mouse.x * asp, u_mouse.y);
  float md = distance(p, m);
  float infl = exp(-md * md * 4.5);
  waves += infl * (0.1 + 0.08 * sin(md * 22.0 - t * 1.4));

  vec3 col = mix(u_dark, u_light, clamp(waves, 0.0, 1.0));
  col = mix(u_base, col, 0.42);
  col += sheen * 0.04;

  gl_FragColor = vec4(col, 1.0);
}
`

const PALETTE = {
  light: {
    base: [0.953, 0.949, 0.941],
    light: [0.995, 0.99, 0.978],
    dark: [0.9, 0.895, 0.884],
  },
  dark: {
    base: [0.04, 0.04, 0.043],
    light: [0.15, 0.15, 0.16],
    dark: [0.02, 0.02, 0.026],
  },
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function ChromeField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL call, not a React hook
    gl.useProgram(prog)

    // fullscreen triangle
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')
    const uBase = gl.getUniformLocation(prog, 'u_base')
    const uLight = gl.getUniformLocation(prog, 'u_light')
    const uDark = gl.getUniformLocation(prog, 'u_dark')

    const setPalette = () => {
      const p = document.documentElement.classList.contains('dark') ? PALETTE.dark : PALETTE.light
      gl.uniform3fv(uBase, p.base)
      gl.uniform3fv(uLight, p.light)
      gl.uniform3fv(uDark, p.dark)
    }
    setPalette()
    const mo = new MutationObserver(setPalette)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const SCALE = 0.55
    const resize = () => {
      const w = Math.max(1, Math.floor(window.innerWidth * SCALE))
      const h = Math.max(1, Math.floor(window.innerHeight * SCALE))
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t0 = performance.now()
    let mx = 0.5
    let my = 0.5
    let raf = 0

    const render = (now: number) => {
      const tx = pointer.active ? pointer.nx : 0.5
      const ty = pointer.active ? 1 - pointer.ny : 0.5
      mx += (tx - mx) * 0.04
      my += (ty - my) * 0.04
      gl.uniform2f(uMouse, mx, my)
      gl.uniform1f(uTime, (now - t0) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(render)
    }

    if (reduce) {
      gl.uniform2f(uMouse, 0.5, 0.5)
      gl.uniform1f(uTime, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    } else {
      raf = requestAnimationFrame(render)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      mo.disconnect()
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  )
}
