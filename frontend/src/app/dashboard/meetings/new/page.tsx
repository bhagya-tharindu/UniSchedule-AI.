"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type ParsedMeetingProposal } from "@/lib/api";

type BookingMode = "form" | "nlp";

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
  const [mode, setMode] = useState<BookingMode>("form");
  const [nlpText, setNlpText] = useState(
    "Book a supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101",
  );
  const [parsed, setParsed] = useState<ParsedMeetingProposal | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(defaultSlot.start);
  const [endTime, setEndTime] = useState(defaultSlot.end);
  const [roomId, setRoomId] = useState("");
  const [participantIds, setParticipantIds] = useState<number[]>([]);
  const [clashPreview, setClashPreview] = useState<string | null>(null);
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
    } else if (proposal.start_time) {
      setClashPreview("Parsed slot has no clashes detected.");
    } else {
      setClashPreview(null);
    }
  }

  async function handleParseNlp() {
    setParsing(true);
    setError(null);
    setClashPreview(null);
    try {
      const res = await api.parseNlp({ text: nlpText });
      applyParsedProposal(res.data);
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
    } else {
      setClashPreview("No clashes detected for this slot.");
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
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create meeting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Schedule a meeting</h1>

      <div className="flex gap-2 rounded-lg border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setMode("form")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
            mode === "form"
              ? "bg-indigo-600 text-white"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Form
        </button>
        <button
          type="button"
          onClick={() => setMode("nlp")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
            mode === "nlp"
              ? "bg-indigo-600 text-white"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Natural language
        </button>
      </div>

      {mode === "nlp" && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
          <label className="block text-sm font-medium text-slate-700">
            Describe your meeting
            <textarea
              value={nlpText}
              onChange={(e) => setNlpText(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              rows={3}
              placeholder='e.g. "Book supervision with Dr Jane Lecturer next Tuesday at 2pm in ENG-101"'
            />
          </label>
          <button
            type="button"
            onClick={handleParseNlp}
            disabled={parsing || nlpText.trim().length < 3}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-60"
          >
            {parsing ? "Parsing…" : "Parse request"}
          </button>
          {parsed && (
            <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <p>
                <span className="font-medium">Intent:</span> {parsed.intent} ·{" "}
                <span className="font-medium">Parser:</span> {parsed.parser} ·{" "}
                <span className="font-medium">Confidence:</span>{" "}
                {Math.round(parsed.confidence * 100)}%
              </p>
              {parsed.participant_names.length > 0 && (
                <p>
                  <span className="font-medium">Participants:</span>{" "}
                  {parsed.participant_names.join(", ")}
                </p>
              )}
              {parsed.validation_errors.length > 0 && (
                <ul className="mt-1 list-disc pl-5 text-amber-800">
                  {parsed.validation_errors.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-slate-500">
                Review and edit the fields below, then confirm booking.
              </p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            rows={2}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Start
          <input
            type="datetime-local"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          End
          <input
            type="datetime-local"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <p className="text-sm text-slate-500">
          Use a weekday between 08:00 and 20:00 (demo availability). Room IDs: 1
          (ENG-101) or 2 (SCI-202).
        </p>

        <label className="block text-sm font-medium text-slate-700">
          Room ID (optional)
          <input
            type="number"
            min={1}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        {participantIds.length > 0 && (
          <p className="text-sm text-slate-600">
            Participants (from NLP): IDs {participantIds.join(", ")}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={checkClashes}
            disabled={!startTime || !endTime}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Check clashes
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Create meeting"}
          </button>
        </div>

        {clashPreview && (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">{clashPreview}</p>
        )}
      </form>
    </div>
  );
}
