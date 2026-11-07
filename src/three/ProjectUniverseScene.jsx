import { Suspense, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Html, Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import ProjectThumbnail from '../components/ProjectThumbnail'
import { playSyntheticSound } from '../utils/soundFX'

/**
 * 3D Project Node floating in spatial universe with smart depth culling.
 * Foreground nodes render rich interactive 3D cards.
 * Background nodes render sleek celestial beacon pills so cards NEVER collide or overlap.
 */
function ProjectSpatialNode({
  project,
  position,
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
  const [isFront, setIsFront] = useState(true)
  const lastFrontRef = useRef(true)

  // Real-time camera proximity tracking & subtle core rotation
  useFrame(({ camera }, delta) => {
    if (!meshRef.current) return

    if (!reduced) {
      meshRef.current.rotation.y += delta * 0.35
      meshRef.current.rotation.x += delta * 0.18
    }

    // Determine if node is in front hemisphere (facing camera)
    const nodePos = new THREE.Vector3()
    meshRef.current.getWorldPosition(nodePos)

    const targetPos = new THREE.Vector3(0, 0.05, 0)
    const distToCam = camera.position.distanceTo(nodePos)
    const distToCenter = camera.position.distanceTo(targetPos)

    // Hysteresis threshold to prevent flickering at the equator
    const threshold = lastFrontRef.current ? distToCenter + 0.35 : distToCenter - 0.35
    const nextFront = distToCam <= threshold

    if (nextFront !== lastFrontRef.current) {
      lastFrontRef.current = nextFront
      setIsFront(nextFront)
    }
  })

  // Whether to show the expanded card vs the sleek beacon
  const showExpanded = isFront || isSelected || isHovered

  return (
    <Float
      speed={reduced ? 0 : 1.1}
      rotationIntensity={reduced ? 0 : 0.25}
      floatIntensity={reduced ? 0 : 0.8}
      position={position}
    >
      <group>
        {/* Core glowing orb */}
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(project)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            onHover(project)
          }}
          onPointerOut={() => onHover(null)}
          scale={isSelected ? 1.5 : isHovered ? 1.25 : 1}
        >
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={isSelected ? 1.4 : isHovered ? 1.0 : 0.6}
            wireframe
          />
        </mesh>

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
            zIndexRange={[250, 0]}
            style={{
              transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: filterMatch ? 1 : 0.2,
              pointerEvents: filterMatch ? 'auto' : 'none',
            }}
          >
            {showExpanded ? (
              /* Foreground: Full Interactive 3D Card (crisp, fixed width, NEVER scaled to gigantic proportions) */
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
                className={`cursor-pointer transition-all duration-300 select-none ${
                  isSelected
                    ? 'scale-105 z-50 ring-1 ring-[#c8f53c]/60'
                    : isHovered
                    ? 'scale-102 z-40'
                    : 'hover:scale-102 opacity-95'
                }`}
                style={{ width: '232px' }}
              >
                <div
                  className="relative p-2.5 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-2xl overflow-hidden group"
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
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="font-mono text-[9.5px] font-bold tracking-widest px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${project.color}18`,
                        color: project.color,
                      }}
                    >
                      {project.num}
                    </span>
                    <span className="font-mono text-[8.5px] uppercase tracking-wider text-white/50">
                      {project.category}
                    </span>
                  </div>

                  {/* Card Visual Preview */}
                  <div className="w-full h-20 rounded-lg overflow-hidden border border-white/10 mb-2">
                    <ProjectThumbnail project={project} compact={true} />
                  </div>

                  {/* Project Title & Short Subtitle */}
                  <h3 className="font-display font-semibold text-[12.5px] text-white line-clamp-1 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-[10px] text-white/60 line-clamp-1 mt-0.5 font-sans">
                    {project.subtitle}
                  </p>

                  {/* Stack Chips */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {project.stack.slice(0, 3).map((st) => (
                      <span
                        key={st}
                        className="font-mono text-[7.5px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-white/70"
                      >
                        {st}
                      </span>
                    ))}
                    {project.stack.length > 3 && (
                      <span className="font-mono text-[7.5px] px-1 py-0.5 text-white/40">
                        +{project.stack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Direct Clickable Action Row on Card */}
                  <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between gap-1 font-mono text-[9.5px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(project)
                      }}
                      className="px-2 py-0.5 rounded font-semibold transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: isHovered || isSelected ? project.color : 'rgba(255,255,255,0.12)',
                        color: isHovered || isSelected ? '#000' : '#fff',
                      }}
                    >
                      Case Study →
                    </button>

                    <div className="flex items-center gap-1">
                      {project.link && project.link.startsWith('http') && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-1.5 py-0.5 rounded border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-0.5 text-[8.5px] font-semibold"
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
                          className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer text-[8.5px]"
                          title="GitHub Repository"
                        >
                          GH ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Background: Sleek Celestial Beacon Pill (Zero Overlapping / Clean Depth) */
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
                className="group/beacon flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#050906]/92 border border-white/15 hover:border-[#c8f53c] backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 select-none whitespace-nowrap"
                style={{
                  boxShadow: `0 0 14px ${project.color}25, 0 4px 10px rgba(0,0,0,0.85)`
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span
                  className="font-mono text-[9px] font-bold tracking-wider"
                  style={{ color: project.color }}
                >
                  {project.num}
                </span>
                <span className="font-display text-[11px] text-white/80 group-hover/beacon:text-white font-medium">
                  {project.title}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-white/40">
                  {project.category.split(' ')[0]}
                </span>
              </div>
            )}
          </Html>
        )}
      </group>
    </Float>
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

    const target = controls.target || new THREE.Vector3(0, 0.05, 0)
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

  // Distribute projects in a wide 3D celestial orbit with alternating upper/lower heights
  // Alternating heights (+0.52 and -0.48) ensures neighboring nodes never collide horizontally!
  const positions = useMemo(() => {
    const total = projects.length
    return projects.map((_, i) => {
      const angle = (i / total) * Math.PI * 2
      const radius = 7.2
      const height = i % 2 === 0 ? 0.52 : -0.48
      const zOffset = Math.sin(angle) * radius

      return [
        Math.cos(angle) * radius,
        height,
        zOffset,
      ]
    })
  }, [projects])

  return (
    <Canvas
      camera={{ position: [0, 0.5, 10.2], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <color attach="background" args={['#040504']} />
      <fog attach="fog" args={['#040504', 9, 22]} />

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

        {/* Interactive 3D Project Constellation Nodes */}
        {projects.map((p, idx) => {
          const match =
            activeFilter === 'All' ||
            p.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
            (activeFilter === 'Experiments' && p.category === 'Experiments') ||
            (activeFilter === 'AI & Machine Learning' && p.category.includes('AI'))

          return (
            <ProjectSpatialNode
              key={p.id}
              project={p}
              position={positions[idx]}
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

        {/* Orbit / Pan controls with smooth wheel & pinch zoom enabled */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.65}
          enableZoom={true}
          zoomSpeed={0.8}
          minDistance={4.8}
          maxDistance={13.5}
          maxPolarAngle={Math.PI / 1.85}
          minPolarAngle={Math.PI / 3.4}
          target={[0, 0.05, 0]}
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
