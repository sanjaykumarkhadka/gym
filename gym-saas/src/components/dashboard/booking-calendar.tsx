"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  duration: number;
  capacity: number;
  instructor: string | null;
  classType: {
    id: string;
    name: string;
    color: string | null;
  };
}

interface ExistingBooking {
  id: string;
  scheduleId: string;
  date: string | Date;
}

interface BookingCount {
  scheduleId: string;
  date: string | Date;
  _count: number;
}

interface BookingCalendarProps {
  schedules: Schedule[];
  existingBookings: ExistingBooking[];
  bookingCounts: BookingCount[];
}

export function BookingCalendar({
  schedules,
  existingBookings: initialExistingBookings,
  bookingCounts,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isBooking, setIsBooking] = useState(false);
  const [bookingType, setBookingType] = useState<"single" | "recurring">(
    "single"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingBookings, setExistingBookings] = useState(initialExistingBookings);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get schedules for selected date
  const dayOfWeek = selectedDate?.getDay() ?? 0;
  const availableSchedules = schedules.filter((s) => s.dayOfWeek === dayOfWeek);

  // Check if user already has booking for a schedule on selected date
  function hasBooking(scheduleId: string): boolean {
    if (!selectedDate) return false;
    const dateStr = selectedDate.toISOString().split("T")[0];
    return existingBookings.some(
      (b) =>
        b.scheduleId === scheduleId &&
        new Date(b.date).toISOString().split("T")[0] === dateStr
    );
  }

  // Get booking count for a schedule on selected date
  function getBookingCount(scheduleId: string): number {
    if (!selectedDate) return 0;
    const dateStr = selectedDate.toISOString().split("T")[0];
    const count = bookingCounts.find(
      (c) =>
        c.scheduleId === scheduleId &&
        new Date(c.date).toISOString().split("T")[0] === dateStr
    );
    return count?._count ?? 0;
  }

  async function handleBook() {
    if (!selectedSchedule || !selectedDate) return;

    setIsLoading(true);
    setError(null);

    // Simulate booking
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Add to existing bookings locally
    setExistingBookings(prev => [
      ...prev,
      {
        id: `demo-${Date.now()}`,
        scheduleId: selectedSchedule.id,
        date: selectedDate.toISOString().split("T")[0],
      }
    ]);

    toast.success(
      bookingType === "recurring"
        ? "Demo: Booked for 4 weeks"
        : "Demo: Class booked successfully"
    );

    setIsBooking(false);
    setSelectedSchedule(null);
    setIsLoading(false);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>Choose a date to see available classes</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < today}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Available Classes
            {selectedDate && (
              <span className="font-normal text-muted-foreground ml-2">
                {DAYS[selectedDate.getDay()]},{" "}
                {selectedDate.toLocaleDateString()}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {availableSchedules.length === 0
              ? "No classes scheduled for this day"
              : `${availableSchedules.length} class${availableSchedules.length > 1 ? "es" : ""} available`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableSchedules.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No classes are scheduled for this day. Try selecting a different
              date.
            </p>
          ) : (
            <div className="space-y-3">
              {availableSchedules.map((schedule) => {
                const booked = hasBooking(schedule.id);
                const currentCount = getBookingCount(schedule.id);
                const isFull = currentCount >= schedule.capacity;

                return (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      {schedule.classType.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: schedule.classType.color }}
                        />
                      )}
                      <div>
                        <div className="font-medium">
                          {schedule.classType.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {schedule.startTime} ({schedule.duration} min)
                          {schedule.instructor && ` - ${schedule.instructor}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {currentCount}/{schedule.capacity} spots filled
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {booked ? (
                        <Badge variant="secondary">Booked</Badge>
                      ) : isFull ? (
                        <Badge variant="destructive">Full</Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setIsBooking(true);
                          }}
                        >
                          Book
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isBooking} onOpenChange={setIsBooking}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Class</DialogTitle>
            <DialogDescription>
              {selectedSchedule?.classType.name} on{" "}
              {selectedDate?.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Booking Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    checked={bookingType === "single"}
                    onChange={() => setBookingType("single")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Single booking</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    checked={bookingType === "recurring"}
                    onChange={() => setBookingType("recurring")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Weekly (4 weeks)</span>
                </label>
              </div>
              {bookingType === "recurring" && (
                <p className="text-xs text-muted-foreground">
                  This will book you for every {DAYS[selectedSchedule?.dayOfWeek ?? 0]} for the next 4 weeks
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBooking(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleBook} disabled={isLoading}>
              {isLoading
                ? "Booking..."
                : bookingType === "recurring"
                  ? "Book 4 Weeks"
                  : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
