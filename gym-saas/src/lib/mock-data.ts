// Mock data for static demo site

export type Role = "SUPER_ADMIN" | "OWNER" | "ASSISTANT" | "MEMBER";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string;
  tenantSlug: string;
}

export interface MockClassType {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  tenantId: string;
  schedules: MockSchedule[];
}

export interface MockSchedule {
  id: string;
  classTypeId: string;
  dayOfWeek: number;
  startTime: string;
  duration: number;
  capacity: number;
  instructor: string | null;
  isActive: boolean;
  classType: {
    id: string;
    name: string;
    color: string | null;
  };
}

export interface MockBooking {
  id: string;
  userId: string;
  scheduleId: string;
  date: string;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  checkedIn: boolean;
  schedule: MockSchedule;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface MockPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: "WEEKLY" | "MONTHLY" | "YEARLY";
  isActive: boolean;
  stripePriceId: string | null;
}

export interface MockMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  subscriptions: {
    id: string;
    status: string;
    plan: { name: string };
  }[];
}

export interface MockTenant {
  id: string;
  name: string;
  slug: string;
  stripeAccountId: string | null;
  stripeAccountStatus: string | null;
}

// Demo user - defaults to OWNER role
export const demoUser: MockUser = {
  id: "demo-user-1",
  name: "Demo Owner",
  email: "demo@gymsaas.com",
  role: "OWNER",
  tenantId: "demo-tenant-1",
  tenantSlug: "demo-gym",
};

// Demo tenant
export const demoTenant: MockTenant = {
  id: "demo-tenant-1",
  name: "FitZone Studio",
  slug: "demo-gym",
  stripeAccountId: "acct_demo123",
  stripeAccountStatus: "active",
};

// Demo class types with schedules
export const demoClassTypes: MockClassType[] = [
  {
    id: "class-1",
    name: "Morning Yoga",
    description: "Start your day with a relaxing yoga session",
    color: "#8B5CF6",
    tenantId: "demo-tenant-1",
    schedules: [
      {
        id: "sched-1",
        classTypeId: "class-1",
        dayOfWeek: 1,
        startTime: "07:00",
        duration: 60,
        capacity: 20,
        instructor: "Sarah Johnson",
        isActive: true,
        classType: { id: "class-1", name: "Morning Yoga", color: "#8B5CF6" },
      },
      {
        id: "sched-2",
        classTypeId: "class-1",
        dayOfWeek: 3,
        startTime: "07:00",
        duration: 60,
        capacity: 20,
        instructor: "Sarah Johnson",
        isActive: true,
        classType: { id: "class-1", name: "Morning Yoga", color: "#8B5CF6" },
      },
      {
        id: "sched-3",
        classTypeId: "class-1",
        dayOfWeek: 5,
        startTime: "07:00",
        duration: 60,
        capacity: 20,
        instructor: "Sarah Johnson",
        isActive: true,
        classType: { id: "class-1", name: "Morning Yoga", color: "#8B5CF6" },
      },
    ],
  },
  {
    id: "class-2",
    name: "HIIT Training",
    description: "High-intensity interval training for maximum results",
    color: "#EF4444",
    tenantId: "demo-tenant-1",
    schedules: [
      {
        id: "sched-4",
        classTypeId: "class-2",
        dayOfWeek: 1,
        startTime: "18:00",
        duration: 45,
        capacity: 15,
        instructor: "Mike Chen",
        isActive: true,
        classType: { id: "class-2", name: "HIIT Training", color: "#EF4444" },
      },
      {
        id: "sched-5",
        classTypeId: "class-2",
        dayOfWeek: 3,
        startTime: "18:00",
        duration: 45,
        capacity: 15,
        instructor: "Mike Chen",
        isActive: true,
        classType: { id: "class-2", name: "HIIT Training", color: "#EF4444" },
      },
      {
        id: "sched-6",
        classTypeId: "class-2",
        dayOfWeek: 5,
        startTime: "18:00",
        duration: 45,
        capacity: 15,
        instructor: "Mike Chen",
        isActive: true,
        classType: { id: "class-2", name: "HIIT Training", color: "#EF4444" },
      },
    ],
  },
  {
    id: "class-3",
    name: "Spin Class",
    description: "Indoor cycling for cardio fitness",
    color: "#3B82F6",
    tenantId: "demo-tenant-1",
    schedules: [
      {
        id: "sched-7",
        classTypeId: "class-3",
        dayOfWeek: 2,
        startTime: "06:30",
        duration: 45,
        capacity: 25,
        instructor: "Emma Wilson",
        isActive: true,
        classType: { id: "class-3", name: "Spin Class", color: "#3B82F6" },
      },
      {
        id: "sched-8",
        classTypeId: "class-3",
        dayOfWeek: 4,
        startTime: "06:30",
        duration: 45,
        capacity: 25,
        instructor: "Emma Wilson",
        isActive: true,
        classType: { id: "class-3", name: "Spin Class", color: "#3B82F6" },
      },
      {
        id: "sched-9",
        classTypeId: "class-3",
        dayOfWeek: 6,
        startTime: "09:00",
        duration: 45,
        capacity: 25,
        instructor: "Emma Wilson",
        isActive: true,
        classType: { id: "class-3", name: "Spin Class", color: "#3B82F6" },
      },
    ],
  },
  {
    id: "class-4",
    name: "Pilates",
    description: "Core strength and flexibility training",
    color: "#10B981",
    tenantId: "demo-tenant-1",
    schedules: [
      {
        id: "sched-10",
        classTypeId: "class-4",
        dayOfWeek: 2,
        startTime: "10:00",
        duration: 50,
        capacity: 18,
        instructor: "Lisa Park",
        isActive: true,
        classType: { id: "class-4", name: "Pilates", color: "#10B981" },
      },
      {
        id: "sched-11",
        classTypeId: "class-4",
        dayOfWeek: 4,
        startTime: "10:00",
        duration: 50,
        capacity: 18,
        instructor: "Lisa Park",
        isActive: true,
        classType: { id: "class-4", name: "Pilates", color: "#10B981" },
      },
    ],
  },
];

// Helper to get all schedules
export const demoSchedules: MockSchedule[] = demoClassTypes.flatMap(
  (ct) => ct.schedules
);

// Demo bookings
const today = new Date();
const getDateString = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
};

export const demoUpcomingBookings: MockBooking[] = [
  {
    id: "booking-1",
    userId: "demo-user-1",
    scheduleId: "sched-1",
    date: getDateString(1),
    status: "CONFIRMED",
    checkedIn: false,
    schedule: demoSchedules.find((s) => s.id === "sched-1")!,
  },
  {
    id: "booking-2",
    userId: "demo-user-1",
    scheduleId: "sched-4",
    date: getDateString(1),
    status: "CONFIRMED",
    checkedIn: false,
    schedule: demoSchedules.find((s) => s.id === "sched-4")!,
  },
  {
    id: "booking-3",
    userId: "demo-user-1",
    scheduleId: "sched-7",
    date: getDateString(2),
    status: "CONFIRMED",
    checkedIn: false,
    schedule: demoSchedules.find((s) => s.id === "sched-7")!,
  },
];

export const demoPastBookings: MockBooking[] = [
  {
    id: "booking-past-1",
    userId: "demo-user-1",
    scheduleId: "sched-1",
    date: getDateString(-7),
    status: "COMPLETED",
    checkedIn: true,
    schedule: demoSchedules.find((s) => s.id === "sched-1")!,
  },
  {
    id: "booking-past-2",
    userId: "demo-user-1",
    scheduleId: "sched-4",
    date: getDateString(-5),
    status: "COMPLETED",
    checkedIn: true,
    schedule: demoSchedules.find((s) => s.id === "sched-4")!,
  },
  {
    id: "booking-past-3",
    userId: "demo-user-1",
    scheduleId: "sched-7",
    date: getDateString(-3),
    status: "NO_SHOW",
    checkedIn: false,
    schedule: demoSchedules.find((s) => s.id === "sched-7")!,
  },
];

// Demo membership plans
export const demoPlans: MockPlan[] = [
  {
    id: "plan-1",
    name: "Basic",
    description: "Access to all classes during off-peak hours",
    price: 29.99,
    interval: "MONTHLY",
    isActive: true,
    stripePriceId: "price_demo1",
  },
  {
    id: "plan-2",
    name: "Premium",
    description: "Unlimited access to all classes, any time",
    price: 59.99,
    interval: "MONTHLY",
    isActive: true,
    stripePriceId: "price_demo2",
  },
  {
    id: "plan-3",
    name: "Annual",
    description: "Full access for one year - best value!",
    price: 499.99,
    interval: "YEARLY",
    isActive: true,
    stripePriceId: "price_demo3",
  },
];

// Demo members
export const demoMembers: MockMember[] = [
  {
    id: "demo-user-1",
    name: "Demo Owner",
    email: "demo@gymsaas.com",
    role: "OWNER",
    createdAt: "2024-01-15T10:00:00Z",
    subscriptions: [],
  },
  {
    id: "member-1",
    name: "John Smith",
    email: "john@example.com",
    role: "MEMBER",
    createdAt: "2024-02-10T14:30:00Z",
    subscriptions: [{ id: "sub-1", status: "ACTIVE", plan: { name: "Premium" } }],
  },
  {
    id: "member-2",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "MEMBER",
    createdAt: "2024-02-20T09:15:00Z",
    subscriptions: [{ id: "sub-2", status: "ACTIVE", plan: { name: "Basic" } }],
  },
  {
    id: "member-3",
    name: "Bob Williams",
    email: "bob@example.com",
    role: "MEMBER",
    createdAt: "2024-03-05T11:45:00Z",
    subscriptions: [{ id: "sub-3", status: "ACTIVE", plan: { name: "Premium" } }],
  },
  {
    id: "member-4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "MEMBER",
    createdAt: "2024-03-12T16:20:00Z",
    subscriptions: [],
  },
  {
    id: "assistant-1",
    name: "Tom Assistant",
    email: "tom@gymsaas.com",
    role: "ASSISTANT",
    createdAt: "2024-01-20T08:00:00Z",
    subscriptions: [],
  },
];

// Demo stats for admin dashboard
export const demoStats = {
  memberCount: demoMembers.filter((m) => m.role === "MEMBER").length,
  activeSubscriptions: demoMembers.filter((m) => m.subscriptions.length > 0).length,
  todayBookings: 12,
  monthlyRevenue: 2459.85,
};

// Demo today's bookings for check-in
export const demoTodayBookings: MockBooking[] = [
  {
    id: "today-1",
    userId: "member-1",
    scheduleId: "sched-1",
    date: today.toISOString().split("T")[0],
    status: "CONFIRMED",
    checkedIn: true,
    schedule: demoSchedules.find((s) => s.id === "sched-1")!,
    user: { id: "member-1", name: "John Smith", email: "john@example.com" },
  },
  {
    id: "today-2",
    userId: "member-2",
    scheduleId: "sched-1",
    date: today.toISOString().split("T")[0],
    status: "CONFIRMED",
    checkedIn: false,
    schedule: demoSchedules.find((s) => s.id === "sched-1")!,
    user: { id: "member-2", name: "Alice Johnson", email: "alice@example.com" },
  },
  {
    id: "today-3",
    userId: "member-3",
    scheduleId: "sched-1",
    date: today.toISOString().split("T")[0],
    status: "CONFIRMED",
    checkedIn: false,
    schedule: demoSchedules.find((s) => s.id === "sched-1")!,
    user: { id: "member-3", name: "Bob Williams", email: "bob@example.com" },
  },
  {
    id: "today-4",
    userId: "member-1",
    scheduleId: "sched-4",
    date: today.toISOString().split("T")[0],
    status: "CONFIRMED",
    checkedIn: false,
    schedule: demoSchedules.find((s) => s.id === "sched-4")!,
    user: { id: "member-1", name: "John Smith", email: "john@example.com" },
  },
  {
    id: "today-5",
    userId: "member-4",
    scheduleId: "sched-4",
    date: today.toISOString().split("T")[0],
    status: "CONFIRMED",
    checkedIn: false,
    schedule: demoSchedules.find((s) => s.id === "sched-4")!,
    user: { id: "member-4", name: "Emily Davis", email: "emily@example.com" },
  },
];

// Booking counts for capacity display
export const demoBookingCounts: { scheduleId: string; date: string; _count: number }[] = [
  { scheduleId: "sched-1", date: getDateString(1), _count: 8 },
  { scheduleId: "sched-4", date: getDateString(1), _count: 12 },
  { scheduleId: "sched-7", date: getDateString(2), _count: 15 },
];
