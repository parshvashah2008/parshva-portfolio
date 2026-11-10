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
  const densityFactor = count > 8 ? Math.max(0.76, Math.sqrt(8 / count)) : 1
  const baseScale = isMobile ? 0.45 : isTablet ? 0.62 : 0.72
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
            opacity={0.20}
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
            opacity={0.08}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Luminous nucleus core at sphere origin */}
        <mesh>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshBasicMaterial
            color="#c8f53c"
            transparent
            opacity={0.35}
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
  const isSelected = active?.id === project.id
  const isHovered = hovered?.id === project.id
  const [depthScale, setDepthScale] = useState(1)
  const [depthOpacity, setDepthOpacity] = useState(1)
  const [depthZIndex, setDepthZIndex] = useState(100)

  // Real-time camera proximity tracking & smooth position interpolation along the circle
  useFrame(({ camera }, delta) => {
    if (!meshRef.current) return

    // Smoothly lerp towards assigned slot position on the 3D circle
    meshRef.current.position.x = THREE.MathUtils.damp(
      meshRef.current.position.x,
      targetPos[0],
      5.5,
      delta
    )
    meshRef.current.position.y = THREE.MathUtils.damp(
      meshRef.current.position.y,
      targetPos[1],
      5.5,
      delta
    )
    meshRef.current.position.z = THREE.MathUtils.damp(
      meshRef.current.position.z,
      targetPos[2],
      5.5,
      delta
    )

    const nodePos = new THREE.Vector3()
    meshRef.current.getWorldPosition(nodePos)
    const dist = camera.position.distanceTo(nodePos)
    const centerDist = camera.position.length()

    // View-agnostic 360° depth scaling & opacity: front cards pop sharply; back cards recede smoothly
    const relDepth = dist - centerDist
    const scale = THREE.MathUtils.clamp(0.86 - relDepth * 0.06, 0.54, 1.04)
    const opacity = THREE.MathUtils.clamp(0.92 - relDepth * 0.085, 0.44, 1.0)
    const zIndex = Math.round(240 - dist * 7)

    if (Math.abs(scale - depthScale) > 0.015) setDepthScale(scale)
    if (Math.abs(opacity - depthOpacity) > 0.03) setDepthOpacity(opacity)
    if (zIndex !== depthZIndex) setDepthZIndex(zIndex)
  })

  return (
    <group ref={meshRef}>
      <Float
        speed={reduced ? 0 : 0.9}
        rotationIntensity={0}
        floatIntensity={reduced ? 0 : 0.35}
      >
        {/* Ambient halo glow */}
        <pointLight
          color={project.color}
          intensity={isSelected ? 1.8 : isHovered ? 1.2 : 0.4}
          distance={3.5}
        />

        {/* Interactive 3D Spatial Presentation (completely unmounted while modal is open) */}
        {!modalOpen && (
          <Html
            center
            position={[0, 0, 0]}
            zIndexRange={[300, 0]}
            style={{
              transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: filterMatch ? (isHovered || isSelected ? 1 : depthOpacity) : 0.18,
              pointerEvents: filterMatch ? 'auto' : 'none',
              zIndex: isHovered || isSelected ? 250 : depthZIndex,
            }}
          >
            {/* Full Interactive 3D Card: all projects rendered simultaneously */}
            <div
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
              className={`cursor-pointer transition-transform duration-300 select-none ${
                isSelected ? 'ring-1 ring-[#c8f53c]/60' : ''
              }`}
              style={{
                width: isSelected || isHovered ? '176px' : '150px',
                transform: `scale(${((isSelected || isHovered ? 1.05 : depthScale) * cardScale).toFixed(3)})`,
                transformOrigin: 'center center',
              }}
            >
              <div
                className="relative p-2 rounded-xl backdrop-blur-xl border transition-all duration-300 shadow-2xl overflow-hidden group"
                style={{
                  backgroundColor: isSelected
                    ? '#0d1712'
                    : isHovered
                    ? '#0b130f'
                    : '#080d0a',
                  borderColor: isSelected
                    ? project.color
                    : isHovered
                    ? 'rgba(255, 255, 255, 0.32)'
                    : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: isSelected
                    ? `0 0 38px ${project.color}45, 0 20px 40px rgba(0,0,0,0.85)`
                    : isHovered
                    ? `0 0 26px ${project.color}30, 0 16px 30px rgba(0,0,0,0.75)`
                    : '0 10px 25px rgba(0,0,0,0.65)',
                }}
              >
                {/* Holographic dynamic sheen */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ mixBlendMode: 'overlay' }}
                />

                {/* Sci-fi corner brackets */}
                <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-white/20 pointer-events-none" />
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none" />
                <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b border-l border-white/20 pointer-events-none" />
                <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-white/20 pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className="font-mono text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded shrink-0"
                    style={{
                      backgroundColor: `${project.color}18`,
                      color: project.color,
                    }}
                  >
                    {project.num}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/50 truncate">
                    {project.category}
                  </span>
                </div>

                {/* Card Visual Preview */}
                <div className={`w-full ${isSelected ? 'h-14' : 'h-12'} rounded-lg overflow-hidden border border-white/10 mb-1.5`}>
                  <ProjectThumbnail project={project} compact={true} />
                </div>

                {/* Project Title & Short Subtitle */}
                <h3 className="font-display font-semibold text-[11.5px] text-white line-clamp-1 leading-snug">
                  {project.title}
                </h3>
                <p className="text-[9px] text-white/60 line-clamp-1 mt-0.5 font-sans">
                  {project.subtitle}
                </p>

                {/* Single-row compact Stack Chips */}
                <div className="flex items-center flex-nowrap gap-1 mt-1.5 overflow-hidden">
                  {project.stack.slice(0, 2).map((st) => (
                    <span
                      key={st}
                      className="font-mono text-[7px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-white/70 whitespace-nowrap truncate"
                    >
                      {st}
                    </span>
                  ))}
                  {project.stack.length > 2 && (
                    <span className="font-mono text-[7px] px-1 py-0.5 text-white/40 shrink-0">
                      +{project.stack.length - 2}
                    </span>
                  )}
                </div>

                {/* Direct Clickable Action Row on Card */}
                <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between gap-1 font-mono text-[7.5px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(project)
                    }}
                    className="px-1.5 py-0.5 rounded font-semibold transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: isHovered || isSelected ? project.color : 'rgba(255,255,255,0.12)',
                      color: isHovered || isSelected ? '#000' : '#fff',
                    }}
                  >
                    Case Study →
                  </button>

                  <div className="flex items-center gap-0.5 shrink-0">
                    {project.link && project.link.startsWith('http') && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-1 py-0.5 rounded border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-0.5 text-[7px] font-semibold whitespace-nowrap"
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
                        className="px-1 py-0.5 rounded border border-white/15 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer text-[7px] whitespace-nowrap"
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

  useFrame(() => {
    const controls = controlsRef.current
    if (!controls) return

    const target = controls.target || new THREE.Vector3(0, -0.25, 0)
    const offset = new THREE.Vector3().subVectors(camera.position, target)
    const currentDist = offset.length()

    if (currentDist < 0.001) return

    let nextDist = currentDist
    if (targetDistance != null) {
      const diff = Math.abs(currentDist - targetDistance)
      if (diff > 0.02) {
        nextDist = THREE.MathUtils.lerp(currentDist, targetDistance, 0.18)
      } else if (diff > 0.003) {
        nextDist = targetDistance
      }
    }

    // Smoothly orbit 360° around sphere when a card/stepper selection requests focus
    if (slewActiveRef.current && focusDir) {
      const desiredOffset = focusDir.clone().multiplyScalar(nextDist)
      offset.lerp(desiredOffset, 0.10)
      offset.setLength(nextDist)
      if (offset.distanceTo(desiredOffset) < 0.18) {
        slewActiveRef.current = false
      }
      camera.position.copy(target).add(offset)
      controls.update()
      return
    }

    if (nextDist !== currentDist) {
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
  const controlsRef = useRef(null)
  const slewActiveRef = useRef(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const prevActiveIdRef = useRef(activeProject?.id)

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
    <Canvas
      camera={{ position: [0, 0.15, 16.2], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
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
  )
}
