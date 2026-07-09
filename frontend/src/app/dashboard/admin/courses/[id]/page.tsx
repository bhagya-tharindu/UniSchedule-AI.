"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, TriangleAlert } from "lucide-react";
import { api, type CourseDetail, type User } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminCourseDetailPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolUserId, setEnrolUserId] = useState("");
  const [examName, setExamName] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");

  function load() {
    if (!Number.isFinite(courseId)) return;
    setLoading(true);
    Promise.all([api.adminGetCourse(courseId), api.adminListUsers()])
      .then(([courseRes, usersRes]) => {
        setCourse(courseRes.data);
        setAllUsers(usersRes.data.filter((u) => u.role !== "admin"));
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [courseId]);

  const enrolledIds = new Set(course?.users.map((u) => u.id) ?? []);
  const enrolable = allUsers.filter((u) => !enrolledIds.has(u.id));

  async function enrol(e: FormEvent) {
    e.preventDefault();
    if (!enrolUserId) return;
    try {
      await api.adminEnrolUser(courseId, Number(enrolUserId));
      toast.success("User enrolled");
      setEnrolUserId("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enrol failed");
    }
  }

  async function removeUser(userId: number) {
    try {
      await api.adminRemoveUserFromCourse(courseId, userId);
      toast.success("User removed");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Remove failed");
    }
  }

  async function addExam(e: FormEvent) {
    e.preventDefault();
    try {
      await api.adminCreateCourseExamPeriod(courseId, {
        name: examName,
        valid_from: validFrom,
        valid_to: validTo,
        is_active: true,
      });
      toast.success("Exam period added");
      setExamName("");
      setValidFrom("");
      setValidTo("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add period");
    }
  }

  async function toggleExam(id: number, isActive: boolean) {
    try {
      await api.adminUpdateCourseExamPeriod(id, { is_active: !isActive });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function deleteExam(id: number) {
    try {
      await api.adminDeleteCourseExamPeriod(id);
      toast.success("Exam period deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (!course) {
    return (
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertDescription>{error ?? "Course not found."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/admin/courses">
            <ArrowLeft />
            All courses
          </Link>
        </Button>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          {course.code} — {course.name}
        </h2>
        <p className="text-muted-foreground text-sm">
          Enrol users and set exam periods for this course only.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enrolled users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={enrol} className="flex flex-wrap gap-2">
            <Select value={enrolUserId} onValueChange={setEnrolUserId}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {enrolable.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.name} ({u.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={!enrolUserId}>
              <Plus />
              Enrol
            </Button>
          </form>
          <ul className="space-y-2">
            {course.users.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span>
                  {u.name}{" "}
                  <span className="text-muted-foreground">({u.role})</span>
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeUser(u.id)}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
            {course.users.length === 0 && (
              <p className="text-muted-foreground text-sm">No enrolments yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course exam periods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={addExam} className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="exam-name">Name</Label>
              <Input
                id="exam-name"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="End-of-semester exams"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                type="date"
                required
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="date"
                required
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">
                <Plus />
                Add exam period
              </Button>
            </div>
          </form>

          <ul className="space-y-2">
            {course.exam_periods.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-muted-foreground">
                    {p.valid_from} → {p.valid_to}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={p.is_active ? "default" : "secondary"}>
                    {p.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => toggleExam(p.id, p.is_active)}
                  >
                    {p.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteExam(p.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
            {course.exam_periods.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No exam periods for this course.
              </p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
