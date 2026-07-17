'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VibeAgent } from '@/components/VibeAgent'
import { useAppContext } from '@/app/context'

const quizQuestions = [
  {
    id: 1,
    question: 'What does "visual hierarchy" mean in UI design?',
    options: [
      'Making everything the same size so it looks balanced',
      'Organizing elements so the most important things are most noticeable',
      'Using as many colors as possible',
      'Making the navigation menu the biggest element',
    ],
    correct: 1,
    explanation: 'Visual hierarchy guides the user\'s eye to what matters most. Big, bold headings draw attention first. Supporting text is smaller. Buttons are colored. This tells users where to look and what to do — without them having to think about it.',
  },
  {
    id: 2,
    question: 'Which color palette approach is easiest for beginners?',
    options: [
      'Use every color you like — more is more',
      'Only use black and white — colors are too risky',
      'Pick one main color, one accent color, and neutrals for backgrounds',
      'Copy the exact colors from your favorite website pixel by pixel',
    ],
    correct: 2,
    explanation: 'One main color + one accent + neutrals is the 60-30-10 rule. 60% neutral (background), 30% main color (cards, sections), 10% accent (buttons, highlights). This formula works for almost every app and is hard to mess up.',
  },
  {
    id: 3,
    question: 'What is "white space" and why does it matter?',
    options: [
      'Literally white colored space — only useful for light mode apps',
      'Empty space around elements that makes designs feel less crowded and easier to read',
      'A bug where elements disappear',
      'The background color of the page',
    ],
    correct: 1,
    explanation: 'White space (also called negative space) is the breathing room between elements. Without it, designs feel cramped and overwhelming. With it, designs feel clean and professional. More white space almost always makes a design look better.',
  },
  {
    id: 4,
    question: 'How should you describe design changes to AI?',
    options: [
      '"Make it look better"',
      '"Change the font to something cool"',
      '"Make the heading 48px, bold, white, and add 24px of space below it"',
      '"I don\'t like the design, redo it"',
    ],
    correct: 2,
    explanation: 'Specific design prompts get specific results. Measurements (px, rem), exact colors (hex codes or names), font weights, spacing values — the more specific you are, the closer the AI gets to your vision on the first try.',
  },
]

export default function Lesson3() {
  const { awardXP, isLoggedIn } = useAppContext()
  const [currentTab, setCurrentTab] = useState<'learn' | 'quiz'>('learn')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowExplanation(true)
    const correct = index === quizQuestions[currentQuestion].correct
    if (correct) setScore((s) => s + 1)
    setAnswers((prev) => [...prev, correct])
  }

  const handleNext = () => {
    if (currentQuestion + 1 >= quizQuestions.length) {
      setQuizComplete(true)
      awardXP(score * 31)
    } else {
      setCurrentQuestion((q) => q + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const q = quizQuestions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-12 pb-32">

      {/* Header */}
      <div className="space-y-4">
        <Link href="/learn/lesson-2" className="text-lavender-dim hover:text-lavender font-mono text-sm transition-colors">
          ← BACK TO LESSON 2
        </Link>
        <div className="card bg-gradient-hero p-8 sm:p-12 space-y-4">
          <p className="eyebrow">COURSE 1 · LESSON 3 OF 5</p>
          <h1 className="text-3xl sm:text-5xl font-chakra font-bold text-white">
            Make It Look Good
          </h1>
          <p className="text-base text-lavender-muted max-w-xl">
            Your app works. Now make it beautiful. Learn the design fundamentals that separate amateur projects from ones people actually want to use.
          </p>
          <div className="flex gap-6 pt-2">
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">4</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">Concepts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">~12</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">Min</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">+125</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-violet-border pb-0">
        {(['learn', 'quiz'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (tab === 'quiz' && !isLoggedIn) { window.location.href = '/login'; return }
              setCurrentTab(tab)
            }}
            className={`px-6 py-3 font-chakra font-bold text-sm uppercase transition-all border-b-2 ${
              currentTab === tab
                ? 'text-orange-primary border-orange-primary'
                : 'text-lavender-muted border-transparent hover:text-lavender'
            }`}
          >
            {tab === 'learn' ? '📖 LEARN' : '🧠 QUIZ'}
          </button>
        ))}
      </div>

      {/* LEARN TAB */}
      {currentTab === 'learn' && (
        <div className="space-y-12">

          {/* Concept 1 - Visual Hierarchy */}
          <section className="space-y-6">
            <div>
              <p className="eyebrow mb-3">// CONCEPT 1</p>
              <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Visual Hierarchy</h2>
            </div>
            <p className="text-lavender-muted leading-relaxed">
              Visual hierarchy is the most important design concept you'll ever learn. It answers one question: <span className="text-white font-bold">where should the user look first?</span>
            </p>
            <p className="text-lavender-muted leading-relaxed">
              Great design guides the eye. The heading is big and bold. The subheading is smaller. The body text is even smaller. The button is brightly colored. Users don't have to think — they just know what to do.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="card border border-red-500/30 p-6 space-y-3">
                <p className="font-mono text-xs text-red-400 uppercase tracking-widest">❌ No hierarchy</p>
                <div className="bg-panel-deep rounded p-4 space-y-2">
                  <p className="text-lavender text-sm">Welcome to my app</p>
                  <p className="text-lavender text-sm">This app helps you track quotes</p>
                  <p className="text-lavender text-sm">Click here to add a quote</p>
                </div>
                <p className="text-xs text-lavender-dim">Everything looks the same. Where do you click?</p>
              </div>
              <div className="card border border-success-green/30 p-6 space-y-3">
                <p className="font-mono text-xs text-success-green uppercase tracking-widest">✓ Clear hierarchy</p>
                <div className="bg-panel-deep rounded p-4 space-y-2">
                  <p className="text-white font-chakra font-bold text-xl">Quote Board</p>
                  <p className="text-lavender-muted text-sm">Save your favorite quotes</p>
                  <div className="bg-orange-primary text-ink text-xs font-bold px-3 py-1.5 rounded inline-block">+ ADD QUOTE</div>
                </div>
                <p className="text-xs text-lavender-dim">Eyes go: Title → Description → Button. Clear!</p>
              </div>
            </div>

            <div className="card p-6 bg-violet-accent/5 border border-violet-accent/30">
              <p className="font-mono text-xs text-violet-accent uppercase tracking-widest mb-2">// PROMPT TO TRY</p>
              <p className="font-mono text-sm text-lavender-dim">
                "Redesign the layout with clear visual hierarchy. The app title should be the largest element. Below it, a subtitle in smaller text. Then a prominent, colored call-to-action button. Everything else should be secondary."
              </p>
            </div>
          </section>

          {/* Concept 2 - Color */}
          <section className="space-y-6">
            <div>
              <p className="eyebrow mb-3">// CONCEPT 2</p>
              <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Color That Works</h2>
            </div>
            <p className="text-lavender-muted leading-relaxed">
              You don't need to be a color theorist. You need the <span className="text-white font-bold">60-30-10 rule</span>:
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { pct: '60%', name: 'Neutral', desc: 'Background, cards', color: 'bg-panel-raised border-violet-border', text: 'text-lavender-dim' },
                { pct: '30%', name: 'Main Color', desc: 'Sections, headers', color: 'bg-violet-accent/20 border-violet-accent/50', text: 'text-violet-accent' },
                { pct: '10%', name: 'Accent', desc: 'Buttons, highlights', color: 'bg-orange-primary/20 border-orange-primary/50', text: 'text-orange-primary' },
              ].map((item) => (
                <div key={item.pct} className={`card border p-6 text-center space-y-2 ${item.color}`}>
                  <p className={`text-3xl font-chakra font-bold ${item.text}`}>{item.pct}</p>
                  <p className="font-chakra font-bold text-white text-sm">{item.name}</p>
                  <p className="text-xs text-lavender-dim">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="card p-6 space-y-4">
              <p className="font-mono text-xs text-violet-accent uppercase tracking-widest">// GREAT COLOR COMBOS FOR DARK APPS</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { name: 'Purple + Orange', colors: ['#8B5CF6', '#FF8A21', '#0A0611'] },
                  { name: 'Blue + Green', colors: ['#3B82F6', '#10B981', '#0F172A'] },
                  { name: 'Pink + Yellow', colors: ['#EC4899', '#F59E0B', '#1A0A2E'] },
                ].map((combo) => (
                  <div key={combo.name} className="bg-panel-deep rounded p-4 space-y-3">
                    <p className="font-mono text-xs text-lavender-dim">{combo.name}</p>
                    <div className="flex gap-2">
                      {combo.colors.map((color) => (
                        <div key={color} className="flex-1 h-8 rounded" style={{ background: color, border: '1px solid rgba(255,255,255,0.1)' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Concept 3 - Typography */}
          <section className="space-y-6">
            <div>
              <p className="eyebrow mb-3">// CONCEPT 3</p>
              <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Typography Rules</h2>
            </div>
            <p className="text-lavender-muted leading-relaxed">
              Typography is how you choose and style fonts. You only need three rules to make your text look great:
            </p>

            <div className="space-y-4">
              {[
                {
                  rule: 'Rule 1: Max 2 fonts',
                  desc: 'One font for headings (bold, personality). One font for body text (easy to read). Never more than two — it looks chaotic.',
                  example: 'Headings: Chakra Petch, Space Grotesk, or Orbitron\nBody: Inter, DM Sans, or Nunito',
                },
                {
                  rule: 'Rule 2: Size contrast',
                  desc: 'Make your heading noticeably bigger than your body text. A good ratio: heading 2-3x bigger than body. If they\'re too close in size, neither stands out.',
                  example: 'Heading: 48px bold\nSubheading: 24px medium\nBody: 16px regular',
                },
                {
                  rule: 'Rule 3: Line height matters',
                  desc: 'Line height (space between lines of text) should be 1.5x the font size for body text. Tight text is hard to read. Give it room to breathe.',
                  example: 'font-size: 16px → line-height: 24px (1.5x)\nfont-size: 18px → line-height: 28px (1.5x)',
                },
              ].map((item) => (
                <div key={item.rule} className="card p-6 space-y-3">
                  <h3 className="font-chakra font-bold text-white">{item.rule}</h3>
                  <p className="text-lavender-muted text-sm leading-relaxed">{item.desc}</p>
                  <div className="bg-panel-deep rounded p-4 border border-violet-border">
                    <pre className="font-mono text-xs text-lavender-dim whitespace-pre-wrap">{item.example}</pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Concept 4 - Spacing */}
          <section className="space-y-6">
            <div>
              <p className="eyebrow mb-3">// CONCEPT 4</p>
              <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Spacing & White Space</h2>
            </div>
            <p className="text-lavender-muted leading-relaxed">
              If your design looks cramped or overwhelming, add more white space. It's almost never the wrong call. White space makes your design feel more premium, easier to scan, and less stressful.
            </p>

            <div className="card border-l-4 border-orange-primary p-6 bg-orange-primary/5">
              <p className="font-mono text-xs text-orange-primary uppercase tracking-widest mb-2">// THE GOLDEN RULE</p>
              <p className="text-white font-chakra font-bold text-lg">
                "When in doubt, add more padding."
              </p>
              <p className="text-lavender-muted text-sm mt-2">
                Most beginner designs are too cramped. Professional designers always use more space than feels comfortable at first.
              </p>
            </div>

            <div className="card p-6 space-y-4">
              <p className="font-mono text-xs text-violet-accent uppercase tracking-widest">// DESIGN IMPROVEMENT PROMPT</p>
              <p className="text-lavender-muted text-sm leading-relaxed">
                Copy this prompt and paste it after your existing app prompt to instantly improve the design:
              </p>
              <div className="bg-panel-deep rounded p-4 border border-violet-border">
                <p className="font-mono text-sm text-lavender-dim leading-relaxed">
                  "Now improve the visual design: add generous padding (at least 24px inside cards, 48px between sections), increase the heading size to at least 40px bold, add subtle border radius to all cards and buttons, and make sure there's clear visual hierarchy between the title, body text, and call-to-action buttons. Use a consistent color palette with one accent color for interactive elements."
                </p>
              </div>
            </div>
          </section>

          {/* Go to quiz */}
          <div className="text-center space-y-4">
            {!isLoggedIn && (
              <p className="text-xs font-mono text-orange-primary bg-orange-primary/10 border border-orange-primary/30 rounded p-3 inline-block">
                📝 Create a free account to take this quiz and start earning XP
              </p>
            )}
            <div>
              <button
                onClick={() => { if (!isLoggedIn) { window.location.href = '/login'; return } setCurrentTab('quiz') }}
                className="px-8 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
              >
                {isLoggedIn ? "TAKE THE QUIZ →" : 'SIGN UP TO TAKE QUIZ →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ TAB */}
      {currentTab === 'quiz' && (
        <div className="space-y-6">
          {!quizComplete ? (
            <div className="card p-8 space-y-6">
              <div className="flex justify-between items-center">
                <p className="font-mono text-xs text-lavender-dim uppercase">Question {currentQuestion + 1} of {quizQuestions.length}</p>
                <p className="font-mono text-xs text-orange-primary">Score: {score}/{currentQuestion}</p>
              </div>
              <div className="w-full bg-panel-deep rounded-full h-2">
                <div className="bg-gradient-accent h-full rounded-full transition-all" style={{ width: `${(currentQuestion / quizQuestions.length) * 100}%` }} />
              </div>

              <h3 className="text-xl font-chakra font-bold text-white">{q.question}</h3>

              <div className="space-y-3">
                {q.options.map((option, index) => {
                  let style = 'border border-violet-border bg-panel-deep hover:border-violet-accent cursor-pointer'
                  if (selectedAnswer !== null) {
                    if (index === q.correct) style = 'border-2 border-success-green bg-success-green/10 cursor-default'
                    else if (index === selectedAnswer) style = 'border-2 border-red-500 bg-red-500/10 cursor-default'
                    else style = 'border border-violet-border bg-panel-deep opacity-50 cursor-default'
                  }
                  return (
                    <button key={index} onClick={() => handleAnswer(index)} className={`w-full text-left p-4 rounded-sm transition-all ${style}`}>
                      <div className="flex gap-3 items-start">
                        <span className="font-mono text-xs text-lavender-dim min-w-[20px] mt-0.5">{String.fromCharCode(65 + index)}.</span>
                        <span className="text-lavender text-sm leading-relaxed">{option}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {showExplanation && (
                <div className={`rounded p-4 border ${selectedAnswer === q.correct ? 'bg-success-green/10 border-success-green/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <p className={`font-mono text-xs uppercase tracking-widest mb-2 ${selectedAnswer === q.correct ? 'text-success-green' : 'text-red-400'}`}>
                    {selectedAnswer === q.correct ? '✓ CORRECT!' : '✗ NOT QUITE'}
                  </p>
                  <p className="text-lavender-muted text-sm leading-relaxed">{q.explanation}</p>
                </div>
              )}

              {showExplanation && (
                <button onClick={handleNext} className="w-full px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
                  {currentQuestion + 1 >= quizQuestions.length ? 'SEE RESULTS →' : 'NEXT QUESTION →'}
                </button>
              )}
            </div>
          ) : (
            <div className="card bg-gradient-hero p-8 sm:p-12 text-center space-y-6">
              <div className="text-6xl">{score === 4 ? '🏆' : score >= 3 ? '🎉' : '💪'}</div>
              <h3 className="text-2xl font-chakra font-bold text-white">You scored {score} out of {quizQuestions.length}!</h3>
              <p className="text-lavender-muted">
                {score === 4 ? 'Design master! Your apps are about to look incredible.' : score >= 3 ? 'Solid! You\'ve got the design fundamentals.' : 'Keep at it! Review the concepts and try again.'}
              </p>
              <div className="flex justify-center gap-3">
                {answers.map((correct, i) => (
                  <div key={i} className={`w-10 h-10 rounded flex items-center justify-center font-chakra font-bold text-sm ${correct ? 'bg-success-green/20 text-success-green border border-success-green/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                    {correct ? '✓' : '✗'}
                  </div>
                ))}
              </div>
              <div className="bg-panel-deep rounded p-4 border border-orange-primary/30 inline-block mx-auto px-8">
                <p className="font-mono text-xs text-orange-primary uppercase tracking-widest mb-1">XP EARNED</p>
                <p className="text-3xl font-chakra font-bold text-white">+{score * 31} XP</p>
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                {score < 4 && (
                  <button onClick={() => { setCurrentQuestion(0); setSelectedAnswer(null); setShowExplanation(false); setScore(0); setQuizComplete(false); setAnswers([]) }}
                    className="px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
                    RETRY QUIZ
                  </button>
                )}
                <Link href="/learn/lesson-4" className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
                  LESSON 4: DEPLOY YOUR APP →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom nav */}
      <div className="flex justify-between items-center pt-8 border-t border-violet-border">
        <Link href="/learn/lesson-2" className="px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
          ← LESSON 2
        </Link>
        <Link href="/learn/lesson-4" className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
          LESSON 4 →
        </Link>
      </div>

      <div className="h-8" />

      {/* Vibe AI Agent */}
      <VibeAgent context="lesson-3" />
    </div>
  )
}
