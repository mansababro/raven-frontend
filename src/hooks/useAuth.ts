import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getCurrentSession, signOut } from '../store/slices/authSlice'
import { supabase } from '../lib/supabase'
import type { RootState, AppDispatch } from '../store/store'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, profile, token, loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  )

  useEffect(() => {
    // Check for existing session on mount
    dispatch(getCurrentSession())

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(getCurrentSession())
      } else {
        dispatch(signOut())
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch])

  return {
    user,
    profile,
    token,
    loading,
    error,
    isAuthenticated,
  }
}

