"use client";

import { demoClassTypes } from "@/lib/mock-data";
import { useDemoAuth } from "@/lib/demo-auth";
import { ClassList } from "@/components/dashboard/class-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ClassesPage() {
  const { user } = useDemoAuth();
  const classTypes = demoClassTypes;
  const canManage = user?.role === "OWNER" || user?.role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
          <p className="text-muted-foreground">
            Manage your class types and schedules
          </p>
        </div>
        {canManage && (
          <Button asChild>
            <Link href="/dashboard/classes/new">Add Class Type</Link>
          </Button>
        )}
      </div>

      <ClassList classTypes={classTypes} canManage={canManage} />
    </div>
  );
}
