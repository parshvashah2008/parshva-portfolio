import { Suspense, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Html, Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import ProjectThumbnail from '../components/ProjectThumbnail'
import { playSyntheticSound } from '../utils/soundFX'

/**
 * 3D Celestial Sphere + Circular Orbit Layout.
 * Distributes all 8 project cards along a circular/spherical 3D orbit surrounding
 * a central architectural wireframe sphere & rotating armillary rings, with ZERO overlap.
 */
const RADIUS_X = 11.4
const RADIUS_Y = 2.72
const RADIUS_Z = 2.40
const CENTER_Y = 3.42

// Perspective-compensated angular intervals around the 3D circle so projected spacing
// around left, right, upper, and lower arcs remains balanced with zero card overlap.
const ORBIT_ANGLES_DEG = [0, 35, 86, 142, 180, 218, 274, 325]

/**
 * Computes responsive circular/spherical orbit metrics so all 8 cards remain visible
 * across desktop, tablet, and narrow mobile screens without horizontal clipping.
 */
function getResponsiveOrbit(canvasWidth) {
  const isMobile = canvasWidth < 640
  const rxScale = canvasWidth >= 1080 ? 1 : Math.max(0.36, canvasWidth / 1120)
  const cardScale = isMobile ? 0.48 : canvasWidth < 920 ? 0.78 : 1.0
  return {
    radiusX: isMobile ? 3.55 : RADIUS_X * rxScale,
    radiusY: isMobile ? 2.75 : RADIUS_Y,
    radiusZ: isMobile ? 1.85 : RADIUS_Z,
    centerY: isMobile ? 3.35 : CENTER_Y,
    cardScale,
  }
}

function getSlotPositions(metrics) {
  return ORBIT_ANGLES_DEG.map((deg) => {
    const theta = (deg * Math.PI) / 180
    return [
      Number((metrics.radiusX * Math.sin(theta)).toFixed(3)),
      Number((metrics.centerY - metrics.radiusY * Math.cos(theta)).toFixed(3)),
      Number((metrics.radiusZ * Math.cos(theta)).toFixed(3)),
    ]
  })
}

/**
 * Visual 3D Celestial Sphere & Circular Orbit Path
 * Renders the central rotating wireframe globe, armillary meridian rings, and the outer
 * glowing orbital halo traced by the 8 project cards in 3D space.
 */
function CelestialOrbitRing({ reduced = false }) {
  const { size } = useThree()
  const metrics = useMemo(() => getResponsiveOrbit(size.width), [size.width])
  const sphereGroupRef = useRef(null)

  const sphereRadius = useMemo(
    () => Math.min(metrics.radiusY * 0.78, metrics.radiusX * 0.21),
    [metrics.radiusX, metrics.radiusY]
  )

  const slotPoints = useMemo(() => getSlotPositions(metrics), [metrics])

  const lineGeometry = useMemo(() => {
    const pts = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      const x = metrics.radiusX * Math.sin(theta)
      const y = metrics.centerY - metrics.radiusY * Math.cos(theta)
      const z = metrics.radiusZ * Math.cos(theta)
      pts.push(new THREE.Vector3(x, y, z))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [metrics])

  useFrame((state, delta) => {
    if (!sphereGroupRef.current || reduced) return
    sphereGroupRef.current.rotation.y += delta * 0.14
    sphereGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.14
  })

  return (
    <group>
      {/* Primary ethereal neon circular orbit track */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color="#c8f53c"
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Atmospheric secondary halo ring */}
      <line geometry={lineGeometry} scale={[1.018, 1.018, 1.018]}>
        <lineBasicMaterial
          color="#4a785d"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Pinpoint orbital slot nodes on the outer circle */}
      {slotPoints.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.042, 10, 10]} />
          <meshBasicMaterial
            color="#c8f53c"
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Central Architectural 3D Wireframe Sphere & Armillary Rings */}
      <group ref={sphereGroupRef} position={[0, metrics.centerY, 0]}>
        {/* Deep translucent spherical core */}
        <mesh>
          <sphereGeometry args={[sphereRadius * 0.96, 32, 24]} />
          <meshBasicMaterial
            color="#07150e"
            transparent
            opacity={0.38}
            depthWrite={false}
          />
        </mesh>

        {/* Fine geodesic latitude/longitude wireframe globe */}
        <mesh>
          <sphereGeometry args={[sphereRadius, 28, 18]} />
          <meshBasicMaterial
            color="#4a785d"
            wireframe
            transparent
            opacity={0.22}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Secondary sparse lime meridian wireframe lattice */}
        <mesh rotation={[0.25, 0.4, 0]}>
          <sphereGeometry args={[sphereRadius * 1.006, 16, 10]} />
          <meshBasicMaterial
            color="#c8f53c"
            wireframe
            transparent
            opacity={0.11}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Luminous nucleus core */}
        <mesh>
          <sphereGeometry args={[sphereRadius * 0.09, 16, 16]} />
          <meshBasicMaterial
            color="#c8f53c"
            transparent
            opacity={0.30}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Smooth equatorial, prime meridian & tilted ecliptic orbital rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[sphereRadius * 1.12, 0.013, 12, 96]} />
          <meshBasicMaterial
            color="#c8f53c"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[sphereRadius * 1.06, 0.011, 12, 96]} />
          <meshBasicMaterial
            color="#4a785d"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3.1, Math.PI / 5, 0]}>
          <torusGeometry args={[sphereRadius * 1.18, 0.01, 12, 96]} />
          <meshBasicMaterial
            color="#c8f53c"
            transparent
            opacity={0.24}
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

    // Depth scaling: front hero card is full size (1.05x), back cards scale gracefully (~0.72x)
    const scale = THREE.MathUtils.clamp(1.05 - (dist - 16.2) * 0.062, 0.72, 1.05)
    const opacity = THREE.MathUtils.clamp(1.0 - (dist - 16.2) * 0.032, 0.80, 1.0)
    // Front cards have positive Z and higher zIndex than background cards
    const zIndex = Math.round(150 + nodePos.z * 22)

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
                width: isSelected ? '182px' : '152px',
                transform: `scale(${((isSelected || isHovered ? 1.06 : depthScale) * cardScale).toFixed(3)})`,
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
function CameraZoomBridge({ targetDistance, controlsRef }) {
  const { camera } = useThree()

  // Smoothly lerp camera to targetDistance in the render loop with buttery 60fps motion
  useFrame(() => {
    const controls = controlsRef.current
    if (!controls || targetDistance == null) return

    const target = controls.target || new THREE.Vector3(0, 2.10, 0)
    const offset = new THREE.Vector3().subVectors(camera.position, target)
    const currentDist = offset.length()

    if (currentDist < 0.001) return

    const diff = Math.abs(currentDist - targetDistance)
    if (diff > 0.02) {
      const nextDist = THREE.MathUtils.lerp(currentDist, targetDistance, 0.20)
      offset.setLength(nextDist)
      camera.position.copy(target).add(offset)
      controls.update()
    } else if (diff > 0.003) {
      offset.setLength(targetDistance)
      camera.position.copy(target).add(offset)
      controls.update()
    }
  })

  return null
}

/**
 * Constellation Carousel: Assigns each project to its dedicated amphitheater slot
 * and smoothly animates the active project into the Center Hero slot.
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
  const metrics = useMemo(() => getResponsiveOrbit(size.width), [size.width])
  const slotPositions = useMemo(() => getSlotPositions(metrics), [metrics])

  const selectedIdx = useMemo(() => {
    if (!activeProject || projects.length === 0) return 0
    const idx = projects.findIndex((p) => p.id === activeProject.id)
    return idx === -1 ? 0 : idx
  }, [activeProject, projects])

  return (
    <group>
      {projects.map((p, idx) => {
        const match =
          activeFilter === 'All' ||
          p.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
          (activeFilter === 'Experiments' && p.category === 'Experiments') ||
          (activeFilter === 'AI & Machine Learning' && p.category.includes('AI'))

        // Map each project to its relative circular orbit slot (Slot 0 = Center Hero spotlight)
        const slotIdx = (idx - selectedIdx + projects.length) % projects.length
        const targetPos = slotPositions[slotIdx % slotPositions.length]

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

  return (
    <Canvas
      camera={{ position: [0, 2.24, 18.6], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <color attach="background" args={['#040504']} />
      <fog attach="fog" args={['#040504', 14, 30]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} color="#f4f1ea" />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#c8f53c" distance={12} />

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

        {/* Visible 3D Celestial Orbit Ring Path */}
        <CelestialOrbitRing reduced={reduced} />

        {/* Interactive 3D Project Constellation Nodes in Circular Orbit */}
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

        {/* Orbit / Pan controls with smooth wheel & pinch zoom enabled */}
        {/* Constrained azimuth & polar angles provide breathtaking 3D parallax without ever flipping cards sideways or backwards */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.65}
          enablePan={false}
          enableZoom={true}
          zoomSpeed={0.8}
          minDistance={8.0}
          maxDistance={23.0}
          minAzimuthAngle={-Math.PI / 4.2}
          maxAzimuthAngle={Math.PI / 4.2}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 2.08}
          target={[0, 2.10, 0]}
        />

        {/* Dynamic Bidirectional Zoom Bridge */}
        <CameraZoomBridge
          targetDistance={zoomDistance}
          controlsRef={controlsRef}
        />
      </Suspense>
    </Canvas>
  )
}
