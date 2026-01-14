import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createStripeProduct } from "@/lib/stripe";
import type { PlanInterval } from "@prisma/client";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.membershipPlan.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { price: "asc" },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["OWNER", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, interval } = body;

    if (!name || !price || !interval) {
      return NextResponse.json(
        { error: "Name, price, and interval are required" },
        { status: 400 }
      );
    }

    // Validate interval
    const validIntervals: PlanInterval[] = ["WEEKLY", "MONTHLY", "YEARLY"];
    if (!validIntervals.includes(interval)) {
      return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
    }

    // Get tenant to check for Stripe
    const tenant = await prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    let stripeProductId: string | null = null;
    let stripePriceId: string | null = null;

    // If Stripe is connected, create product and price
    if (tenant.stripeAccountId && tenant.stripeAccountStatus === "active") {
      try {
        const stripeInterval =
          interval === "WEEKLY"
            ? "week"
            : interval === "MONTHLY"
              ? "month"
              : "year";

        const result = await createStripeProduct(
          tenant.stripeAccountId,
          name,
          Math.round(price * 100), // Convert to cents
          stripeInterval
        );

        stripeProductId = result.productId;
        stripePriceId = result.priceId;
      } catch (stripeError) {
        console.error("Failed to create Stripe product:", stripeError);
        // Continue without Stripe - can be set up later
      }
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        name,
        description,
        price,
        interval,
        tenantId: session.user.tenantId,
        stripeProductId,
        stripePriceId,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}
