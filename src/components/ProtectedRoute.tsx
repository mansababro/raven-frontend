import React, { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentSession, handleOAuthCallback } from '../store/slices/authSlice'
import type { AppDispatch, RootState } from '../store/store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
  const hasOAuthHash = typeof window !== 'undefined' && window.location.hash.includes('access_token')
  const didInitRef = useRef(false)

  // Ensure we always resolve auth on /home refresh, including OAuth hash callbacks.
  // This prevents getting stuck with a lingering "#access_token=..." hash.
  useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true

    const run = async () => {
      try {
        if (hasOAuthHash) {
          await dispatch(handleOAuthCallback())
          // Clear the hash so we don't get stuck in "hasOAuthHash" state
          window.history.replaceState(null, '', window.location.pathname)
        } else {
          await dispatch(getCurrentSession())
        }
      } catch {
        // noop; reducers already hold error state if needed
        if (hasOAuthHash) {
          window.history.replaceState(null, '', window.location.pathname)
        }
      }
    }

    run()
  }, [dispatch, hasOAuthHash])

  // Show loading while checking auth state
  if (loading || hasOAuthHash) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#3a3a3a] border-t-[#ffaeaf] mx-auto"></div>
        </div>
      </div>
    )
  }

  // Only redirect if we're sure the user is not authenticated (after loading is complete)
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
