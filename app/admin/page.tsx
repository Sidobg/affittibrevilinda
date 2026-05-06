'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  function handleLogin() {
    if (pwd === 'linda2024') {
      localStorage.setItem('linda_auth', '1')
      router.push('/admin/dashboard')
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm text-center shadow-sm">
        <img src="/logo.webp" alt="Linda Affitti Brevi" className="h-16 mx-auto mb-6" />
        <p className="text-sm text-gray-500 mb-6">Accedi al pannello di gestione</p>
        <input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={e => { setPwd(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-3 text-sm outline-none focus:border-gray-400"
        />
        {error && <p className="text-red-500 text-xs mb-3">Password errata</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-gray-900 text-white rounded-lg py-2 text-sm hover:bg-gray-700 transition"
        >
          Accedi
        </button>
      </div>
    </div>
  )
}
