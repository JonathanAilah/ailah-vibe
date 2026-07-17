'use client'

import { useEffect, useState } from 'react'

const prompts = [
  'build me a 2-player pong game',
  'create a todo list app with local storage',
  'make a weather dashboard using an API',
  'build a snake game',
  'create a portfolio website',
]

export const TerminalWindow = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    const prompt = prompts[currentPromptIndex]
    let charIndex = 0

    if (isTyping) {
      const typeInterval = setInterval(() => {
        if (charIndex < prompt.length) {
          setDisplayedText(prompt.slice(0, charIndex + 1))
          charIndex++
        } else {
          setIsTyping(false)
          setShowOutput(true)
          clearInterval(typeInterval)
        }
      }, 50)

      return () => clearInterval(typeInterval)
    }
  }, [currentPromptIndex, isTyping])

  useEffect(() => {
    if (showOutput) {
      const timer = setTimeout(() => {
        setDisplayedText('')
        setShowOutput(false)
        setIsTyping(true)
        setCurrentPromptIndex((prev) => (prev + 1) % prompts.length)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showOutput])

  return (
    <div className="bg-panel-deep rounded-lg overflow-hidden border border-violet-border shadow-card">
      {/* Window header */}
      <div className="bg-panel-raised px-4 py-3 flex gap-2 items-center border-b border-violet-border">
        <div className="w-3 h-3 rounded-full bg-orange-primary" />
        <div className="w-3 h-3 rounded-full bg-orange-bright" />
        <div className="w-3 h-3 rounded-full bg-orange-light" />
        <span className="ml-4 font-mono text-xs text-lavender-dim">vibe-coden-terminal</span>
      </div>

      {/* Terminal content */}
      <div className="p-6 font-mono text-sm space-y-3 h-64">
        <div className="text-lavender-dim">
          <span className="text-orange-primary">→</span> {displayedText}
          {isTyping && <span className="animate-blink">█</span>}
        </div>

        {showOutput && (
          <>
            <div className="text-success-green">✓ Build completed in 2.3s</div>
            <div className="text-lavender-dim text-xs">generating deployment link...</div>
            <div className="text-success-green">✓ Shipped! 🚀</div>
            <div className="text-lavender-dim text-xs">
              Live at: https://vibe-build-{Math.random().toString(36).slice(2, 8)}.app
            </div>
          </>
        )}
      </div>
    </div>
  )
}
