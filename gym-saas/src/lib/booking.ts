import { prisma } from "@/lib/prisma";
import type { BookingStatus } from "@prisma/client";

interface BookingResult {
  success: boolean;
  error?: string;
  booking?: {
    id: string;
    date: Date;
    status: BookingStatus;
  };
}

export async function createBooking(
  userId: string,
  scheduleId: string,
  date: Date,
  isRecurring: boolean = false,
  recurringUntil?: Date
): Promise<BookingResult> {
  // Verify schedule exists and get capacity
  const schedule = await prisma.classSchedule.findUnique({
    where: { id: scheduleId },
    include: {
      classType: true,
      bookings: {
        where: {
          date,
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
      },
    },
  });

  if (!schedule) {
    return { success: false, error: "Schedule not found" };
  }

  if (!schedule.isActive) {
    return { success: false, error: "This class is not currently active" };
  }

  // Check capacity
  const currentBookings = schedule.bookings.length;
  if (currentBookings >= schedule.capacity) {
    return { success: false, error: "This class is fully booked" };
  }

  // Check for existing booking
  const existingBooking = await prisma.booking.findUnique({
    where: {
      userId_scheduleId_date: {
        userId,
        scheduleId,
        date,
      },
    },
  });

  if (existingBooking) {
    return { success: false, error: "You already have a booking for this class" };
  }

  // Check if user has active subscription
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: {
          status: "ACTIVE",
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } },
          ],
        },
      },
    },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  // For now, allow bookings without subscription for testing
  // In production, you'd want to check: if (user.subscriptions.length === 0) return error

  // Create the booking
  const booking = await prisma.booking.create({
    data: {
      userId,
      scheduleId,
      date,
      status: "CONFIRMED",
      isRecurring,
      recurringUntil,
    },
  });

  return {
    success: true,
    booking: {
      id: booking.id,
      date: booking.date,
      status: booking.status,
    },
  };
}

export async function cancelBooking(
  userId: string,
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },
  });

  if (!booking) {
    return { success: false, error: "Booking not found" };
  }

  if (booking.status === "CANCELLED") {
    return { success: false, error: "Booking is already cancelled" };
  }

  // Check if booking is in the past
  if (booking.date < new Date()) {
    return { success: false, error: "Cannot cancel past bookings" };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  return { success: true };
}

export async function getAvailableSlots(
  tenantId: string,
  startDate: Date,
  endDate: Date
) {
  // Get all schedules for the tenant
  const schedules = await prisma.classSchedule.findMany({
    where: {
      classType: { tenantId },
      isActive: true,
    },
    include: {
      classType: true,
    },
  });

  // Get all bookings for the date range
  const bookings = await prisma.booking.findMany({
    where: {
      schedule: {
        classType: { tenantId },
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      status: { in: ["CONFIRMED", "COMPLETED"] },
    },
  });

  // Generate slots for each day in the range
  const slots: Array<{
    date: Date;
    schedule: typeof schedules[0];
    bookedCount: number;
    availableSpots: number;
  }> = [];

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const dateStr = currentDate.toISOString().split("T")[0];

    for (const schedule of schedules) {
      if (schedule.dayOfWeek === dayOfWeek) {
        const bookedCount = bookings.filter(
          (b) =>
            b.scheduleId === schedule.id &&
            b.date.toISOString().split("T")[0] === dateStr
        ).length;

        slots.push({
          date: new Date(currentDate),
          schedule,
          bookedCount,
          availableSpots: schedule.capacity - bookedCount,
        });
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
}

export async function getUserBookings(userId: string, upcoming: boolean = true) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const bookings = await prisma.booking.findMany({
    where: {
      userId,
      ...(upcoming
        ? { date: { gte: now }, status: "CONFIRMED" }
        : { date: { lt: now } }),
    },
    include: {
      schedule: {
        include: {
          classType: true,
        },
      },
    },
    orderBy: { date: upcoming ? "asc" : "desc" },
    take: upcoming ? 20 : 50,
  });

  return bookings;
}

export async function checkInBooking(
  bookingId: string,
  staffUserId: string
): Promise<{ success: boolean; error?: string }> {
  // Verify staff has permission
  const staff = await prisma.user.findUnique({
    where: { id: staffUserId },
  });

  if (!staff || !["OWNER", "ASSISTANT", "SUPER_ADMIN"].includes(staff.role)) {
    return { success: false, error: "Unauthorized" };
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      schedule: {
        classType: { tenantId: staff.tenantId },
      },
    },
  });

  if (!booking) {
    return { success: false, error: "Booking not found" };
  }

  if (booking.checkedIn) {
    return { success: false, error: "Already checked in" };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      checkedIn: true,
      checkedInAt: new Date(),
      status: "COMPLETED",
    },
  });

  return { success: true };
}

// Generate recurring bookings for the next N weeks
export async function generateRecurringBookings(
  userId: string,
  scheduleId: string,
  weeksAhead: number = 4
): Promise<{ created: number; errors: string[] }> {
  const schedule = await prisma.classSchedule.findUnique({
    where: { id: scheduleId },
  });

  if (!schedule) {
    return { created: 0, errors: ["Schedule not found"] };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + weeksAhead * 7);

  let created = 0;
  const errors: string[] = [];

  // Find all dates that match the day of week
  const currentDate = new Date(today);
  while (currentDate <= endDate) {
    if (currentDate.getDay() === schedule.dayOfWeek) {
      const result = await createBooking(userId, scheduleId, new Date(currentDate));
      if (result.success) {
        created++;
      } else if (result.error && !result.error.includes("already have a booking")) {
        errors.push(`${currentDate.toDateString()}: ${result.error}`);
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { created, errors };
}
