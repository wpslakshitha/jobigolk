"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, Users, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

// Mock data for dashboard stats
const stats = {
  totalJobs: 24,
  activeJobs: 18,
  totalApplications: 156,
  viewsToday: 342,
};

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {session?.user?.name || session?.user?.email}!
          Here&apos;s what&apos;s happening with your jobs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-gray-500 mt-1">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Jobs
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((stats.activeJobs / stats.totalJobs) * 100)}% of total
              jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-gray-500 mt-1">
              +12 new applications today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Views Today
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.viewsToday}</div>
            <p className="text-xs text-gray-500 mt-1">+18% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you can perform from your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            asChild
            className="h-auto py-4 flex flex-col items-center justify-center space-y-2"
          >
            <Link href="/dashboard/jobs/new">
              <Briefcase className="h-6 w-6 mb-2" />
              <span>Post a New Job</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center space-y-2"
          >
            <Link href="/dashboard/jobs">
              <Clock className="h-6 w-6 mb-2" />
              <span>Manage Active Jobs</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center space-y-2"
          >
            <Link href="/dashboard/applications">
              <Users className="h-6 w-6 mb-2" />
              <span>View Applications</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>
            Your most recently posted job listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <h3 className="font-medium">Senior Software Engineer</h3>
                  <div className="text-sm text-gray-500">
                    Posted {i} day{i > 1 ? "s" : ""} ago • {10 * i} applications
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/jobs/job${i}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
