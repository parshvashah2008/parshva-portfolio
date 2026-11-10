import { useEffect, useRef, useState, useMemo } from 'react'

/**
 * Parses color inputs (hex string or RGB array) to normalized [r, g, b] in [0, 1]
 */
function parseColor(input, defaultColor = [0.035, 0.027, 0.012]) {
  if (!input) return defaultColor
  if (Array.isArray(input) && input.length >= 3) {
    // If values are > 1, assume 0..255 range
    const maxVal = Math.max(...input.slice(0, 3))
    const scale = maxVal > 1.0 ? 255.0 : 1.0
    return [input[0] / scale, input[1] / scale, input[2] / scale]
  }
  if (typeof input === 'string') {
    const hex = input.replace('#', '').trim()
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16) / 255,
        parseInt(hex[1] + hex[1], 16) / 255,
        parseInt(hex[2] + hex[2], 16) / 255,
      ]
    }
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255,
      ]
    }
  }
  return defaultColor
}

/**
 * FluidAmberBackground
 *
 * A full-screen interactive background component featuring:
 * - A near-black organic textured surface (#090703) with slow shifting smoky shading
 * - A warm amber fluid trail that follows pointer movements with continuous capsule interpolation,
 *   inertial advection, spreading, and exponential burning decay
 * - Animated monochrome film grain updating smoothly on every frame
 * - A bespoke square cursor (10px x 10px expanding to 20px x 20px on interactive elements)
 * - Self-contained, responsive, performant (runs internal sim at 1/4 resolution with linear upscaling)
 */
export default function FluidAmberBackground({
  backgroundColor = '#090703',
  glowColor = [224, 142, 28],
  tintColor = '#d98b1e',
  cursorColor = '#d8c4a0',
  grainOpacity = 0.32,
  className = '',
  style = {},
  children,
  reduced = false,
  as: Component = 'div',
  ...rest
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const cursorRef = useRef(null)

  const [isFinePointer, setIsFinePointer] = useState(false)

  // Parse colors
  const parsedBgColor = useMemo(() => parseColor(backgroundColor, [0.035, 0.027, 0.012]), [backgroundColor])
  const parsedGlowColor = useMemo(() => parseColor(glowColor, [0.878, 0.557, 0.11]), [glowColor])
  const parsedTintColor = useMemo(() => parseColor(tintColor, [0.851, 0.545, 0.118]), [tintColor])

  // Detect fine pointer (devices with mouse / hover capability)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsFinePointer(media.matches)
    const handler = (e) => setIsFinePointer(e.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  // WebGL Fluid Simulation & Background Rendering Lifecycle
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return undefined

    // Attempt WebGL2 or WebGL1 context creation with high-performance GPU preference
    const glOpts = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    }
    const gl =
      canvas.getContext('webgl2', glOpts) ||
      canvas.getContext('webgl', glOpts)

    let isFallback = !gl
    let fallbackRafId = null

    // Setup 2D Fallback if WebGL unavailable
    if (isFallback) {
      const ctx = canvas.getContext('2d')
      if (!ctx) return undefined

      let width = (canvas.width = container.clientWidth || window.innerWidth)
      let height = (canvas.height = container.clientHeight || window.innerHeight)
      const points = []

      function render2DFallback() {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)

        // Draw points with soft amber glow
        for (let i = points.length - 1; i >= 0; i--) {
          const pt = points[i]
          pt.age += 0.02
          pt.radius += 0.4
          if (pt.age >= 1) {
            points.splice(i, 1)
            continue
          }
          const alpha = (1 - pt.age) * 0.55
          const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.radius)
          grad.addColorStop(0, `rgba(${glowColor[0] || 224}, ${glowColor[1] || 142}, ${glowColor[2] || 28}, ${alpha})`)
          grad.addColorStop(0.5, `rgba(217, 139, 30, ${alpha * 0.75})`)
          grad.addColorStop(1, 'rgba(9, 7, 3, 0)')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2)
          ctx.fill()
        }

        fallbackRafId = requestAnimationFrame(render2DFallback)
      }

      fallbackRafId = requestAnimationFrame(render2DFallback)

      const handleFallbackPointerMove = (e) => {
        const rect = container.getBoundingClientRect()
        points.push({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          age: 0,
          radius: 28,
        })
      }

      container.addEventListener('pointermove', handleFallbackPointerMove, { passive: true })

      return () => {
        if (fallbackRafId) cancelAnimationFrame(fallbackRafId)
        container.removeEventListener('pointermove', handleFallbackPointerMove)
      }
    }

    // --- WebGL Shader & Ping-Pong Simulation Pipeline ---

    // Extensions check for floating-point / half-float textures
    const isWebGL2 = Boolean(window.WebGL2RenderingContext && gl instanceof window.WebGL2RenderingContext)
    let internalFormat, format, type, filterMode

    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float')
      internalFormat = gl.RGBA16F || gl.RGBA
      format = gl.RGBA
      type = gl.HALF_FLOAT
      filterMode = gl.LINEAR
    } else {
      const halfFloat = gl.getExtension('OES_texture_half_float')
      const halfFloatLinear = gl.getExtension('OES_texture_half_float_linear')
      if (halfFloat && halfFloatLinear) {
        internalFormat = gl.RGBA
        format = gl.RGBA
        type = halfFloat.HALF_FLOAT_OES
        filterMode = gl.LINEAR
      } else {
        // Fallback to standard 8-bit unsigned byte textures
        internalFormat = gl.RGBA
        format = gl.RGBA
        type = gl.UNSIGNED_BYTE
        filterMode = gl.LINEAR
      }
    }

    // Helper: Compile Shader
    function compileShader(src, shaderType) {
      const s = gl.createShader(shaderType)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Shader compile failed:', gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
      }
      return s
    }

    // Helper: Create Program
    function createProgram(vsSrc, fsSrc) {
      const vs = compileShader(vsSrc, gl.VERTEX_SHADER)
      const fs = compileShader(fsSrc, gl.FRAGMENT_SHADER)
      if (!vs || !fs) return null
      const p = gl.createProgram()
      gl.attachShader(p, vs)
      gl.attachShader(p, fs)
      gl.linkProgram(p)
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.warn('Program link failed:', gl.getProgramInfoLog(p))
        return null
      }
      return p
    }

    // Full-screen Quad Vertex Shader
    const baseVS = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_pos + 1.0) * 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `

    // Simulation: Advection + Diffusion + Decay Fragment Shader
    const simFS = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_velocity_texture;
      uniform sampler2D u_density_texture;
      uniform vec2 u_texel_size;
      uniform float u_dt;
      uniform float u_dissipation;
      uniform float u_time;

      void main() {
        vec2 vel = texture2D(u_velocity_texture, v_uv).xy;

        // Organic curl-like heat swirl & rising smoke draft
        vec2 swirl = vec2(
          sin(v_uv.y * 9.0 + u_time * 0.65 + cos(v_uv.x * 6.0 - u_time * 0.4)) * 0.045,
          cos(v_uv.x * 8.0 - u_time * 0.55 + sin(v_uv.y * 7.0 + u_time * 0.35)) * 0.04 + 0.048
        );
        vec2 effectiveVel = vel + swirl * 0.16;

        vec2 coord = v_uv - effectiveVel * u_dt * u_texel_size * 58.0;
        coord = clamp(coord, vec2(0.001), vec2(0.999));

        vec4 advected = texture2D(u_density_texture, coord);

        // 4-tap Laplacian smoothing to create natural fluid smoke diffusion
        vec4 left  = texture2D(u_density_texture, v_uv - vec2(u_texel_size.x, 0.0));
        vec4 right = texture2D(u_density_texture, v_uv + vec2(u_texel_size.x, 0.0));
        vec4 top   = texture2D(u_density_texture, v_uv + vec2(0.0, u_texel_size.y));
        vec4 bot   = texture2D(u_density_texture, v_uv - vec2(0.0, u_texel_size.y));
        vec4 blurred = (advected * 4.0 + left + right + top + bot) / 8.0;

        vec4 result = mix(advected, blurred, 0.24) * u_dissipation;

        // Clean dropoff at tail to prevent muddy accumulation
        if (result.r < 0.001) result = vec4(0.0);

        gl_FragColor = result;
      }
    `

    // Simulation: Velocity Advection Fragment Shader
    const velFS = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_velocity_texture;
      uniform vec2 u_texel_size;
      uniform float u_dt;
      uniform float u_dissipation;

      void main() {
        vec2 vel = texture2D(u_velocity_texture, v_uv).xy;
        vec2 coord = v_uv - vel * u_dt * u_texel_size * 55.0;
        coord = clamp(coord, vec2(0.001), vec2(0.999));

        vec2 advectedVel = texture2D(u_velocity_texture, coord).xy;
        gl_FragColor = vec4(advectedVel * u_dissipation, 0.0, 1.0);
      }
    `

    // Continuous Splat Fragment Shader (Line-segment capsule distance)
    const splatFS = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_target;
      uniform vec2 u_point_a;
      uniform vec2 u_point_b;
      uniform vec2 u_aspect;
      uniform float u_radius;
      uniform vec4 u_color;

      void main() {
        vec4 base = texture2D(u_target, v_uv);

        vec2 p = v_uv * u_aspect;
        vec2 a = u_point_a * u_aspect;
        vec2 b = u_point_b * u_aspect;

        vec2 pa = p - a;
        vec2 ba = b - a;
        float lenSq = dot(ba, ba);
        float h = lenSq > 0.000001 ? clamp(dot(pa, ba) / lenSq, 0.0, 1.0) : 0.0;
        float d = length(pa - ba * h);

        // Soft exponential Gaussian profile
        float splat = exp(- (d * d) / (2.0 * u_radius * u_radius));

        // Controlled saturation headroom to retain rich amber color and prevent flat blowout
        float density = base.r;
        float headroom = clamp(1.0 - density * 0.68, 0.08, 1.0);
        vec4 addition = u_color * (splat * headroom);

        gl_FragColor = min(base + addition, vec4(1.38));
      }
    `

    // Display / Final Composite Fragment Shader
    const displayFS = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_density_texture;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec3 u_base_color;
      uniform vec3 u_glow_color;
      uniform vec3 u_tint_color;
      uniform float u_grain_opacity;

      float getOrganicShading(vec2 uv, float t) {
        vec2 p = uv * 2.2;
        float n1 = sin(p.x * 1.6 + t * 0.16 + cos(p.y * 1.3 - t * 0.13));
        float n2 = cos(p.y * 2.2 - t * 0.19 + sin(p.x * 1.7 + t * 0.15));
        float n3 = sin((p.x + p.y) * 1.1 + t * 0.08);
        return (n1 + n2 + n3) / 3.0 * 0.5 + 0.5;
      }

      void main() {
        vec4 fluid = texture2D(u_density_texture, v_uv);
        float d = fluid.r;

        // Aspect-corrected coordinates for organic textured backdrop
        vec2 aspectUv = v_uv * vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
        float smoke = getOrganicShading(aspectUv, u_time);

        // 1. Organic textured dark base: infused with a subtle warm amber-bronze ambient tint
        vec3 ambientTint = u_tint_color * 0.072 * (0.85 + smoke * 0.42);
        vec3 bg = u_base_color * (0.85 + smoke * 0.30) + ambientTint;
        bg += u_tint_color * 0.028 * (smoke * smoke);

        // 2. Warm amber fluid glow with rich burnt bronze tail & luminous golden-honey core
        float dNorm = 1.0 - exp(-d * 0.96);

        vec3 deepAmber    = u_glow_color;
        vec3 warmBronze   = mix(u_glow_color, u_tint_color, 0.55);
        vec3 goldenHoney  = vec3(0.98, 0.72, 0.22);
        vec3 amberCore    = mix(goldenHoney, vec3(1.0, 0.88, 0.54), 0.45);

        vec3 fluidCol = deepAmber * (dNorm * 0.75)
                      + warmBronze * (pow(dNorm, 1.55) * 0.78)
                      + goldenHoney * (pow(dNorm, 2.35) * 0.65)
                      + amberCore * (pow(dNorm, 3.4) * 0.42);

        // Cinematic saturation tone curve (luminous warm amber core, never chalk white)
        fluidCol = fluidCol / (1.0 + fluidCol * 0.38);

        vec3 col = bg + fluidCol;

        // 3. Continuously updating high-frequency monochrome film grain
        vec2 grainSeed = gl_FragCoord.xy + vec2(fract(u_time * 2.37) * 413.0, fract(u_time * 4.19) * 917.0);
        float noise = fract(sin(dot(grainSeed, vec2(12.9898, 78.233))) * 43758.5453);
        float grain = (noise - 0.5) * u_grain_opacity * 0.22;

        col += vec3(grain);

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }
    `

    // Compile programs
    const simProgram = createProgram(baseVS, simFS)
    const velProgram = createProgram(baseVS, velFS)
    const splatProgram = createProgram(baseVS, splatFS)
    const displayProgram = createProgram(baseVS, displayFS)

    if (!simProgram || !velProgram || !splatProgram || !displayProgram) {
      console.warn('Failed to build WebGL programs for FluidAmberBackground')
      return undefined
    }

    // Cache attribute & uniform locations once to eliminate >2,000 WebGL lookups/sec at 144Hz
    const locs = {
      splat: {
        aPos: gl.getAttribLocation(splatProgram, 'a_pos'),
        uTarget: gl.getUniformLocation(splatProgram, 'u_target'),
        uPtA: gl.getUniformLocation(splatProgram, 'u_point_a'),
        uPtB: gl.getUniformLocation(splatProgram, 'u_point_b'),
        uAspect: gl.getUniformLocation(splatProgram, 'u_aspect'),
        uRad: gl.getUniformLocation(splatProgram, 'u_radius'),
        uCol: gl.getUniformLocation(splatProgram, 'u_color'),
      },
      vel: {
        aPos: gl.getAttribLocation(velProgram, 'a_pos'),
        uVel: gl.getUniformLocation(velProgram, 'u_velocity_texture'),
        uTexel: gl.getUniformLocation(velProgram, 'u_texel_size'),
        uDt: gl.getUniformLocation(velProgram, 'u_dt'),
        uDiss: gl.getUniformLocation(velProgram, 'u_dissipation'),
      },
      sim: {
        aPos: gl.getAttribLocation(simProgram, 'a_pos'),
        uVel: gl.getUniformLocation(simProgram, 'u_velocity_texture'),
        uDens: gl.getUniformLocation(simProgram, 'u_density_texture'),
        uTexel: gl.getUniformLocation(simProgram, 'u_texel_size'),
        uDt: gl.getUniformLocation(simProgram, 'u_dt'),
        uDiss: gl.getUniformLocation(simProgram, 'u_dissipation'),
        uTime: gl.getUniformLocation(simProgram, 'u_time'),
      },
      display: {
        aPos: gl.getAttribLocation(displayProgram, 'a_pos'),
        uDens: gl.getUniformLocation(displayProgram, 'u_density_texture'),
        uRes: gl.getUniformLocation(displayProgram, 'u_resolution'),
        uTime: gl.getUniformLocation(displayProgram, 'u_time'),
        uBg: gl.getUniformLocation(displayProgram, 'u_base_color'),
        uGlow: gl.getUniformLocation(displayProgram, 'u_glow_color'),
        uTint: gl.getUniformLocation(displayProgram, 'u_tint_color'),
        uGrain: gl.getUniformLocation(displayProgram, 'u_grain_opacity'),
      },
    }

    // Geometry: Full-screen quad
    const quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    // Helper: Create Double FBO (Ping-Pong Buffer)
    function createFBO(w, h) {
      function createTexture() {
        const tex = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)
        return tex
      }

      const texA = createTexture()
      const texB = createTexture()

      const fboA = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboA)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texA, 0)

      const fboB = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texB, 0)

      gl.bindFramebuffer(gl.FRAMEBUFFER, null)

      return {
        width: w,
        height: h,
        read: { fbo: fboA, tex: texA },
        write: { fbo: fboB, tex: texB },
        swap() {
          const temp = this.read
          this.read = this.write
          this.write = temp
        },
        destroy() {
          gl.deleteTexture(texA)
          gl.deleteTexture(texB)
          gl.deleteFramebuffer(fboA)
          gl.deleteFramebuffer(fboB)
        },
      }
    }

    // Simulation resolution: 1/4 of container CSS resolution for ultra-fast 60+ FPS performance
    let cssWidth = container.clientWidth || window.innerWidth
    let cssHeight = container.clientHeight || window.innerHeight
    let simWidth = Math.max(128, Math.floor(cssWidth * 0.25))
    let simHeight = Math.max(128, Math.floor(cssHeight * 0.25))

    let densityFBO = createFBO(simWidth, simHeight)
    let velocityFBO = createFBO(simWidth, simHeight)

    // Clear initial FBOs
    gl.bindFramebuffer(gl.FRAMEBUFFER, densityFBO.read.fbo)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.bindFramebuffer(gl.FRAMEBUFFER, densityFBO.write.fbo)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.bindFramebuffer(gl.FRAMEBUFFER, velocityFBO.read.fbo)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.bindFramebuffer(gl.FRAMEBUFFER, velocityFBO.write.fbo)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // Pointer Tracking
    const pointer = {
      x: -1,
      y: -1,
      prevX: -1,
      prevY: -1,
      moved: false,
      speed: 0,
    }

    const splatQueue = []

    function addSplat(p1, p2, velX, velY, speed) {
      const radius = THREE_WAY_RADIUS(speed)
      splatQueue.push({
        p1: [p1.x, p1.y],
        p2: [p2.x, p2.y],
        vel: [velX, velY],
        radius,
        intensity: Math.min(1.75, 0.86 + speed * 2.8),
      })
    }

    function THREE_WAY_RADIUS(speed) {
      // Dynamic radius scaling: faster swipes produce a wider, billowing amber plume
      return Math.min(0.070, 0.040 + speed * 0.045)
    }

    let cachedRect = container.getBoundingClientRect()
    const syncRect = () => {
      if (container) cachedRect = container.getBoundingClientRect()
    }

    const handlePointerMove = (e) => {
      const rect = cachedRect
      const w = Math.max(rect.width, 1)
      const h = Math.max(rect.height, 1)
      const nx = (e.clientX - rect.left) / w
      const ny = 1.0 - (e.clientY - rect.top) / h // Invert Y for WebGL texture coords

      if (pointer.prevX >= 0 && pointer.prevY >= 0) {
        const dx = nx - pointer.prevX
        const dy = ny - pointer.prevY
        const dist = Math.hypot(dx, dy)
        pointer.speed = dist
        if (dist > 0.0001) {
          addSplat(
            { x: pointer.prevX, y: pointer.prevY },
            { x: nx, y: ny },
            dx * 18.0,
            dy * 18.0,
            dist
          )
        }
      } else {
        // Seed initial luminous amber ember on entry so text inversion never sits on dark canvas
        addSplat({ x: nx, y: ny }, { x: nx, y: ny }, 0, 0, 0.012)
      }

      pointer.x = nx
      pointer.y = ny
      pointer.prevX = nx
      pointer.prevY = ny
      pointer.moved = true
    }

    const handlePointerEnter = () => syncRect()

    const handlePointerLeave = () => {
      pointer.prevX = -1
      pointer.prevY = -1
    }

    container.addEventListener('pointerenter', handlePointerEnter, { passive: true })
    container.addEventListener('pointermove', handlePointerMove, { passive: true })
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('scroll', syncRect, { passive: true })

    // ResizeObserver
    const handleResize = () => {
      if (!container || !canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      cssWidth = container.clientWidth || window.innerWidth
      cssHeight = container.clientHeight || window.innerHeight
      syncRect()

      canvas.width = Math.floor(cssWidth * dpr)
      canvas.height = Math.floor(cssHeight * dpr)

      const newSimW = Math.max(128, Math.floor(cssWidth * 0.25))
      const newSimH = Math.max(128, Math.floor(cssHeight * 0.25))

      if (newSimW !== simWidth || newSimH !== simHeight) {
        simWidth = newSimW
        simHeight = newSimH
        densityFBO.destroy()
        velocityFBO.destroy()
        densityFBO = createFBO(simWidth, simHeight)
        velocityFBO = createFBO(simWidth, simHeight)
      }
    }

    handleResize()
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)

    // Render Loop (144Hz+ refresh-rate-independent simulation + offscreen pause)
    let animId = null
    let lastTime = performance.now()
    let isInView = true
    let isTabVisible = !document.hidden

    function render(now) {
      if (!isInView || !isTabVisible) {
        animId = null
        return
      }
      animId = requestAnimationFrame(render)

      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.05)
      lastTime = now
      const timeSec = now * 0.001
      const stepDissipation = Math.pow(0.96, dt * 60)

      gl.viewport(0, 0, simWidth, simHeight)

      // 1. Splat Injection Pass
      if (splatQueue.length > 0) {
        gl.useProgram(splatProgram)
        gl.enableVertexAttribArray(locs.splat.aPos)
        gl.vertexAttribPointer(locs.splat.aPos, 2, gl.FLOAT, false, 0, 0)
        gl.uniform2f(locs.splat.uAspect, cssWidth / Math.max(cssHeight, 1), 1.0)

        while (splatQueue.length > 0) {
          const s = splatQueue.shift()

          gl.bindFramebuffer(gl.FRAMEBUFFER, velocityFBO.write.fbo)
          gl.activeTexture(gl.TEXTURE0)
          gl.bindTexture(gl.TEXTURE_2D, velocityFBO.read.tex)
          gl.uniform1i(locs.splat.uTarget, 0)
          gl.uniform2f(locs.splat.uPtA, s.p1[0], s.p1[1])
          gl.uniform2f(locs.splat.uPtB, s.p2[0], s.p2[1])
          gl.uniform1f(locs.splat.uRad, s.radius * 1.25)
          gl.uniform4f(locs.splat.uCol, s.vel[0], s.vel[1], 0.0, 1.0)
          gl.drawArrays(gl.TRIANGLES, 0, 6)
          velocityFBO.swap()

          gl.bindFramebuffer(gl.FRAMEBUFFER, densityFBO.write.fbo)
          gl.activeTexture(gl.TEXTURE0)
          gl.bindTexture(gl.TEXTURE_2D, densityFBO.read.tex)
          gl.uniform1i(locs.splat.uTarget, 0)
          gl.uniform2f(locs.splat.uPtA, s.p1[0], s.p1[1])
          gl.uniform2f(locs.splat.uPtB, s.p2[0], s.p2[1])
          gl.uniform1f(locs.splat.uRad, s.radius)
          gl.uniform4f(locs.splat.uCol, s.intensity, s.intensity * 0.75, s.intensity * 0.35, 1.0)
          gl.drawArrays(gl.TRIANGLES, 0, 6)
          densityFBO.swap()
        }
      }

      // 2. Advect Velocity Pass
      gl.useProgram(velProgram)
      gl.enableVertexAttribArray(locs.vel.aPos)
      gl.vertexAttribPointer(locs.vel.aPos, 2, gl.FLOAT, false, 0, 0)

      gl.bindFramebuffer(gl.FRAMEBUFFER, velocityFBO.write.fbo)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, velocityFBO.read.tex)
      gl.uniform1i(locs.vel.uVel, 0)
      gl.uniform2f(locs.vel.uTexel, 1.0 / simWidth, 1.0 / simHeight)
      gl.uniform1f(locs.vel.uDt, dt)
      gl.uniform1f(locs.vel.uDiss, stepDissipation)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      velocityFBO.swap()

      // 3. Advect + Diffuse + Decay Density (Amber Dye) Pass
      gl.useProgram(simProgram)
      gl.enableVertexAttribArray(locs.sim.aPos)
      gl.vertexAttribPointer(locs.sim.aPos, 2, gl.FLOAT, false, 0, 0)

      gl.bindFramebuffer(gl.FRAMEBUFFER, densityFBO.write.fbo)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, velocityFBO.read.tex)
      gl.uniform1i(locs.sim.uVel, 0)

      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, densityFBO.read.tex)
      gl.uniform1i(locs.sim.uDens, 1)

      gl.uniform2f(locs.sim.uTexel, 1.0 / simWidth, 1.0 / simHeight)
      gl.uniform1f(locs.sim.uDt, dt)
      gl.uniform1f(locs.sim.uDiss, stepDissipation)
      gl.uniform1f(locs.sim.uTime, timeSec)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      densityFBO.swap()

      // 4. Final Display Composite Pass (Output to Visible Full Canvas)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, canvas.width, canvas.height)

      gl.useProgram(displayProgram)
      gl.enableVertexAttribArray(locs.display.aPos)
      gl.vertexAttribPointer(locs.display.aPos, 2, gl.FLOAT, false, 0, 0)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, densityFBO.read.tex)
      gl.uniform1i(locs.display.uDens, 0)

      gl.uniform2f(locs.display.uRes, canvas.width, canvas.height)
      gl.uniform1f(locs.display.uTime, timeSec)
      gl.uniform3f(locs.display.uBg, parsedBgColor[0], parsedBgColor[1], parsedBgColor[2])
      gl.uniform3f(locs.display.uGlow, parsedGlowColor[0], parsedGlowColor[1], parsedGlowColor[2])
      gl.uniform3f(locs.display.uTint, parsedTintColor[0], parsedTintColor[1], parsedTintColor[2])
      gl.uniform1f(locs.display.uGrain, reduced ? grainOpacity * 0.5 : grainOpacity)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    const syncRenderState = () => {
      if (isInView && isTabVisible && !animId) {
        lastTime = performance.now()
        animId = requestAnimationFrame(render)
      }
    }

    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          ([entry]) => {
            isInView = Boolean(entry?.isIntersecting)
            syncRenderState()
          },
          { rootMargin: '240px 0px' }
        )
      : null
    io?.observe(container)

    const handleVisibility = () => {
      isTabVisible = !document.hidden
      syncRenderState()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    syncRenderState()

    // Comprehensive unmount cleanup
    return () => {
      isInView = false
      if (animId) cancelAnimationFrame(animId)
      io?.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      container.removeEventListener('pointerenter', handlePointerEnter)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('scroll', syncRect)
      resizeObserver.disconnect()

      densityFBO.destroy()
      velocityFBO.destroy()
      gl.deleteBuffer(quadBuffer)
      gl.deleteProgram(simProgram)
      gl.deleteProgram(velProgram)
      gl.deleteProgram(splatProgram)
      gl.deleteProgram(displayProgram)
    }
  }, [backgroundColor, glowColor, grainOpacity, parsedBgColor, parsedGlowColor, parsedTintColor, reduced, tintColor])

  // Custom Square Cursor Follower with GPU-composited Transform & Refresh-Independent Easing
  useEffect(() => {
    if (!isFinePointer || reduced) return undefined
    const container = containerRef.current
    const cursor = cursorRef.current
    if (!container || !cursor) return undefined

    let rect = container.getBoundingClientRect()
    let targetX = -100
    let targetY = -100
    let curX = -100
    let curY = -100
    let isInside = false
    let isInteractive = false
    let rafId = null
    let lastTime = performance.now()

    const refreshRect = () => {
      rect = container.getBoundingClientRect()
    }

    function onPointerEnter() {
      refreshRect()
      if (!rafId && !document.hidden) {
        lastTime = performance.now()
        rafId = requestAnimationFrame(loop)
      }
    }

    function onPointerMove(e) {
      targetX = e.clientX - rect.left
      targetY = e.clientY - rect.top
      isInside = true

      const interactiveEl = e.target.closest?.(
        'button, a, input, select, textarea, [role="button"], [data-cursor], [data-interactive], .interactive'
      )
      isInteractive = Boolean(interactiveEl)
      if (!rafId && !document.hidden) {
        lastTime = performance.now()
        rafId = requestAnimationFrame(loop)
      }
    }

    function onPointerLeave() {
      isInside = false
      isInteractive = false
    }

    function loop(now) {
      if (document.hidden) {
        rafId = null
        return
      }
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.05)
      lastTime = now

      const ease = 1 - Math.exp(-20 * dt)
      curX += (targetX - curX) * ease
      curY += (targetY - curY) * ease

      const scale = isInteractive ? 2 : 1
      cursor.style.transform = `translate3d(${curX - 5}px, ${curY - 5}px, 0) scale(${scale})`
      cursor.style.opacity = isInside ? (isInteractive ? '0.65' : '0.90') : '0'

      if (!isInside && Math.abs(targetX - curX) < 0.25 && Math.abs(targetY - curY) < 0.25) {
        rafId = null
        return
      }
      rafId = requestAnimationFrame(loop)
    }

    container.addEventListener('pointerenter', onPointerEnter, { passive: true })
    container.addEventListener('pointermove', onPointerMove, { passive: true })
    container.addEventListener('pointerleave', onPointerLeave, { passive: true })
    window.addEventListener('scroll', refreshRect, { passive: true })
    window.addEventListener('resize', refreshRect, { passive: true })

    return () => {
      container.removeEventListener('pointerenter', onPointerEnter)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('scroll', refreshRect)
      window.removeEventListener('resize', refreshRect)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isFinePointer, reduced])

  return (
    <Component
      ref={containerRef}
      data-fluid-bg="true"
      className={`relative overflow-hidden w-full select-none ${isFinePointer ? 'cursor-none' : ''} ${className}`}
      style={{
        backgroundColor,
        ...style,
      }}
      {...rest}
    >
      {/* Visible Single WebGL / Canvas Layer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-0 block"
      />

      {/* Bespoke Square Sand/Beige Custom Cursor (Fine pointers only, 100% GPU composited) */}
      {isFinePointer && !reduced && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-50 transition-opacity duration-200 ease-out"
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: cursorColor,
            boxShadow: `0 0 10px ${cursorColor}60`,
            borderRadius: '0px', // Strict sharp square as requested
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />
      )}

      {/* Content Layer: Stretches full container, sits above canvas, fully interactive */}
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-auto">
          {children}
        </div>
      )}
    </Component>
  )
}
