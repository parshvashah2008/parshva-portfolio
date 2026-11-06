import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CertificateModal({
  certificate,
  onClose,
  onNext,
  onPrev,
  hasMultiple = false,
}) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && onNext) onNext()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
  }, [onClose, onNext, onPrev])

  if (!certificate) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6"
        data-lenis-prevent="true"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#070c09] border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-[#0a120e]">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c8f53c]" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#c8f53c] truncate">
                  {certificate.issuer || certificate.company || 'Verified Credential'}
                </span>
                {certificate.date && (
                  <span className="font-mono text-[10px] text-white/40 hidden sm:inline">
                    · {certificate.date}
                  </span>
                )}
              </div>
              <h2 className="font-display font-semibold text-base sm:text-lg text-white truncate mt-0.5">
                {certificate.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasMultiple && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={onPrev}
                    aria-label="Previous certificate"
                    className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center font-mono text-sm transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={onNext}
                    aria-label="Next certificate"
                    className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center font-mono text-sm transition-colors"
                  >
                    →
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Certificate Image Canvas */}
          <div
            className="flex-1 overflow-auto overscroll-contain p-4 sm:p-6 bg-[#040604] flex items-center justify-center min-h-[300px]"
            data-lenis-prevent="true"
          >
            {certificate.image ? (
              <img
                src={certificate.image}
                alt={certificate.title}
                className="max-h-[66vh] w-auto max-w-full rounded-lg shadow-2xl border border-white/10 object-contain mx-auto select-none"
              />
            ) : (
              <div className="text-center font-mono text-xs text-white/40">
                Image preview unavailable
              </div>
            )}
          </div>

          {/* Bottom Actions Bar */}
          <div className="px-5 py-3.5 border-t border-white/10 bg-[#0a120e] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-white/60 text-[11px]">
              <span>Issued to:</span>
              <strong className="text-white font-sans font-semibold">Parshva Shah</strong>
              {certificate.enrollCode && (
                <span className="hidden sm:inline text-white/40">
                  · Code: <code className="text-[#d8b375]">{certificate.enrollCode}</code>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {certificate.pdf && (
                <a
                  href={certificate.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-all inline-flex items-center gap-1.5"
                >
                  <span>Open PDF</span>
                  <span>↗</span>
                </a>
              )}
              {certificate.verifyUrl && (
                <a
                  href={certificate.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full border border-[#c8f53c]/30 bg-[#c8f53c]/15 text-[#c8f53c] hover:bg-[#c8f53c]/25 transition-all inline-flex items-center gap-1.5"
                >
                  <span>Verify Credential</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
