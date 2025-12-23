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
    console.log('[useAuth] checking for existing session on mount');
    dispatch(getCurrentSession())

    // Listen for auth state changes
    console.log('[useAuth] setting up onAuthStateChange listener');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[useAuth] onAuthStateChange event:', event, 'session exists:', !!session);
      if (session) {
        console.log('[useAuth] onAuthStateChange: session exists, dispatching getCurrentSession');
        dispatch(getCurrentSession())
      } else {
        console.log('[useAuth] onAuthStateChange: no session, dispatching signOut');
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

