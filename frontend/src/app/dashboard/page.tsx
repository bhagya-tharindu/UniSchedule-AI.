"use client";

import { useEffect, useState } from "react";
import { api, type Meeting } from "@/lib/api";

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

  if (loading) {
    return <p className="text-slate-600">Loading meetings…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Your meetings</h1>

      {meetings.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          No meetings yet. Create one to test clash detection.
        </p>
      ) : (
        <ul className="space-y-3">
          {meetings.map((m) => (
            <li
              key={m.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{m.title}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {new Date(m.start_time).toLocaleString()} —{" "}
                    {new Date(m.end_time).toLocaleTimeString()}
                  </p>
                  {m.room && (
                    <p className="mt-1 text-sm text-slate-500">
                      Room: {m.room.name} ({m.room.building})
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    m.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {m.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
