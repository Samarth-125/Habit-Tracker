import { useEffect } from 'react'

export default function Toast({ message, show, onHide }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onHide, 2400)
      return () => clearTimeout(t)
    }
  }, [show, onHide])

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
      background: '#1c1c24',
      border: '1px solid #272733',
      borderRadius: 8,
      padding: '8px 20px',
      fontSize: 11,
      color: '#e6e6f0',
      opacity: show ? 1 : 0,
      pointerEvents: 'none',
      transition: 'all 0.25s',
      zIndex: 9999,
      whiteSpace: 'nowrap',
    }}>
      {message}
    </div>
  )
}