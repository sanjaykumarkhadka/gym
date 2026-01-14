"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface StripeConnectButtonProps {
  isConnected: boolean;
  isPending: boolean;
}

export function StripeConnectButton({
  isConnected,
  isPending,
}: StripeConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleConnect() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/connect", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start Stripe onboarding");
      }
    } catch (error) {
      console.error("Failed to connect Stripe:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isConnected) {
    return (
      <Button variant="outline" disabled>
        Connected
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      {isLoading
        ? "Loading..."
        : isPending
          ? "Continue Setup"
          : "Connect Stripe"}
    </Button>
  );
}
