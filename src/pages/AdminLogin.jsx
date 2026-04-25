import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, Leaf, AlertCircle } from 'lucide-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await axios.post(`${API}/api/admin/login`, { email, password })
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminEmail', data.email)
      navigate('/admin/panel')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <img src="/logo.png" alt="TulipCrop Logo" className="w-11 h-11 object-contain" />
          <span className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white">
            Tulip<span className="text-brand-lime">Crop</span>
          </span>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161a] p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Admin Login</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to manage your products</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 font-semibold">
                Email
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tulipcrop.in"
                  className="w-full rounded-xl bg-slate-50 dark:bg-[#0d0f13] border border-slate-200 dark:border-white/10 pl-11 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-lime transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 font-semibold">
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full rounded-xl bg-slate-50 dark:bg-[#0d0f13] border border-slate-200 dark:border-white/10 pl-11 pr-12 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-lime transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-lime text-brand-dark font-bold flex items-center justify-center gap-2 hover:bg-brand-volt transition-colors shadow-[0_8px_30px_rgba(132,204,22,0.25)] disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          Access restricted to authorized administrators only.
        </p>
      </div>
    </main>
  )
}

export default AdminLogin
