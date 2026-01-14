import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getCurrentTenant() {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return null;
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  });

  return tenant;
}

export async function getTenantBySlug(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
  });

  return tenant;
}

export async function getTenantMembers(tenantId: string) {
  const members = await prisma.user.findMany({
    where: { tenantId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      subscriptions: {
        where: { status: "ACTIVE" },
        include: { plan: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return members;
}

export async function getTenantStats(tenantId: string) {
  const [memberCount, activeSubscriptions, todayBookings, totalRevenue] =
    await Promise.all([
      // Total members
      prisma.user.count({
        where: { tenantId, role: "MEMBER" },
      }),

      // Active subscriptions
      prisma.subscription.count({
        where: {
          user: { tenantId },
          status: "ACTIVE",
        },
      }),

      // Today's bookings
      prisma.booking.count({
        where: {
          schedule: {
            classType: { tenantId },
          },
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
          status: "CONFIRMED",
        },
      }),

      // Total revenue (sum of active subscription values)
      prisma.subscription.findMany({
        where: {
          user: { tenantId },
          status: "ACTIVE",
        },
        include: { plan: true },
      }),
    ]);

  const monthlyRevenue = totalRevenue.reduce((sum, sub) => {
    const price = Number(sub.plan.price);
    // Normalize to monthly
    if (sub.plan.interval === "WEEKLY") return sum + price * 4;
    if (sub.plan.interval === "YEARLY") return sum + price / 12;
    return sum + price;
  }, 0);

  return {
    memberCount,
    activeSubscriptions,
    todayBookings,
    monthlyRevenue,
  };
}

export async function updateTenantSettings(
  tenantId: string,
  settings: object
) {
  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: { settings: settings as Parameters<typeof prisma.tenant.update>[0]["data"]["settings"] },
  });

  return tenant;
}
