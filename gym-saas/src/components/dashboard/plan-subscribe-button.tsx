"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PlanSubscribeButtonProps {
  planId: string;
}

export function PlanSubscribeButton({ planId }: PlanSubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubscribe() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch (error) {
      console.error("Failed to subscribe:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button className="w-full" onClick={handleSubscribe} disabled={isLoading}>
      {isLoading ? "Loading..." : "Subscribe"}
    </Button>
  );
}
