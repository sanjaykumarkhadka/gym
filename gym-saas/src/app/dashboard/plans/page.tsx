"use client";

import { demoPlans } from "@/lib/mock-data";
import { useDemoAuth } from "@/lib/demo-auth";
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
import { toast } from "sonner";

const INTERVAL_LABELS: Record<string, string> = {
  WEEKLY: "/week",
  MONTHLY: "/month",
  YEARLY: "/year",
};

export default function PlansPage() {
  const { user } = useDemoAuth();
  const isOwner = user?.role === "OWNER" || user?.role === "SUPER_ADMIN";
  const plans = demoPlans;
  const activeSubscription = { planId: "plan-2", plan: { name: "Premium" } };
  const stripeConnected = true;

  const handleSubscribe = (planName: string) => {
    toast.success(`Demo: Would subscribe to ${planName}`);
  };

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

      {!isOwner && activeSubscription && (
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
                <Button variant="outline" className="w-full" onClick={() => toast.info("Demo: Edit plan")}>
                  Edit
                </Button>
              ) : activeSubscription?.planId === plan.id ? (
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              ) : stripeConnected && plan.stripePriceId ? (
                <Button className="w-full" onClick={() => handleSubscribe(plan.name)}>
                  Subscribe
                </Button>
              ) : (
                <Button disabled className="w-full">
                  {stripeConnected ? "Not configured" : "Payments not set up"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
