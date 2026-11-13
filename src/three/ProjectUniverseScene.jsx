import { Suspense, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Html, Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import ProjectThumbnail from '../components/ProjectThumbnail'
import { playSyntheticSound } from '../utils/soundFX'

/**
 * Enclosing 3D Celestial Sphere + Inner Spherical Lattice Layout.
 * Places ALL 8 project cards cleanly INSIDE a large glowing 3D geodesic sphere
 * using balanced antiprism spherical coordinates so every project sits inside
 * the sphere volume and remains viewable & interactive across a full 360° orbit.
 */
const SPHERE_RADIUS = 5.45
const INNER_CARD_RADIUS = 3.98
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

// Balanced 3-ring spherical lattice inside the enclosing wireframe sphere for up to 8 cards
const INNER_SPHERE_SLOTS = [
  [0.040, 0.000, 0.960],   // 01: Front center equator spotlight
  [-0.955, -0.063, 0.260], // 02: Left-front equator
  [0.741, -0.063, -0.666], // 03: Back-right equator
  [-0.500, 0.645, 0.560],  // 04: Upper front-left crown
  [0.680, 0.645, 0.320],   // 05: Upper front-right crown
  [-0.352, 0.616, -0.673], // 06: Upper back-left crown
  [-0.565, -0.641, -0.528],// 07: Lower back-left pole
  [0.720, -0.540, 0.400],  // 08: Lower front-right pole
]

function getSlotUnitVector(idx, count) {
  if (count <= INNER_SPHERE_SLOTS.length) {
    return INNER_SPHERE_SLOTS[idx % INNER_SPHERE_SLOTS.length]
  }
  // Smooth multi-latitude Fibonacci Golden Sphere for N > 8 dynamically synced projects
  const t = (idx + 0.5) / count
  const y = 0.04 + (0.5 - t) * 1.12
  const rXZ = Math.sqrt(Math.max(0, 1 - y * y))
  const phi = idx * GOLDEN_ANGLE + 0.28
  return [
    Number((rXZ * Math.sin(phi)).toFixed(4)),
    Number(y.toFixed(4)),
    Number((rXZ * Math.cos(phi)).toFixed(4)),
  ]
}

/**
 * Computes responsive enclosing sphere & inner card lattice metrics across
 * desktop, tablet, and narrow mobile viewports, scaling smoothly as project count grows.
 */
function getResponsiveOrbit(canvasWidth, count = 8) {
  const isMobile = canvasWidth < 640
  const isTablet = canvasWidth < 960
  const densityFactor = count > 8 ? Math.max(0.78, Math.sqrt(8 / count)) : 1
  const baseScale = isMobile ? 0.48 : isTablet ? 0.58 : 0.66
  return {
    sphereRadius: isMobile ? 4.35 : SPHERE_RADIUS,
    innerRadius: isMobile ? 3.00 : INNER_CARD_RADIUS,
    cardScale: Number((baseScale * densityFactor).toFixed(3)),
  }
}

function getSlotPositions(metrics, count = 8) {
  const total = Math.max(1, count)
  return Array.from({ length: total }, (_, idx) => {
    const [ux, uy, uz] = getSlotUnitVector(idx, total)
    return [
      Number((metrics.innerRadius * ux).toFixed(3)),
      Number((metrics.innerRadius * uy).toFixed(3)),
      Number((metrics.innerRadius * uz).toFixed(3)),
    ]
  })
}

/**
 * Enclosing 3D Celestial Wireframe Sphere, Gimbal Rings & Radial Anchor Tethers
 * Encompasses all inner-sphere project cards across full 360° camera rotation.
 */
function CelestialOrbitRing({ reduced = false, count = 8 }) {
  const { size } = useThree()
  const metrics = useMemo(() => getResponsiveOrbit(size.width, count), [size.width, count])
  const sphereGroupRef = useRef(null)

  const sphereRadius = metrics.sphereRadius
  const slotPoints = useMemo(() => getSlotPositions(metrics, count), [metrics, count])

  const tetherGeometry = useMemo(() => {
    const pts = []
    slotPoints.forEach((pos) => {
      pts.push(new THREE.Vector3(0, 0, 0))
      pts.push(new THREE.Vector3(pos[0], pos[1], pos[2]))
    })
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [slotPoints])

  useFrame((state, delta) => {
    if (!sphereGroupRef.current || reduced) return
    sphereGroupRef.current.rotation.y += delta * 0.09
    sphereGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.16) * 0.08
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Hairline radial anchor filaments connecting sphere center to each project node */}
      <lineSegments geometry={tetherGeometry}>
        <lineBasicMaterial
          color="#4a785d"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Pinpoint glowing node anchors inside the sphere */}
      {slotPoints.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.048, 10, 10]} />
          <meshBasicMaterial
            color="#c8f53c"
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Large Enclosing 3D Geodesic Wireframe Sphere & Armillary Rings */}
      <group ref={sphereGroupRef}>
        {/* Deep translucent inner cosmic lens shell (back-face only so front cards stay vivid) */}
        <mesh>
          <sphereGeometry args={[sphereRadius * 0.99, 36, 24]} />
          <meshBasicMaterial
            color="#06140c"
            side={THREE.BackSide}
            transparent
            opacity={0.42}
            depthWrite={false}
          />
        </mesh>

        {/* Primary enclosing latitude/longitude wireframe sphere */}
        <mesh>
          <sphereGeometry args={[sphereRadius, 32, 20]} />
          <meshBasicMaterial
            color="#4a785d"
            wireframe
            transparent
            opacity={0.14}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Secondary sparse neon meridian wireframe dome */}
        <mesh rotation={[0.24, 0.42, 0]}>
          <sphereGeometry args={[sphereRadius * 1.004, 16, 10]} />
          <meshBasicMaterial
            color="#c8f53c"
            wireframe
            transparent
            opacity={0.07}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Luminous nucleus core at sphere origin */}
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial
            color="#c8f53c"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Enclosing equatorial, prime meridian & tilted orbital gimbal rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[sphereRadius * 1.02, 0.015, 12, 128]} />
          <meshBasicMaterial
            color="#c8f53c"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[sphereRadius * 1.01, 0.012, 12, 128]} />
          <meshBasicMaterial
            color="#4a785d"
            transparent
            opacity={0.26}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3.1, Math.PI / 5, 0]}>
          <torusGeometry args={[sphereRadius * 1.05, 0.011, 12, 128]} />
          <meshBasicMaterial
            color="#c8f53c"
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 3D Project Node floating in spatial universe.
 * Renders full interactive 3D cards for ALL projects simultaneously along the circular orbit.
 * Smoothly glides between orbit slots when a new project is selected.
 */
function ProjectSpatialNode({
  project,
  targetPos,
  cardScale = 1,
  active,
  hovered,
  onHover,
  onSelect,
  reduced,
  filterMatch,
  modalOpen = false,
}) {
  const meshRef = useRef(null)
  const cardRef = useRef(null)
  const nodePosRef = useRef(new THREE.Vector3())
  const lastVisualRef = useRef({ scale: -1, opacity: -1, zIndex: -999 })
  const isSelected = active?.id === project.id
  const isHovered = hovered?.id === project.id

  // Keep opacity & zIndex aligned cleanly when hover/selection/filter changes while idle
  useEffect(() => {
    lastVisualRef.current.scale = -1
    lastVisualRef.current.opacity = -1
    lastVisualRef.current.zIndex = -999
  }, [isSelected, isHovered, filterMatch, cardScale])

  // Real-time 144Hz+ camera proximity tracking with ZERO React setState or heap allocations in useFrame
  useFrame(({ camera }, delta) => {
    if (!meshRef.current) return

    // Smoothly damp towards assigned slot position on the 3D sphere
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetPos[0], 5.5, delta)
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetPos[1], 5.5, delta)
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetPos[2], 5.5, delta)

    if (!cardRef.current || modalOpen) return

    const nodePos = nodePosRef.current
    meshRef.current.getWorldPosition(nodePos)
    const dist = camera.position.distanceTo(nodePos)
    const centerDist = camera.position.length()

    // Dynamic zoom progression (camera distance 4.5 = 100% zoom, 22.0 = 0% zoom)
    const MIN_ZOOM = 4.5
    const MAX_ZOOM = 22.0
    const zoomProgress = THREE.MathUtils.clamp(
      (MAX_ZOOM - centerDist) / (MAX_ZOOM - MIN_ZOOM),
      0,
      1
    )
    // Controlled zoom response: compact overview at distance, sleek and readable up close without ballooning
    const zoomScaleMultiplier = 0.82 + Math.pow(zoomProgress, 1.1) * 0.58

    // Front-proximity depth boost (subtle so front cards stay prominent without dominating)
    const relDepth = dist - centerDist
    const depthScale = THREE.MathUtils.clamp(1.0 - relDepth * 0.05, 0.82, 1.15)
    const baseStateScale = isSelected || isHovered ? 1.08 : depthScale
    const targetScale = baseStateScale * cardScale * zoomScaleMultiplier

    const depthOpacity = THREE.MathUtils.clamp(1.0 - relDepth * 0.09, 0.45, 1.0)
    const targetOpacity = filterMatch ? (isHovered || isSelected ? 1.0 : depthOpacity) : 0.15
    const targetZ = isHovered || isSelected ? 500 : Math.round(320 - dist * 10)

    const prev = lastVisualRef.current
    if (Math.abs(targetScale - prev.scale) > 0.005) {
      prev.scale = targetScale
      cardRef.current.style.transform = `translate3d(0, 0, 0) scale(${targetScale.toFixed(3)})`
    }
    if (Math.abs(targetOpacity - prev.opacity) > 0.015) {
      prev.opacity = targetOpacity
      cardRef.current.style.opacity = targetOpacity.toFixed(3)
    }
    if (targetZ !== prev.zIndex) {
      prev.zIndex = targetZ
      const htmlHost = cardRef.current.parentElement
      if (htmlHost) htmlHost.style.zIndex = String(targetZ)
    }
  })

  return (
    <group ref={meshRef}>
      <Float
        speed={reduced ? 0 : 0.9}
        rotationIntensity={0}
        floatIntensity={reduced ? 0 : 0.35}
      >
        {/* Mount dynamic WebGL pointLight only on focused/hovered node to eliminate 11x fragment light loops */}
        {(isSelected || isHovered) && (
          <pointLight
            color={project.color}
            intensity={isSelected ? 1.8 : 1.2}
            distance={3.5}
          />
        )}

        {/* Interactive 3D Spatial Presentation (completely unmounted while modal is open) */}
        {!modalOpen && (
          <Html
            center
            position={[0, 0, 0]}
            zIndexRange={[300, 0]}
            style={{
              pointerEvents: filterMatch ? 'auto' : 'none',
            }}
          >
            {/* Full Interactive 3D Card: compact, high-contrast, perfectly proportioned */}
            <div
              ref={cardRef}
              onClick={(e) => {
                e.stopPropagation()
                playSyntheticSound('click')
                onSelect(project)
              }}
              onMouseEnter={() => {
                playSyntheticSound('tick')
                onHover(project)
              }}
              onMouseLeave={() => onHover(null)}
              className={`cursor-pointer select-none transition-shadow duration-200 ${
                isSelected ? 'ring-1 ring-[#c8f53c]' : ''
              }`}
              style={{
                width: isSelected || isHovered ? '172px' : '158px',
                transform: `translate3d(0, 0, 0) scale(${((isSelected || isHovered ? 1.08 : 0.92) * cardScale).toFixed(3)})`,
                opacity: filterMatch ? (isHovered || isSelected ? 1.0 : 0.95) : 0.15,
                transformOrigin: 'center center',
                willChange: 'transform, opacity',
              }}
            >
              <div
                className="relative p-2 rounded-xl border transition-colors duration-200 shadow-xl overflow-hidden group"
                style={{
                  backgroundColor: isSelected
                    ? '#07120a'
                    : isHovered
                    ? '#09150d'
                    : '#050a07',
                  borderColor: isSelected
                    ? project.color
                    : isHovered
                    ? '#c8f53c'
                    : 'rgba(255, 255, 255, 0.20)',
                  boxShadow: isSelected
                    ? `0 0 24px ${project.color}45, 0 10px 24px rgba(0,0,0,0.9)`
                    : isHovered
                    ? `0 0 18px rgba(200,245,60,0.3), 0 8px 20px rgba(0,0,0,0.85)`
                    : '0 6px 18px rgba(0,0,0,0.75)',
                }}
              >
                {/* Holographic dynamic sheen */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ mixBlendMode: 'overlay' }}
                />

                {/* Sci-fi corner brackets */}
                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-white/30 pointer-events-none" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-white/30 pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-white/30 pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-white/30 pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className="font-mono text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded shrink-0 shadow-sm"
                    style={{
                      backgroundColor: `${project.color}22`,
                      color: project.color,
                      border: `1px solid ${project.color}44`,
                    }}
                  >
                    {project.num}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#c8f53c]/90 font-semibold truncate">
                    {project.category}
                  </span>
                </div>

                {/* Card Visual Preview */}
                <div className={`w-full ${isSelected ? 'h-13' : 'h-11'} rounded-lg overflow-hidden border border-white/15 mb-1.5 bg-black/60`}>
                  <ProjectThumbnail project={project} compact={true} />
                </div>

                {/* Project Title & Subtitle - crisp, high-contrast, compact */}
                <h3 className="font-display font-bold text-[11.5px] text-white line-clamp-1 leading-snug tracking-tight">
                  {project.title}
                </h3>
                <p className="text-[9.5px] text-white/85 line-clamp-1 mt-0.5 font-sans">
                  {project.subtitle}
                </p>

                {/* Single-row compact Stack Chips */}
                <div className="flex items-center flex-nowrap gap-1 mt-1.5 overflow-hidden">
                  {project.stack.slice(0, 2).map((st) => (
                    <span
                      key={st}
                      className="font-mono text-[7.5px] px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white font-medium whitespace-nowrap truncate"
                    >
                      {st}
                    </span>
                  ))}
                  {project.stack.length > 2 && (
                    <span className="font-mono text-[7.5px] px-1 py-0.5 text-white/60 font-semibold shrink-0">
                      +{project.stack.length - 2}
                    </span>
                  )}
                </div>

                {/* Direct Clickable Action Row on Card */}
                <div className="mt-2 pt-1.5 border-t border-white/15 flex items-center justify-between gap-1 font-mono text-[7.5px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(project)
                    }}
                    className="px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer shadow hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: isHovered || isSelected ? project.color : '#c8f53c',
                      color: '#000000',
                    }}
                  >
                    Case Study →
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    {project.link && project.link.startsWith('http') && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-1.5 py-0.5 rounded border border-[#c8f53c]/40 bg-[#c8f53c]/15 hover:bg-[#c8f53c]/30 text-[#c8f53c] hover:text-white transition-all cursor-pointer flex items-center gap-0.5 text-[7.5px] font-bold whitespace-nowrap"
                        title={`Launch ${project.title}`}
                      >
                        <span>Live</span>
                        <span>↗</span>
                      </a>
                    )}

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-1.5 py-1 rounded border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer text-[7.5px] font-medium whitespace-nowrap"
                        title="GitHub Repository"
                      >
                        GH ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Html>
        )}
      </Float>
    </group>
  )
}

/**
 * Animated Ambient Nebular Particle Cloud
 */
function CosmicParticles({ count = 800, reduced = false }) {
  const pointsRef = useRef(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const colorA = new THREE.Color('#c8f53c')
    const colorB = new THREE.Color('#f4f1ea')
    const colorC = new THREE.Color('#4a785d')

    for (let i = 0; i < count; i++) {
      // Golden spiral spherical distribution
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 5.0 + Math.random() * 8.0

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.65
      pos[i * 3 + 2] = r * Math.cos(phi)

      const mixed = Math.random() < 0.4 ? colorA : Math.random() < 0.7 ? colorB : colorC
      col[i * 3] = mixed.r
      col[i * 3 + 1] = mixed.g
      col[i * 3 + 2] = mixed.b
    }

    return [pos, col]
  }, [count])

  useFrame((state, delta) => {
    if (!pointsRef.current || reduced) return
    pointsRef.current.rotation.y += delta * 0.03
    pointsRef.current.rotation.x += delta * 0.015
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * Camera Zoom Controller Bridge: smoothly dollys the camera to targetDistance
 */
function CameraZoomBridge({ targetDistance, focusDir, slewActiveRef, controlsRef }) {
  const { camera } = useThree()
  const fallbackTargetRef = useRef(new THREE.Vector3(0, -0.25, 0))
  const offsetRef = useRef(new THREE.Vector3())
  const desiredRef = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    const dt = Math.min(delta, 0.05)
    const target = controls.target || fallbackTargetRef.current
    const offset = offsetRef.current.subVectors(camera.position, target)
    const currentDist = offset.length()

    if (currentDist < 0.001) return

    let nextDist = currentDist
    let moved = false
    if (targetDistance != null) {
      const diff = Math.abs(currentDist - targetDistance)
      if (diff > 0.02) {
        const distEase = 1 - Math.exp(-10 * dt)
        nextDist = THREE.MathUtils.lerp(currentDist, targetDistance, distEase)
        moved = true
      } else if (diff > 0.003) {
        nextDist = targetDistance
        moved = true
      }
    }

    // Smoothly orbit 360° around sphere when a card/stepper selection requests focus
    if (slewActiveRef.current && focusDir) {
      const slewEase = 1 - Math.exp(-6.5 * dt)
      const desiredOffset = desiredRef.current.copy(focusDir).multiplyScalar(nextDist)
      offset.lerp(desiredOffset, slewEase)
      offset.setLength(nextDist)
      if (offset.distanceTo(desiredOffset) < 0.18) {
        slewActiveRef.current = false
      }
      camera.position.copy(target).add(offset)
      controls.update()
      return
    }

    if (moved) {
      offset.setLength(nextDist)
      camera.position.copy(target).add(offset)
      controls.update()
    }
  })

  return null
}

/**
 * Constellation Carousel: Maps all 8 projects cleanly onto permanent 3D spherical coordinates
 * inside the enclosing wireframe sphere for true 360° spatial navigation.
 */
function ConstellationCarousel({
  projects,
  activeProject,
  hoveredProject,
  onHoverProject,
  onSelectProject,
  activeFilter,
  reduced,
  modalOpen,
}) {
  const { size } = useThree()
  const metrics = useMemo(
    () => getResponsiveOrbit(size.width, projects.length),
    [size.width, projects.length]
  )
  const slotPositions = useMemo(
    () => getSlotPositions(metrics, projects.length),
    [metrics, projects.length]
  )

  return (
    <group>
      {projects.map((p, idx) => {
        const match =
          activeFilter === 'All' ||
          p.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
          (activeFilter === 'Experiments' && p.category === 'Experiments') ||
          (activeFilter === 'AI & Machine Learning' && p.category.includes('AI'))

        const targetPos = slotPositions[idx % slotPositions.length]

        return (
          <ProjectSpatialNode
            key={p.id}
            project={p}
            targetPos={targetPos}
            cardScale={metrics.cardScale}
            active={activeProject}
            hovered={hoveredProject}
            onHover={onHoverProject}
            onSelect={onSelectProject}
            reduced={reduced}
            filterMatch={match}
            modalOpen={modalOpen}
          />
        )
      })}
    </group>
  )
}

/**
 * Main 3D Project Universe Experience Canvas
 */
export default function ProjectUniverseScene({
  projects = [],
  activeProject,
  hoveredProject,
  onHoverProject,
  onSelectProject,
  activeFilter = 'All',
  reduced = false,
  modalOpen = false,
  zoomDistance,
  onDistanceChange,
}) {
  const wrapRef = useRef(null)
  const controlsRef = useRef(null)
  const slewActiveRef = useRef(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isInView, setIsInView] = useState(true)
  const prevActiveIdRef = useRef(activeProject?.id)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([entry]) => setIsInView(Boolean(entry?.isIntersecting)),
      { rootMargin: '220px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const focusDir = useMemo(() => {
    if (!activeProject || projects.length === 0) return new THREE.Vector3(0, 0.04, 1).normalize()
    const idx = projects.findIndex((p) => p.id === activeProject.id)
    const [ux, uy, uz] = getSlotUnitVector(idx === -1 ? 0 : idx, projects.length)
    return new THREE.Vector3(ux, uy * 0.55 + 0.06, uz).normalize()
  }, [activeProject, projects])

  useEffect(() => {
    if (activeProject?.id && prevActiveIdRef.current !== activeProject.id) {
      prevActiveIdRef.current = activeProject.id
      slewActiveRef.current = true
    }
  }, [activeProject])

  return (
    <div ref={wrapRef} className="w-full h-full">
      <Canvas
        frameloop={isInView && !modalOpen ? 'always' : 'demand'}
        camera={{ position: [0, 0.15, 16.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
      <color attach="background" args={['#040504']} />
      <fog attach="fog" args={['#040504', 18, 36]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} color="#f4f1ea" />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#c8f53c" distance={14} />

      <Suspense fallback={null}>
        {/* Background stars */}
        <Stars
          radius={30}
          depth={40}
          count={1800}
          factor={3.5}
          saturation={0.5}
          fade
          speed={reduced ? 0 : 0.6}
        />

        {/* Ambient nebular particle system */}
        <CosmicParticles count={900} reduced={reduced} />

        {/* Enclosing 3D Celestial Sphere & Armillary Gimbal Rings */}
        <CelestialOrbitRing reduced={reduced} count={projects.length} />

        {/* Interactive 3D Project Nodes arranged symmetrically inside the sphere */}
        <ConstellationCarousel
          projects={projects}
          activeProject={activeProject}
          hoveredProject={hoveredProject}
          onHoverProject={onHoverProject}
          onSelectProject={onSelectProject}
          activeFilter={activeFilter}
          reduced={reduced}
          modalOpen={modalOpen}
        />

        {/* Full 360° Free Spherical Orbit & Inside-Sphere Zoom */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.75}
          enablePan={false}
          enableZoom={true}
          zoomSpeed={0.85}
          autoRotate={!reduced && !isInteracting && !hoveredProject && !modalOpen}
          autoRotateSpeed={0.42}
          minDistance={4.5}
          maxDistance={22.0}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
          minPolarAngle={0.22}
          maxPolarAngle={Math.PI - 0.22}
          target={[0, -0.25, 0]}
          onStart={() => {
            slewActiveRef.current = false
            setIsInteracting(true)
          }}
          onEnd={() => setIsInteracting(false)}
        />

        {/* Dynamic Bidirectional Zoom & 360° Camera Focus Bridge */}
        <CameraZoomBridge
          targetDistance={zoomDistance}
          focusDir={focusDir}
          slewActiveRef={slewActiveRef}
          controlsRef={controlsRef}
        />
      </Suspense>
    </Canvas>
    </div>
  )
}
