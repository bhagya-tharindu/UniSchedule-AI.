"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, TriangleAlert } from "lucide-react";
import { api, type TimetableSlot, type User } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TimetablePage() {
  const [user, setUser] = useState<User | null>(null);
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.me(), api.listTimetableSlots()])
      .then(([meRes, slotsRes]) => {
        setUser(meRes.user);
        setSlots(slotsRes.data);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rise-in space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <BookOpen className="text-primary h-6 w-6" />
            My timetable
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Lectures and classes that block your meeting bookings. Only admins
            can edit timetables.
          </p>
        </div>
        {user?.role === "admin" && (
          <Button asChild>
            <Link href="/dashboard/admin/timetables">Manage in Admin</Link>
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : slots.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-muted-foreground py-10 text-center text-sm">
            No timetable slots assigned to you yet.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {slots.map((s) => (
            <li key={s.id}>
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {DAYS[s.day_of_week] ?? `Day ${s.day_of_week}`} ·{" "}
                      {s.start_time}–{s.end_time}
                      {s.valid_from && s.valid_to
                        ? ` · ${s.valid_from} → ${s.valid_to}`
                        : ""}
                    </p>
                  </div>
                  <Badge variant={s.is_active ? "default" : "secondary"}>
                    {s.is_active ? "Active" : "Inactive"}
                  </Badge>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
