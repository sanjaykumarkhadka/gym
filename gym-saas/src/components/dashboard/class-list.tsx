"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  duration: number;
  capacity: number;
  instructor: string | null;
  isActive: boolean;
}

interface ClassType {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  schedules: Schedule[];
}

interface ClassListProps {
  classTypes: ClassType[];
  canManage: boolean;
}

export function ClassList({ classTypes, canManage }: ClassListProps) {
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddSchedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedClassId) return;

    setIsLoading(true);

    // Simulate adding schedule
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success("Demo: Schedule would be added");
    setIsAddingSchedule(false);
    setSelectedClassId(null);
    setIsLoading(false);
  }

  function handleDeleteSchedule(classId: string, scheduleId: string) {
    toast.success("Demo: Schedule would be deleted");
  }

  if (classTypes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No class types yet</p>
          {canManage && (
            <Button asChild>
              <a href="/dashboard/classes/new">Create your first class</a>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {classTypes.map((classType) => (
          <Card key={classType.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {classType.color && (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: classType.color }}
                      />
                    )}
                    {classType.name}
                  </CardTitle>
                  {classType.description && (
                    <CardDescription>{classType.description}</CardDescription>
                  )}
                </div>
                {canManage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedClassId(classType.id);
                      setIsAddingSchedule(true);
                    }}
                  >
                    Add Schedule
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {classType.schedules.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No schedules configured
                </p>
              ) : (
                <div className="space-y-2">
                  {classType.schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {DAYS[schedule.dayOfWeek]}
                        </Badge>
                        <span className="font-medium">{schedule.startTime}</span>
                        <span className="text-sm text-muted-foreground">
                          {schedule.duration} min
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Capacity: {schedule.capacity}
                        </span>
                        {schedule.instructor && (
                          <span className="text-sm text-muted-foreground">
                            Instructor: {schedule.instructor}
                          </span>
                        )}
                        {!schedule.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      {canManage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDeleteSchedule(classType.id, schedule.id)
                          }
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddingSchedule} onOpenChange={setIsAddingSchedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Schedule</DialogTitle>
            <DialogDescription>
              Add a new weekly schedule for this class
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSchedule}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="dayOfWeek">Day of Week</Label>
                <Select name="dayOfWeek" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day, index) => (
                      <SelectItem key={day} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="15"
                  max="180"
                  defaultValue="60"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  max="100"
                  defaultValue="20"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instructor">Instructor (optional)</Label>
                <Input
                  id="instructor"
                  name="instructor"
                  type="text"
                  disabled={isLoading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingSchedule(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
