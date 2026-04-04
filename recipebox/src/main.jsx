import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './lib/supabase'
import './index.css'
import App from './App'

const root = createRoot(document.getElementById('root'))

function render() {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

// Supabase auth redirects conflict with HashRouter (both use URL #fragment).
// We set detectSessionInUrl: false in supabase.js and handle it manually here
// before React mounts so the session is ready when components render.
try {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (code) {
    // PKCE flow (Supabase v2 default): auth code arrives as ?code=xxx
    supabase.auth.exchangeCodeForSession(code)
      .then(() => {
        window.history.replaceState(null, '', window.location.pathname + window.location.hash)
      })
      .catch((err) => console.error('Code exchange failed:', err))
      .finally(render)
  } else {
    // Check for implicit flow tokens in hash: #access_token=xxx&type=recovery
    const hash = window.location.hash
    if (hash && hash.includes('access_token') && hash.includes('type=')) {
      const cleaned = hash.replace(/^#\/?/, '')
      const hashParams = new URLSearchParams(cleaned)
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(() => { window.location.hash = '#/' })
          .catch((err) => console.error('Set session failed:', err))
          .finally(render)
      } else {
        render()
      }
    } else {
      render()
    }
  }
} catch (err) {
  console.error('Auth redirect handling failed:', err)
  render()
}
