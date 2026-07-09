"use client";

import { useEffect, useState } from "react";
import { GraduationCap, TriangleAlert } from "lucide-react";
import { api, type CourseExamPeriod } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyExamsPage() {
  const [periods, setPeriods] = useState<CourseExamPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listMyExams()
      .then((res) => setPeriods(res.data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rise-in space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <GraduationCap className="text-primary h-6 w-6" />
          My course exams
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Exam periods for courses you are enrolled in. Meetings cannot be
          booked for you during these dates.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Skeleton className="h-24 w-full" />
      ) : periods.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-muted-foreground py-10 text-center text-sm">
            No course exam periods apply to you.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {periods.map((p) => (
            <li key={p.id}>
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {p.course_code}: {p.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {p.course_name} · {p.valid_from} → {p.valid_to}
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
