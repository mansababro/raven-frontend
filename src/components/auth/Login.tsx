import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { signIn } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store/store'

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: RootState) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(signIn({ email, password }))
    if (signIn.fulfilled.match(result)) {
      navigate('/chat') // Redirect to chat screen
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-white text-2xl font-medium">Login</h2>
      {error && <div className="text-[#ffaeaf] text-sm">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#ffaeaf] focus:outline-none"
      />
      <div className="flex items-center">
      <input
          type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
          className="flex-1 px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#ffaeaf] focus:outline-none"
      />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="-ml-11 h-[40px] w-[44px] flex items-center justify-center text-[#9c9aa5] hover:text-[#ffaeaf] transition-colors"
        >
          {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-[#ffaeaf] text-[#121212] font-medium hover:bg-[#ff9e9f] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default Login

