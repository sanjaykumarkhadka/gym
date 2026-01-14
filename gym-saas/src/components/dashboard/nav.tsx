"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Role } from "@prisma/client";

interface NavItem {
  title: string;
  href: string;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    roles: ["SUPER_ADMIN", "OWNER"],
  },
  {
    title: "Check-in",
    href: "/dashboard/assistant",
    roles: ["SUPER_ADMIN", "OWNER", "ASSISTANT"],
  },
  {
    title: "My Bookings",
    href: "/dashboard/member",
    roles: ["SUPER_ADMIN", "OWNER", "ASSISTANT", "MEMBER"],
  },
  {
    title: "Book Class",
    href: "/dashboard/book",
    roles: ["SUPER_ADMIN", "OWNER", "ASSISTANT", "MEMBER"],
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
    roles: ["SUPER_ADMIN", "OWNER", "ASSISTANT"],
  },
  {
    title: "Members",
    href: "/dashboard/members",
    roles: ["SUPER_ADMIN", "OWNER", "ASSISTANT"],
  },
  {
    title: "Plans",
    href: "/dashboard/plans",
    roles: ["SUPER_ADMIN", "OWNER"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    roles: ["SUPER_ADMIN", "OWNER"],
  },
];

interface DashboardNavProps {
  role: Role;
}

export function DashboardNav({ role }: DashboardNavProps) {
  const pathname = usePathname();

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <nav className="hidden lg:flex w-64 flex-col border-r bg-white min-h-[calc(100vh-4rem)]">
      <div className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
