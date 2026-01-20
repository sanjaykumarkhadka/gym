"use client";

import { demoTenant } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const tenant = demoTenant;

  const handleStripeConnect = () => {
    toast.info("Demo: Would redirect to Stripe Connect onboarding");
  };

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
                <Badge variant="default" className="bg-green-600">
                  Connected
                </Badge>
                <Button variant="outline" onClick={handleStripeConnect}>
                  Manage
                </Button>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Your Stripe account is connected and ready to accept payments.
                You can now create membership plans and members can subscribe.
              </p>
            </div>
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
                https://gymsaas.demo/register?gym={tenant.slug}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
