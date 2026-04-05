import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-11-20',
  })

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get customer details
        const customer = await stripe.customers.retrieve(customerId)
        const email = (customer as Stripe.Customer).email

        if (email && subscription.items.data.length > 0) {
          // Update user's pro status
          await prisma.user.update({
            where: { email },
            data: {
              isProMember: true,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
            },
          }).catch(() => {
            // User doesn't exist yet, will be created on signup
          })
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        const deletedCustomerId = deletedSubscription.customer as string

        const deletedCustomer = await stripe.customers.retrieve(deletedCustomerId)
        const deletedEmail = (deletedCustomer as Stripe.Customer).email

        if (deletedEmail) {
          await prisma.user.update({
            where: { email: deletedEmail },
            data: { isProMember: false },
          }).catch(() => {
            // User doesn't exist, ignore
          })
        }
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
