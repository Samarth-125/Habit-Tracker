import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, theme }) {
  const bg     = theme === 'light' ? '#ffffff' : '#15151a'
  const border = theme === 'light' ? '#e0e0d8' : '#272733'
  const muted  = theme === 'light' ? '#6b6b80' : '#9191a8'

  // close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 500,
      }}>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 12,
          padding: '28px 28px 22px',
          minWidth: 320,
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>

        {/* Title */}
        <div className='font-serif' style={{ fontSize: 20, color: '#c8f55a', marginBottom: 16 }}>
          {title}
        </div>

        {/* Content */}
        {children}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 14,
            background: 'transparent', border: 'none',
            color: muted, fontSize: 16, cursor: 'pointer',
          }}>
          ✕
        </button>

      </div>
    </div>
  )
}