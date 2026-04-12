import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit() {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError('')
    try {
      if (isSignUp) {
        await signUp(email, password)
        setError('✓ Check your email to confirm your account!')
      } else {
        await signIn(email, password)
        navigate('/')
      }
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      height: '100vh',
      background: '#0e0e10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#15151a',
        border: '1px solid #272733',
        borderRadius: 12,
        padding: '40px 36px',
        minWidth: 340,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        {/* Title */}
        <div className='font-serif' style={{ fontSize: 28, color: '#c8f55a', marginBottom: 4 }}>
          ✦ Habit Tracker
        </div>
        <div style={{ fontSize: 11, color: '#9191a8', letterSpacing: 1, marginBottom: 4 }}>
          {isSignUp ? 'CREATE AN ACCOUNT' : 'SIGN IN TO CONTINUE'}
        </div>

        {/* Email */}
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{
            background: '#1c1c24',
            border: '1px solid #272733',
            borderRadius: 6,
            padding: '10px 14px',
            color: '#e6e6f0',
            fontFamily: 'DM Mono, monospace',
            fontSize: 12, outline: 'none',
          }}
        />

        {/* Password */}
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{
            background: '#1c1c24',
            border: '1px solid #272733',
            borderRadius: 6,
            padding: '10px 14px',
            color: '#e6e6f0',
            fontFamily: 'DM Mono, monospace',
            fontSize: 12, outline: 'none',
          }}
        />

        {/* Error message */}
        {error && (
          <div style={{
            fontSize: 11,
            color: error.startsWith('✓') ? '#5af5c8' : '#f55a8c',
            letterSpacing: 0.5,
          }}>
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: '#c8f55a', color: '#0e0e10',
            border: 'none', borderRadius: 6,
            padding: '10px 14px',
            fontFamily: 'DM Mono, monospace',
            fontSize: 12, fontWeight: 700,
            letterSpacing: 1, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: 4,
          }}>
          {loading ? 'LOADING...' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </button>

        {/* Toggle sign up / sign in */}
        <div
          onClick={() => { setIsSignUp(!isSignUp); setError('') }}
          style={{
            fontSize: 10, color: '#9191a8',
            textAlign: 'center', cursor: 'pointer',
            letterSpacing: 1,
          }}>
          {isSignUp ? 'Already have an account? SIGN IN' : "Don't have an account? SIGN UP"}
        </div>

      </div>
    </div>
  )
}