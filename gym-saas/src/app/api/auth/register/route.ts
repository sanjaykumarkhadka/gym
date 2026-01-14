import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, type, gymName, gymSlug } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    if (type === "owner") {
      // Validate gym details for owner registration
      if (!gymName || !gymSlug) {
        return NextResponse.json(
          { error: "Gym name and slug are required for owner registration" },
          { status: 400 }
        );
      }

      // Validate slug format
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(gymSlug)) {
        return NextResponse.json(
          { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }

      // Check if slug already exists
      const existingTenant = await prisma.tenant.findUnique({
        where: { slug: gymSlug },
      });

      if (existingTenant) {
        return NextResponse.json(
          { error: "This gym URL is already taken" },
          { status: 400 }
        );
      }

      // Create tenant and owner in a transaction
      const result = await prisma.$transaction(async (tx) => {
        const tenant = await tx.tenant.create({
          data: {
            name: gymName,
            slug: gymSlug,
            settings: {
              theme: "default",
              timezone: "UTC",
            },
          },
        });

        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: "OWNER",
            tenantId: tenant.id,
          },
        });

        return { tenant, user };
      });

      return NextResponse.json(
        {
          message: "Gym and owner account created successfully",
          tenantSlug: result.tenant.slug,
        },
        { status: 201 }
      );
    } else {
      // Member registration - must join existing tenant
      if (!gymSlug) {
        return NextResponse.json(
          { error: "Gym slug is required to join as a member" },
          { status: 400 }
        );
      }

      // Find the tenant
      const tenant = await prisma.tenant.findUnique({
        where: { slug: gymSlug },
      });

      if (!tenant) {
        return NextResponse.json(
          { error: "Gym not found. Please check the URL slug." },
          { status: 404 }
        );
      }

      // Create member
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "MEMBER",
          tenantId: tenant.id,
        },
      });

      return NextResponse.json(
        {
          message: "Member account created successfully",
          userId: user.id,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
