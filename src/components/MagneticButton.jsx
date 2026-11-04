import { motion } from 'framer-motion'
import { useMagnetic } from '../hooks/useMagnetic'

export default function MagneticButton({ href, children, variant = 'solid', reduced, external = false, className = '', ...props }) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic(0.35, reduced)

  const base =
    'inline-flex items-center gap-2 font-medium text-sm px-7 py-3.5 rounded-full transition-colors duration-200'
  const styles =
    variant === 'solid'
      ? 'bg-[#c8f53c] text-[#040804] font-semibold hover:bg-[#d8ff54] shadow-md'
      : 'border border-[var(--line)] text-[var(--hi)] hover:border-[#c8f53c]/50 hover:text-[#c8f53c]'

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      className={`${base} ${styles} ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  )
}
