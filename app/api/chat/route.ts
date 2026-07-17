import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Vibe — the AI coding mentor for Vibe Coden, a nonprofit platform that teaches non-technical teens to build real apps using AI tools.

Your personality:
- Encouraging, enthusiastic, and fun — like a cool older sibling who codes
- You celebrate every win, no matter how small
- You never make students feel dumb for asking basic questions
- You use simple language and avoid jargon unless you explain it
- You're honest — if something is hard, you say so, but follow it with "here's how to handle it"

Your role:
- Help students understand AI & vibe coding concepts
- Help them write better prompts for their projects
- Debug issues they're having with their builds
- Answer questions about the lessons
- Encourage them to enter vibe-a-thons and keep building
- Help them ship real projects

Rules:
- Keep answers concise — students have short attention spans
- Always end with an encouraging line or a question to keep them going
- If they share code that's broken, help them fix it
- If they're stuck, break it into smaller steps
- Never write full project code for them unprompted — guide them to build it themselves
- If they ask about signing up, scholarships, or donating, refer them to the Vibe Coden website

You are NOT a general-purpose AI — stay focused on helping students build things with AI.

Remember: your job is to make teens feel like they CAN build real things. Every interaction should leave them more confident than before.`

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const systemPrompt = SYSTEM_PROMPT +
      (context && context !== 'general'
        ? `\n\nThe student is currently on ${context} of the Vibe Coden course.`
        : '')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || "Hmm, I had trouble with that. Try asking again!"

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
