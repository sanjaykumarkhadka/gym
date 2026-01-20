"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDemoAuth } from "@/lib/demo-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useDemoAuth();

  const handleDemoStart = (role: "OWNER" | "MEMBER") => {
    login(role);
    if (role === "OWNER") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/member");
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <Badge variant="outline">Demo</Badge>
        </div>
        <CardDescription className="text-center">
          This is a demo - click a button below to explore
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Start as Gym Owner</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create and manage your own gym, set up classes, membership plans, and accept payments.
            </p>
            <Button
              onClick={() => handleDemoStart("OWNER")}
              className="w-full"
            >
              Create Demo Gym
            </Button>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Join as Member</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Book classes, manage your bookings, and view membership plans.
            </p>
            <Button
              onClick={() => handleDemoStart("MEMBER")}
              variant="outline"
              className="w-full"
            >
              Join Demo Gym
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
