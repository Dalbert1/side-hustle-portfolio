import { createClient } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// iOS can evict WKWebView localStorage under disk pressure, which would
// silently sign users out. Preferences persists in native storage instead.
const nativeStorage = {
  getItem: async (key) => (await Preferences.get({ key })).value,
  setItem: async (key, value) => {
    await Preferences.set({ key, value })
  },
  removeItem: async (key) => {
    await Preferences.remove({ key })
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: Capacitor.isNativePlatform() ? { storage: nativeStorage } : {},
})
