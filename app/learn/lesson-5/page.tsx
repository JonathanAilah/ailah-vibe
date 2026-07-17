'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VibeAgent } from '@/components/VibeAgent'
import { useAppContext } from '@/app/context'

const quizQuestions = [
  {
    id: 1,
    question: 'What is the most important factor in winning a vibe-a-thon?',
    options: [
      'Having the most complex code',
      'Building something that connects with voters emotionally or solves a real problem',
      'Submitting first',
      'Using the most AI tools',
    ],
    correct: 1,
    explanation: 'Vibe-a-thons are community voted. Voters don\'t care how complex your code is — they care if your project makes them laugh, helps them, or impresses them. Build something people feel something about.',
  },
  {
    id: 2,
    question: 'When should you submit your project to a vibe-a-thon?',
    options: [
      'Only when it\'s 100% perfect with no bugs',
      'As early as possible so you have more time to collect votes',
      'On the last day for maximum drama',
      'Never — only experienced developers should enter',
    ],
    correct: 1,
    explanation: 'Submit early! More time on the leaderboard means more chances for people to discover, try, and vote for your project. A good-enough project submitted early beats a perfect project submitted late.',
  },
  {
    id: 3,
    question: 'What makes a great vibe-a-thon project description?',
    options: [
      'A detailed technical explanation of how the code works',
      'A list of every feature you built',
      'A short, energetic story: what it does, why you built it, what makes it fun',
      'A formal essay about the problem space',
    ],
    correct: 2,
    explanation: 'Voters decide in seconds. A great description is short (3-5 sentences), tells a story, and makes the voter feel something. Why did you build this? What\'s surprising or delightful about it? Lead with the fun.',
  },
  {
    id: 4,
    question: 'You\'ve never coded before. Should you enter a vibe-a-thon?',
    options: [
      'No — wait until you have at least 2 years of experience',
      'No — vibe-a-thons are only for advanced developers',
      'Yes — vibe-a-thons are designed for beginners and everyone starts somewhere',
      'Only if someone else helps you build the entire project',
    ],
    correct: 2,
    explanation: 'Vibe-a-thons at Vibe Coden are specifically designed for non-technical beginners. The whole point is that anyone with an idea can build something with AI and compete. Your first entry doesn\'t need to win — it just needs to exist. Ship it.',
  },
]

export default function Lesson5() {
  const { awardXP, isLoggedIn } = useAppContext()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [courseComplete, setCourseComplete] = useState(false)

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
      setCourseComplete(true)
      awardXP(score * 30 + 100) // quiz XP + course completion bonus
    } else {
      setCurrentQuestion((q) => q + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const q = quizQuestions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-16 pb-32">

      {/* Header */}
      <div className="space-y-4">
        <Link href="/learn/lesson-4" className="text-lavender-dim hover:text-lavender font-mono text-sm transition-colors">
          ← BACK TO LESSON 4
        </Link>
        <div className="card bg-gradient-hero p-8 sm:p-12 space-y-4 border border-orange-border">
          <p className="eyebrow">COURSE 1 · LESSON 5 OF 5 · FINAL LESSON</p>
          <h1 className="text-3xl sm:text-5xl font-chakra font-bold text-white">
            Enter Your First{' '}
            <span className="text-orange-primary">Vibe-a-thon</span>
          </h1>
          <p className="text-base text-lavender-muted max-w-xl">
            You've learned the skills. You've built something. Now it's time to compete. This lesson prepares you to submit your first project and give it the best shot at winning.
          </p>
          <div className="flex gap-6 pt-2">
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">5</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">Sections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">~10</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">Min</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">+200</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* What is a vibe-a-thon */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// WHAT IS A VIBE-A-THON?</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">The Arena</h2>
        </div>
        <p className="text-lavender-muted leading-relaxed">
          A vibe-a-thon is a weekend building competition. A theme is announced. You have 48-72 hours to build an app, game, or website that fits the theme. Then you submit it, the community votes, and the top 3 win cash prizes.
        </p>
        <p className="text-lavender-muted leading-relaxed">
          It's not about being the best coder. It's about having the best idea, executing it well, and connecting with voters. Anyone can win.
        </p>

        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { icon: '📣', label: 'Theme announced', desc: 'Friday at 6pm' },
            { icon: '⚡', label: 'Build weekend', desc: '48-72 hours' },
            { icon: '🗳️', label: 'Community votes', desc: 'Anyone can vote' },
            { icon: '🏆', label: 'Top 3 win prizes', desc: 'Real cash rewards' },
          ].map((item) => (
            <div key={item.label} className="card p-5 text-center space-y-2">
              <div className="text-2xl">{item.icon}</div>
              <p className="font-chakra font-bold text-white text-sm">{item.label}</p>
              <p className="text-xs text-lavender-dim">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Picking a project */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// PICKING YOUR PROJECT</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Choose the right idea</h2>
        </div>
        <p className="text-lavender-muted leading-relaxed">
          You have one weekend. Don't try to build the next Instagram. Pick an idea that's:
        </p>

        <div className="space-y-3">
          {[
            { label: 'Small enough to finish', desc: 'You need a working, deployed app by the deadline. A simple app that works beats a complex app that\'s broken.', icon: '✅' },
            { label: 'Fits the theme', desc: 'Read the theme carefully. The best submissions fit the theme in a clever, unexpected way — not just literally.', icon: '🎯' },
            { label: 'Fun or useful', desc: 'Voters respond to things that make them laugh, help them, or impress them. Build something you\'d want to use yourself.', icon: '❤️' },
            { label: 'Buildable with AI', desc: 'Can you describe this in a clear prompt? If you can explain it in 3-4 sentences, AI can probably build it.', icon: '🤖' },
          ].map((item) => (
            <div key={item.label} className="card p-5 flex gap-4 items-start">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-chakra font-bold text-white">{item.label}</p>
                <p className="text-sm text-lavender-muted mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Writing your description */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// YOUR SUBMISSION</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Write a description that wins votes</h2>
        </div>
        <p className="text-lavender-muted leading-relaxed">
          Voters spend 5-10 seconds deciding whether to try your project. Your description is your pitch. Make it count.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="card border border-red-500/30 p-6 space-y-4">
            <p className="font-mono text-xs text-red-400 uppercase tracking-widest">❌ Weak description</p>
            <div className="bg-panel-deep rounded p-4">
              <p className="text-lavender text-sm italic">
                "This is a quiz app I made. It has multiple choice questions. You can answer them and see your score at the end. I built it using HTML, CSS, and JavaScript."
              </p>
            </div>
            <ul className="space-y-1 text-sm text-lavender-dim">
              <li>✗ Boring — no personality</li>
              <li>✗ No reason to try it</li>
              <li>✗ Technical details nobody cares about</li>
            </ul>
          </div>

          <div className="card border border-success-green/30 p-6 space-y-4">
            <p className="font-mono text-xs text-success-green uppercase tracking-widest">✓ Strong description</p>
            <div className="bg-panel-deep rounded p-4">
              <p className="text-lavender text-sm italic">
                "Think you know useless facts better than your friends? This quiz destroys you with the most random trivia imaginable — then roasts you for every wrong answer. I built this at 2am because I was procrastinating on homework. You're welcome."
              </p>
            </div>
            <ul className="space-y-1 text-sm text-lavender-dim">
              <li>✓ Personality and voice</li>
              <li>✓ Makes you want to try it</li>
              <li>✓ Relatable story behind it</li>
            </ul>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <p className="font-mono text-xs text-violet-accent uppercase tracking-widest">// THE DESCRIPTION FORMULA</p>
          <div className="bg-panel-deep rounded p-4 font-mono text-sm space-y-2">
            <p><span className="text-orange-primary">Hook:</span> <span className="text-lavender-dim">One punchy sentence that makes them stop scrolling</span></p>
            <p><span className="text-orange-primary">What:</span> <span className="text-lavender-dim">What does your app do in plain English?</span></p>
            <p><span className="text-orange-primary">Why:</span> <span className="text-lavender-dim">Why did you build it? What's the story?</span></p>
            <p><span className="text-orange-primary">CTA:</span> <span className="text-lavender-dim">Tell them to try it. "Give it a shot." "You won't regret it."</span></p>
          </div>
        </div>
      </section>

      {/* Getting votes */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// GETTING VOTES</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">How to get people to vote</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { tip: 'Submit early', desc: 'More time on the leaderboard = more visibility = more votes. Don\'t wait until the last hour.' },
            { tip: 'Share the link', desc: 'Post your live URL in Discord, on social media, in your group chats. Every person you tell is a potential vote.' },
            { tip: 'Make it actually work', desc: 'If someone clicks your project and it\'s broken, they won\'t vote. Test on mobile and desktop before submitting.' },
            { tip: 'Respond to feedback', desc: 'If someone comments on your project, respond. Engagement makes people more likely to vote and share.' },
          ].map((item) => (
            <div key={item.tip} className="card p-5 space-y-2">
              <p className="font-chakra font-bold text-white flex items-center gap-2">
                <span className="text-orange-primary">→</span> {item.tip}
              </p>
              <p className="text-sm text-lavender-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mindset */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// MINDSET</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Your first entry won't win. That's fine.</h2>
        </div>
        <p className="text-lavender-muted leading-relaxed">
          Almost nobody wins their first vibe-a-thon. The students who eventually win are the ones who entered multiple times, learned from each attempt, and kept shipping. Every entry teaches you something.
        </p>
        <div className="card bg-gradient-hero p-8 space-y-4 border border-orange-border">
          <p className="text-2xl font-chakra font-bold text-white">The goal of your first entry isn't to win.</p>
          <p className="text-lavender-muted">
            It's to <span className="text-white font-bold">ship something real</span>, get it in front of real people, and prove to yourself that you can build and deploy an app. That's already a huge win.
          </p>
          <p className="text-lavender-muted">
            The prize money is great. But the real prize is knowing that you — someone who didn't write code before — built a real app that real people can use. That's something most people never do.
          </p>
        </div>
      </section>

      {/* Quiz */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// FINAL QUIZ</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Last quiz — you've got this</h2>
        </div>

        {!quizStarted ? (
          <div className="card bg-gradient-hero p-8 sm:p-12 text-center space-y-6">
            <div className="text-6xl">🏆</div>
            <h3 className="text-2xl font-chakra font-bold text-white">Final quiz of Course 1!</h3>
            <p className="text-lavender-muted">4 questions · Complete the course · Earn your certificate</p>
            {!isLoggedIn && (
              <p className="text-xs font-mono text-orange-primary bg-orange-primary/10 border border-orange-primary/30 rounded p-3 inline-block mb-2">
                📝 Create a free account to take this quiz and start earning XP
              </p>
            )}
            <button onClick={() => { if (!isLoggedIn) { window.location.href = '/login'; return } setQuizStarted(true) }} className="px-8 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
              {isLoggedIn ? 'START FINAL QUIZ →' : 'SIGN UP TO START →'}
            </button>
          </div>
        ) : quizComplete ? (
          <div className="space-y-6">
            {/* Course Complete! */}
            <div className="card bg-gradient-hero p-8 sm:p-16 text-center space-y-8 border border-orange-border">
              <div className="text-7xl">🎓</div>
              <div>
                <p className="eyebrow mb-4">COURSE 1 COMPLETE</p>
                <h3 className="text-3xl sm:text-4xl font-chakra font-bold text-white mb-4">
                  You're a Vibe Coder Now.
                </h3>
                <p className="text-lavender-muted max-w-lg mx-auto">
                  You completed all 5 lessons. You know how to prompt AI, build real apps, design them, deploy them, and compete. That's more than most people ever learn.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
                {[
                  { label: 'Lessons', value: '5/5' },
                  { label: 'Quiz Score', value: `${score}/4` },
                  { label: 'XP Earned', value: '575+' },
                  { label: 'Status', value: 'BUILDER' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-panel-deep rounded p-4 border border-violet-border text-center">
                    <p className="text-xl font-chakra font-bold text-orange-primary">{stat.value}</p>
                    <p className="font-mono text-xs text-lavender-dim uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/vibe-a-thons"
                  className="px-8 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
                >
                  🏆 ENTER THE ARENA →
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet"
                >
                  VIEW DASHBOARD →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-8 space-y-6">
            <div className="flex justify-between items-center">
              <p className="font-mono text-xs text-lavender-dim uppercase">Question {currentQuestion + 1} of {quizQuestions.length}</p>
              <p className="font-mono text-xs text-orange-primary">Score: {score}/{currentQuestion}</p>
            </div>
            <div className="w-full bg-panel-deep rounded-full h-2">
              <div className="bg-gradient-accent h-full rounded-full" style={{ width: `${(currentQuestion / quizQuestions.length) * 100}%` }} />
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
                {currentQuestion + 1 >= quizQuestions.length ? 'COMPLETE COURSE →' : 'NEXT QUESTION →'}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Bottom nav */}
      {!courseComplete && (
        <div className="flex justify-between items-center pt-8 border-t border-violet-border">
          <Link href="/learn/lesson-4" className="px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
            ← LESSON 4
          </Link>
          <Link href="/vibe-a-thons" className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
            ENTER THE ARENA →
          </Link>
        </div>
      )}

      <div className="h-8" />
      <VibeAgent context="lesson-5" />
    </div>
  )
}
