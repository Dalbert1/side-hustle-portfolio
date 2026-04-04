import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './lib/supabase'
import './index.css'
import App from './App'

// Supabase auth redirects conflict with HashRouter (both use URL #fragment).
// We set detectSessionInUrl: false in supabase.js and handle it manually here
// before React mounts so the session is ready when components render.
async function handleAuthRedirect() {
  try {
    // PKCE flow (Supabase v2 default): auth code arrives as ?code=xxx
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
      // Clean the query string so the code isn't reused on refresh
      window.history.replaceState(null, '', window.location.pathname + window.location.hash)
      return
    }

    // Implicit flow fallback: tokens arrive in the hash as #access_token=xxx&type=recovery
    const hash = window.location.hash
    if (hash && hash.includes('access_token') && hash.includes('type=')) {
      const cleaned = hash.replace(/^#\/?/, '')
      const hashParams = new URLSearchParams(cleaned)
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        window.location.hash = '#/'
        return
      }
    }
  } catch (err) {
    console.error('Auth redirect handling failed:', err)
  }
}

handleAuthRedirect().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
