import { requireOwner } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StripeConnectButton } from "@/components/dashboard/stripe-connect-button";

export default async function SettingsPage() {
  const user = await requireOwner();

  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId },
  });

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure your gym settings and integrations
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gym Information</CardTitle>
            <CardDescription>Your gym details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Gym Name</label>
              <p className="text-lg">{tenant.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">URL Slug</label>
              <p className="text-lg">/{tenant.slug}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Processing</CardTitle>
            <CardDescription>
              Connect Stripe to accept membership payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Stripe Connect</p>
                <p className="text-sm text-muted-foreground">
                  Accept credit cards, Apple Pay, and Google Pay
                </p>
              </div>
              <div className="flex items-center gap-4">
                {tenant.stripeAccountStatus === "active" ? (
                  <Badge variant="default" className="bg-green-600">
                    Connected
                  </Badge>
                ) : tenant.stripeAccountId ? (
                  <Badge variant="secondary">Pending Setup</Badge>
                ) : (
                  <Badge variant="outline">Not Connected</Badge>
                )}
                <StripeConnectButton
                  isConnected={tenant.stripeAccountStatus === "active"}
                  isPending={!!tenant.stripeAccountId && tenant.stripeAccountStatus !== "active"}
                />
              </div>
            </div>

            {tenant.stripeAccountStatus === "active" && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Your Stripe account is connected and ready to accept payments.
                  You can now create membership plans and members can subscribe.
                </p>
              </div>
            )}

            {tenant.stripeAccountId && tenant.stripeAccountStatus !== "active" && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Please complete your Stripe onboarding to start accepting
                  payments. Click the button above to continue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite Link</CardTitle>
            <CardDescription>
              Share this link with members to join your gym
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <code className="text-sm">
                {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
                /register?gym={tenant.slug}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
