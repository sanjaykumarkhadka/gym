"use client";

import { demoStats } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = demoStats;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your gym.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.memberCount}</div>
            <p className="text-xs text-muted-foreground">Registered members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Paying members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayBookings}</div>
            <p className="text-xs text-muted-foreground">Confirmed classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthlyRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Estimated monthly</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your gym</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/dashboard/classes"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Manage Classes</div>
              <div className="text-sm text-muted-foreground">
                Create and edit class schedules
              </div>
            </Link>
            <Link
              href="/dashboard/members"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">View Members</div>
              <div className="text-sm text-muted-foreground">
                Manage member accounts and subscriptions
              </div>
            </Link>
            <Link
              href="/dashboard/plans"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Membership Plans</div>
              <div className="text-sm text-muted-foreground">
                Configure pricing and plans
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Setup checklist for your gym</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">
                1
              </div>
              <span className="text-sm">Create your gym account</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">
                2
              </div>
              <span className="text-sm">Add class types (Yoga, Kickboxing, etc.)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">
                3
              </div>
              <span className="text-sm">Set up weekly schedules</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">
                4
              </div>
              <span className="text-sm">Create membership plans</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">
                5
              </div>
              <span className="text-sm">Connect Stripe for payments</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
