"use client";

import { DemoAuthProvider } from "@/lib/demo-auth";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DemoAuthProvider>
      {children}
      <Toaster position="top-right" />
    </DemoAuthProvider>
  );
}
