import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { amount, scholarshipId, scholarshipName } = await request.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Please enter a valid donation amount.' }, { status: 400 })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ error: 'Payments are not configured yet.' }, { status: 500 })
    }

    const stripe = new Stripe(stripeKey)
    const siteUrl = 'https://ailah-vibe.vercel.app'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: scholarshipName
                ? `Scholarship Donation — ${scholarshipName}`
                : 'Vibe Coden General Scholarship Fund',
              description: 'Vibe Coden is a 501(c)(3) nonprofit. Your donation helps fund AI education scholarships.',
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/fund-a-scholarship?donation=success`,
      cancel_url: `${siteUrl}/fund-a-scholarship?donation=cancelled`,
      metadata: {
        scholarshipId: scholarshipId || 'general',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Stripe checkout error:', message)
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 })
  }
}
