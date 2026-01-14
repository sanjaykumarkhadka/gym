import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession, getOrCreateCustomer } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    // Get plan and tenant
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
      include: { tenant: true },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (!plan.tenant.stripeAccountId || plan.tenant.stripeAccountStatus !== "active") {
      return NextResponse.json(
        { error: "Payment processing is not set up for this gym" },
        { status: 400 }
      );
    }

    if (!plan.stripePriceId) {
      return NextResponse.json(
        { error: "Plan is not configured for payments" },
        { status: 400 }
      );
    }

    // Get or create customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const customer = await getOrCreateCustomer(
      plan.tenant.stripeAccountId,
      user.email,
      user.name,
      user.id
    );

    // Update user's Stripe customer ID if not set
    if (!user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const checkoutSession = await createCheckoutSession(
      plan.tenant.stripeAccountId,
      plan.stripePriceId,
      customer.id,
      user.email,
      `${baseUrl}/dashboard/member?subscribed=true`,
      `${baseUrl}/dashboard/plans?cancelled=true`,
      {
        userId: user.id,
        planId: plan.id,
        tenantId: plan.tenantId,
      }
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
