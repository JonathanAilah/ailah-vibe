'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface VibeAgentProps {
  context?: string
  minimizable?: boolean
}

export const VibeAgent = ({ context = 'general', minimizable = true }: VibeAgentProps) => {
  const getGreeting = () => {
    if (context === 'lesson-1') return "Hey! I'm Vibe, your AI coding mentor 👋 I'm here to help you through this lesson. Got questions about vibe coding, prompts, or anything else? Ask away!"
    if (context === 'lesson-2') return "Hey builder! 👋 I'm Vibe. Working on your first app? I can help you write better prompts, fix issues, or just cheer you on. What do you need?"
    if (context === 'lesson-3') return "Hey! I'm Vibe 🎨 Ready to make your app look amazing? Ask me anything about design, colors, layout — I got you."
    if (context === 'lesson-4') return "Hey! I'm Vibe 🚀 Deployment questions? I'll walk you through getting your app live step by step. What's up?"
    if (context === 'lesson-5') return "Hey competitor! I'm Vibe 🏆 Ready to enter your first vibe-a-thon? I'll help you pick your project, write your description, and prep your submission. Let's go!"
    return "Hey! I'm Vibe, your AI coding mentor 👋 Ask me anything — prompts, debugging, design, deployment, you name it!"
  }

  const getSuggestions = () => {
    if (context === 'lesson-1') return ['What is vibe coding?', 'How do I write a good prompt?', 'What tools do I need?']
    if (context === 'lesson-2') return ['Help me write a prompt for my app', 'My app isn\'t working, help!', 'How do I save data?']
    if (context === 'lesson-3') return ['What colors work well together?', 'How do I make my app responsive?', 'What makes a good UI?']
    if (context === 'lesson-4') return ['How do I deploy to Vercel?', 'What is a domain name?', 'My deploy failed, help!']
    if (context === 'lesson-5') return ['Help me pick a project idea', 'How do I get more votes?', 'Help me write my description']
    return ['Help me write a prompt', 'How do I deploy my app?', 'I\'m stuck, help!']
  }

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: getGreeting() },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          context,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API error')
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Oops — I ran into a connection issue. Try again in a sec! You've got this 💪",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-primary rounded-full flex items-center justify-center shadow-orange-glow hover:shadow-orange-glow-hover transition-all hover:-translate-y-1"
      >
        <span className="text-2xl">🤖</span>
      </button>
    )
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-96 flex flex-col rounded-lg overflow-hidden border border-violet-border shadow-card-lg transition-all ${minimized ? 'h-14' : 'h-[520px]'}`}
      style={{ background: '#120A1E' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-panel-raised border-b border-violet-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-primary/20 border border-orange-primary/50 flex items-center justify-center text-sm">
            🤖
          </div>
          <div>
            <p className="font-chakra font-bold text-white text-sm">VIBE</p>
            <p className="font-mono text-xs text-success-green">● Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {minimizable && (
            <button
              onClick={() => setMinimized(!minimized)}
              className="text-lavender-dim hover:text-lavender transition-colors font-mono text-sm px-2"
            >
              {minimized ? '▲' : '▼'}
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-lavender-dim hover:text-lavender transition-colors font-mono text-sm px-2"
          >
            ✕
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-orange-primary text-ink font-medium'
                    : 'bg-surface-violet text-lavender border border-violet-border'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface-violet text-lavender border border-violet-border rounded-lg px-4 py-3 text-sm">
                  <span className="animate-pulse">Vibe is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {getSuggestions().map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-violet-border text-lavender-muted hover:border-violet-accent hover:text-lavender transition-all font-mono"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-violet-border flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Vibe anything..."
                disabled={loading}
                className="flex-1 bg-panel-deep border border-violet-border rounded-sm px-3 py-2 text-lavender text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-xs uppercase transition-all hover:shadow-orange-glow disabled:opacity-40 disabled:cursor-not-allowed"
              >
                SEND
              </button>
            </div>
            <p className="font-mono text-xs text-lavender-dim mt-2 text-center">
              Powered by Claude AI · Vibe Coden Mentor
            </p>
          </div>
        </>
      )}
    </div>
  )
}
