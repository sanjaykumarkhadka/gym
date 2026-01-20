"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { demoUser, type MockUser, type Role } from "./mock-data";

interface DemoAuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (role?: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(demoUser);

  const login = (role: Role = "OWNER") => {
    setUser({
      ...demoUser,
      role,
      name: role === "MEMBER" ? "Demo Member" : role === "ASSISTANT" ? "Demo Assistant" : "Demo Owner",
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: Role) => {
    if (user) {
      setUser({
        ...user,
        role,
        name: role === "MEMBER" ? "Demo Member" : role === "ASSISTANT" ? "Demo Assistant" : "Demo Owner",
      });
    }
  };

  return (
    <DemoAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (context === undefined) {
    throw new Error("useDemoAuth must be used within a DemoAuthProvider");
  }
  return context;
}
