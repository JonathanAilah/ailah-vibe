'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VibeAgent } from '@/components/VibeAgent'
import { useAppContext } from '@/app/context'

const steps = [
  {
    id: 1,
    title: 'Pick your idea',
    duration: '2 min',
    content: `Every great app starts with a simple idea. For your first app, you want something small enough to finish in one session but real enough to be useful.

The best first projects solve a problem you actually have. Think about your daily life — what's annoying, slow, or repetitive? That's usually a great app idea.

For this lesson, we'll build a **Personal Quote Board** — a simple app where you can save your favorite quotes, see them displayed beautifully, and delete ones you no longer want. It's small, useful, and teaches you the core skills.`,
    tip: 'Keep your first app simple. One screen, one purpose. You can always add features later.',
    example: null,
  },
  {
    id: 2,
    title: 'Write your prompt',
    duration: '3 min',
    content: `Now we need to describe our app to AI. Remember the prompt formula from Lesson 1:

This is the prompt we'll use for our Quote Board app. Read through it carefully — notice how specific it is. Every detail helps the AI understand exactly what to build.

After this lesson you'll paste this prompt into Claude or another AI tool to generate the actual code.`,
    tip: 'Copy this prompt exactly. Don\'t skip any part — each sentence adds something important.',
    example: `Build me a personal quote board app.

It should let users type in a quote and an author name, then click "Save Quote" to add it to their collection. Each quote should display in a beautiful card with the quote text in large text and the author name below it. Users should be able to delete any quote by clicking an X button on the card.

Make it look clean and modern with a dark background, white text, and purple accent colors. The quotes should be saved so they stay even when the page is refreshed. Show a nice empty state message when there are no quotes yet.

Build this as a single HTML file with all CSS and JavaScript included.`,
  },
  {
    id: 3,
    title: 'Run it in Claude',
    duration: '5 min',
    content: `Now it's time to actually generate the code. Here's exactly how to do it:

1. Go to **claude.ai** (or any AI coding tool)
2. Start a new conversation
3. Paste the prompt from Step 2
4. Hit Enter and watch it generate your app

The AI will write all the HTML, CSS, and JavaScript for you. It usually takes 30-60 seconds. When it's done you'll see a full block of code.

Don't worry if you don't understand every line — that's totally normal. You're learning to describe what you want, not memorize syntax.`,
    tip: 'If Claude asks clarifying questions, just answer them. It\'s trying to build something better for you.',
    example: `// What Claude generates looks something like this:
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Quote Board</title>
  <style>
    /* All your styles here */
    body { background: #0a0611; color: white; }
    .quote-card { background: #1E1233; border-radius: 12px; padding: 24px; }
    /* ... more styles ... */
  </style>
</head>
<body>
  <!-- Your app layout -->
  <div id="app">
    <input id="quote-input" placeholder="Enter a quote..." />
    <button onclick="saveQuote()">Save Quote</button>
    <div id="quotes-grid"></div>
  </div>
  <script>
    // All your JavaScript here
    function saveQuote() { /* ... */ }
  </script>
</body>
</html>`,
  },
  {
    id: 4,
    title: 'Preview your app',
    duration: '2 min',
    content: `Once Claude generates the code, you need to see it running. Here's the easiest way:

**Method 1 — Claude's built-in preview:**
Claude usually shows a live preview right in the chat. Look for a preview panel on the right side or a "Preview" button above the code.

**Method 2 — Save and open in browser:**
1. Copy all the generated code
2. Open Notepad (Windows) or TextEdit (Mac)
3. Paste the code
4. Save the file as **quote-board.html**
5. Find the file in your Downloads/Desktop
6. Double-click it — it opens in your browser!

You should see your Quote Board app running. Try adding a quote to make sure it works.`,
    tip: 'Always test your app right after generating it. If something doesn\'t work, tell Claude what\'s broken and it will fix it.',
    example: null,
  },
  {
    id: 5,
    title: 'Refine it',
    duration: '5 min',
    content: `Your first version is working — great! Now let's make it better. This is the most important skill in vibe coding: knowing how to ask for improvements.

Here are some ways you could improve your Quote Board. Pick one or two that you like and ask Claude to add them. Practice using specific, clear language.

The key is to describe the problem or feature clearly. Don't say "make it better" — say exactly what you want changed.`,
    tip: 'One improvement at a time. Ask for one change, test it, then ask for the next one.',
    example: `// Improvement prompts to try:

"Add a feature that randomly displays one of my saved quotes 
in a highlighted hero section at the top of the page."

"Add a category tag to each quote (Motivation, Funny, 
Life, etc.) and let me filter quotes by category."

"When I hover over a quote card, show a 'Copy' button 
that copies the quote text to my clipboard."

"Add a search bar that filters my quotes in real time 
as I type."`,
  },
]

const quizQuestions = [
  {
    id: 1,
    question: 'What is the best type of project for your first app?',
    options: [
      'A complex social media platform with user accounts and feeds',
      'Something small that solves one problem and fits on one screen',
      'A mobile app with push notifications and GPS',
      'A game with multiplayer and real-time scoring',
    ],
    correct: 1,
    explanation: 'Your first app should be small and focused. One problem, one screen, one clear purpose. You can always add features once the basics work. Complexity is the enemy of finishing.',
  },
  {
    id: 2,
    question: 'In our Quote Board prompt, why did we specify "save so they stay when the page is refreshed"?',
    options: [
      'It\'s just filler text that doesn\'t matter',
      'Because without it, quotes would disappear every time you reload the page',
      'Because it makes the app run faster',
      'It\'s required for all web apps',
    ],
    correct: 1,
    explanation: 'By default, data entered into a web page disappears when you refresh. By specifying persistence in the prompt, we told the AI to use localStorage — a browser feature that saves data permanently on the user\'s device.',
  },
  {
    id: 3,
    question: 'After Claude generates your app, what should you do first?',
    options: [
      'Share it on social media immediately',
      'Read every line of code to understand it fully',
      'Preview and test it to make sure it works as expected',
      'Delete it and start over with a different prompt',
    ],
    correct: 2,
    explanation: 'Always test your app immediately after generating it. Click every button, try every feature. If something doesn\'t work, you can tell Claude exactly what\'s broken. Testing first saves time.',
  },
  {
    id: 4,
    question: 'Which is the best way to ask Claude for an improvement?',
    options: [
      '"Make it better"',
      '"I don\'t like it, try again"',
      '"Add a search bar that filters quotes in real time as I type"',
      '"Fix everything that\'s wrong"',
    ],
    correct: 2,
    explanation: 'Specific improvement prompts get specific results. "Make it better" gives the AI no direction. "Add a search bar that filters quotes in real time as I type" tells the AI exactly what feature to add and how it should behave.',
  },
]

export default function Lesson2() {
  const { awardXP } = useAppContext()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])

  const handleStepComplete = (stepId: number) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]))
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

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
      awardXP(score * 37)
    } else {
      setCurrentQuestion((q) => q + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const q = quizQuestions[currentQuestion]
  const allStepsComplete = completedSteps.size >= steps.length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-16">

      {/* Header */}
      <div className="space-y-4">
        <Link href="/learn/lesson-1" className="text-lavender-dim hover:text-lavender font-mono text-sm transition-colors">
          ← BACK TO LESSON 1
        </Link>
        <div className="card bg-gradient-hero p-8 sm:p-12 space-y-4">
          <p className="eyebrow">COURSE 1 · LESSON 2 OF 5</p>
          <h1 className="text-3xl sm:text-5xl font-chakra font-bold text-white">
            Build Your First App
          </h1>
          <p className="text-base text-lavender-muted max-w-xl">
            Stop reading about building and actually build something. In this lesson you'll create a real, working app from scratch using AI — step by step.
          </p>
          <div className="flex gap-6 pt-2">
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">5</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">Steps</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">~15</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">Min</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-chakra font-bold text-orange-primary">+150</p>
              <p className="font-mono text-xs text-lavender-dim uppercase">XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* What you'll build */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// WHAT YOU'LL BUILD</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">
            A Personal Quote Board
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: '✍️', label: 'Add quotes', desc: 'Type any quote and author name' },
            { icon: '🗂️', label: 'Save them', desc: 'Quotes persist after refresh' },
            { icon: '🗑️', label: 'Delete them', desc: 'Remove quotes you no longer want' },
          ].map((f) => (
            <div key={f.label} className="card p-6 text-center space-y-2">
              <div className="text-3xl">{f.icon}</div>
              <p className="font-chakra font-bold text-white">{f.label}</p>
              <p className="text-sm text-lavender-muted">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="card border-l-4 border-orange-primary p-6 bg-orange-primary/5">
          <p className="font-mono text-xs text-orange-primary uppercase tracking-widest mb-2">// WHY THIS PROJECT</p>
          <p className="text-lavender-muted text-sm leading-relaxed">
            A Quote Board teaches you the three fundamentals of every app: <span className="text-white font-bold">input</span> (adding quotes), <span className="text-white font-bold">display</span> (showing them nicely), and <span className="text-white font-bold">persistence</span> (saving data). Master these three and you can build almost anything.
          </p>
        </div>
      </section>

      {/* Step-by-step */}
      <section className="space-y-6">
        <div>
          <p className="eyebrow mb-3">// BUILD IT STEP BY STEP</p>
          <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">
            Follow along
          </h2>
          <p className="text-lavender-muted mt-2">Complete each step before moving to the next.</p>
        </div>

        {/* Step progress */}
        <div className="flex gap-2">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`flex-1 h-2 rounded-full transition-all ${
                completedSteps.has(step.id)
                  ? 'bg-success-green'
                  : i === currentStep
                  ? 'bg-orange-primary'
                  : 'bg-panel-raised'
              }`}
            />
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, i) => {
            const isActive = i === currentStep
            const isComplete = completedSteps.has(step.id)
            const isLocked = i > currentStep && !isComplete

            return (
              <div
                key={step.id}
                className={`card p-6 sm:p-8 space-y-4 transition-all ${
                  isActive ? 'border-orange-primary/50 bg-orange-primary/5' : ''
                } ${isLocked ? 'opacity-50' : ''}`}
              >
                {/* Step header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center font-chakra font-bold flex-shrink-0 ${
                      isComplete
                        ? 'bg-success-green text-panel-deep'
                        : isActive
                        ? 'bg-orange-primary text-ink'
                        : 'bg-panel-raised text-lavender-dim'
                    }`}>
                      {isComplete ? '✓' : step.id}
                    </div>
                    <div>
                      <h3 className="font-chakra font-bold text-white">{step.title}</h3>
                      <p className="font-mono text-xs text-lavender-dim">{step.duration}</p>
                    </div>
                  </div>
                  {!isActive && !isComplete && (
                    <button
                      onClick={() => !isLocked && setCurrentStep(i)}
                      disabled={isLocked}
                      className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors"
                    >
                      {isLocked ? '🔒 LOCKED' : 'OPEN'}
                    </button>
                  )}
                </div>

                {/* Step content */}
                {(isActive || isComplete) && (
                  <div className="space-y-4 pl-14">
                    <p className="text-lavender-muted text-sm leading-relaxed whitespace-pre-line">
                      {step.content}
                    </p>

                    {/* Tip */}
                    <div className="bg-violet-accent/10 border border-violet-accent/30 rounded p-4">
                      <p className="font-mono text-xs text-violet-accent uppercase tracking-widest mb-1">// PRO TIP</p>
                      <p className="text-lavender text-sm">{step.tip}</p>
                    </div>

                    {/* Code example */}
                    {step.example && (
                      <div>
                        <p className="eyebrow mb-2">// EXAMPLE</p>
                        <div className="bg-panel-deep rounded p-4 border border-violet-border overflow-x-auto">
                          <pre className="font-mono text-xs text-lavender-dim leading-relaxed whitespace-pre-wrap">
                            {step.example}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Mark complete button */}
                    {isActive && (
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
                      >
                        {i === steps.length - 1 ? 'COMPLETE LESSON →' : 'DONE — NEXT STEP →'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Quiz — only shows after all steps complete */}
      {allStepsComplete && (
        <section className="space-y-6">
          <div>
            <p className="eyebrow mb-3">// KNOWLEDGE CHECK</p>
            <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Quiz Time</h2>
            <p className="text-lavender-muted mt-2">4 questions on what you just learned.</p>
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
                  ? 'Perfect! You\'re ready to make your app look incredible in Lesson 3.'
                  : score >= 3
                  ? 'Great work! You\'ve got the core concepts down.'
                  : 'Good effort! Review the steps and try again.'}
              </p>

              <div className="flex justify-center gap-3">
                {answers.map((correct, i) => (
                  <div key={i} className={`w-10 h-10 rounded flex items-center justify-center font-chakra font-bold text-sm ${
                    correct
                      ? 'bg-success-green/20 text-success-green border border-success-green/50'
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    {correct ? '✓' : '✗'}
                  </div>
                ))}
              </div>

              <div className="bg-panel-deep rounded p-4 border border-orange-primary/30 inline-block mx-auto px-8">
                <p className="font-mono text-xs text-orange-primary uppercase tracking-widest mb-1">XP EARNED</p>
                <p className="text-3xl font-chakra font-bold text-white">+{score * 37} XP</p>
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
                  href="/learn/lesson-3"
                  className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
                >
                  LESSON 3: MAKE IT LOOK GOOD →
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
                <div
                  className="bg-gradient-accent h-full rounded-full transition-all duration-500"
                  style={{ width: `${(currentQuestion / quizQuestions.length) * 100}%` }}
                />
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
      )}

      {/* Locked quiz message */}
      {!allStepsComplete && (
        <div className="card p-8 text-center space-y-4 opacity-60">
          <div className="text-4xl">🔒</div>
          <h3 className="font-chakra font-bold text-white">Quiz Locked</h3>
          <p className="text-lavender-muted text-sm">Complete all 5 steps above to unlock the quiz.</p>
          <p className="font-mono text-xs text-lavender-dim">{completedSteps.size} of {steps.length} steps complete</p>
        </div>
      )}

      {/* Bottom nav */}
      <div className="flex justify-between items-center pt-8 border-t border-violet-border">
        <Link href="/learn/lesson-1" className="px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
          ← LESSON 1
        </Link>
        <Link href="/dashboard" className="px-6 py-3 rounded-sm border border-violet-border text-lavender-dim font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
          DASHBOARD
        </Link>
      </div>

      <div className="h-8" />

      {/* Vibe AI Agent */}
      <VibeAgent context="lesson-2" />
    </div>
  )
}
