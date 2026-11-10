import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import { skills } from '../data/projects'

function Node({ position, label, reduced }) {
  return (
    <Float
      speed={reduced ? 0 : 1.4}
      rotationIntensity={reduced ? 0 : 0.4}
      floatIntensity={reduced ? 0 : 1.1}
      position={position}
    >
      <mesh>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color={label.group?.includes('AI') ? '#c8f53c' : '#f4f1ea'}
          emissive={label.group?.includes('AI') ? '#c8f53c' : '#8ba352'}
          emissiveIntensity={0.6}
        />
      </mesh>
      <Html center distanceFactor={8} occlude={false}>
        <div className="font-mono text-[11px] whitespace-nowrap px-2 py-1 rounded-full border border-[var(--line)] bg-[var(--panel)]/80 text-[var(--hi)] backdrop-blur-sm select-none">
          {label.label}
        </div>
      </Html>
    </Float>
  )
}

export default function SkillsOrbit({ reduced = false }) {
  const wrapRef = useRef(null)
  const [isInView, setIsInView] = useState(true)

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

  const positions = useMemo(() => {
    const n = skills.length
    return skills.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 2.4
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta) * 0.6, r * Math.cos(phi)]
    })
  }, [])

  return (
    <div ref={wrapRef} className="w-full h-full">
      <Canvas
        frameloop={isInView && !reduced ? 'always' : 'demand'}
        camera={{ position: [0, 0, 5.4], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 4]} intensity={1} color="#c8f53c" />
        <Suspense fallback={null}>
          {skills.map((s, i) => (
            <Node key={s.label} position={positions[i]} label={s} reduced={reduced} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  )
}
