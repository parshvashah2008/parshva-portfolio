import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import ProjectThumbnail from '../components/ProjectThumbnail'
import { playSyntheticSound } from '../utils/soundFX'

/**
 * 3D Project Node floating in spatial universe
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

  // Subtle pulsing animation on the spatial core
  useFrame((state, delta) => {
    if (!meshRef.current || reduced) return
    meshRef.current.rotation.y += delta * 0.4
    meshRef.current.rotation.x += delta * 0.2
  })

  return (
    <Float
      speed={reduced ? 0 : 1.2}
      rotationIntensity={reduced ? 0 : 0.3}
      floatIntensity={reduced ? 0 : 0.9}
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
          scale={isSelected ? 1.6 : isHovered ? 1.3 : 1}
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

        {/* Interactive 3D Spatial Card (completely unmounted while modal is open) */}
        {!modalOpen && (
          <Html
            center
            distanceFactor={7.8}
            position={[0, 0, 0]}
            style={{
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: filterMatch ? 1 : 0.25,
              pointerEvents: filterMatch ? 'auto' : 'none',
            }}
          >
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
                ? 'scale-110 z-50'
                : isHovered
                ? 'scale-105 z-40'
                : 'hover:scale-102 opacity-90'
            }`}
            style={{ width: '270px' }}
          >
            <div
              className="relative p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-2xl overflow-hidden group"
              style={{
                backgroundColor: isSelected
                  ? 'rgba(10, 16, 14, 0.94)'
                  : isHovered
                  ? 'rgba(12, 20, 17, 0.90)'
                  : 'rgba(6, 10, 8, 0.82)',
                borderColor: isSelected
                  ? project.color
                  : isHovered
                  ? 'rgba(255, 255, 255, 0.32)'
                  : 'rgba(255, 255, 255, 0.10)',
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
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-mono text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${project.color}18`,
                    color: project.color,
                  }}
                >
                  {project.num}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/50">
                  {project.category}
                </span>
              </div>

              {/* Card Visual Preview */}
              <div className="w-full h-28 rounded-lg overflow-hidden border border-white/10 mb-2.5">
                <ProjectThumbnail project={project} compact={true} />
              </div>

              {/* Project Title & Short Subtitle */}
              <h3 className="font-display font-semibold text-sm text-white line-clamp-1 leading-snug">
                {project.title}
              </h3>
              <p className="text-[11px] text-white/60 line-clamp-1 mt-0.5 font-sans">
                {project.subtitle}
              </p>

              {/* Stack Chips */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {project.stack.slice(0, 3).map((st) => (
                  <span
                    key={st}
                    className="font-mono text-[8.5px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-white/70"
                  >
                    {st}
                  </span>
                ))}
                {project.stack.length > 3 && (
                  <span className="font-mono text-[8.5px] px-1 py-0.5 text-white/40">
                    +{project.stack.length - 3}
                  </span>
                )}
              </div>

              {/* Direct Clickable Action Row on Card */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-1.5 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(project)
                  }}
                  className="px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
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
                      className="px-2 py-1 rounded-md border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-1 text-[9px] font-semibold"
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
                      className="px-2 py-1 rounded-md border border-white/15 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer text-[9px]"
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
}) {
  const controlsRef = useRef(null)

  // Distribute projects in a 3D celestial ellipse / constellation
  const positions = useMemo(() => {
    const total = projects.length
    return projects.map((_, i) => {
      // Cylindrical/elliptical orbital distribution
      const angle = (i / total) * Math.PI * 2
      const radius = 4.2 + (i % 2 === 0 ? 0.6 : -0.4)
      const height = ((i % 3) - 1) * 1.5 + Math.sin(i * 1.5) * 0.6
      const zOffset = Math.sin(angle) * radius * 0.9

      return [
        Math.cos(angle) * radius,
        height,
        zOffset,
      ]
    })
  }, [projects])

  return (
    <Canvas
      camera={{ position: [0, 0.4, 7.8], fov: 46 }}
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

        {/* Orbit / Pan controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.65}
          zoomSpeed={0.8}
          minDistance={3.5}
          maxDistance={12.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 3.4}
        />
      </Suspense>
    </Canvas>
  )
}
