"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { GraduationCap, Plus, TriangleAlert } from "lucide-react";
import { api, type Course } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api
      .adminListCourses()
      .then((res) => setCourses(res.data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.adminCreateCourse({ code, name, is_active: true });
      toast.success("Course created");
      setCode("");
      setName("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create course");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            {error && (
              <div className="sm:col-span-2">
                <Alert variant="destructive">
                  <TriangleAlert className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="COSC261"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Introduction to Computer Science"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving}>
                <Plus />
                {saving ? "Saving…" : "Add course"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <ul className="space-y-3">
          {courses.map((c) => (
            <li key={c.id}>
              <Card className="transition hover:ring-primary/30">
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {c.code} — {c.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {c.users_count ?? 0} enrolled
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={c.is_active ? "default" : "secondary"}>
                      {c.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/admin/courses/${c.id}`}>
                        Manage
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
