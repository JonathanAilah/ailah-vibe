'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const scholarships = [
  {
    id: 'marcus',
    name: 'Marcus T.',
    age: 16,
    location: 'Atlanta, GA',
    avatar: 'M',
    avatarColor: 'bg-violet-accent/20 text-violet-accent border-violet-accent/50',
    goal: 'Build a community app for his neighborhood',
    story:
      'Marcus lives in a food desert and wants to build an app that connects neighbors with local farms and food banks. He has the idea, the drive, and the creativity — but no access to AI tools or mentorship. A scholarship gives him everything he needs to ship his first real app and compete in his first vibe-a-thon.',
    status: 'Applications Open',
    statusColor: 'text-success-green bg-success-green/10 border-success-green/30',
    raised: 240,
    goal_amount: 400,
    backers: 6,
    tag: 'Community Impact',
    tagColor: 'text-violet-accent bg-violet-accent/10 border-violet-accent/30',
  },
  {
    id: 'jasmine',
    name: 'Jasmine R.',
    age: 17,
    location: 'Detroit, MI',
    avatar: 'J',
    avatarColor: 'bg-orange-primary/20 text-orange-primary border-orange-primary/50',
    goal: 'Create a mental health app for teens',
    story:
      'Jasmine struggled with anxiety in middle school and found no apps that felt made for someone like her. She wants to build one. She\'s been doodling UI designs in her notebook for two years. With a scholarship, she\'ll get the AI tools and mentorship to turn those notebook sketches into a real, shipped product.',
    status: 'Fully Funded — Waitlist',
    statusColor: 'text-orange-primary bg-orange-primary/10 border-orange-primary/30',
    raised: 400,
    goal_amount: 400,
    backers: 11,
    tag: 'Mental Health',
    tagColor: 'text-orange-primary bg-orange-primary/10 border-orange-primary/30',
  },
  {
    id: 'devon',
    name: 'Devon W.',
    age: 15,
    location: 'Houston, TX',
    avatar: 'D',
    avatarColor: 'bg-success-green/20 text-success-green border-success-green/30',
    goal: 'Build an AI tutor for kids who can\'t afford one',
    story:
      'Devon is the youngest of four siblings. His parents work two jobs each. He taught himself math by watching YouTube videos and wants to build an AI tutoring app that helps other kids like him — kids who can\'t afford Kumon or private tutors. He needs this scholarship to get access to the premium AI tools to make it happen.',
    status: 'Applications Open',
    statusColor: 'text-success-green bg-success-green/10 border-success-green/30',
    raised: 100,
    goal_amount: 400,
    backers: 3,
    tag: 'Education',
    tagColor: 'text-success-green bg-success-green/10 border-success-green/30',
  },
]

const donationAmounts = [25, 50, 100, 200, 400]

function FundAScholarshipContent() {
  const searchParams = useSearchParams()
  const [selectedScholarship, setSelectedScholarship] = useState<string | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [donating, setDonating] = useState(false)
  const [donateError, setDonateError] = useState('')
  const [returnedStatus, setReturnedStatus] = useState<'success' | 'cancelled' | null>(null)
  const [returnedInfo, setReturnedInfo] = useState<{ amount?: string; scholarshipName?: string } | null>(null)

  const activeScholarship = scholarships.find((s) => s.id === selectedScholarship)
  const donationAmount = customAmount ? parseInt(customAmount) : selectedAmount

  // Detect return from Stripe Checkout
  useEffect(() => {
    const donationParam = searchParams.get('donation')
    if (donationParam === 'success' || donationParam === 'cancelled') {
      setReturnedStatus(donationParam)
      try {
        const saved = sessionStorage.getItem('vibeCoden_pending_donation')
        if (saved) {
          setReturnedInfo(JSON.parse(saved))
          sessionStorage.removeItem('vibeCoden_pending_donation')
        }
      } catch {
        // ignore
      }
    }
  }, [searchParams])

  const handleDonate = (scholarshipId: string) => {
    setSelectedScholarship(scholarshipId)
    setSelectedAmount(null)
    setCustomAmount('')
    setDonateError('')
    setShowModal(true)
  }

  const handleConfirmDonate = async () => {
    if (!donationAmount || donationAmount < 1) return
    setDonating(true)
    setDonateError('')

    try {
      // Save context so we can show a personalized message after returning from Stripe
      sessionStorage.setItem(
        'vibeCoden_pending_donation',
        JSON.stringify({ amount: donationAmount, scholarshipName: activeScholarship?.name })
      )

      const res = await fetch('/api/donations/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount,
          scholarshipId: selectedScholarship || 'general',
          scholarshipName: activeScholarship?.name,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        setDonateError(data.error || 'Something went wrong. Please try again.')
        setDonating(false)
        return
      }

      // Redirect to Stripe's secure checkout page
      window.location.href = data.url
    } catch {
      setDonateError('Something went wrong. Please try again.')
      setDonating(false)
    }
  }

  return (
    <div className="space-y-16">

      {/* Return-from-Stripe banner */}
      {returnedStatus === 'success' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8">
          <div className="card bg-gradient-hero p-8 sm:p-12 text-center space-y-4 border border-success-green/40">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Thank you so much!</h2>
            <p className="text-lavender-muted">
              Your {returnedInfo?.amount ? `$${returnedInfo.amount}` : ''} donation
              {returnedInfo?.scholarshipName ? ` to fund ${returnedInfo.scholarshipName}'s scholarship` : ' to our general fund'}{' '}
              is making a real difference. A receipt has been emailed to you by Stripe.
            </p>
            <button
              onClick={() => setReturnedStatus(null)}
              className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover"
            >
              DONE
            </button>
          </div>
        </section>
      )}

      {returnedStatus === 'cancelled' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8">
          <div className="card p-6 text-center space-y-2 border border-violet-border">
            <p className="text-lavender-muted text-sm">Your donation was cancelled — no charge was made.</p>
            <button
              onClick={() => setReturnedStatus(null)}
              className="text-xs font-mono text-lavender-dim hover:text-lavender transition-colors uppercase"
            >
              Dismiss
            </button>
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-20">
        <div className="card bg-gradient-hero p-8 sm:p-16 space-y-6 text-center">
          <p className="eyebrow">♥ FUND A SCHOLARSHIP</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-chakra font-bold text-white leading-tight">
            Change a Teen's Life.{' '}
            <span className="text-orange-primary">For $400.</span>
          </h1>
          <p className="text-base sm:text-lg text-lavender-muted max-w-2xl mx-auto">
            Every scholarship covers one student's full access to AI tools, mentorship, and vibe-a-thon entry.
            Pick a student below and fund their journey. 100% of your donation goes directly to them.
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto pt-4">
            <div>
              <p className="text-3xl font-chakra font-bold text-white">214</p>
              <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Funded So Far</p>
            </div>
            <div>
              <p className="text-3xl font-chakra font-bold text-orange-primary">$400</p>
              <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Per Student</p>
            </div>
            <div>
              <p className="text-3xl font-chakra font-bold text-white">100%</p>
              <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Goes to Student</p>
            </div>
          </div>
        </div>
      </section>

      {/* What your donation covers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="mb-8">
          <p className="eyebrow mb-3">// WHAT YOUR DONATION COVERS</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">
            Every dollar goes to the student
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { amount: '$25', label: 'Funds one week of AI tools', icon: '🛠️' },
            { amount: '$100', label: 'Covers a month of mentorship', icon: '🎓' },
            { amount: '$200', label: 'Pays for vibe-a-thon entry + tools', icon: '🏆' },
            { amount: '$400', label: 'Fully funds one complete scholarship', icon: '⭐' },
          ].map((item) => (
            <div key={item.amount} className="card p-6 text-center space-y-3">
              <div className="text-3xl">{item.icon}</div>
              <p className="text-2xl font-chakra font-bold text-orange-primary">{item.amount}</p>
              <p className="text-sm text-lavender-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scholarship Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="mb-8">
          <p className="eyebrow mb-3">// CHOOSE A STUDENT TO FUND</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">
            Meet the builders
          </h2>
          <p className="text-lavender-muted mt-2">
            Real students. Real goals. Your donation makes it happen.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {scholarships.map((s) => {
            const progress = Math.round((s.raised / s.goal_amount) * 100)
            const isFull = s.raised >= s.goal_amount

            return (
              <div key={s.id} className="card p-8 space-y-6 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-sm border flex items-center justify-center text-2xl font-chakra font-bold ${s.avatarColor}`}>
                      {s.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-chakra font-bold text-white">{s.name}</h3>
                      <p className="font-mono text-xs text-lavender-dim">
                        Age {s.age} · {s.location}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-mono border ${s.tagColor}`}>
                    {s.tag}
                  </span>
                </div>

                <span className={`inline-block text-xs px-3 py-1 rounded-full font-mono border w-fit ${s.statusColor}`}>
                  ● {s.status}
                </span>

                <div>
                  <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mb-1">Goal</p>
                  <p className="text-white font-chakra font-bold">{s.goal}</p>
                </div>

                <p className="text-lavender-muted text-sm leading-relaxed flex-1">
                  {s.story}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-lavender-muted font-mono">${s.raised} raised</span>
                    <span className="text-orange-primary font-mono font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-panel-deep rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-accent h-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-lavender-dim font-mono">
                    <span>{s.backers} backers</span>
                    <span>Goal: ${s.goal_amount}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDonate(s.id)}
                  className={`w-full px-6 py-3 rounded-sm font-chakra font-bold text-sm uppercase transition-all hover:-translate-y-0.5 ${
                    isFull
                      ? 'bg-panel-raised text-lavender-muted border border-violet-border cursor-pointer hover:bg-surface-violet'
                      : 'bg-orange-primary text-ink hover:shadow-orange-glow-hover'
                  }`}
                >
                  {isFull ? 'JOIN WAITLIST →' : '♥ FUND THIS SCHOLARSHIP →'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* General donation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="card bg-gradient-hero p-8 sm:p-12 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="eyebrow">// GENERAL FUND</p>
            <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">
              Don't see the right student?
            </h2>
            <p className="text-lavender-muted">
              Donate to our general scholarship fund and we'll match your gift to the next eligible student. Every dollar goes to a teen who needs it.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setSelectedScholarship(null)
                setSelectedAmount(null)
                setCustomAmount('')
                setDonateError('')
                setShowModal(true)
              }}
              className="w-full px-6 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
            >
              ♥ DONATE TO GENERAL FUND →
            </button>
            <p className="text-xs text-lavender-dim text-center font-mono">
              Tax deductible · 501(c)(3) nonprofit · EIN: XX-XXXXXXX
            </p>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-8">
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet"
        >
          ← BACK TO HOME
        </Link>
      </div>

      {/* Donation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(10,6,17,0.92)' }}
          onClick={(e) => { if (e.target === e.currentTarget && !donating) setShowModal(false) }}
        >
          <div className="card w-full max-w-md p-8 space-y-6 relative">

            {!donating && (
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-lavender-dim hover:text-lavender transition-colors font-mono text-lg"
              >
                ✕
              </button>
            )}

            <div>
              <p className="eyebrow mb-2">♥ FUND A SCHOLARSHIP</p>
              <h3 className="text-xl font-chakra font-bold text-white">
                {activeScholarship
                  ? `Fund ${activeScholarship.name}'s Scholarship`
                  : 'Donate to General Fund'}
              </h3>
              {activeScholarship && (
                <p className="text-sm text-lavender-muted mt-1">{activeScholarship.goal}</p>
              )}
            </div>

            {/* Amount selector */}
            <div className="space-y-3">
              <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest">
                Choose an amount
              </p>
              <div className="grid grid-cols-3 gap-2">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => { setSelectedAmount(amount); setCustomAmount('') }}
                    className={`py-3 rounded-sm font-chakra font-bold text-sm transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'bg-orange-primary text-ink'
                        : 'bg-panel-deep border border-violet-border text-lavender-muted hover:border-violet-accent'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
                <div className={`col-span-3 rounded-sm border transition-all ${customAmount ? 'border-orange-primary' : 'border-violet-border'}`}>
                  <input
                    type="number"
                    placeholder="Custom amount ($)"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
                    className="w-full bg-transparent px-4 py-3 font-mono text-sm text-lavender outline-none placeholder-lavender-dim"
                  />
                </div>
              </div>
            </div>

            {donateError && (
              <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">⚠ {donateError}</p>
            )}

            <button
              onClick={handleConfirmDonate}
              disabled={!donationAmount || donationAmount < 1 || donating}
              className={`w-full px-6 py-4 rounded-sm font-chakra font-bold text-sm uppercase transition-all ${
                donationAmount && donationAmount >= 1 && !donating
                  ? 'bg-orange-primary text-ink hover:shadow-orange-glow-hover hover:-translate-y-0.5'
                  : 'bg-panel-raised text-lavender-dim cursor-not-allowed'
              }`}
            >
              {donating
                ? 'REDIRECTING TO SECURE CHECKOUT...'
                : donationAmount && donationAmount >= 1
                  ? `♥ DONATE $${donationAmount}`
                  : '♥ SELECT AN AMOUNT'}
            </button>

            <p className="text-xs text-lavender-dim text-center font-mono">
              🔒 Secure payment via Stripe · Tax deductible · 501(c)(3)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FundAScholarship() {
  return (
    <Suspense fallback={null}>
      <FundAScholarshipContent />
    </Suspense>
  )
}
