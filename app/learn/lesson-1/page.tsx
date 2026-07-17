'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VibeAgent } from '@/components/VibeAgent'
import { useAppContext } from '@/app/context'

const quizQuestions = [
  {
    id: 1,
    question: 'What is "vibe coding"?',
    options: [
      'Writing code by hand from scratch',
      'Describing what you want in plain English and letting AI build it',
      'Copying code from the internet',
      'Using drag-and-drop tools to build websites',
    ],
    correct: 1,
    explanation:
      'Vibe coding means describing what you want to build in plain English, then letting AI generate the code for you. You focus on the idea — AI handles the syntax.',
  },
  {
    id: 2,
    question: 'Which of these is a good AI prompt for building an app?',
    options: [
      '"Make app"',
      '"Build me a to-do list app where I can add tasks, check them off, and delete them. Make it look clean and modern."',
      '"Code please"',
      '"I want something cool"',
    ],
    correct: 1,
    explanation:
      'The best prompts are specific. They describe exactly what the app does, what actions users can take, and how it should look. Vague prompts produce vague results.',
  },
  {
    id: 3,
    question: 'What should you do if the AI output isn\'t quite right?',
    options: [
      'Give up and start over completely',
      'Accept it as-is even if it\'s wrong',
      'Refine your prompt with more specific instructions',
      'Switch to a different programming language',
    ],
    correct: 2,
    explanation:
      'AI coding is iterative. If the first result isn\'t perfect, add more detail to your prompt. Say what\'s wrong and what you want changed. Each round gets you closer.',
  },
  {
    id: 4,
    question: 'What does it mean to "ship" a project?',
    options: [
      'Mail your computer to someone',
      'Delete your project and start fresh',
      'Deploy and publish your app so others can use it',
      'Print out your code',
    ],
    correct: 2,
    explanation:
      '"Shipping" means deploying your app live so real people can access it. In vibe coding, the goal is always to ship — to build real things, not just tutorials.',
  },
]

export default function Lesson1() {
  const { awardXP } = useAppContext()
  const [quizStarted, setQuizStarted] = useState(false)
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
      awardXP(score * 25)
    } else {
      setCurrentQuestion((q) => q + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const q = quizQuestions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-16">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-lavender-dim hover:text-lavender font-mono text-sm transition-colors">
            ← BACK TO DASHBOARD
          </Link>
        </div>
        <div className="card bg-gradient-hero p-8 sm:p-12 space-y-4">
          <p className="eyebrow">COURSE 1 · LESSON 1 OF 5</p>
          <h1 className="text-3xl sm:text-5xl font-chakra font-bold text-white">
            Intro to AI & Vibe Coding
          </h1>
          <p className="text-base text-lavender-muted max-w-xl">
            Learn how to describe ideas, prompt AI to build them, and ship real apps — no prior experience needed.
          </p>
          <div className="flex gap-6 pt-2">
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">15</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">Min read</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">4</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">Quiz questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">+100</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">XP on completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1 - What is Vibe Coding */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// SECTION 1</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">
            What is Vibe Coding?
          </h2>
        </div>
        <div className="space-y-4 text-lavender-muted text-base leading-relaxed">
          <p>
            Vibe coding is a new way to build software. Instead of memorizing syntax, learning programming languages for years, or spending months in tutorials — you <span className="text-white font-bold">describe what you want</span>, and AI builds it for you.
          </p>
          <p>
            The idea is simple: you have an idea for an app, game, or website. You describe it to an AI tool like Claude, ChatGPT, or Cursor. The AI generates working code. You review it, tweak it, and ship it to the world.
          </p>
          <p>
            That's it. No CS degree required. No years of experience. Just a good idea and the ability to describe it clearly.
          </p>
        </div>

        {/* Callout */}
        <div className="card border-l-4 border-orange-primary p-6 bg-orange-primary/5">
          <p className="font-mono text-xs text-orange-primary uppercase tracking-widest mb-2">// KEY IDEA</p>
          <p className="text-white text-lg font-chakra font-bold">
            "The skill isn't writing code. The skill is knowing what to build and how to describe it."
          </p>
        </div>
      </section>

      {/* Section 2 - How it works */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// SECTION 2</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">
            How It Actually Works
          </h2>
        </div>
        <div className="space-y-4 text-lavender-muted text-base leading-relaxed">
          <p>
            Here's the real process behind every app you'll build at Vibe Coden:
          </p>
        </div>

        <div className="grid gap-4">
          {[
            {
              step: '01',
              title: 'Get an idea',
              desc: 'Think of something useful, fun, or interesting. A game. A tool. A website. Anything. The best apps solve a problem or bring joy.',
              example: '"I want to build a quiz app that helps me study for my history class."',
            },
            {
              step: '02',
              title: 'Write a clear prompt',
              desc: 'Describe your idea to an AI in detail. The more specific you are, the better the result. Include what it does, how it looks, and how users interact with it.',
              example: '"Build me a quiz app with multiple choice questions. Users should see one question at a time, get instant feedback on their answer, and see a final score at the end."',
            },
            {
              step: '03',
              title: 'AI generates the code',
              desc: 'The AI writes all the code for you — HTML, CSS, JavaScript, whatever is needed. You get a working app in seconds.',
              example: 'The AI outputs a complete, working quiz app with clean design and all the features you described.',
            },
            {
              step: '04',
              title: 'Review and refine',
              desc: 'Look at what it built. Does it match your vision? If not, ask for changes. Be specific about what needs to be different.',
              example: '"Make the buttons bigger. Add a timer that counts down 30 seconds per question. Change the color scheme to dark mode."',
            },
            {
              step: '05',
              title: 'Ship it',
              desc: 'Deploy your app to the internet so real people can use it. You\'ll use tools like Vercel (same as this website!) to make it live in minutes.',
              example: 'Your quiz app is now live at yourname.vercel.app — share the link with friends.',
            },
          ].map((item) => (
            <div key={item.step} className="card p-6 space-y-3">
              <div className="flex gap-4 items-start">
                <span className="text-3xl font-chakra font-bold text-orange-primary min-w-[48px]">
                  {item.step}
                </span>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-chakra font-bold text-white">{item.title}</h3>
                  <p className="text-lavender-muted text-sm leading-relaxed">{item.desc}</p>
                  <div className="bg-panel-deep rounded p-4 border-l-2 border-violet-accent mt-3">
                    <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mb-1">Example</p>
                    <p className="text-lavender text-sm italic">"{item.example}"</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 - Writing good prompts */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// SECTION 3</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">
            Writing Prompts That Work
          </h2>
        </div>
        <div className="space-y-4 text-lavender-muted text-base leading-relaxed">
          <p>
            The #1 skill in vibe coding is writing good prompts. A great prompt gets you 80% of the way there on the first try. A bad prompt wastes your time.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Bad example */}
          <div className="card border border-red-500/30 p-6 space-y-4">
            <p className="font-mono text-xs text-red-400 uppercase tracking-widest">❌ Weak Prompt</p>
            <div className="bg-panel-deep rounded p-4">
              <p className="font-mono text-sm text-lavender-dim">
                "make me a game"
              </p>
            </div>
            <ul className="space-y-2 text-sm text-lavender-muted">
              <li className="flex gap-2"><span className="text-red-400">✗</span> No details about what kind of game</li>
              <li className="flex gap-2"><span className="text-red-400">✗</span> No description of how it works</li>
              <li className="flex gap-2"><span className="text-red-400">✗</span> No visual style mentioned</li>
              <li className="flex gap-2"><span className="text-red-400">✗</span> AI has to guess everything</li>
            </ul>
          </div>

          {/* Good example */}
          <div className="card border border-success-green/30 p-6 space-y-4">
            <p className="font-mono text-xs text-success-green uppercase tracking-widest">✓ Strong Prompt</p>
            <div className="bg-panel-deep rounded p-4">
              <p className="font-mono text-sm text-lavender-dim">
                "Build me a 2-player Pong game. Each player controls a paddle using keyboard keys (W/S for left, Up/Down for right). The ball speeds up after each hit. First to 10 points wins. Make it look like a retro arcade game with neon colors on a dark background."
              </p>
            </div>
            <ul className="space-y-2 text-sm text-lavender-muted">
              <li className="flex gap-2"><span className="text-success-green">✓</span> Specific game type</li>
              <li className="flex gap-2"><span className="text-success-green">✓</span> Exact controls described</li>
              <li className="flex gap-2"><span className="text-success-green">✓</span> Win condition defined</li>
              <li className="flex gap-2"><span className="text-success-green">✓</span> Visual style specified</li>
            </ul>
          </div>
        </div>

        {/* Prompt formula */}
        <div className="card p-8 space-y-4">
          <p className="font-mono text-xs text-violet-accent uppercase tracking-widest">// THE PROMPT FORMULA</p>
          <h3 className="text-xl font-chakra font-bold text-white">Use this template for any project:</h3>
          <div className="bg-panel-deep rounded p-6 font-mono text-sm space-y-2">
            <p><span className="text-orange-primary">Build me</span> <span className="text-lavender">[what it is]</span>.</p>
            <p><span className="text-orange-primary">It should</span> <span className="text-lavender">[main features, 1-3 things]</span>.</p>
            <p><span className="text-orange-primary">Users can</span> <span className="text-lavender">[actions users take]</span>.</p>
            <p><span className="text-orange-primary">Make it look</span> <span className="text-lavender">[visual style]</span>.</p>
          </div>
        </div>
      </section>

      {/* Section 4 - Tools */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// SECTION 4</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">
            Tools You'll Use
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              name: 'Claude',
              role: 'AI Code Generator',
              desc: 'Describe your app, Claude writes the code. Best for complex apps and detailed explanations.',
              color: 'border-violet-accent/50 bg-violet-accent/5',
            },
            {
              name: 'Cursor',
              role: 'AI Code Editor',
              desc: 'A code editor with AI built in. Great for editing and refining code with AI help.',
              color: 'border-orange-primary/50 bg-orange-primary/5',
            },
            {
              name: 'Vercel',
              role: 'Deployment Platform',
              desc: 'Deploy your finished app to the internet in one click. This very website runs on Vercel.',
              color: 'border-success-green/50 bg-success-green/5',
            },
          ].map((tool) => (
            <div key={tool.name} className={`card border p-6 space-y-3 ${tool.color}`}>
              <h3 className="text-xl font-chakra font-bold text-white">{tool.name}</h3>
              <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest">{tool.role}</p>
              <p className="text-sm text-lavender-muted leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz Section */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// KNOWLEDGE CHECK</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">
            Quiz Time
          </h2>
          <p className="text-lavender-muted mt-2">
            Test what you've learned. 4 questions. Take your time.
          </p>
        </div>

        {!quizStarted ? (
          <div className="card bg-gradient-hero p-8 sm:p-12 text-center space-y-6">
            <div className="text-6xl">🧠</div>
            <h3 className="text-2xl font-chakra font-bold text-white">Ready for the quiz?</h3>
            <p className="text-lavender-muted">4 questions · No time limit · Instant feedback</p>
            <button
              onClick={() => setQuizStarted(true)}
              className="px-8 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
            >
              START QUIZ →
            </button>
          </div>
        ) : quizComplete ? (
          <div className="card bg-gradient-hero p-8 sm:p-12 text-center space-y-6">
            <div className="text-6xl">{score === 4 ? '🏆' : score >= 3 ? '🎉' : '💪'}</div>
            <h3 className="text-2xl font-chakra font-bold text-white">
              You scored {score} out of {quizQuestions.length}!
            </h3>
            <p className="text-lavender-muted">
              {score === 4
                ? 'Perfect score! You nailed it. Ready for Lesson 2.'
                : score >= 3
                  ? 'Great job! You understand the core concepts.'
                  : 'Good effort! Review the lesson and try again.'}
            </p>

            {/* Score breakdown */}
            <div className="flex justify-center gap-3">
              {answers.map((correct, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded flex items-center justify-center font-chakra font-bold text-sm ${
                    correct
                      ? 'bg-success-green/20 text-success-green border border-success-green/50'
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}
                >
                  {correct ? '✓' : '✗'}
                </div>
              ))}
            </div>

            {/* XP earned */}
            <div className="bg-panel-deep rounded p-4 border border-orange-primary/30 inline-block mx-auto px-8">
              <p className="font-mono text-xs text-orange-primary uppercase tracking-widest mb-1">XP EARNED</p>
              <p className="text-3xl font-chakra font-bold text-white">+{score * 25} XP</p>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              {score < 4 && (
                <button
                  onClick={() => {
                    setQuizStarted(false)
                    setCurrentQuestion(0)
                    setSelectedAnswer(null)
                    setShowExplanation(false)
                    setScore(0)
                    setQuizComplete(false)
                    setAnswers([])
                  }}
                  className="px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet"
                >
                  RETRY QUIZ
                </button>
              )}
              <Link
                href="/learn/lesson-2"
                className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
              >
                NEXT LESSON →
              </Link>
            </div>
          </div>
        ) : (
          <div className="card p-8 space-y-6">
            {/* Progress */}
            <div className="flex justify-between items-center mb-4">
              <p className="font-mono text-xs text-lavender-dim uppercase">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </p>
              <p className="font-mono text-xs text-orange-primary">
                Score: {score}/{currentQuestion}
              </p>
            </div>
            <div className="w-full bg-panel-deep rounded-full h-2 mb-6">
              <div
                className="bg-gradient-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <h3 className="text-xl font-chakra font-bold text-white">{q.question}</h3>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((option, index) => {
                let style = 'border border-violet-border bg-panel-deep hover:border-violet-accent cursor-pointer'
                if (selectedAnswer !== null) {
                  if (index === q.correct) {
                    style = 'border-2 border-success-green bg-success-green/10 cursor-default'
                  } else if (index === selectedAnswer && index !== q.correct) {
                    style = 'border-2 border-red-500 bg-red-500/10 cursor-default'
                  } else {
                    style = 'border border-violet-border bg-panel-deep opacity-50 cursor-default'
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full text-left p-4 rounded-sm transition-all ${style}`}
                  >
                    <div className="flex gap-3 items-start">
                      <span className="font-mono text-xs text-lavender-dim min-w-[20px] mt-0.5">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-lavender text-sm leading-relaxed">{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`rounded p-4 border ${selectedAnswer === q.correct ? 'bg-success-green/10 border-success-green/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <p className={`font-mono text-xs uppercase tracking-widest mb-2 ${selectedAnswer === q.correct ? 'text-success-green' : 'text-red-400'}`}>
                  {selectedAnswer === q.correct ? '✓ CORRECT!' : '✗ NOT QUITE'}
                </p>
                <p className="text-lavender-muted text-sm leading-relaxed">{q.explanation}</p>
              </div>
            )}

            {/* Next button */}
            {showExplanation && (
              <button
                onClick={handleNext}
                className="w-full px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
              >
                {currentQuestion + 1 >= quizQuestions.length ? 'SEE RESULTS →' : 'NEXT QUESTION →'}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Bottom nav */}
      <div className="flex justify-between items-center pt-8 border-t border-violet-border">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet"
        >
          ← DASHBOARD
        </Link>
        <Link
          href="/learn/lesson-2"
          className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
        >
          LESSON 2: BUILD YOUR FIRST APP →
        </Link>
      </div>

      <div className="h-8" />

      {/* Vibe AI Agent */}
      <VibeAgent context="lesson-1" />
    </div>
  )
}
