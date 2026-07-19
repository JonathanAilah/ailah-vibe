'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Settings {
  goal_amount: number
  offline_raised: number
  cohort_spots_total: number
  cohort_spots_funded: number
  students_floor: number
  projects_shipped_floor: number
  prizes_awarded_floor: number
  scholarships_awarded_floor: number
  updated_at: string
}

export default function AdminFund() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [goalAmount, setGoalAmount] = useState('')
  const [offlineRaised, setOfflineRaised] = useState('')
  const [cohortSpotsTotal, setCohortSpotsTotal] = useState('')
  const [cohortSpotsFunded, setCohortSpotsFunded] = useState('')
  const [studentsFloor, setStudentsFloor] = useState('')
  const [projectsShippedFloor, setProjectsShippedFloor] = useState('')
  const [prizesAwardedFloor, setPrizesAwardedFloor] = useState('')
  const [scholarshipsAwardedFloor, setScholarshipsAwardedFloor] = useState('')

  const [stripeTotal, setStripeTotal] = useState(0)
  const [stripeCount, setStripeCount] = useState(0)
  const [updatedAt, setUpdatedAt] = useState('')

  useEffect(() => {
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) { router.push('/admin/login'); return }

    fetch('/api/admin/fund', { headers: { 'x-admin-key': key } })
      .then(async (res) => {
        if (res.status === 401) {
          sessionStorage.removeItem('vibeCoden_admin_key')
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        const s: Settings | null = data.settings
        if (s) {
          setGoalAmount(String(s.goal_amount))
          setOfflineRaised(String(s.offline_raised))
          setCohortSpotsTotal(String(s.cohort_spots_total))
          setCohortSpotsFunded(String(s.cohort_spots_funded))
          setStudentsFloor(String(s.students_floor ?? 0))
          setProjectsShippedFloor(String(s.projects_shipped_floor ?? 0))
          setPrizesAwardedFloor(String(s.prizes_awarded_floor ?? 0))
          setScholarshipsAwardedFloor(String(s.scholarships_awarded_floor ?? 0))
          setUpdatedAt(s.updated_at)
        }
        setStripeTotal(data.stripeTotal || 0)
        setStripeCount(data.stripeCount || 0)
      })
      .catch(() => setError('Failed to load fund settings.'))
      .finally(() => setLoading(false))
  }, [router])

  const handleSave = async () => {
    setError('')
    setSuccess(false)
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) return

    const goal = parseInt(goalAmount)
    const offline = parseInt(offlineRaised)
    const totalSpots = parseInt(cohortSpotsTotal)
    const fundedSpots = parseInt(cohortSpotsFunded)
    const sFloor = parseInt(studentsFloor)
    const pFloor = parseInt(projectsShippedFloor)
    const przFloor = parseInt(prizesAwardedFloor)
    const schFloor = parseInt(scholarshipsAwardedFloor)

    if (isNaN(goal) || goal < 0) return setError('Goal amount must be a positive number.')
    if (isNaN(offline) || offline < 0) return setError('Offline donations must be a positive number.')
    if (isNaN(totalSpots) || totalSpots < 0) return setError('Total spots must be a positive number.')
    if (isNaN(fundedSpots) || fundedSpots < 0) return setError('Funded spots must be a positive number.')
    if (fundedSpots > totalSpots) return setError('Funded spots can\u2019t exceed total spots.')
    if (isNaN(sFloor) || sFloor < 0) return setError('Students display floor must be a positive number.')
    if (isNaN(pFloor) || pFloor < 0) return setError('Projects display floor must be a positive number.')
    if (isNaN(przFloor) || przFloor < 0) return setError('Prizes display floor must be a positive number.')
    if (isNaN(schFloor) || schFloor < 0) return setError('Scholarships display floor must be a positive number.')

    setSaving(true)
    try {
      const res = await fetch('/api/admin/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({
          goalAmount: goal,
          offlineRaised: offline,
          cohortSpotsTotal: totalSpots,
          cohortSpotsFunded: fundedSpots,
          studentsFloor: sFloor,
          projectsShippedFloor: pFloor,
          prizesAwardedFloor: przFloor,
          scholarshipsAwardedFloor: schFloor,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setUpdatedAt(new Date().toISOString())
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSaving(false)
  }

  const totalRaised = (parseInt(offlineRaised) || 0) + stripeTotal
  const goal = parseInt(goalAmount) || 0
  const percentage = goal > 0 ? Math.min(100, Math.round((totalRaised / goal) * 100)) : 0
  const spotsLeft = Math.max(0, (parseInt(cohortSpotsTotal) || 0) - (parseInt(cohortSpotsFunded) || 0))

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-16 py-12 space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex gap-4 items-center">
          <Link href="/" className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors">← BACK TO SITE</Link>
          <span className="font-mono text-xs text-lavender-dim">·</span>
          <Link href="/admin" className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors">BACK TO OVERVIEW</Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-chakra font-bold text-white mt-2">Scholarship Fund</h1>
        <p className="text-sm text-lavender-muted mt-2">These numbers control what shows in the "Live Scholarship Fund" card on the home page.</p>
      </div>

      {loading ? (
        <p className="text-lavender-muted font-mono text-sm">Loading...</p>
      ) : (
        <>
          {/* Live preview card */}
          <div className="card bg-gradient-hero p-6 border border-orange-border">
            <p className="font-mono text-xs tracking-[1.5px] text-orange-primary mb-3">// LIVE PREVIEW</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-chakra font-bold text-4xl text-white leading-none">
                ${totalRaised.toLocaleString()}
              </span>
              <span className="font-mono text-sm text-lavender-dim">raised of ${goal.toLocaleString()} goal</span>
            </div>
            <div className="h-3 rounded-full bg-panel-deep overflow-hidden mb-2">
              <div className="h-full rounded-full bg-gradient-accent transition-all duration-500" style={{ width: `${percentage}%` }} />
            </div>
            <p className="font-mono text-[11px] text-lavender-dim">{percentage}% funded · {spotsLeft} scholarship spots left this cohort</p>
          </div>

          {/* Editing form */}
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-chakra font-bold text-white">Edit Fund Settings</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Fundraising Goal ($)</label>
                <input
                  type="number" min="0"
                  value={goalAmount} onChange={(e) => { setGoalAmount(e.target.value); setSuccess(false) }}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
                />
                <p className="text-xs text-lavender-dim">Total amount you\u2019re trying to raise (e.g. 20000)</p>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Offline Donations ($)</label>
                <input
                  type="number" min="0"
                  value={offlineRaised} onChange={(e) => { setOfflineRaised(e.target.value); setSuccess(false) }}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
                />
                <p className="text-xs text-lavender-dim">Checks, wire transfers, matching gifts \u2014 anything received outside Stripe</p>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Total Cohort Spots</label>
                <input
                  type="number" min="0"
                  value={cohortSpotsTotal} onChange={(e) => { setCohortSpotsTotal(e.target.value); setSuccess(false) }}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
                />
                <p className="text-xs text-lavender-dim">How many scholarships you\u2019re offering this cohort</p>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Spots Funded So Far</label>
                <input
                  type="number" min="0"
                  value={cohortSpotsFunded} onChange={(e) => { setCohortSpotsFunded(e.target.value); setSuccess(false) }}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
                />
                <p className="text-xs text-lavender-dim">How many scholarships have been fully funded</p>
              </div>
            </div>

            {/* Impact Stats Floors */}
            <div className="pt-2 border-t border-violet-border/40">
              <div className="pt-4">
                <h3 className="font-chakra font-bold text-white mb-1">Impact Stats — display floors</h3>
                <p className="text-sm text-lavender-muted mb-4">
                  These are the baseline numbers shown on the home page and vibe-a-thons page. Real activity from the database will automatically override any floor once it exceeds these numbers.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Students (Beginners Empowered)</label>
                  <input
                    type="number" min="0"
                    value={studentsFloor} onChange={(e) => { setStudentsFloor(e.target.value); setSuccess(false) }}
                    className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
                  />
                  <p className="text-xs text-lavender-dim">Baseline count including off-platform impact</p>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Projects Shipped</label>
                  <input
                    type="number" min="0"
                    value={projectsShippedFloor} onChange={(e) => { setProjectsShippedFloor(e.target.value); setSuccess(false) }}
                    className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
                  />
                  <p className="text-xs text-lavender-dim">Baseline count of projects ever built</p>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Prizes Awarded ($)</label>
                  <input
                    type="number" min="0"
                    value={prizesAwardedFloor} onChange={(e) => { setPrizesAwardedFloor(e.target.value); setSuccess(false) }}
                    className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
                  />
                  <p className="text-xs text-lavender-dim">Total prize money ever awarded to students</p>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Scholarships Awarded</label>
                  <input
                    type="number" min="0"
                    value={scholarshipsAwardedFloor} onChange={(e) => { setScholarshipsAwardedFloor(e.target.value); setSuccess(false) }}
                    className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
                  />
                  <p className="text-xs text-lavender-dim">Total scholarships ever awarded</p>
                </div>
              </div>
            </div>

            {/* Stripe status */}
            <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30">
              <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mb-2">Stripe donations (auto)</p>
              <p className="text-white font-chakra">
                ${stripeTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                <span className="text-sm text-lavender-muted font-mono ml-2">from {stripeCount} donation{stripeCount === 1 ? '' : 's'}</span>
              </p>
              <p className="text-xs text-lavender-dim mt-1">
                {stripeCount === 0
                  ? 'Stripe isn\u2019t connected yet, so this is $0. Once Stripe is live, real donations will automatically be added to your total.'
                  : 'This gets automatically added to your offline donations to calculate the total raised.'}
              </p>
            </div>

            {error && <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">⚠ {error}</p>}
            {success && <p className="text-success-green font-mono text-xs bg-success-green/10 border border-success-green/30 rounded p-3">✓ Saved. The home page will show the new numbers within a few seconds.</p>}

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-lavender-dim font-mono">
                {updatedAt ? `Last updated: ${new Date(updatedAt).toLocaleString()}` : ''}
              </p>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover disabled:opacity-60"
              >
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
