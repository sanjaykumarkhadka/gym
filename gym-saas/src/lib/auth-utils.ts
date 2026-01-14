import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

export async function getSession() {
  const session = await auth();
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }
  return user;
}

export async function requireOwner() {
  return requireRole(["OWNER", "SUPER_ADMIN"]);
}

export async function requireAssistant() {
  return requireRole(["OWNER", "ASSISTANT", "SUPER_ADMIN"]);
}

export function canManageTenant(userRole: Role): boolean {
  return userRole === "OWNER" || userRole === "SUPER_ADMIN";
}

export function canManageClasses(userRole: Role): boolean {
  return ["OWNER", "ASSISTANT", "SUPER_ADMIN"].includes(userRole);
}

export function canManageBookings(userRole: Role): boolean {
  return ["OWNER", "ASSISTANT", "SUPER_ADMIN"].includes(userRole);
}

export function canCheckInMembers(userRole: Role): boolean {
  return ["OWNER", "ASSISTANT", "SUPER_ADMIN"].includes(userRole);
}

export function canViewDashboard(userRole: Role): boolean {
  return ["OWNER", "SUPER_ADMIN"].includes(userRole);
}

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "OWNER":
      return "/dashboard/admin";
    case "ASSISTANT":
      return "/dashboard/assistant";
    case "MEMBER":
    default:
      return "/dashboard/member";
  }
}
