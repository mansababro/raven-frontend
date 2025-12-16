import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4000'

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

interface Session {
  access_token: string
  refresh_token?: string
  expires_at?: number
  user: User
}

interface AuthState {
  user: User | null
  profile: Profile | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

// Initial state
const initialState: AuthState = {
  user: null,
  profile: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false
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

      // If session exists, fetch profile from backend
      if (data.session) {
        try {
          const profileResponse = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`
            }
          })

          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            return {
              user: data.user!,
              session: data.session,
              profile: profileData.profile || null
            }
          }
        } catch (profileError) {
          // If profile fetch fails, still return session
          console.warn('Failed to fetch profile on signup:', profileError)
        }
      }

      return {
        user: data.user,
        session: data.session,
        profile: null
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

      // Fetch user profile from backend
      const profileResponse = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${data.session!.access_token}`
        }
      })

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile')
      }

      const profileData = await profileResponse.json()

      return {
        user: data.user!,
        session: data.session!,
        profile: profileData.profile
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Send users back to /home so we land on the protected route
          redirectTo: `${window.location.origin}/home`
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
      // Wait a moment for Supabase to process the hash if it exists
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const { data, error } = await supabase.auth.getSession()

      if (error) throw error

      if (!data.session) {
        throw new Error('No session found')
      }

      // Try to fetch user profile from backend, but don't fail if it errors
      let profile = null
      try {
        const profileResponse = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`
          }
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          profile = profileData.profile || null
        } else {
          console.warn('Failed to fetch user profile, but session is valid')
        }
      } catch (profileError) {
        // Backend might not be running - that's okay, we have a valid session
        console.warn('Could not reach backend for profile:', profileError)
      }

      return {
        user: data.session.user,
        session: data.session,
        profile
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Async thunk: Sign out
export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear all raven-related localStorage data
      localStorage.removeItem('raven_onboarding_complete')
      localStorage.removeItem('raven_user_genres')
      localStorage.removeItem('raven_user_vibes')
      localStorage.removeItem('raven_user_artists')
      
      return null
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
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

      // Try to fetch user profile from backend, but don't fail if it errors
      let profile = null
      try {
        const profileResponse = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`
          }
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          profile = profileData.profile || null
        } else {
          console.warn('Failed to fetch user profile, but session is valid')
        }
      } catch (profileError) {
        // Backend might not be running - that's okay, we have a valid session
        console.warn('Could not reach backend for profile:', profileError)
      }

      return {
        user: data.session.user,
        session: data.session,
        profile
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

      const profileResponse = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${state.auth.token}`
        }
      })

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile')
      }

      const profileData = await profileResponse.json()

      return {
        profile: profileData.profile,
        user: profileData.user
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
        state.error = null
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Get current session
    builder
      .addCase(getCurrentSession.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentSession.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.user = action.payload.user
          state.profile = action.payload.profile
          state.token = action.payload.session.access_token
          state.isAuthenticated = true
        } else {
          state.user = null
          state.profile = null
          state.token = null
          state.isAuthenticated = false
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

