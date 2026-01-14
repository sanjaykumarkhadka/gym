import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createConnectedAccount,
  getConnectOnboardingLink,
  getAccountStatus,
} from "@/lib/stripe";

// Start Stripe Connect onboarding
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["OWNER", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    let accountId = tenant.stripeAccountId;

    // Create account if doesn't exist
    if (!accountId) {
      const account = await createConnectedAccount(
        tenant.id,
        session.user.email,
        tenant.name
      );
      accountId = account.id;

      await prisma.tenant.update({
        where: { id: tenant.id },
        data: {
          stripeAccountId: accountId,
          stripeAccountStatus: "pending",
        },
      });
    }

    // Get onboarding link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const onboardingUrl = await getConnectOnboardingLink(
      accountId,
      `${baseUrl}/dashboard/settings?stripe=complete`,
      `${baseUrl}/dashboard/settings?stripe=refresh`
    );

    return NextResponse.json({ url: onboardingUrl });
  } catch (error) {
    console.error("Error starting Stripe Connect:", error);
    return NextResponse.json(
      { error: "Failed to start Stripe Connect onboarding" },
      { status: 500 }
    );
  }
}

// Check Stripe Connect status
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
    });

    if (!tenant || !tenant.stripeAccountId) {
      return NextResponse.json({
        connected: false,
        status: null,
      });
    }

    const status = await getAccountStatus(tenant.stripeAccountId);

    // Update tenant status if changed
    const newStatus = status.chargesEnabled ? "active" : "pending";
    if (tenant.stripeAccountStatus !== newStatus) {
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { stripeAccountStatus: newStatus },
      });
    }

    return NextResponse.json({
      connected: true,
      status: newStatus,
      chargesEnabled: status.chargesEnabled,
      payoutsEnabled: status.payoutsEnabled,
    });
  } catch (error) {
    console.error("Error checking Stripe status:", error);
    return NextResponse.json(
      { error: "Failed to check Stripe status" },
      { status: 500 }
    );
  }
}
