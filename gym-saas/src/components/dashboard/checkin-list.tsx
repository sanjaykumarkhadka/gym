"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  checkedIn: boolean;
  checkedInAt: Date | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface CheckInListProps {
  bookings: Booking[];
}

export function CheckInList({ bookings }: CheckInListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleCheckIn(bookingId: string) {
    setLoadingId(bookingId);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkin" }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to check in:", error);
    } finally {
      setLoadingId(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No bookings for this class
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className={`flex items-center justify-between p-3 rounded-lg ${
            booking.checkedIn ? "bg-green-50" : "bg-gray-50"
          }`}
        >
          <div>
            <div className="font-medium">{booking.user.name}</div>
            <div className="text-sm text-muted-foreground">
              {booking.user.email}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {booking.checkedIn ? (
              <>
                <Badge variant="default" className="bg-green-600">
                  Checked In
                </Badge>
                {booking.checkedInAt && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(booking.checkedInAt).toLocaleTimeString()}
                  </span>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => handleCheckIn(booking.id)}
                disabled={loadingId === booking.id}
              >
                {loadingId === booking.id ? "..." : "Check In"}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
