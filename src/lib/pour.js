/**
 * Molten chocolate, rendered as a signed-distance field in one small WebGL pass.
 *
 * The stream is a chain of tapered capsules that narrows as it speeds up, with bulges that travel
 * down it and a gentle sway. Where it meets the pack it gathers into a pool on the top seal, throws a
 * crown of droplets that fall back in, and sends slow drips down the front of the pouch. Everything is
 * smooth-unioned, so drops and pool fuse like real liquid, then lit with a fake height profile
 * (round edges, flat top), a soft diffuse, a sharp specular and a highlight that ripples downwards.
 * Only the stream's bounding box is shaded each frame.
 */

const MS = 40 // capsules
const MB = 40 // ellipses / circles

const VERT = `#version 300 es
in vec2 aPos;
uniform vec2 uRes;
uniform vec4 uBox; // x0,y0,x1,y1 in css px (y down)
void main(){
  vec2 p = mix(uBox.xy, uBox.zw, aPos);
  vec2 c = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
#define MS ${MS}
#define MB ${MB}
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uBevel;
uniform float uK; // smoothing scale (1 at a ~280px pack)
uniform vec4 uSeg[MS];
uniform vec2 uSegR[MS];
uniform float uSegK[MS]; // 0: hard union (the chain), >0: smooth (liquid that fuses)
uniform int uNSeg;
uniform vec4 uBlob[MB];
uniform int uNBlob;
out vec4 outColor;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdSeg(vec2 p, vec4 s, vec2 r){
  vec2 pa = p - s.xy, ba = s.zw - s.xy;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  return length(pa - ba * h) - mix(r.x, r.y, h);
}
float sdEll(vec2 p, vec4 e){
  vec2 q = (p - e.xy) / e.zw;
  return (length(q) - 1.0) * min(e.z, e.w);
}
float map(vec2 p){
  float d = 1e5;
  // plain union along the chain: smooth-min would swell every joint into a rib
  for (int i = 0; i < MS; i++) {
    if (i >= uNSeg) break;
    float ds = sdSeg(p, uSeg[i], uSegR[i]);
    float k = uSegK[i];
    d = k > 0.0 ? smin(d, ds, k) : min(d, ds);
  }
  for (int i = 0; i < MB; i++) { if (i >= uNBlob) break; d = smin(d, sdEll(p, uBlob[i]), uBlob[i].z > 14.0 * uK ? 14.0 * uK : 7.0 * uK); }
  return d;
}
void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  float d = map(p);
  if (d > 3.0) { outColor = vec4(0.0); return; }
  // smooth normal from central differences (screen derivatives are blocky)
  const float e = 0.8;
  vec2 g = vec2(map(p + vec2(e, 0.0)) - map(p - vec2(e, 0.0)), map(p + vec2(0.0, e)) - map(p - vec2(0.0, e))) / (2.0 * e);
  float gl = max(length(g), 1e-3);
  float alpha = clamp(0.5 - d * uDpr / gl, 0.0, 1.0);
  if (alpha <= 0.0) { outColor = vec4(0.0); return; }
  vec2 n2 = g / gl; // outward
  // height profile: round within the bevel, flat beyond
  float t = max(-d, 0.0);
  float x = clamp(1.0 - t / uBevel, 0.0, 1.0);
  // ripples flowing downwards over the surface
  float fl = noise(vec2(p.x * 0.05, p.y * 0.011 - uTime * 1.5)) - 0.5;
  float fl2 = noise(vec2(p.x * 0.09 + 7.0, p.y * 0.022 - uTime * 2.3)) - 0.5;
  vec3 N = normalize(vec3(n2 * x + vec2(fl * 0.22 + fl2 * 0.08, fl * 0.05), sqrt(max(1.0 - x * x, 0.0)) + 0.1));
  vec3 L = normalize(vec3(-0.62, -0.18, 0.76));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  vec3 L2 = normalize(vec3(0.75, 0.1, 0.65));
  vec3 H2 = normalize(L2 + vec3(0.0, 0.0, 1.0));
  float diff = max(dot(N, L), 0.0);
  float spec = pow(max(dot(N, H), 0.0), 90.0);
  float sheen = pow(max(dot(N, H), 0.0), 10.0);
  float spec2 = pow(max(dot(N, H2), 0.0), 22.0);
  vec3 espresso = vec3(0.102, 0.063, 0.043);
  vec3 cocoa = vec3(0.169, 0.102, 0.071);
  vec3 choc = vec3(0.290, 0.173, 0.118);
  vec3 milk = vec3(0.478, 0.290, 0.180);
  vec3 caramel = vec3(0.722, 0.522, 0.325);
  vec3 warm = vec3(0.988, 0.976, 0.953);
  // dark, slightly red chocolate like the pour printed on the pack, with a crisp white glint
  vec3 col = mix(espresso, cocoa, smoothstep(0.0, 0.5, diff));
  col = mix(col, choc, smoothstep(0.45, 0.9, diff));
  col = mix(col, milk, smoothstep(0.88, 1.0, diff) * 0.45);
  col += milk * sheen * 0.16;
  col += caramel * spec2 * 0.16;
  col += warm * spec * 0.95;
  // warm rim: lifts the edges off the dark pack face
  col += caramel * pow(1.0 - clamp(N.z, 0.0, 1.0), 2.2) * 0.28;

  outColor = vec4(col * alpha, alpha);
}`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader')
  return s
}

const rand = (a, b) => a + Math.random() * (b - a)
const easeOut = (k) => 1 - Math.pow(1 - k, 3)

export class ChocolatePour {
  constructor(canvas, { onLand, behind = false } = {}) {
    this.canvas = canvas
    this.onLand = onLand
    // behind: the stream runs on down behind the pack (drawn under it), so there is no landing
    this.behind = behind
    this.ok = false
    this.seg = new Float32Array(MS * 4)
    this.segR = new Float32Array(MS * 2)
    this.segK = new Float32Array(MS)
    this.drips = []
    this.falling = []
    this.blob = new Float32Array(MB * 4)
    this.drops = []
    this.landedAt = -1
    this.nextSplash = 0
    this.w = 1
    this.h = 1
    this.dpr = 1
    let gl = null
    try {
      gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false })
    } catch {
      gl = null
    }
    if (!gl) return
    try {
      const prog = gl.createProgram()
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link')
      gl.useProgram(prog)
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, 'aPos')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      const u = (n) => gl.getUniformLocation(prog, n)
      this.u = {
        res: u('uRes'),
        dpr: u('uDpr'),
        time: u('uTime'),
        bevel: u('uBevel'),
        k: u('uK'),
        box: u('uBox'),
        seg: u('uSeg'),
        segR: u('uSegR'),
        segK: u('uSegK'),
        nSeg: u('uNSeg'),
        blob: u('uBlob'),
        nBlob: u('uNBlob'),
      }
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      gl.clearColor(0, 0, 0, 0)
      this.gl = gl
      this.ok = true
    } catch {
      this.ok = false
    }
  }

  resize(w, h) {
    if (!this.ok) return
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    this.w = w
    this.h = h
    this.canvas.width = Math.round(w * this.dpr)
    this.canvas.height = Math.round(h * this.dpr)
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  /** forget the landing (used when the pour restarts) */
  reset() {
    this.landedAt = -1
    this.drops.length = 0
    this.drips.length = 0
    this.falling.length = 0
  }

  /**
   * @param p.cx     stream x (css px)
   * @param p.yJ     where the pour meets the pack's top seal (css px)
   * @param p.size   pack width on screen (css px), everything scales with it
   * @param p.pour   0..1 how far the stream has fallen
   * @param p.t      time (s); p.dt frame delta (s)
   * @param p.still  render a settled, motionless frame (reduced motion)
   */
  frame({ cx, yJ, size, pour, t, dt = 0.016, still = false }) {
    if (!this.ok) return
    const S = size
    const yLand = this.behind ? yJ + S * 0.3 : yJ - S * 0.012
    const L = Math.max(0, yLand * pour)
    let ns = 0
    let nb = 0
    const seg = this.seg
    const segR = this.segR
    const blob = this.blob
    let x0 = Infinity
    let x1 = -Infinity
    let y1 = 0
    const grow = (x, y, r) => {
      if (x - r < x0) x0 = x - r
      if (x + r > x1) x1 = x + r
      if (y + r > y1) y1 = y + r
    }
    const segK = this.segK
    const addSeg = (ax, ay, bx, by, ra, rb, k = 0) => {
      if (ns >= MS) return
      seg.set([ax, ay, bx, by], ns * 4)
      segR.set([ra, rb], ns * 2)
      segK[ns] = k
      ns++
      grow(ax, ay, ra)
      grow(bx, by, rb)
    }
    const addBlob = (x, y, rx, ry) => {
      if (nb >= MB) return
      blob.set([x, y, rx, ry], nb * 4)
      nb++
      grow(x, y, Math.max(rx, ry))
    }

    // ---- the stream: narrows as it speeds up, bulges travel down, sways a little
    const r0 = S * 0.05
    const rN = S * 0.03
    if (L > 2) {
      const N = 26
      let px = 0
      let py = 0
      let pr = 0
      for (let i = 0; i <= N; i++) {
        const y = (L * i) / N
        const u = Math.min(y / yLand, 1)
        let r = r0 + (rN - r0) * Math.sqrt(u)
        if (!still) r *= (1 + 0.17 * Math.sin(y * 0.05 - t * 7.2) * Math.min(1, u * 5)) * (1 + 0.07 * Math.sin(y * 0.012 - t * 1.9))
        const env = Math.sin(Math.PI * u)
        const sway = still ? 0 : env * (S * 0.012 * Math.sin(t * 1.6 + y * 0.011) + S * 0.005 * Math.sin(t * 3.3 - y * 0.034))
        const x = cx + sway
        if (i > 0) addSeg(px, py, x, y, pr, r)
        px = x
        py = y
        pr = r
      }
      // a rounded leading drop while it is still falling
      if (pour < 1) addBlob(px, py + rN * 0.5, rN * 1.45, rN * 1.75)
    }

    // ---- landing
    if (!this.behind && pour >= 1 && this.landedAt < 0) {
      this.landedAt = t
      if (!still) {
        for (let i = 0; i < 9; i++) {
          const side = i % 2 ? 1 : -1
          this.drops.push({ x: side * rand(0.01, 0.05), y: -0.01, vx: side * rand(0.18, 0.7), vy: -rand(0.7, 1.35), r: rand(0.008, 0.017) })
        }
        this.onLand?.()
      }
      this.nextSplash = t + 0.6
    }
    if (this.landedAt >= 0) {
      const age = still ? 30 : t - this.landedAt
      // the chocolate spreads along the top seal as a thin sheet, quickly at first, then creeping
      const spread = easeOut(Math.min(age / 2.4, 1))
      const w = S * (0.04 + 0.12 * spread + 0.02 * Math.min(age / 10, 1))
      const rs = S * (0.014 + 0.008 * spread)
      const wob = still ? 0 : S * 0.004 * Math.sin(t * 1.3)
      const K = Math.max(0.45, Math.min(1.4, S / 280))
      // the stream flares into the sheet (a smooth fillet, no bulb)
      addSeg(cx, yJ - S * 0.05, cx, yJ - rs * 0.2, rN * 0.95, rN * 1.5, 10 * K)
      // thickest where it lands, thinning towards its spreading edges
      addSeg(cx, yJ, cx - w + wob, yJ + rs * 0.3, rs * 1.3, rs * 0.5, 11 * K)
      addSeg(cx, yJ, cx + w * 0.88 + wob, yJ + rs * 0.2, rs * 1.25, rs * 0.5, 11 * K)
      if (!still) {
        for (const [ph, f] of [[0, 0.7], [2.1, 0.53]]) {
          const u = Math.sin(t * f + ph)
          addBlob(cx + u * w * 0.62, yJ - rs * 0.35, rs * (1.5 + 0.3 * Math.sin(t * 1.7 + ph)), rs * 0.9)
        }
      }
      // and rolls over the front edge
      addSeg(cx - w * 0.68, yJ + rs * 1.6, cx + w * 0.6, yJ + rs * 1.6, rs * 0.95, rs * 0.7, 11 * K)

      // drips run down the front, swell at the tip, let go, and start again
      if (!this.drips.length) {
        // irregular on purpose: three drips of different weight, speed and reach
        const spec = [
          [-0.58, 0.3, 0.24, 0.05, 0.028],
          [0.14, 1.05, 0.36, 0.038, 0.033],
          [0.66, 0.6, 0.17, 0.058, 0.024],
        ]
        this.drips = spec.map(([fx, delay, max, speed, wd]) => ({ fx, delay, max, speed, wd, len: 0 }))
      }
      for (const d of this.drips) {
        const live = age - d.delay
        // a drip starts once the spreading sheet has reached its spot
        if (live <= 0 || spread < Math.abs(d.fx) * 0.8) continue
        if (still) d.len = d.max * 0.75
        else {
          // viscous: slows as it lengthens, the swelling tip pulls it on
          d.len += S * d.speed * dt * (1.15 - (0.6 * d.len) / (S * d.max))
          if (d.len >= S * d.max) {
            this.falling.push({ fx: d.fx, y: d.len, vy: S * 0.05, r: d.wd * 1.25 })
            d.len = S * d.max * 0.42
          }
        }
        const x = cx + d.fx * w * 0.92 + wob * 0.6
        const top = yJ + rs * 1.4
        const rr = S * d.wd
        const fill = d.len / (S * d.max)
        const swell = 0.8 + 0.5 * fill * (0.85 + 0.3 * Math.abs(d.fx))
        const sway = still ? 0 : S * 0.003 * Math.sin(t * (0.9 + d.speed * 6) + d.fx * 9)
        addSeg(x, top - rr * 0.4, x + sway, top + d.len, rr * 1.45, rr * 0.66, 9 * K)
        addBlob(x + sway, top + d.len + rr * (0.15 + 0.35 * fill), rr * swell * (0.92 - 0.12 * fill), rr * swell * (1.1 + 0.45 * fill))
      }
      // drops that let go fall down the face of the pack and fade out towards the bottom
      if (!still) {
        const bottom = S * 1.18
        this.falling = this.falling.filter((f) => {
          f.vy += S * 2.4 * dt
          f.y += f.vy * dt
          return f.y < bottom
        })
        for (const f of this.falling) {
          const x = cx + f.fx * w * 0.92
          const fade = Math.max(0.35, Math.min(1, (bottom - f.y) / (S * 0.3)))
          const st = 1 + Math.min(f.vy / (S * 1.2), 0.8)
          addBlob(x, yJ + rs * 1.4 + f.y, (S * f.r * fade) / Math.sqrt(st), S * f.r * fade * st)
        }
      }

      // crown droplets: thrown up where the stream lands, they fall back into the sheet and fuse
      if (!still) {
        if (t > this.nextSplash) {
          const n = Math.random() < 0.5 ? 1 : 2
          for (let i = 0; i < n; i++) {
            const side = Math.random() < 0.5 ? -1 : 1
            this.drops.push({ x: side * rand(0.005, 0.03), y: -0.01, vx: side * rand(0.1, 0.42), vy: -rand(0.45, 0.85), r: rand(0.008, 0.016) })
          }
          this.nextSplash = t + rand(0.45, 0.95)
        }
        const G = 5.2
        this.drops = this.drops.filter((d) => {
          d.vy += G * dt
          d.x += d.vx * dt
          d.y += d.vy * dt
          return !(d.vy > 0 && d.y > 0.004) && d.y < 0.25
        })
        for (const d of this.drops) {
          const stretch = 1 + Math.min(Math.hypot(d.vx, d.vy) * 0.55, 0.9)
          addBlob(cx + d.x * S, yJ + d.y * S - rs, (d.r * S) / Math.sqrt(stretch), d.r * S * stretch)
        }
      }
    }

    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT)
    if (!ns && !nb) return
    const m = 18
    gl.uniform2f(this.u.res, this.w, this.h)
    gl.uniform1f(this.u.dpr, this.dpr)
    gl.uniform1f(this.u.time, t)
    gl.uniform1f(this.u.bevel, r0 * 1.15)
    gl.uniform1f(this.u.k, Math.max(0.45, Math.min(1.4, S / 280)))
    gl.uniform4f(this.u.box, Math.max(0, x0 - m), 0, Math.min(this.w, x1 + m), Math.min(this.h, y1 + m))
    gl.uniform4fv(this.u.seg, seg)
    gl.uniform2fv(this.u.segR, segR)
    gl.uniform1fv(this.u.segK, segK)
    gl.uniform1i(this.u.nSeg, ns)
    gl.uniform4fv(this.u.blob, blob)
    gl.uniform1i(this.u.nBlob, nb)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  destroy() {
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext()
    this.ok = false
  }
}
