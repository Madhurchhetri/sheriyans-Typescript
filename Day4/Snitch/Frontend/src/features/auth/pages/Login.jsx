import React, { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import ContinueWithGoogle from '../components/ContinueWithGoogle'

const Login = () => {
  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await handleLogin(form)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4 py-16"
      style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Subtle radial gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, #201F1F 0%, #0D0D0D 70%)' }} />

      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="mb-12">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#f5c518] mb-3">
            Snitch
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#e5e2e1]">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-[#9a9078]">
            Sign in to pick up where you left off.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-md bg-[#93000a]/20 border border-[#93000a]/30 text-[#ffb4ab] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email"
              className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#9a9078]">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3.5 rounded-md bg-[#1A1A1A] text-[#e5e2e1] text-sm
                placeholder-[#4e4633] border border-[#4e4633]/30
                focus:outline-none focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/20
                transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password"
                className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#9a9078]">
                Password
              </label>
              <a href="#"
                className="text-xs text-[#f5c518]/70 hover:text-[#f5c518] transition-colors">
                Forgot password?
              </a>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className="w-full px-4 py-3.5 rounded-md bg-[#1A1A1A] text-[#e5e2e1] text-sm
                placeholder-[#4e4633] border border-[#4e4633]/30
                focus:outline-none focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/20
                transition-all duration-200"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-md bg-[#f5c518] text-[#3d2f00] text-sm font-semibold
                tracking-wide hover:bg-[#f0c110] active:bg-[#e0b510]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#f5c518]/40">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>

          <ContinueWithGoogle/>

        </form>

        {/* Footer link */}
        <p className="mt-8 text-center text-sm text-[#9a9078]">
          Don&apos;t have an account?{' '}
          <Link to="/register"
            className="text-[#f5c518] hover:text-[#ffe5a0] transition-colors font-medium">
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
