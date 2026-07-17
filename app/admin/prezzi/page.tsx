'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CASE } from '@/lib/case-prezzi'

/*
 * Calendario prezzi — pannello di Linda.
 *
 * Per ora salva sul dispositivo (localStorage), così la schermata è già
 * cliccabile e valutabile. Quando il progetto Supabase sarà collegato, cambia
 * solo COME si legge e si salva (le due funzioni carica()/salva() qui sotto):
 * l'interfaccia resta identica.
 *
 * Modello semplice: un PREZZO BASE a notte per casa, più i periodi speciali
 * (Ferragosto, Capodanno...) impostati toccando le date sul calendario.
 */

const MESI = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
const GIORNI = ['L','M','M','G','V','S','D']

type DatiCasa = { base: number | null; giorni: Record<string, number> }
type Tutti = Record<string, DatiCasa>

const COL = {
  sfondo: '#F5F0E8', card: '#FDFAF4', bordo: '#E8DFD0', bordoForte: '#D4C4B0',
  testo: '#3D2B1F', marrone: '#8B6F4E', tenue: '#A08060',
}

function chiave(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// --- salvataggio: oggi localStorage, domani Supabase (stessa firma) ---
function carica(): Tutti {
  try { return JSON.parse(localStorage.getItem('prezzi_linda') || '{}') } catch { return {} }
}
function salva(dati: Tutti) {
  localStorage.setItem('prezzi_linda', JSON.stringify(dati))
}

export default function PaginaPrezzi() {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [tutti, setTutti] = useState<Tutti>({})
  const [mese, setMese] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [selA, setSelA] = useState<string | null>(null)
  const [selB, setSelB] = useState<string | null>(null)
  const [prezzoPeriodo, setPrezzoPeriodo] = useState('')
  const [salvato, setSalvato] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('linda_auth') !== '1') { router.push('/admin'); return }
    setTutti(carica())
  }, [])

  const casa = CASE.find(c => c.slug === slug)
  const dati = tutti[slug] ?? { base: null, giorni: {} }

  const cittaOrdinate = useMemo(() => [...new Set(CASE.map(c => c.citta))], [])

  function aggiorna(nuovi: DatiCasa) {
    const agg = { ...tutti, [slug]: nuovi }
    setTutti(agg); salva(agg)
    setSalvato(true); setTimeout(() => setSalvato(false), 1500)
  }

  function impostaBase(v: string) {
    const n = v.replace(/[^\d]/g, '')
    aggiorna({ ...dati, base: n ? Number(n) : null })
  }

  function toccaGiorno(k: string) {
    if (!selA || (selA && selB)) { setSelA(k); setSelB(null); setPrezzoPeriodo('') }
    else if (k >= selA) setSelB(k)
    else { setSelA(k); setSelB(null) }
  }

  function applicaPeriodo() {
    if (!selA) return
    const fine = selB ?? selA
    const giorni = { ...dati.giorni }
    const d = new Date(selA); const f = new Date(fine)
    for (let x = new Date(d); x <= f; x.setDate(x.getDate() + 1)) {
      const k = chiave(x)
      if (prezzoPeriodo) giorni[k] = Number(prezzoPeriodo.replace(/[^\d]/g, ''))
      else delete giorni[k] // vuoto = torna al prezzo base
    }
    aggiorna({ ...dati, giorni })
    setSelA(null); setSelB(null); setPrezzoPeriodo('')
  }

  const anno = mese.getFullYear(); const m = mese.getMonth()
  const primo = (new Date(anno, m, 1).getDay() + 6) % 7
  const giorniMese = new Date(anno, m + 1, 0).getDate()
  const oggi = new Date(); oggi.setHours(0, 0, 0, 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: COL.sfondo }}>
      <div className="border-b px-6 py-3 flex items-center justify-between" style={{ backgroundColor: COL.card, borderColor: COL.bordo }}>
        <img src="/logo.webp" alt="Linda Affitti Brevi" className="h-10" />
        <button onClick={() => router.push('/admin/dashboard')} className="text-sm hover:opacity-70 transition" style={{ color: COL.marrone }}>← Indietro</button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: COL.tenue }}>Prezzi</p>
        <h1 className="text-2xl font-semibold mb-4" style={{ color: COL.testo }}>Calendario dei prezzi</h1>

        {/* avviso: la schermata è pronta ma non ancora collegata al sito */}
        <div className="rounded-2xl px-4 py-3 mb-5 flex items-start gap-3" style={{ backgroundColor: '#FBF3E2', border: '1px solid #E8D9B8' }}>
          <span className="text-lg leading-none">⚠️</span>
          <p className="text-xs leading-relaxed" style={{ color: '#8A6D2F' }}>
            <strong>Anteprima.</strong> Puoi provare a impostare i prezzi, ma non
            sono ancora collegati al sito: verranno attivati a breve. Per ora è
            solo per vedere come funziona.
          </p>
        </div>

        {/* scelta casa */}
        <select
          value={slug}
          onChange={e => { setSlug(e.target.value); setSelA(null); setSelB(null) }}
          className="w-full rounded-2xl px-5 py-4 text-sm mb-5 outline-none"
          style={{ backgroundColor: COL.card, border: `1px solid ${COL.bordo}`, color: COL.testo }}
        >
          <option value="">Scegli una casa…</option>
          {cittaOrdinate.map(citta => (
            <optgroup key={citta} label={citta}>
              {CASE.filter(c => c.citta === citta).map(c => (
                <option key={c.slug} value={c.slug}>{c.nome}</option>
              ))}
            </optgroup>
          ))}
        </select>

        {casa && (
          <>
            {/* prezzo base */}
            <div className="rounded-2xl px-5 py-4 mb-4 flex items-center justify-between gap-4" style={{ backgroundColor: COL.card, border: `1px solid ${COL.bordo}` }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: COL.testo }}>Prezzo base a notte</p>
                <p className="text-xs mt-0.5" style={{ color: COL.tenue }}>Vale tutti i giorni, salvo i periodi speciali</p>
              </div>
              <div className="flex items-center gap-1" style={{ color: COL.testo }}>
                <input
                  inputMode="numeric"
                  value={dati.base ?? ''}
                  onChange={e => impostaBase(e.target.value)}
                  placeholder="—"
                  className="w-20 rounded-xl px-3 py-2 text-right text-lg font-semibold outline-none"
                  style={{ backgroundColor: COL.sfondo, border: `1px solid ${COL.bordoForte}`, color: COL.testo }}
                />
                <span className="text-lg font-semibold">€</span>
              </div>
            </div>

            {/* calendario */}
            <div className="rounded-2xl px-4 py-5 mb-4" style={{ backgroundColor: COL.card, border: `1px solid ${COL.bordo}` }}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setMese(new Date(anno, m - 1, 1))}
                  disabled={new Date(anno, m, 1) <= new Date(oggi.getFullYear(), oggi.getMonth(), 1)}
                  className="h-9 w-9 rounded-full flex items-center justify-center disabled:opacity-30"
                  style={{ border: `1px solid ${COL.bordoForte}`, color: COL.marrone }}>←</button>
                <p className="font-semibold" style={{ color: COL.testo }}>{MESI[m]} {anno}</p>
                <button onClick={() => setMese(new Date(anno, m + 1, 1))}
                  className="h-9 w-9 rounded-full flex items-center justify-center"
                  style={{ border: `1px solid ${COL.bordoForte}`, color: COL.marrone }}>→</button>
              </div>
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {GIORNI.map((g, i) => <span key={i} className="pb-2 text-xs font-semibold" style={{ color: COL.tenue }}>{g}</span>)}
                {Array.from({ length: primo }).map((_, i) => <span key={`v${i}`} />)}
                {Array.from({ length: giorniMese }).map((_, i) => {
                  const data = new Date(anno, m, i + 1); const k = chiave(data)
                  const passato = data < oggi
                  const prezzo = dati.giorni[k] ?? dati.base
                  const eccezione = dati.giorni[k] != null
                  const inSel = selA && ((selB && k >= selA && k <= selB) || k === selA)
                  return (
                    <button key={k} disabled={passato} onClick={() => toccaGiorno(k)}
                      className="mx-auto flex h-11 w-11 flex-col items-center justify-center rounded-xl text-sm leading-none disabled:opacity-25"
                      style={{
                        backgroundColor: inSel ? COL.marrone : eccezione ? '#F0E6D6' : 'transparent',
                        color: inSel ? '#fff' : COL.testo,
                        border: eccezione && !inSel ? `1px solid ${COL.bordoForte}` : '1px solid transparent',
                      }}>
                      <span className={eccezione ? 'font-bold' : ''}>{i + 1}</span>
                      {prezzo != null && <span className="mt-0.5 text-[0.55rem]" style={{ color: inSel ? 'rgba(255,255,255,0.85)' : COL.tenue }}>{prezzo}</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* barra periodo selezionato */}
            {selA && (
              <div className="rounded-2xl px-5 py-4 mb-4 flex flex-wrap items-center gap-3" style={{ backgroundColor: COL.card, border: `1px solid ${COL.marrone}` }}>
                <p className="text-sm flex-1" style={{ color: COL.testo }}>
                  {selB && selB !== selA
                    ? `Dal ${selA.split('-').reverse().join('/')} al ${selB.split('-').reverse().join('/')}`
                    : `Giorno ${selA.split('-').reverse().join('/')}`}
                </p>
                <div className="flex items-center gap-1">
                  <input inputMode="numeric" value={prezzoPeriodo} onChange={e => setPrezzoPeriodo(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="prezzo" className="w-24 rounded-xl px-3 py-2 text-right outline-none"
                    style={{ backgroundColor: COL.sfondo, border: `1px solid ${COL.bordoForte}`, color: COL.testo }} />
                  <span style={{ color: COL.testo }}>€</span>
                </div>
                <button onClick={applicaPeriodo} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: COL.marrone, color: '#fff' }}>
                  {prezzoPeriodo ? 'Applica' : 'Azzera'}
                </button>
              </div>
            )}

            <p className="text-xs text-center" style={{ color: COL.tenue }}>
              {salvato ? '✓ Salvato' : 'Tocca un giorno, o trascina su un periodo, per dargli un prezzo diverso'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
