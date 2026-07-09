"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarRange, TriangleAlert } from "lucide-react";
import { api, type ExamPeriod, type User } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExamPeriodsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [periods, setPeriods] = useState<ExamPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.me(), api.listExamPeriods()])
      .then(([meRes, periodsRes]) => {
        setUser(meRes.user);
        setPeriods(periodsRes.data);
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
            <CalendarRange className="text-primary h-6 w-6" />
            Campus-wide blackouts
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            University-wide freezes that block everyone. Course-specific exams
            are under My course exams. Only admins can change blackouts.
          </p>
        </div>
        {user?.role === "admin" && (
          <Button asChild>
            <Link href="/dashboard/admin/exams">Manage in Admin</Link>
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
      ) : periods.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-muted-foreground py-10 text-center text-sm">
            No exam periods configured yet.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {periods.map((p) => (
            <li key={p.id}>
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {p.valid_from} → {p.valid_to}
                    </p>
                  </div>
                  <Badge variant={p.is_active ? "default" : "secondary"}>
                    {p.is_active ? "Active" : "Inactive"}
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
