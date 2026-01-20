"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoAuth } from "@/lib/demo-auth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useDemoAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role === "OWNER" || user?.role === "SUPER_ADMIN") {
      router.push("/dashboard/admin");
    } else if (user?.role === "ASSISTANT") {
      router.push("/dashboard/assistant");
    } else {
      router.push("/dashboard/member");
    }
  }, [isAuthenticated, user, router]);

  return null;
}
