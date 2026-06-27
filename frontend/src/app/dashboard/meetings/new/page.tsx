"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { api, type ParsedMeetingProposal } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROOMS = [
  { id: "1", label: "ENG-101 · Engineering" },
  { id: "2", label: "SCI-202 · Science" },
];

function defaultMeetingSlot(): { start: string; end: string } {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return { start: `${date}T10:00`, end: `${date}T11:00` };
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const defaultSlot = defaultMeetingSlot();

export default function NewMeetingPage() {
  const router = useRouter();
  const [nlpText, setNlpText] = useState(
    "Book a supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101",
  );
  const [parsed, setParsed] = useState<ParsedMeetingProposal | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(defaultSlot.start);
  const [endTime, setEndTime] = useState(defaultSlot.end);
  const [roomId, setRoomId] = useState<string>("");
  const [participantIds, setParticipantIds] = useState<number[]>([]);
  const [clashPreview, setClashPreview] = useState<string | null>(null);
  const [clashClean, setClashClean] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);

  function applyParsedProposal(proposal: ParsedMeetingProposal) {
    setParsed(proposal);
    if (proposal.title) setTitle(proposal.title);
    if (proposal.description) setDescription(proposal.description);
    if (proposal.start_time) setStartTime(toDatetimeLocal(proposal.start_time));
    if (proposal.end_time) setEndTime(toDatetimeLocal(proposal.end_time));
    if (proposal.room_id) setRoomId(String(proposal.room_id));
    setParticipantIds(proposal.participant_ids);

    if (proposal.has_clashes) {
      const msgs = proposal.clashes.map((c) => c.message).join("; ");
      const sug =
        proposal.suggestions.length > 0
          ? ` Suggestions: ${proposal.suggestions.map((s) => new Date(s.start_time).toLocaleString()).join(", ")}`
          : "";
      setClashPreview(`${msgs}${sug}`);
      setClashClean(false);
    } else if (proposal.start_time) {
      setClashPreview("Parsed slot has no clashes detected.");
      setClashClean(true);
    } else {
      setClashPreview(null);
      setClashClean(false);
    }
  }

  async function handleParseNlp() {
    setParsing(true);
    setError(null);
    setClashPreview(null);
    try {
      const res = await api.parseNlp({ text: nlpText });
      applyParsedProposal(res.data);
      toast.success("Request parsed", {
        description: "Review the details below, then confirm.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not parse request");
      setParsed(null);
    } finally {
      setParsing(false);
    }
  }

  async function checkClashes() {
    setClashPreview(null);
    const res = await api.checkClash({
      start_time: startTime,
      end_time: endTime,
      room_id: roomId ? Number(roomId) : null,
      participant_ids: participantIds.length > 0 ? participantIds : undefined,
    });
    if (res.has_clashes) {
      const msgs = res.clashes.map((c) => c.message).join("; ");
      const sug =
        res.suggestions.length > 0
          ? ` Suggestions: ${res.suggestions.map((s) => new Date(s.start_time).toLocaleString()).join(", ")}`
          : "";
      setClashPreview(`${msgs}${sug}`);
      setClashClean(false);
    } else {
      setClashPreview("No clashes detected for this slot.");
      setClashClean(true);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.createMeeting({
        title,
        description: description || null,
        start_time: startTime,
        end_time: endTime,
        room_id: roomId ? Number(roomId) : null,
        participant_ids: participantIds.length > 0 ? participantIds : undefined,
      });
      toast.success("Meeting created");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create meeting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rise-in mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Schedule a meeting
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Fill in the details, or describe it in plain English and let the
          assistant draft it.
        </p>
      </div>

      <Tabs defaultValue="form">
        <TabsList className="w-full">
          <TabsTrigger value="form" className="flex-1">
            <CalendarDays />
            Form
          </TabsTrigger>
          <TabsTrigger value="nlp" className="flex-1">
            <Sparkles />
            Natural language
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nlp" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nlp">Describe your meeting</Label>
                <Textarea
                  id="nlp"
                  value={nlpText}
                  onChange={(e) => setNlpText(e.target.value)}
                  rows={3}
                  placeholder='e.g. "Book supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101"'
                />
              </div>
              <Button
                type="button"
                onClick={handleParseNlp}
                disabled={parsing || nlpText.trim().length < 3}
              >
                <Zap />
                {parsing ? "Parsing…" : "Parse request"}
              </Button>

              {parsed && (
                <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="capitalize">{parsed.intent}</Badge>
                    <Badge variant="secondary">
                      {parsed.parser === "llm" ? "LLM" : "Rule-based"}
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(parsed.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  {parsed.participant_names.length > 0 && (
                    <p className="text-muted-foreground text-sm">
                      <span className="text-foreground font-medium">
                        Participants:
                      </span>{" "}
                      {parsed.participant_names.join(", ")}
                    </p>
                  )}
                  {parsed.validation_errors.length > 0 && (
                    <ul className="space-y-1 text-sm text-amber-600 dark:text-amber-400">
                      {parsed.validation_errors.map((msg) => (
                        <li key={msg} className="flex items-start gap-1.5">
                          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {msg}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-muted-foreground text-sm">
                    Review and edit the fields below, then confirm booking.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="mt-4">
          <Card>
            <CardContent className="text-muted-foreground text-sm">
              Enter meeting details directly in the form below.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project supervision"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Optional notes for participants"
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
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Room (optional)</Label>
              <Select
                value={roomId || undefined}
                onValueChange={(v) => setRoomId(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {ROOMS.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 text-xs">
              Demo availability: weekdays 08:00–20:00. Rooms: ENG-101 or SCI-202.
            </p>

            {participantIds.length > 0 && (
              <p className="text-muted-foreground text-sm">
                Participants from AI: IDs {participantIds.join(", ")}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={checkClashes}
                disabled={!startTime || !endTime}
              >
                <Zap />
                Check clashes
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving…" : "Create meeting"}
              </Button>
            </div>

            {clashPreview && (
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
                  className={clashClean ? "text-emerald-700 dark:text-emerald-400" : ""}
                >
                  {clashPreview}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
