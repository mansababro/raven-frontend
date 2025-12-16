import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { handleOAuthCallback } from '../store/slices/authSlice'
import type { AppDispatch, RootState } from '../store/store'

const AuthCallback = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const processCallback = async () => {
      const result = await dispatch(handleOAuthCallback())
      if (handleOAuthCallback.fulfilled.match(result)) {
        navigate('/chat')
      }
    }
    processCallback()
  }, [dispatch, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffaeaf] mx-auto mb-4"></div>
          <p>Processing authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212] text-white">
        <div className="text-center">
          <p className="text-[#ffaeaf] mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate('/signup')}
            className="px-6 py-3 rounded-lg bg-[#ffaeaf] text-[#121212] font-medium hover:bg-[#ff9e9f]"
          >
            Go to Sign Up
          </button>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212] text-white">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    )
  }

  return null
}

export default AuthCallback

