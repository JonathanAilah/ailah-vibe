'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VibeAgent } from '@/components/VibeAgent'
import { useAppContext } from '@/app/context'

const deploySteps = [
  {
    id: 1,
    title: 'Get your code ready',
    desc: 'Make sure your app works locally first. Test every button, every feature. Fix anything that\'s broken before you deploy.',
    icon: '🔍',
    detail: 'If you built a single HTML file using Claude, you\'re already ready. If you built a React/Next.js app, run it locally and confirm it works.',
  },
  {
    id: 2,
    title: 'Push to GitHub',
    desc: 'GitHub is where your code lives online. Create a repo, upload your files. This is the source of truth for your project.',
    icon: '📦',
    detail: 'Go to github.com → New Repository → give it a name → Upload Files → drag your project files in → Commit. That\'s it.',
  },
  {
    id: 3,
    title: 'Connect to Vercel',
    desc: 'Vercel reads your GitHub repo and builds your site automatically. Every time you update your code, it redeploys.',
    icon: '🔗',
    detail: 'Go to vercel.com → New Project → Import your GitHub repo → Deploy. Vercel handles the rest.',
  },
  {
    id: 4,
    title: 'Get your live URL',
    desc: 'Vercel gives you a free URL like yourproject.vercel.app. Share it with anyone — they can use your app from anywhere in the world.',
    icon: '🌍',
    detail: 'Your URL is ready in 2-3 minutes. Copy it from the Vercel dashboard. That\'s your app, live on the internet!',
  },
  {
    id: 5,
    title: 'Update anytime',
    desc: 'Made changes? Just update your file in GitHub and Vercel redeploys automatically. Your live URL stays the same.',
    icon: '🔄',
    detail: 'Edit a file on GitHub → Commit → Vercel detects the change → Redeploys in 2-3 min. No extra steps needed.',
  },
]

const quizQuestions = [
  {
    id: 1,
    question: 'What does "deploying" an app mean?',
    options: [
      'Deleting your app from your computer',
      'Publishing your app to the internet so anyone can access it',
      'Sending your app\'s code to your teacher',
      'Converting your app into a mobile app',
    ],
    correct: 1,
    explanation: 'Deploying means taking your app from your local computer and publishing it to a server on the internet. After deploying, anyone with the link can use your app from any device, anywhere in the world.',
  },
  {
    id: 2,
    question: 'What is GitHub used for in the deployment process?',
    options: [
      'It runs your app directly and gives users access',
      'It designs the visual layout of your app',
      'It stores your code online and tracks every change you make',
      'It handles payments and user accounts',
    ],
    correct: 2,
    explanation: 'GitHub is a code storage and version control platform. It keeps your code online, tracks every change (so you can go back if something breaks), and connects to deployment platforms like Vercel that actually run your app.',
  },
  {
    id: 3,
    question: 'What happens when you update your code on GitHub after it\'s deployed to Vercel?',
    options: [
      'Nothing — you have to manually redeploy every time',
      'Vercel automatically detects the change and redeploys your app',
      'You have to delete and recreate the project',
      'You need to pay for each update',
    ],
    correct: 1,
    explanation: 'Vercel watches your GitHub repo automatically. Every time you push new code, Vercel detects it and redeploys within minutes. This is called continuous deployment — your live site always reflects your latest code.',
  },
  {
    id: 4,
    question: 'What is a custom domain?',
    options: [
      'A type of database that stores user information',
      'A special font used only on deployed websites',
      'A personalized web address like yourname.com instead of yourapp.vercel.app',
      'A security feature that blocks unauthorized users',
    ],
    correct: 2,
    explanation: 'A custom domain is a web address you own and control. Instead of yourapp.vercel.app (which Vercel assigns for free), you could buy vibecoden.com and point it at your Vercel app. Custom domains look more professional and are memorable.',
  },
]

export default function Lesson4() {
  const { awardXP } = useAppContext()
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizStarted, setQuizStarted] = useState(false)

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowExplanation(true)
    const correct = index === quizQuestions[currentQuestion].correct
    if (correct) setScore((s) => s + 1)
    setAnswers((prev) => [...prev, correct])
  }

  const handleNext = () => {
    if (currentQuestion + 1 >= quizQuestions.length) { setQuizComplete(true); awardXP(score * 25) }
    else { setCurrentQuestion((q) => q + 1); setSelectedAnswer(null); setShowExplanation(false) }
  }

  const q = quizQuestions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-16 pb-32">

      {/* Header */}
      <div className="space-y-4">
        <Link href="/learn/lesson-3" className="text-lavender-dim hover:text-lavender font-mono text-sm transition-colors">
          ← BACK TO LESSON 3
        </Link>
        <div className="card bg-gradient-hero p-8 sm:p-12 space-y-4">
          <p className="eyebrow">COURSE 1 · LESSON 4 OF 5</p>
          <h1 className="text-3xl sm:text-5xl font-chakra font-bold text-white">
            Deploy & Share Your App
          </h1>
          <p className="text-base text-lavender-muted max-w-xl">
            Your app looks great. Now let's get it live. Learn how to deploy to the internet so real people can use what you built.
          </p>
          <div className="flex gap-6 pt-2">
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">5</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">Steps</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">~10</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">Min</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">+100</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why deployment matters */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// WHY THIS MATTERS</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Shipping is the skill</h2>
        </div>
        <p className="text-lavender-muted leading-relaxed">
          Anyone can build something that works on their own computer. The real skill is <span className="text-white font-bold">shipping</span> — getting it live so other people can actually use it. Until your app is deployed, it doesn't exist for the world.
        </p>
        <p className="text-lavender-muted leading-relaxed">
          Deployed apps can be shared, voted on in vibe-a-thons, added to your portfolio, and used by real users. That's the difference between a project and a product.
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: '🏆', label: 'Enter vibe-a-thons', desc: 'You need a live URL to submit' },
            { icon: '💼', label: 'Build a portfolio', desc: 'Shareable links impress anyone' },
            { icon: '🌍', label: 'Real users', desc: 'Friends, family, strangers can try it' },
          ].map((item) => (
            <div key={item.label} className="card p-6 text-center space-y-2">
              <div className="text-3xl">{item.icon}</div>
              <p className="font-chakra font-bold text-white">{item.label}</p>
              <p className="text-sm text-lavender-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5-step deployment */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// HOW TO DEPLOY</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">5 steps to go live</h2>
        </div>

        <div className="space-y-3">
          {deploySteps.map((step) => (
            <div key={step.id} className="card overflow-hidden">
              <button
                className="w-full p-6 flex items-center gap-4 text-left"
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              >
                <div className="w-12 h-12 flex-shrink-0 bg-orange-primary/20 border border-orange-primary/50 rounded-sm flex items-center justify-center text-xl">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-orange-primary">0{step.id}</span>
                    <h3 className="font-chakra font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm text-lavender-muted mt-1">{step.desc}</p>
                </div>
                <span className="text-lavender-dim font-mono">{expandedStep === step.id ? '▲' : '▼'}</span>
              </button>
              {expandedStep === step.id && (
                <div className="px-6 pb-6 pl-22">
                  <div className="bg-panel-deep rounded p-4 border-l-2 border-violet-accent ml-16">
                    <p className="text-lavender-muted text-sm leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// TOOLS YOU'LL USE</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">GitHub + Vercel</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              name: 'GitHub',
              url: 'github.com',
              color: 'border-lavender/30 bg-lavender/5',
              tagColor: 'text-lavender bg-lavender/10 border-lavender/30',
              desc: 'Where your code lives. Free. Create an account, upload your files, and connect it to Vercel.',
              steps: ['Create a free account', 'Create a new repository', 'Upload your project files', 'Connect to Vercel'],
            },
            {
              name: 'Vercel',
              url: 'vercel.com',
              color: 'border-orange-primary/30 bg-orange-primary/5',
              tagColor: 'text-orange-primary bg-orange-primary/10 border-orange-primary/30',
              desc: 'Where your app runs. Free for personal projects. Connect your GitHub repo and it deploys automatically.',
              steps: ['Create a free account', 'Import your GitHub repo', 'Click Deploy', 'Get your live URL'],
            },
          ].map((tool) => (
            <div key={tool.name} className={`card border p-6 space-y-4 ${tool.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-chakra font-bold text-white">{tool.name}</h3>
                <span className={`text-xs px-2 py-1 rounded font-mono border ${tool.tagColor}`}>{tool.url}</span>
              </div>
              <p className="text-sm text-lavender-muted">{tool.desc}</p>
              <div className="space-y-2">
                {tool.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <span className="w-5 h-5 rounded-full bg-panel-raised flex items-center justify-center font-mono text-xs text-lavender-dim flex-shrink-0">{i + 1}</span>
                    <span className="text-sm text-lavender">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Common issues */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// COMMON ISSUES</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">When things go wrong</h2>
        </div>
        <div className="space-y-3">
          {[
            { problem: 'Build failed', fix: 'Check the build logs in Vercel. Look for red error text. Copy the error and ask Vibe (the AI below) to help you fix it.' },
            { problem: '404 Not Found', fix: 'Your files might not be in the right place. Make sure package.json and your app folder are at the root of your GitHub repo.' },
            { problem: 'Site looks different than local', fix: 'Some styles or fonts don\'t load in production. Check the browser console for errors (F12 → Console tab).' },
            { problem: 'Changes not showing', fix: 'Wait 2-3 minutes for Vercel to finish redeploying. If still not showing, do a hard refresh (Ctrl+Shift+R).' },
          ].map((item) => (
            <div key={item.problem} className="card p-5 grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-red-400">⚠</span>
                <p className="font-chakra font-bold text-white text-sm">{item.problem}</p>
              </div>
              <p className="sm:col-span-2 text-lavender-muted text-sm leading-relaxed">{item.fix}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// KNOWLEDGE CHECK</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Quiz Time</h2>
        </div>

        {!quizStarted ? (
          <div className="card bg-gradient-hero p-8 sm:p-12 text-center space-y-6">
            <div className="text-6xl">🧠</div>
            <h3 className="text-2xl font-chakra font-bold text-white">Ready for the quiz?</h3>
            <p className="text-lavender-muted">4 questions · No time limit · Instant feedback</p>
            <button onClick={() => setQuizStarted(true)} className="px-8 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
              START QUIZ →
            </button>
          </div>
        ) : quizComplete ? (
          <div className="card bg-gradient-hero p-8 sm:p-12 text-center space-y-6">
            <div className="text-6xl">{score === 4 ? '🏆' : score >= 3 ? '🎉' : '💪'}</div>
            <h3 className="text-2xl font-chakra font-bold text-white">You scored {score} out of {quizQuestions.length}!</h3>
            <p className="text-lavender-muted">
              {score === 4 ? 'Deployment pro! One more lesson and you\'re ready to compete.' : score >= 3 ? 'Solid understanding! Time to ship.' : 'Review the steps above and try again!'}
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
              <p className="text-3xl font-chakra font-bold text-white">+{score * 25} XP</p>
            </div>
            <div className="flex gap-4 justify-center">
              {score < 4 && (
                <button onClick={() => { setCurrentQuestion(0); setSelectedAnswer(null); setShowExplanation(false); setScore(0); setQuizComplete(false); setAnswers([]); setQuizStarted(false) }}
                  className="px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
                  RETRY
                </button>
              )}
              <Link href="/learn/lesson-5" className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
                FINAL LESSON →
              </Link>
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
                {currentQuestion + 1 >= quizQuestions.length ? 'SEE RESULTS →' : 'NEXT QUESTION →'}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Bottom nav */}
      <div className="flex justify-between items-center pt-8 border-t border-violet-border">
        <Link href="/learn/lesson-3" className="px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
          ← LESSON 3
        </Link>
        <Link href="/learn/lesson-5" className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
          LESSON 5 →
        </Link>
      </div>

      <div className="h-8" />
      <VibeAgent context="lesson-4" />
    </div>
  )
}
