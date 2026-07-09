"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, TriangleAlert } from "lucide-react";
import { api, type TimetableSlot, type User } from "@/lib/api";
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

const DAYS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

function dayLabel(day: number): string {
  return DAYS.find((d) => d.value === String(day))?.label ?? `Day ${day}`;
}

export default function AdminTimetablesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .adminListUsers()
      .then((res) => {
        const nonAdmins = res.data.filter((u) => u.role !== "admin");
        setUsers(nonAdmins);
        if (nonAdmins[0]) setUserId(String(nonAdmins[0].id));
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load users"),
      )
      .finally(() => setLoading(false));
  }, []);

  function loadSlots(id: string) {
    if (!id) return;
    api
      .listTimetableSlots(Number(id))
      .then((res) => setSlots(res.data))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load slots"),
      );
  }

  useEffect(() => {
    if (userId) loadSlots(userId);
  }, [userId]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      await api.createTimetableSlot({
        user_id: Number(userId),
        title,
        day_of_week: Number(dayOfWeek),
        start_time: startTime,
        end_time: endTime,
        valid_from: validFrom || null,
        valid_to: validTo || null,
        is_active: true,
      });
      toast.success("Timetable slot added");
      setTitle("");
      loadSlots(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add slot");
    } finally {
      setSaving(false);
    }
  }

  async function remove(slot: TimetableSlot) {
    try {
      await api.deleteTimetableSlot(slot.id);
      toast.success("Slot deleted");
      loadSlots(userId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select user</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.name} ({u.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add lecture / class slot</CardTitle>
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="COSC261 Lecture"
              />
            </div>
            <div className="space-y-2">
              <Label>Day</Label>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start">Start</Label>
                <Input
                  id="start"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End</Label>
                <Input
                  id="end"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="from">Semester from (optional)</Label>
              <Input
                id="from"
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">Semester to (optional)</Label>
              <Input
                id="to"
                type="date"
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving || !userId}>
                <Plus />
                {saving ? "Saving…" : "Add slot"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ul className="space-y-3">
        {slots.map((s) => (
          <li key={s.id}>
            <Card>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {dayLabel(s.day_of_week)} · {s.start_time}–{s.end_time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.is_active ? "default" : "secondary"}>
                    {s.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => remove(s)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
