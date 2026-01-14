import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserBookings } from "@/lib/booking";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingActions } from "@/components/dashboard/booking-actions";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function MemberDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const upcomingBookings = await getUserBookings(session.user.id, true);
  const pastBookings = await getUserBookings(session.user.id, false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
        <p className="text-muted-foreground">
          View and manage your class bookings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>
              {upcomingBookings.length === 0
                ? "No upcoming classes"
                : `${upcomingBookings.length} upcoming booking${upcomingBookings.length > 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">
                  You don&apos;t have any upcoming bookings
                </p>
                <a
                  href="/dashboard/book"
                  className="text-primary hover:underline text-sm"
                >
                  Book a class
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {booking.schedule.classType.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: booking.schedule.classType.color,
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium">
                          {booking.schedule.classType.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {DAYS[new Date(booking.date).getDay()]},{" "}
                          {new Date(booking.date).toLocaleDateString()} at{" "}
                          {booking.schedule.startTime}
                        </div>
                        {booking.schedule.instructor && (
                          <div className="text-xs text-muted-foreground">
                            Instructor: {booking.schedule.instructor}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                      <BookingActions bookingId={booking.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Past Classes</CardTitle>
            <CardDescription>
              {pastBookings.length === 0
                ? "No past classes"
                : `${pastBookings.length} past booking${pastBookings.length > 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pastBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No past bookings
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pastBookings.slice(0, 10).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {booking.schedule.classType.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: booking.schedule.classType.color,
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium">
                          {booking.schedule.classType.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        booking.status === "COMPLETED"
                          ? "default"
                          : booking.status === "NO_SHOW"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {booking.checkedIn ? "Attended" : booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
