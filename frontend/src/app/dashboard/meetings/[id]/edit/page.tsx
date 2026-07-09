"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  Link2,
  TriangleAlert,
  Users,
  Video,
  Zap,
} from "lucide-react";
import {
  api,
  type MeetingMode,
  type SlotSuggestion,
  type User,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatSlot(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function hasMeetingEnded(endTime: string): boolean {
  return new Date(endTime) < new Date();
}

export default function EditMeetingPage() {
  const router = useRouter();
  const params = useParams();
  const meetingId = Number(params.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [roomId, setRoomId] = useState<string>("");
  const [meetingMode, setMeetingMode] = useState<MeetingMode>("jitsi");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [participantIds, setParticipantIds] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [clashMessages, setClashMessages] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SlotSuggestion[]>([]);
  const [clashClean, setClashClean] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(meetingId)) {
      setError("Invalid meeting.");
      setPageLoading(false);
      return;
    }

    Promise.all([
      api.me(),
      api.getMeeting(meetingId),
      api.listUsers(),
    ])
      .then(([meRes, meetingRes, usersRes]) => {
        const meeting = meetingRes.data;
        setCurrentUserId(meRes.user.id);
        setUsers(usersRes.data);

        if (meeting.organizer?.id !== meRes.user.id) {
          setError("Only the organizer can edit this meeting.");
          return;
        }

        if (meeting.status === "cancelled") {
          setError("Cancelled meetings cannot be edited.");
          return;
        }

        if (hasMeetingEnded(meeting.end_time)) {
          setError("Finished meetings cannot be edited.");
          return;
        }

        setTitle(meeting.title);
        setDescription(meeting.description ?? "");
        setStartTime(toDatetimeLocal(meeting.start_time));
        setEndTime(toDatetimeLocal(meeting.end_time));
        setMeetingMode(meeting.meeting_mode ?? "jitsi");
        setMeetingUrl(meeting.meeting_url ?? "");
        setRoomId(meeting.room?.id ? String(meeting.room.id) : "");
        setParticipantIds(
          (meeting.participants ?? [])
            .map((p) => p.user.id)
            .filter((id) => id !== meRes.user.id),
        );
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load meeting"),
      )
      .finally(() => setPageLoading(false));
  }, [meetingId]);

  function clearClashState() {
    setClashMessages([]);
    setSuggestions([]);
    setClashClean(false);
  }

  function applyClashResult(result: {
    has_clashes: boolean;
    clashes: Array<{ type: string; message: string }>;
    suggestions: SlotSuggestion[];
  }) {
    if (result.has_clashes) {
      setClashMessages(result.clashes.map((c) => c.message));
      setSuggestions(result.suggestions);
      setClashClean(false);
    } else {
      setClashMessages(["No clashes detected for this slot."]);
      setSuggestions([]);
      setClashClean(true);
    }
  }

  function toggleParticipant(id: number) {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    clearClashState();
  }

  function applySuggestion(slot: SlotSuggestion) {
    setStartTime(toDatetimeLocal(slot.start_time));
    setEndTime(toDatetimeLocal(slot.end_time));
    setClashMessages([
      "Alternative slot applied — check clashes again if you change other fields.",
    ]);
    setSuggestions([]);
    setClashClean(true);
    toast.success("Alternative slot applied");
  }

  async function checkClashes() {
    setChecking(true);
    setError(null);
    clearClashState();
    try {
      const isOnline =
        meetingMode === "jitsi" || meetingMode === "external";
      const res = await api.checkClash({
        start_time: startTime,
        end_time: endTime,
        room_id: isOnline ? null : roomId ? Number(roomId) : null,
        participant_ids: participantIds.length > 0 ? participantIds : undefined,
        exclude_meeting_id: meetingId,
      });
      applyClashResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not check clashes");
    } finally {
      setChecking(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (meetingMode === "external" && !meetingUrl.trim()) {
        setError("Paste an external meeting link (Zoom, Teams, Meet, etc.).");
        setLoading(false);
        return;
      }

      const isOnline =
        meetingMode === "jitsi" || meetingMode === "external";

      await api.updateMeeting(meetingId, {
        title,
        description: description || null,
        start_time: startTime,
        end_time: endTime,
        room_id: isOnline ? null : roomId ? Number(roomId) : null,
        participant_ids: participantIds.length > 0 ? participantIds : undefined,
        meeting_mode: meetingMode,
        meeting_url:
          meetingMode === "external" ? meetingUrl.trim() : undefined,
      });
      toast.success("Meeting updated");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update meeting");
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  const selectedParticipants = users.filter((u) =>
    participantIds.includes(u.id),
  );

  return (
    <div className="rise-in mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit meeting
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Reschedule or update details. Clash detection excludes this meeting
          when checking the new slot.
        </p>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearClashState();
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start">Start</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    clearClashState();
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    clearClashState();
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>How will you meet?</Label>
              <Tabs
                value={meetingMode}
                onValueChange={(v) => {
                  const next = v as MeetingMode;
                  setMeetingMode(next);
                  if (next === "jitsi" || next === "external") {
                    setRoomId("");
                    clearClashState();
                  }
                }}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="jitsi" className="flex-1">
                    <Video />
                    UniSchedule (Jitsi)
                  </TabsTrigger>
                  <TabsTrigger value="external" className="flex-1">
                    <Link2 />
                    External link
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {meetingMode === "external" && (
                <div className="space-y-2">
                  <Label htmlFor="meeting-url">Meeting link</Label>
                  <Input
                    id="meeting-url"
                    type="url"
                    required
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                    placeholder="https://zoom.us/j/…"
                  />
                </div>
              )}
            </div>

            {meetingMode === "jitsi" && (
              <p className="text-muted-foreground text-xs">
                Online Jitsi meeting — no campus classroom required.
              </p>
            )}

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Participants (optional)
              </Label>
              <div className="flex flex-wrap gap-2">
                {users
                  .filter((u) => u.id !== currentUserId)
                  .map((u) => {
                    const selected = participantIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => toggleParticipant(u.id)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition",
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {u.name}
                        <span className="ml-1 opacity-70">({u.role})</span>
                      </button>
                    );
                  })}
              </div>
              {selectedParticipants.length > 0 && (
                <p className="text-muted-foreground text-xs">
                  Selected:{" "}
                  {selectedParticipants.map((u) => u.name).join(", ")}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={checkClashes}
                disabled={!startTime || !endTime || checking}
              >
                <Zap />
                {checking ? "Checking…" : "Check clashes"}
              </Button>
              <Button type="submit" disabled={loading || !title.trim()}>
                {loading ? "Saving…" : "Save changes"}
              </Button>
              <Button type="button" variant="ghost" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>

            {clashMessages.length > 0 && (
              <div className="space-y-3">
                <Alert
                  variant={clashClean ? "default" : "destructive"}
                  className={
                    clashClean
                      ? "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 [&>svg]:text-emerald-600"
                      : ""
                  }
                >
                  {clashClean ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <TriangleAlert className="h-4 w-4" />
                  )}
                  <AlertDescription
                    className={
                      clashClean
                        ? "text-emerald-700 dark:text-emerald-400"
                        : ""
                    }
                  >
                    <ul className="list-inside list-disc space-y-1">
                      {clashMessages.map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>

                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Alternative slots</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s) => (
                        <Button
                          key={`${s.start_time}-${s.end_time}`}
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => applySuggestion(s)}
                        >
                          {formatSlot(s.start_time)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
