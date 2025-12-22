import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4000'

const fetchJsonWithTimeout = async <T>(
  url: string,
  options: RequestInit,
  timeoutMs: number = 8000,
): Promise<T> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timeoutId)
  }
}

interface User {
  id: string
  email?: string
  [key: string]: any
}

interface Profile {
  id: string
  user_id: string
  [key: string]: any
}

// (Session interface removed; unused)

interface UserPreferences {
  genres: string[]
  vibes: string[]
  avoid: string[]
  factors: string[]
  venue_sizes: string[]
}

const hasMeaningfulItems = (value: unknown): boolean => {
  if (!Array.isArray(value)) return false
  return value.some((item) => {
    if (item === null || item === undefined) return false
    const str = String(item).trim()
    return str.length > 0 && str.toLowerCase() !== 'null'
  })
}

const computeHasPreferences = (preferences: any): boolean => {
  if (!preferences) return false
  return (
    hasMeaningfulItems(preferences.genres) ||
    hasMeaningfulItems(preferences.vibes) ||
    hasMeaningfulItems(preferences.avoid) ||
    hasMeaningfulItems(preferences.factors) ||
    hasMeaningfulItems(preferences.venue_sizes)
  )
}

interface AuthState {
  user: User | null
  profile: Profile | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  hasPreferences: boolean
  preferences: UserPreferences | null
}

const loadStoredSession = (): { user: User | null; token: string | null; isAuthenticated: boolean } => {
  if (typeof window === 'undefined') return { user: null, token: null, isAuthenticated: false }
  try {
    const raw = localStorage.getItem('raven_session')
    if (!raw) return { user: null, token: null, isAuthenticated: false }
    const session = JSON.parse(raw)
    const token = session?.access_token || null
    const user = session?.user || null
    if (token && user?.id) return { user, token, isAuthenticated: true }
  } catch {
    // ignore
  }
  return { user: null, token: null, isAuthenticated: false }
}

const loadStoredHasPreferences = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem('raven_has_preferences') === 'true'
  } catch {
    return false
  }
}

// Initial state
const stored = loadStoredSession()
const initialState: AuthState = {
  user: stored.user,
  profile: null,
  token: stored.token,
  // If we have a stored session, don't block the app behind a loader.
  loading: !stored.isAuthenticated,
  error: null,
  isAuthenticated: stored.isAuthenticated,
  hasPreferences: stored.isAuthenticated ? loadStoredHasPreferences() : false,
  preferences: null
}

// Async thunk: Sign up with email and password
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // If session exists, fetch full profile (includes preferences)
      if (data.session) {
        // Persist session for refresh-stable auth
        try {
          localStorage.setItem('raven_session', JSON.stringify(data.session))
          localStorage.setItem('raven_user_id', data.user!.id)
        } catch {
          // ignore
        }

        try {
          const profileData: any = await fetchJsonWithTimeout(
            `${API_URL}/users/${data.user!.id}/full-profile`,
            {
              headers: { Authorization: `Bearer ${data.session.access_token}` },
            },
          )

          // Check if user has preferences
          const preferences = profileData.preferences || null
          const hasPreferences = computeHasPreferences(preferences)
          try {
            localStorage.setItem('raven_has_preferences', hasPreferences ? 'true' : 'false')
          } catch {
            // ignore
          }

          return {
            user: data.user!,
            session: data.session,
            profile: profileData.profile || null,
            preferences,
            hasPreferences,
          }
        } catch (profileError) {
          // If profile fetch fails, still return session
          console.warn('Failed to fetch profile on signup:', profileError)
        }
      }

      return {
        user: data.user,
        session: data.session,
        profile: null,
        preferences: null,
        hasPreferences: false
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk: Sign in with email and password
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Persist session for refresh-stable auth
      try {
        localStorage.setItem('raven_session', JSON.stringify(data.session))
        localStorage.setItem('raven_user_id', data.user!.id)
      } catch {
        // ignore
      }

      // Fetch full user profile (includes preferences). If backend is down, still allow sign-in.
      try {
        const profileData: any = await fetchJsonWithTimeout(
          `${API_URL}/users/${data.user!.id}/full-profile`,
          { headers: { Authorization: `Bearer ${data.session!.access_token}` } },
        )

        const preferences = profileData.preferences || null
        const hasPreferences = computeHasPreferences(preferences)
        try {
          localStorage.setItem('raven_has_preferences', hasPreferences ? 'true' : 'false')
        } catch {
          // ignore
        }

        return {
          user: data.user!,
          session: data.session!,
          profile: profileData.profile,
          preferences,
          hasPreferences,
        }
      } catch (profileError) {
        console.warn('Failed to fetch profile on signin:', profileError)
        try {
          localStorage.setItem('raven_has_preferences', 'false')
        } catch {
          // ignore
        }
        return {
          user: data.user!,
          session: data.session!,
          profile: null,
          preferences: null,
          hasPreferences: false,
        }
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk: Sign in with Google OAuth
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      // IMPORTANT:
      // - In production (Vercel), we want to redirect back to the real domain, not a preview/localhost.
      // - In dev, default to current origin for convenience.
      const siteUrl = (
        import.meta.env.VITE_SITE_URL ||
        (import.meta.env.PROD ? 'https://askraven.app' : window.location.origin)
      ).replace(/\/$/, '')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Send users back to /home so we land on the protected route
          redirectTo: `${siteUrl}/home`
        }
      })

      if (error) throw error

      // The OAuth flow will redirect, so we return the URL
      return { redirectUrl: data.url }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk: Handle OAuth callback
export const handleOAuthCallback = createAsyncThunk(
  'auth/handleOAuthCallback',
  async (_, { rejectWithValue }) => {
    try {
      // Supabase may take a moment to process the URL hash. Retry briefly.
      let data: any = null
      let error: any = null
      for (let i = 0; i < 25; i++) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, i === 0 ? 50 : 150))
        // eslint-disable-next-line no-await-in-loop
        const res = await supabase.auth.getSession()
        data = res.data
        error = res.error
        if (data?.session) break
      }

      if (error) throw error

      if (!data.session) {
        throw new Error('No session found')
      }

      // Persist session + user id for your flow
      try {
        localStorage.setItem('raven_session', JSON.stringify(data.session))
        localStorage.setItem('raven_user_id', data.session.user.id)
      } catch {
        // ignore storage failures
      }

      // Fetch full user profile from backend, but don't fail if it errors
      let profile = null
      let preferences = null
      let hasPreferences = false
      
      try {
        const profileData: any = await fetchJsonWithTimeout(
          `${API_URL}/users/${data.session.user.id}/full-profile`,
          { headers: { Authorization: `Bearer ${data.session.access_token}` } },
        )
        profile = profileData.profile || null
        preferences = profileData.preferences || null
        hasPreferences = computeHasPreferences(preferences)
        try {
          localStorage.setItem('raven_has_preferences', hasPreferences ? 'true' : 'false')
        } catch {
          // ignore
        }
      } catch (profileError) {
        // Backend might not be running - that's okay, we have a valid session
        console.warn('Could not reach backend for profile:', profileError)
      }

      return {
        user: data.session.user,
        session: data.session,
        profile,
        preferences,
        hasPreferences
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk: Sign out
export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    // Best-effort server sign out; even if it fails we still clear client state/storage.
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.warn('Supabase signOut failed:', error)
      }
    } catch (error) {
      console.warn('Supabase signOut threw:', error)
    } finally {
      // Remove everything from storage as requested.
      try {
        localStorage.clear()
      } catch {
        // ignore
      }
      try {
        sessionStorage.clear()
      } catch {
        // ignore
      }
    }

    return null
  }
)

// Async thunk: Get current session
export const getCurrentSession = createAsyncThunk(
  'auth/getCurrentSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) throw error

      if (!data.session) {
        return null
      }

      // Persist session + user id for your flow
      try {
        localStorage.setItem('raven_session', JSON.stringify(data.session))
        localStorage.setItem('raven_user_id', data.session.user.id)
      } catch {
        // ignore storage failures
      }

      // Fetch full user profile from backend, but don't fail if it errors
      let profile = null
      let preferences = null
      let hasPreferences = false
      
      try {
        const profileData: any = await fetchJsonWithTimeout(
          `${API_URL}/users/${data.session.user.id}/full-profile`,
          { headers: { Authorization: `Bearer ${data.session.access_token}` } },
        )
        profile = profileData.profile || null
        preferences = profileData.preferences || null
        hasPreferences = computeHasPreferences(preferences)
        try {
          localStorage.setItem('raven_has_preferences', hasPreferences ? 'true' : 'false')
        } catch {
          // ignore
        }
      } catch (profileError) {
        // Backend might not be running - that's okay, we have a valid session
        console.warn('Could not reach backend for profile:', profileError)
      }

      return {
        user: data.session.user,
        session: data.session,
        profile,
        preferences,
        hasPreferences
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk: Refresh user profile
export const refreshProfile = createAsyncThunk(
  'auth/refreshProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      if (!state.auth.token) {
        throw new Error('No token available')
      }

      const userId = state.auth.user?.id
      if (!userId) {
        throw new Error('No user available')
      }

      const profileData: any = await fetchJsonWithTimeout(
        `${API_URL}/users/${userId}/full-profile`,
        { headers: { Authorization: `Bearer ${state.auth.token}` } },
      )

      return {
        profile: profileData.profile,
        user: profileData.user,
        preferences: profileData.preferences || null
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setToken: (state, action) => {
      state.token = action.payload
    }
  },
  extraReducers: (builder) => {
    // Sign up
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.profile = action.payload.profile
        state.token = action.payload.session?.access_token || null
        state.isAuthenticated = !!action.payload.session
        state.preferences = action.payload.preferences || null
        state.hasPreferences = action.payload.hasPreferences || false
        state.error = null
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Sign in
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.profile = action.payload.profile
        state.token = action.payload.session.access_token
        state.isAuthenticated = true
        state.preferences = action.payload.preferences || null
        state.hasPreferences = action.payload.hasPreferences || false
        state.error = null
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Sign in with Google
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        // Don't set loading to true for OAuth since it redirects immediately
        // This prevents the button from showing "Loading..." indefinitely
        state.error = null
      })
      .addCase(signInWithGoogle.fulfilled, (state) => {
        // OAuth redirects, so we don't update state here
        // The callback handler will update state
        state.loading = false
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Handle OAuth callback
    builder
      .addCase(handleOAuthCallback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(handleOAuthCallback.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.profile = action.payload.profile
        state.token = action.payload.session.access_token
        state.isAuthenticated = true
        state.preferences = action.payload.preferences || null
        state.hasPreferences = action.payload.hasPreferences || false
        state.error = null
      })
      .addCase(handleOAuthCallback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Sign out
    builder
      .addCase(signOut.pending, (state) => {
        state.loading = true
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.profile = null
        state.token = null
        state.isAuthenticated = false
        state.preferences = null
        state.hasPreferences = false
        state.error = null
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Get current session
    builder
      .addCase(getCurrentSession.pending, (state) => {
        // Don't blank the app if we already have a stored session/user.
        if (!state.isAuthenticated) {
          state.loading = true
        }
      })
      .addCase(getCurrentSession.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.user = action.payload.user
          state.profile = action.payload.profile
          state.token = action.payload.session.access_token
          state.isAuthenticated = true
          state.preferences = action.payload.preferences || null
          state.hasPreferences = action.payload.hasPreferences || false
        } else {
          state.user = null
          state.profile = null
          state.token = null
          state.isAuthenticated = false
          state.preferences = null
          state.hasPreferences = false
        }
        state.error = null
      })
      .addCase(getCurrentSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Refresh profile
    builder
      .addCase(refreshProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(refreshProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload.profile
        state.user = action.payload.user
        state.preferences = action.payload.preferences || null
        state.hasPreferences = computeHasPreferences(action.payload.preferences)
        try {
          localStorage.setItem('raven_has_preferences', state.hasPreferences ? 'true' : 'false')
        } catch {
          // ignore
        }
        state.error = null
      })
      .addCase(refreshProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, setToken } = authSlice.actions
export default authSlice.reducer

