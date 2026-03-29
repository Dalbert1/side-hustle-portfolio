import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
    setLoading(false)
  }

  async function updateProfile(updates) {
    if (!user) return { error: { message: 'Not authenticated' } }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (data) setProfile(data)
    return { data, error }
  }

  async function signUp(email, password, rsn) {
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      return { error: { message: 'Unable to verify signup availability. Please try again.' } }
    }

    if (count >= 5) {
      return { error: { message: 'Signups are currently closed. Maximum number of users (5) reached.' } }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { rsn: rsn?.trim() || null } },
    })
    return { data, error }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    setProfile(null)
    return { error }
  }

  const displayName = profile?.rsn || null

  return (
    <AuthContext.Provider value={{ user, profile, displayName, loading, signUp, signIn, signOut, updateProfile, loadProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
