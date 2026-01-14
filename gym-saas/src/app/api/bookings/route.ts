import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createBooking, getUserBookings, generateRecurringBookings } from "@/lib/booking";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming") !== "false";

    const bookings = await getUserBookings(session.user.id, upcoming);

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { scheduleId, date, recurring, weeksAhead } = body;

    if (!scheduleId || !date) {
      return NextResponse.json(
        { error: "Schedule ID and date are required" },
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // If recurring, generate multiple bookings
    if (recurring) {
      const result = await generateRecurringBookings(
        session.user.id,
        scheduleId,
        weeksAhead || 4
      );

      return NextResponse.json({
        success: true,
        created: result.created,
        errors: result.errors,
      });
    }

    // Single booking
    const result = await createBooking(session.user.id, scheduleId, bookingDate);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
