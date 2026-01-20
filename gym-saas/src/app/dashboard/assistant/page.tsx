"use client";

import { demoTodayBookings, demoSchedules } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckInList } from "@/components/dashboard/checkin-list";

export default function AssistantDashboardPage() {
  const today = new Date();
  const todayBookings = demoTodayBookings;

  // Group bookings by class
  const bookingsByClass = todayBookings.reduce(
    (acc, booking) => {
      const key = `${booking.schedule.id}-${booking.schedule.startTime}`;
      if (!acc[key]) {
        acc[key] = {
          schedule: booking.schedule,
          bookings: [],
        };
      }
      acc[key].bookings.push(booking);
      return acc;
    },
    {} as Record<string, { schedule: typeof todayBookings[0]["schedule"]; bookings: typeof todayBookings }>
  );

  const classGroups = Object.values(bookingsByClass);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Check-In</h2>
        <p className="text-muted-foreground">
          Today&apos;s classes - {today.toLocaleDateString()}
        </p>
      </div>

      {classGroups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No classes scheduled for today
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {classGroups.map((group) => (
            <Card key={group.schedule.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {group.schedule.classType.color && (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: group.schedule.classType.color }}
                    />
                  )}
                  {group.schedule.classType.name}
                </CardTitle>
                <CardDescription>
                  {group.schedule.startTime} - {group.schedule.duration} min
                  {group.schedule.instructor &&
                    ` | Instructor: ${group.schedule.instructor}`}
                  <span className="ml-2">
                    ({group.bookings.filter((b) => b.checkedIn).length}/
                    {group.bookings.length} checked in)
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CheckInList bookings={group.bookings} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
