"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, TriangleAlert } from "lucide-react";
import { api, type ExamPeriod } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminExamsPage() {
  const [periods, setPeriods] = useState<ExamPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api
      .listExamPeriods()
      .then((res) => setPeriods(res.data))
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
      await api.createExamPeriod({
        name,
        valid_from: validFrom,
        valid_to: validTo,
        is_active: true,
      });
      toast.success("Exam period created");
      setName("");
      setValidFrom("");
      setValidTo("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create period");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(period: ExamPeriod) {
    try {
      await api.updateExamPeriod(period.id, { is_active: !period.is_active });
      toast.success(period.is_active ? "Period deactivated" : "Period activated");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function remove(period: ExamPeriod) {
    try {
      await api.deleteExamPeriod(period.id);
      toast.success("Exam period deleted");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add campus-wide blackout</CardTitle>
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
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mid-year exam week"
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
              <Button type="submit" disabled={saving}>
                <Plus />
                {saving ? "Saving…" : "Add period"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <Skeleton className="h-24 w-full" />
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
                  <div className="flex items-center gap-2">
                    <Badge variant={p.is_active ? "default" : "secondary"}>
                      {p.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(p)}
                    >
                      {p.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => remove(p)}
                    >
                      <Trash2 />
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
