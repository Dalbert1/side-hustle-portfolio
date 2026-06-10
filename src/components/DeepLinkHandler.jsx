import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
import { supabase } from '../lib/supabase'

// Handles links like com.forkinggoodclub.app://reset-password#access_token=...
// Supabase puts the session tokens in the URL hash; the webview never loads
// that URL, so we parse it here and establish the session manually.
export default function DeepLinkHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listener = CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
      const hash = url.split('#')[1]
      if (!hash) return

      const params = new URLSearchParams(hash)
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      if (!access_token || !refresh_token) return

      const { error } = await supabase.auth.setSession({ access_token, refresh_token })
      if (!error && params.get('type') === 'recovery') {
        navigate('/reset-password')
      }
    })

    return () => {
      listener.then(l => l.remove())
    }
  }, [navigate])

  return null
}
