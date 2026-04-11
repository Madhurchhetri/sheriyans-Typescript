import React, { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const { handleRegister } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      // Strip everything except digits for contact field
      [name]: type === 'checkbox' ? checked : name === 'contact' ? value.replace(/\D/g, '') : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await handleRegister(form)
      navigate('/')
    } catch (err) {
      const data = err?.response?.data
      if (data?.errors?.length) {
        // express-validator returns an errors array
        setError(data.errors.map((e) => e.msg).join(' · '))
      } else {
        setError(data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4 py-16"
      style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Subtle radial gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top left, #201F1F 0%, #0D0D0D 70%)' }} />

      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="mb-12">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#f5c518] mb-3">
            Snitch
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#e5e2e1]">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-[#9a9078]">
            Join the network. No noise, just signal.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-md bg-[#93000a]/20 border border-[#93000a]/30 text-[#ffb4ab] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullname"
              className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#9a9078]">
              Full Name
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              required
              autoComplete="name"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="w-full px-4 py-3.5 rounded-md bg-[#1A1A1A] text-[#e5e2e1] text-sm
                placeholder-[#4e4633] border border-[#4e4633]/30
                focus:outline-none focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/20
                transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email"
              className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#9a9078]">
              Email
            </label>
            <input
              id="email"
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

          {/* Contact Number */}
          <div className="space-y-2">
            <label htmlFor="contact"
              className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#9a9078]">
              Contact Number
            </label>
            <input
              id="contact"
              name="contact"
              type="tel"
              required
              autoComplete="tel"
              value={form.contact}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full px-4 py-3.5 rounded-md bg-[#1A1A1A] text-[#e5e2e1] text-sm
                placeholder-[#4e4633] border border-[#4e4633]/30
                focus:outline-none focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/20
                transition-all duration-200"
            />
            <p className="text-xs text-[#4e4633] mt-1">Enter 10-digit number without spaces or country code</p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password"
              className="block text-[11px] font-bold tracking-[0.1em] uppercase text-[#9a9078]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className="w-full px-4 py-3.5 rounded-md bg-[#1A1A1A] text-[#e5e2e1] text-sm
                placeholder-[#4e4633] border border-[#4e4633]/30
                focus:outline-none focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518]/20
                transition-all duration-200"
            />
          </div>

          {/* isSeller Checkbox */}
          <div className="pt-1">
            <label htmlFor="isSeller"
              className="flex items-center gap-3 cursor-pointer group w-fit">
              <div className="relative">
                <input
                  id="isSeller"
                  name="isSeller"
                  type="checkbox"
                  checked={form.isSeller}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded border border-[#4e4633]/50 bg-[#1A1A1A]
                  peer-checked:bg-[#f5c518] peer-checked:border-[#f5c518]
                  transition-all duration-200 flex items-center justify-center">
                  {form.isSeller && (
                    <svg className="w-3 h-3 text-[#3d2f00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-[#d1c5ac] group-hover:text-[#e5e2e1] transition-colors">
                Register as Seller
              </span>
            </label>
            <p className="mt-1.5 ml-8 text-xs text-[#4e4633]">
              Enables product listing and selling features.
            </p>
          </div>

          <a href="/api/auth/google" className="text-[#f5c518] hover:text-[#ffe5a0] transition-colors font-medium underline"> Continue with Google </a>

          {/* Submit */}
          <div className="pt-4">
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-md bg-[#f5c518] text-[#3d2f00] text-sm font-semibold
                tracking-wide hover:bg-[#f0c110] active:bg-[#e0b510]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#f5c518]/40">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </div>

        </form>

        {/* Footer link */}
        <p className="mt-8 text-center text-sm text-[#9a9078]">
          Already have an account?{' '}
          <Link to="/login"
            className="text-[#f5c518] hover:text-[#ffe5a0] transition-colors font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register