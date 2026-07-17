'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Apartment = {
  id: string
  slug: string
  name: string
  city: string
}

export default function AdminDashboard() {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [openCities, setOpenCities] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('linda_auth') !== '1') {
      router.push('/admin')
      return
    }
    supabase.from('apartments').select('id, slug, name, city').order('city').then(({ data }) => {
      if (data) setApartments(data)
    })
  }, [])

  const cities = [...new Set(apartments.map(a => a.city))]

  function toggleCity(city: string) {
    setOpenCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    )
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/g/${slug}`
    navigator.clipboard.writeText(url)
    setCopied(slug)
    setTimeout(() => setCopied(null), 2000)
  }

  function logout() {
    localStorage.removeItem('linda_auth')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F5F0E8'}}>
      <div className="border-b px-6 py-3 flex items-center justify-between" style={{backgroundColor: '#FDFAF4', borderColor: '#E8DFD0'}}>
        <img src="/logo.webp" alt="Linda Affitti Brevi" className="h-10" />
        <button onClick={logout} className="text-sm hover:opacity-70 transition" style={{color: '#8B6F4E'}}>Esci</button>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => router.push('/admin/prezzi')}
          className="w-full rounded-2xl px-5 py-4 mb-6 flex items-center justify-between transition"
          style={{backgroundColor: '#8B6F4E', color: '#FDFAF4'}}
        >
          <span className="font-semibold text-sm tracking-wide">📅 Calendario dei prezzi</span>
          <span className="text-sm opacity-80">Apri →</span>
        </button>

        <p className="text-xs uppercase tracking-widest mb-5" style={{color: '#A08060'}}>I tuoi appartamenti</p>
        {cities.map(city => (
          <div key={city} className="mb-3">
            <button
              onClick={() => toggleCity(city)}
              className="w-full rounded-2xl px-5 py-4 flex items-center justify-between transition"
              style={{backgroundColor: '#FDFAF4', border: '1px solid #E8DFD0', color: '#3D2B1F'}}
            >
              <span className="font-semibold text-sm tracking-wide">{city}</span>
              <span className="text-xs" style={{color: '#A08060'}}>
                {apartments.filter(a => a.city === city).length} appartamenti {openCities.includes(city) ? '▲' : '▼'}
              </span>
            </button>
            {openCities.includes(city) && (
              <div className="mt-1 ml-4 pl-4" style={{borderLeft: '2px solid #E8DFD0'}}>
                {apartments.filter(a => a.city === city).map(apt => (
                  <div key={apt.id} className="rounded-xl px-4 py-3 mb-2 flex items-center gap-3" style={{backgroundColor: '#FDFAF4', border: '1px solid #E8DFD0'}}>
                    <p className="flex-1 text-sm font-medium" style={{color: '#3D2B1F'}}>{apt.name}</p>
                    <button
                      onClick={() => copyLink(apt.slug)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition"
                      style={copied === apt.slug
                        ? {border: '1px solid #8B6F4E', color: '#8B6F4E', backgroundColor: '#F5F0E8'}
                        : {border: '1px solid #D4C4B0', color: '#8B6F4E', backgroundColor: 'transparent'}}
                    >
                      {copied === apt.slug ? '✓ Copiato!' : 'Copia link'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
