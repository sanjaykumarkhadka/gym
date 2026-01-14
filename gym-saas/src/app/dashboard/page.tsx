import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDashboardPath } from "@/lib/auth-utils";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const dashboardPath = getDashboardPath(session.user.role);
  redirect(dashboardPath);
}
