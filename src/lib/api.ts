import { store } from '../store/store'

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:4000'

// Create an API client that automatically includes auth token
export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const state = store.getState()
  const token = state.auth.token

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, sign out
      store.dispatch({ type: 'auth/signOut' })
      throw new Error('Unauthorized')
    }
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

