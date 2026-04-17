import { useState } from 'react'
import { supabase } from './supabaseClient.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0C1B2A',padding:20,fontFamily:"'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <div style={{ width:'100%',maxWidth:400 }}>
        <div style={{ textAlign:'center',marginBottom:40 }}>
          <div style={{ width:56,height:56,borderRadius:14,background:'linear-gradient(135deg,#2DB7A6,#1E88C7)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:'#fff',marginBottom:16 }}>M</div>
          <div style={{ fontSize:13,fontWeight:600,color:'#2DB7A6',letterSpacing:2,textTransform:'uppercase',fontFamily:"'Space Grotesk',sans-serif" }}>Coaching x Milestone</div>
          <div style={{ fontSize:11,color:'#4A5F75',marginTop:4 }}>Milestone Mortgage Solutions</div>
        </div>
        <div style={{ background:'#112236',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:32 }}>
          <h2 style={{ fontSize:20,fontWeight:700,color:'#F1F5F9',marginBottom:4,fontFamily:"'Space Grotesk',sans-serif" }}>Sign in</h2>
          <p style={{ fontSize:13,color:'#7B8FA3',marginBottom:24 }}>Welcome back to your coaching platform</p>
          {error && <div style={{ background:'rgba(224,82,82,0.1)',border:'1px solid rgba(224,82,82,0.2)',borderRadius:8,padding:'10px 14px',marginBottom:16,fontSize:13,color:'#E05252' }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block',fontSize:11,color:'#7B8FA3',marginBottom:4,fontWeight:600,textTransform:'uppercase',letterSpacing:0.8 }}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@milestone.com" style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:'11px 14px',color:'#E2E8F0',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit' }}/>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block',fontSize:11,color:'#7B8FA3',marginBottom:4,fontWeight:600,textTransform:'uppercase',letterSpacing:0.8 }}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" style={{ width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:'11px 14px',color:'#E2E8F0',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit' }}/>
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%',padding:12,borderRadius:8,border:'none',fontSize:14,fontWeight:600,background:loading?'#1A3A5C':'#2DB7A6',color:'#fff',cursor:loading?'default':'pointer',fontFamily:'inherit' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p style={{ textAlign:'center',marginTop:20,fontSize:11,color:'#4A5F75' }}>Milestone Mortgage Solutions · NMLS #1815656</p>
      </div>
    </div>
  )
}
