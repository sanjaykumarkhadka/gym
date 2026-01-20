"use client";

import { demoSchedules, demoBookingCounts } from "@/lib/mock-data";
import { BookingCalendar } from "@/components/dashboard/booking-calendar";

export default function BookPage() {
  const schedules = demoSchedules;
  const existingBookings = [
    { id: "booking-1", scheduleId: "sched-1", date: new Date().toISOString().split("T")[0] },
  ];
  const bookingCounts = demoBookingCounts;

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
