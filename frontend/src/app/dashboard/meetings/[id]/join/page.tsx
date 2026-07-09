"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  TriangleAlert,
  Video,
} from "lucide-react";
import { api, type Meeting } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

function hasMeetingEnded(endTime: string): boolean {
  return new Date(endTime) < new Date();
}

export default function JoinMeetingPage() {
  const params = useParams();
  const id = Number(params.id);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) {
      setError("Invalid meeting.");
      setLoading(false);
      return;
    }

    api
      .getMeeting(id)
      .then((res) => {
        const m = res.data;
        if (m.status === "cancelled") {
          setError("This meeting has been cancelled.");
          setMeeting(m);
          return;
        }
        if (hasMeetingEnded(m.end_time)) {
          setError("This meeting has already ended.");
          setMeeting(m);
          return;
        }
        if (!m.meeting_url) {
          setError("No join link is available for this meeting.");
          setMeeting(m);
          return;
        }
        if (m.meeting_mode === "external") {
          window.location.href = m.meeting_url;
          return;
        }
        setMeeting(m);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load meeting"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[70vh] w-full rounded-xl" />
      </div>
    );
  }

  if (error || !meeting?.meeting_url) {
    return (
      <div className="rise-in mx-auto max-w-lg space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft />
            Back to meetings
          </Link>
        </Button>
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>{error ?? "Unable to join."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const embedUrl = meeting.meeting_url.includes("#")
    ? meeting.meeting_url
    : `${meeting.meeting_url}#config.prejoinPageEnabled=true`;

  return (
    <div className="rise-in space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft />
              Back
            </Link>
          </Button>
          <h1 className="mt-1 flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Video className="text-primary h-5 w-5" />
            {meeting.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            In-app meeting via Jitsi
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a
            href={meeting.meeting_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink />
            Open in new tab
          </a>
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <CardHeader className="border-b py-3">
          <CardTitle className="text-sm font-medium">Live room</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <iframe
            title={`Join ${meeting.title}`}
            src={embedUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="h-[min(75vh,720px)] w-full border-0 bg-black"
          />
        </CardContent>
      </Card>
    </div>
  );
}
