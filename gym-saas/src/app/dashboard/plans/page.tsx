import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlanSubscribeButton } from "@/components/dashboard/plan-subscribe-button";

const INTERVAL_LABELS: Record<string, string> = {
  WEEKLY: "/week",
  MONTHLY: "/month",
  YEARLY: "/year",
};

export default async function PlansPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isOwner = ["OWNER", "SUPER_ADMIN"].includes(session.user.role);

  // Get all plans for this tenant
  const plans = await prisma.membershipPlan.findMany({
    where: {
      tenantId: session.user.tenantId,
      ...(isOwner ? {} : { isActive: true }),
    },
    orderBy: { price: "asc" },
  });

  // Get user's active subscription
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
    include: { plan: true },
  });

  // Check if Stripe is connected (for subscribe buttons)
  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: {
      stripeAccountId: true,
      stripeAccountStatus: true,
    },
  });

  const stripeConnected = tenant?.stripeAccountStatus === "active";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Membership Plans</h2>
          <p className="text-muted-foreground">
            {isOwner
              ? "Configure your gym's membership plans"
              : "Choose a membership plan to get started"}
          </p>
        </div>
        {isOwner && (
          <Button asChild>
            <Link href="/dashboard/plans/new">Add Plan</Link>
          </Button>
        )}
      </div>

      {activeSubscription && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Current Subscription
                </p>
                <p className="text-lg font-semibold">
                  {activeSubscription.plan.name}
                </p>
              </div>
              <Badge variant="default" className="bg-green-600">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No membership plans available
            </p>
            {isOwner && (
              <Button asChild>
                <Link href="/dashboard/plans/new">Create your first plan</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={!plan.isActive ? "opacity-60" : undefined}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {!plan.isActive && <Badge variant="secondary">Inactive</Badge>}
                </div>
                {plan.description && (
                  <CardDescription>{plan.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${Number(plan.price).toFixed(2)}
                  <span className="text-base font-normal text-muted-foreground">
                    {INTERVAL_LABELS[plan.interval]}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                {isOwner ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/plans/${plan.id}/edit`}>Edit</Link>
                  </Button>
                ) : activeSubscription?.planId === plan.id ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : stripeConnected && plan.stripePriceId ? (
                  <PlanSubscribeButton planId={plan.id} />
                ) : (
                  <Button disabled className="w-full">
                    {stripeConnected ? "Not configured" : "Payments not set up"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isOwner && !stripeConnected && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>Note:</strong> Connect Stripe in Settings to enable online
              payments for membership plans.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
