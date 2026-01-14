import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ classId: string; scheduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only OWNER and SUPER_ADMIN can delete schedules
    if (!["OWNER", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { classId, scheduleId } = await params;

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

    // Verify schedule belongs to class
    const schedule = await prisma.classSchedule.findFirst({
      where: {
        id: scheduleId,
        classTypeId: classId,
      },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    // Delete the schedule (this will cascade delete related bookings)
    await prisma.classSchedule.delete({
      where: { id: scheduleId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json(
      { error: "Failed to delete schedule" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ classId: string; scheduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only OWNER and SUPER_ADMIN can update schedules
    if (!["OWNER", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { classId, scheduleId } = await params;

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
    const { dayOfWeek, startTime, duration, capacity, instructor, isActive } =
      body;

    const schedule = await prisma.classSchedule.update({
      where: { id: scheduleId },
      data: {
        ...(dayOfWeek !== undefined && { dayOfWeek }),
        ...(startTime && { startTime }),
        ...(duration && { duration }),
        ...(capacity && { capacity }),
        ...(instructor !== undefined && { instructor }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
}
