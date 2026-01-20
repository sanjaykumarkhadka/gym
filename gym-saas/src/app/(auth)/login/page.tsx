"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDemoAuth } from "@/lib/demo-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useDemoAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    login("OWNER");
    router.push("/dashboard/admin");
  }

  const handleQuickLogin = (role: "OWNER" | "ASSISTANT" | "MEMBER") => {
    login(role);
    if (role === "OWNER") {
      router.push("/dashboard/admin");
    } else if (role === "ASSISTANT") {
      router.push("/dashboard/assistant");
    } else {
      router.push("/dashboard/member");
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <Badge variant="outline">Demo</Badge>
        </div>
        <CardDescription className="text-center">
          This is a demo - click any button below to explore
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <p className="text-sm font-medium text-center mb-2">Quick Login As:</p>
          <Button
            onClick={() => handleQuickLogin("OWNER")}
            className="w-full"
          >
            Login as Gym Owner
          </Button>
          <Button
            onClick={() => handleQuickLogin("ASSISTANT")}
            variant="outline"
            className="w-full"
          >
            Login as Staff Assistant
          </Button>
          <Button
            onClick={() => handleQuickLogin("MEMBER")}
            variant="outline"
            className="w-full"
          >
            Login as Member
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or use form
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="demo@gymsaas.com"
              defaultValue="demo@gymsaas.com"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue="demo123"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
