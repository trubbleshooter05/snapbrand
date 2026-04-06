import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-03-25.dahlia',
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
          try {
            await prisma.user.update({
              where: { email },
              data: {
                isProMember: true,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscription.id,
              },
            })
          } catch (updateError: unknown) {
            // Only ignore if user not found (Prisma error P2025)
            const isP2025 =
              updateError !== null &&
              typeof updateError === 'object' &&
              'code' in updateError &&
              (updateError as { code: unknown }).code === 'P2025'
            if (isP2025) {
              console.info(`User not found for email: ${email} - will be created on signup`)
            } else {
              console.error(`Failed to update user subscription for email ${email}:`, updateError)
              throw updateError
            }
          }
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        const deletedCustomerId = deletedSubscription.customer as string

        const deletedCustomer = await stripe.customers.retrieve(deletedCustomerId)
        const deletedEmail = (deletedCustomer as Stripe.Customer).email

        if (deletedEmail) {
          try {
            await prisma.user.update({
              where: { email: deletedEmail },
              data: { isProMember: false },
            })
          } catch (updateError: unknown) {
            // Only ignore if user not found (Prisma error P2025)
            const isP2025 =
              updateError !== null &&
              typeof updateError === 'object' &&
              'code' in updateError &&
              (updateError as { code: unknown }).code === 'P2025'
            if (isP2025) {
              console.info(`User not found for email: ${deletedEmail}`)
            } else {
              console.error(`Failed to update user subscription status for email ${deletedEmail}:`, updateError)
              throw updateError
            }
          }
        }
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing failed:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
