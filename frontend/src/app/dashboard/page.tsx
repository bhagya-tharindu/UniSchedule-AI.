"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  Clock,
  MapPin,
  TriangleAlert,
  Users,
} from "lucide-react";
import { api, type Meeting } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

function formatRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const date = s.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time(s)} – ${time(e)}`;
}

type StatTone = "violet" | "emerald" | "rose";

function StatCard({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone: StatTone;
  icon: typeof CalendarClock;
}) {
  const tones: Record<StatTone, string> = {
    violet: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          <p className="text-muted-foreground text-xs">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listMeetings()
      .then((res) => setMeetings(res.data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load meetings"),
      )
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = meetings.filter(
      (m) => m.status !== "cancelled" && new Date(m.start_time) >= now,
    ).length;
    const scheduled = meetings.filter((m) => m.status !== "cancelled").length;
    const cancelled = meetings.filter((m) => m.status === "cancelled").length;
    return { upcoming, scheduled, cancelled };
  }, [meetings]);

  return (
    <div className="rise-in space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Your meetings
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Everything you organise or attend, in one place.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/meetings/new">
            <CalendarPlus />
            Schedule meeting
          </Link>
        </Button>
      </div>

      {!loading && !error && meetings.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            label="Upcoming"
            value={stats.upcoming}
            tone="violet"
            icon={CalendarClock}
          />
          <StatCard
            label="Scheduled"
            value={stats.scheduled}
            tone="emerald"
            icon={CalendarCheck}
          />
          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            tone="rose"
            icon={CalendarX}
          />
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && !loading && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && meetings.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <div className="bg-primary text-primary-foreground flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm">
              <CalendarPlus className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">No meetings yet</h2>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              Create your first meeting to see clash detection and academic
              constraints in action.
            </p>
            <Button asChild className="mt-5">
              <Link href="/dashboard/meetings/new">
                <CalendarPlus />
                New meeting
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && meetings.length > 0 && (
        <ul className="space-y-3">
          {meetings.map((m) => {
            const cancelled = m.status === "cancelled";
            const participants = m.participants?.length ?? 0;
            return (
              <li key={m.id}>
                <Card className="transition-all hover:-translate-y-0.5 hover:ring-primary/30">
                  <CardContent className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:flex ${
                          cancelled
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <CalendarClock className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`truncate font-medium ${
                            cancelled
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
                        >
                          {m.title}
                        </p>
                        <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4 opacity-70" />
                            {formatRange(m.start_time, m.end_time)}
                          </span>
                          {m.room && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 opacity-70" />
                              {m.room.name}
                              {m.room.building ? ` · ${m.room.building}` : ""}
                            </span>
                          )}
                          {participants > 0 && (
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="h-4 w-4 opacity-70" />
                              {participants}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {cancelled ? (
                      <Badge variant="destructive" className="capitalize">
                        {m.status}
                      </Badge>
                    ) : (
                      <Badge className="border-transparent bg-emerald-500/10 capitalize text-emerald-600 dark:text-emerald-400">
                        {m.status}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
