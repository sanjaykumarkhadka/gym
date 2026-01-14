import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { constructWebhookEvent } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { userId, planId } = session.metadata || {};

  if (!userId || !planId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  // Create subscription record
  await prisma.subscription.create({
    data: {
      userId,
      planId,
      status: "ACTIVE",
      stripeSubscriptionId: session.subscription as string,
      startDate: new Date(),
    },
  });

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const stripeSubId = subscription.id;

  const existingSub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: stripeSubId },
  });

  if (!existingSub) {
    console.log(`Subscription ${stripeSubId} not found in database`);
    return;
  }

  let status: "ACTIVE" | "PAST_DUE" | "CANCELLED" = "ACTIVE";
  if (subscription.status === "past_due") {
    status = "PAST_DUE";
  } else if (subscription.status === "canceled") {
    status = "CANCELLED";
  }

  await prisma.subscription.update({
    where: { stripeSubscriptionId: stripeSubId },
    data: {
      status,
      endDate: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000)
        : null,
    },
  });

  console.log(`Subscription ${stripeSubId} updated to ${status}`);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const stripeSubId = subscription.id;

  const existingSub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: stripeSubId },
  });

  if (!existingSub) {
    console.log(`Subscription ${stripeSubId} not found in database`);
    return;
  }

  await prisma.subscription.update({
    where: { stripeSubscriptionId: stripeSubId },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      endDate: new Date(),
    },
  });

  // Optionally cancel future bookings
  await prisma.booking.updateMany({
    where: {
      userId: existingSub.userId,
      date: { gte: new Date() },
      status: "CONFIRMED",
    },
    data: {
      status: "CANCELLED",
    },
  });

  console.log(`Subscription ${stripeSubId} cancelled`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Get subscription ID from invoice parent or subscription field
  const stripeSubId = typeof invoice.parent === 'object' && invoice.parent?.subscription_details?.subscription
    ? invoice.parent.subscription_details.subscription as string
    : null;

  if (!stripeSubId) return;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: stripeSubId },
    data: { status: "PAST_DUE" },
  });

  console.log(`Payment failed for subscription ${stripeSubId}`);
}
