import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { supabase } from './lib/supabase'

const root = createRoot(document.getElementById('root'))

function render() {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

// Supabase PKCE flow puts a ?code= param in the query string after password
// reset redirect. Exchange it for a session before mounting the app.
const code = new URLSearchParams(window.location.search).get('code')
if (code) {
  supabase.auth.exchangeCodeForSession(code)
    .then(() => {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash)
    })
    .catch((err) => console.error('Code exchange failed:', err))
    .finally(render)
} else {
  render()
}
