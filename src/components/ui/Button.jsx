export default function Button({ children, variant = 'accent', onClick, type = 'button', disabled = false }) {
  const styles = {
    accent: {
      background: '#c8f55a',
      color: '#0e0e10',
      border: '1px solid #c8f55a',
    },
    ghost: {
      background: 'transparent',
      color: '#9191a8',
      border: '1px solid #272733',
    },
    danger: {
      background: 'transparent',
      color: '#f55a8c',
      border: '1px solid #f55a8c',
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: '6px 14px',
        borderRadius: 6,
        fontFamily: 'DM Mono, monospace',
        fontSize: 11,
        letterSpacing: 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
      {children}
    </button>
  )
}