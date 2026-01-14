import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingCalendar } from "@/components/dashboard/booking-calendar";

export default async function BookPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get all active schedules for this tenant
  const schedules = await prisma.classSchedule.findMany({
    where: {
      classType: { tenantId: session.user.tenantId },
      isActive: true,
    },
    include: {
      classType: true,
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  // Get user's existing bookings for the next 30 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 30);

  const existingBookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: today,
        lte: endDate,
      },
      status: "CONFIRMED",
    },
    select: {
      id: true,
      scheduleId: true,
      date: true,
    },
  });

  // Get booking counts for capacity checking
  const bookingCounts = await prisma.booking.groupBy({
    by: ["scheduleId", "date"],
    where: {
      schedule: {
        classType: { tenantId: session.user.tenantId },
      },
      date: {
        gte: today,
        lte: endDate,
      },
      status: { in: ["CONFIRMED", "COMPLETED"] },
    },
    _count: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Book a Class</h2>
        <p className="text-muted-foreground">
          Select a class from the calendar to book your spot
        </p>
      </div>

      <BookingCalendar
        schedules={schedules}
        existingBookings={existingBookings}
        bookingCounts={bookingCounts}
      />
    </div>
  );
}
