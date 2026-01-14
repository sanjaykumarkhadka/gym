import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only OWNER and SUPER_ADMIN can create schedules
    if (!["OWNER", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { classId } = await params;

    // Verify class belongs to tenant
    const classType = await prisma.classType.findFirst({
      where: {
        id: classId,
        tenantId: session.user.tenantId,
      },
    });

    if (!classType) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const body = await request.json();
    const { dayOfWeek, startTime, duration, capacity, instructor } = body;

    // Validate required fields
    if (dayOfWeek === undefined || !startTime || !duration || !capacity) {
      return NextResponse.json(
        { error: "Day, time, duration, and capacity are required" },
        { status: 400 }
      );
    }

    // Check for duplicate schedule
    const existingSchedule = await prisma.classSchedule.findFirst({
      where: {
        classTypeId: classId,
        dayOfWeek,
        startTime,
      },
    });

    if (existingSchedule) {
      return NextResponse.json(
        { error: "A schedule already exists for this day and time" },
        { status: 400 }
      );
    }

    const schedule = await prisma.classSchedule.create({
      data: {
        classTypeId: classId,
        dayOfWeek,
        startTime,
        duration,
        capacity,
        instructor,
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}
