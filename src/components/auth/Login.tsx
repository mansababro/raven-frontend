import React, { useState } from 'react'
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
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#ffaeaf] focus:outline-none"
      />
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

