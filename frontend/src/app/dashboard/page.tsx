"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  ChevronDown,
  Clock,
  ExternalLink,
  Flame,
  MapPin,
  Pencil,
  Trash2,
  TriangleAlert,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { api, type Meeting, type User } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const QUICK_MEETING_MINUTES = 30;

function formatRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const date = s.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time(s)} – ${time(e)}`;
}

function hasMeetingEnded(endTime: string): boolean {
  return new Date(endTime) < new Date();
}

function hasMeetingStarted(startTime: string): boolean {
  return new Date(startTime) <= new Date();
}

function isMeetingOngoing(meeting: Meeting): boolean {
  return !hasMeetingEnded(meeting.end_time) && hasMeetingStarted(meeting.start_time);
}

type StatTone = "violet" | "emerald" | "rose";
type MeetingSectionTone = "live" | "upcoming" | "past" | "cancelled";

type GroupedMeetings = {
  ongoing: Meeting[];
  upcoming: Meeting[];
  past: Meeting[];
  cancelled: Meeting[];
};

type MeetingSectionKey = keyof GroupedMeetings;

function StatCard({
  label,
  value,
  tone,
  caption,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone: StatTone;
  caption: string;
  icon: typeof CalendarClock;
}) {
  const tones: Record<StatTone, string> = {
    violet: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };
  const hoverTone: Record<StatTone, string> = {
    violet:
      "hover:ring-primary/35 hover:shadow-primary/18 focus-within:ring-primary/35 focus-within:shadow-primary/18",
    emerald:
      "hover:ring-emerald-500/35 hover:shadow-emerald-500/20 focus-within:ring-emerald-500/35 focus-within:shadow-emerald-500/20",
    rose:
      "hover:ring-rose-500/30 hover:shadow-rose-500/16 focus-within:ring-rose-500/30 focus-within:shadow-rose-500/16",
  };
  const liveIconTone: Record<StatTone, string> = {
    violet: "stat-pulse-ring-violet",
    emerald: "stat-pulse-ring-emerald",
    rose: "stat-pulse-ring-rose",
  };
  const iconAuraTone: Record<StatTone, string> = {
    violet: "shadow-primary/20 ring-primary/20",
    emerald: "shadow-emerald-500/25 ring-emerald-500/20",
    rose: "shadow-rose-500/20 ring-rose-500/16",
  };
  return (
    <Card
      className={`glass group/stat border-white/40 shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/18 hover:ring-1 focus-within:-translate-y-2.5 focus-within:scale-[1.02] focus-within:shadow-2xl focus-within:shadow-black/18 focus-within:ring-1 ${hoverTone[tone]}`}
    >
      <CardContent className="flex items-center gap-3 py-5">
        <div className="relative flex h-11 w-11 items-center justify-center">
          <span
            className={`stat-pulse-ring ${liveIconTone[tone]} absolute inset-0 rounded-xl`}
          />
          <div
            className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-xl ring-1 shadow-lg transition-all duration-300 group-hover/stat:scale-[1.2] group-hover/stat:shadow-xl group-hover/stat:shadow-black/20 group-hover/stat:brightness-110 group-focus-within/stat:scale-[1.2] ${tones[tone]} ${iconAuraTone[tone]}`}
          >
            <Icon className="h-5 w-5 transition-transform duration-300 group-hover/stat:scale-110 group-focus-within/stat:scale-110" />
          </div>
        </div>
        <div className="transition-transform duration-300 group-hover/stat:translate-x-1.5 group-focus-within/stat:translate-x-1.5">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 group-hover/stat:text-foreground group-focus-within/stat:text-foreground">
            {label}
          </p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums transition-all duration-300 group-hover/stat:translate-y-[-1px] group-hover/stat:scale-[1.08] group-hover/stat:text-foreground group-focus-within/stat:translate-y-[-1px] group-focus-within/stat:scale-[1.08]">
            {value}
          </p>
          <p className="text-muted-foreground text-xs transition-all duration-300 group-hover/stat:translate-y-[1px] group-hover/stat:text-foreground/85 group-focus-within/stat:translate-y-[1px]">
            {caption}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function sectionConfig(tone: MeetingSectionTone) {
  switch (tone) {
    case "live":
      return {
        badgeClass:
          "border-transparent bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
        iconWrap: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
        cardClass: "border-emerald-500/15 shadow-emerald-500/5",
      };
    case "upcoming":
      return {
        badgeClass:
          "border-transparent bg-primary/12 text-primary dark:text-primary-foreground",
        iconWrap: "bg-primary/12 text-primary",
        cardClass: "border-primary/10 shadow-primary/5",
      };
    case "past":
      return {
        badgeClass:
          "border-transparent bg-muted text-muted-foreground dark:bg-muted/70",
        iconWrap: "bg-muted text-muted-foreground",
        cardClass: "border-border/70 opacity-90",
      };
    case "cancelled":
      return {
        badgeClass:
          "border-transparent bg-rose-500/12 text-rose-700 dark:text-rose-300",
        iconWrap: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
        cardClass: "border-rose-500/10 opacity-90",
      };
  }
}

function statusLabel(meeting: Meeting): { label: string; tone: MeetingSectionTone } {
  if (meeting.status === "cancelled") return { label: "Cancelled", tone: "cancelled" };
  if (isMeetingOngoing(meeting)) return { label: "Live now", tone: "live" };
  if (hasMeetingEnded(meeting.end_time)) return { label: "Ended", tone: "past" };
  return { label: "Scheduled", tone: "upcoming" };
}

function sortByStartAsc(a: Meeting, b: Meeting) {
  return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
}

function sortByStartDesc(a: Meeting, b: Meeting) {
  return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
}

function groupMeetings(meetings: Meeting[]): GroupedMeetings {
  const grouped: GroupedMeetings = {
    ongoing: [],
    upcoming: [],
    past: [],
    cancelled: [],
  };

  for (const meeting of meetings) {
    if (meeting.status === "cancelled") {
      grouped.cancelled.push(meeting);
    } else if (isMeetingOngoing(meeting)) {
      grouped.ongoing.push(meeting);
    } else if (hasMeetingEnded(meeting.end_time)) {
      grouped.past.push(meeting);
    } else {
      grouped.upcoming.push(meeting);
    }
  }

  grouped.ongoing.sort(sortByStartAsc);
  grouped.upcoming.sort(sortByStartAsc);
  grouped.past.sort(sortByStartDesc);
  grouped.cancelled.sort(sortByStartDesc);

  return grouped;
}

function SectionEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="motion-empty border-dashed bg-card/60">
      <CardContent className="py-8 text-center">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingQuick, setStartingQuick] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<MeetingSectionKey, boolean>
  >({
    ongoing: true,
    upcoming: true,
    past: false,
    cancelled: false,
  });

  function loadMeetings() {
    return api.listMeetings().then((res) => setMeetings(res.data));
  }

  useEffect(() => {
    Promise.all([api.me(), api.listMeetings()])
      .then(([meRes, meetingsRes]) => {
        setCurrentUser(meRes.user);
        setMeetings(meetingsRes.data);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load meetings"),
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleCancelMeeting(meeting: Meeting) {
    if (
      !window.confirm(
        `Cancel "${meeting.title}"? Participants will no longer be able to join this meeting.`,
      )
    ) {
      return;
    }

    setCancellingId(meeting.id);
    setError(null);
    try {
      await api.cancelMeeting(meeting.id);
      toast.success("Meeting cancelled");
      await loadMeetings();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not cancel meeting";
      setError(message);
      toast.error(message);
    } finally {
      setCancellingId(null);
    }
  }

  const stats = useMemo(() => {
    const now = new Date();
    const ongoing = meetings.filter(
      (m) => m.status !== "cancelled" && isMeetingOngoing(m),
    ).length;
    const upcoming = meetings.filter(
      (m) => m.status !== "cancelled" && new Date(m.start_time) >= now,
    ).length;
    const past = meetings.filter(
      (m) => m.status !== "cancelled" && new Date(m.end_time) < now,
    ).length;
    const scheduled = meetings.filter((m) => m.status !== "cancelled").length;
    const cancelled = meetings.filter((m) => m.status === "cancelled").length;
    return { ongoing, upcoming, past, scheduled, cancelled };
  }, [meetings]);

  const groupedMeetings = useMemo(() => groupMeetings(meetings), [meetings]);

  async function startQuickMeeting() {
    setStartingQuick(true);
    setError(null);
    try {
      const start = new Date();
      const end = new Date(start.getTime() + QUICK_MEETING_MINUTES * 60 * 1000);
      const res = await api.createMeeting({
        title: "Quick meeting",
        description: "Instant Jitsi meeting started from the dashboard.",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        meeting_mode: "jitsi",
        // Instant online meetings should not be blocked by availability windows.
        force: true,
      });
      toast.success("Quick meeting started");
      router.push(`/dashboard/meetings/${res.data.id}/join`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not start quick meeting";
      setError(message);
      toast.error(message);
    } finally {
      setStartingQuick(false);
    }
  }

  function toggleSection(section: MeetingSectionKey) {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  function renderMeetingCard(meeting: Meeting) {
    const ended = hasMeetingEnded(meeting.end_time);
    const cancelled = meeting.status === "cancelled";
    const ongoing = isMeetingOngoing(meeting);
    const participants = meeting.participants?.length ?? 0;
    const isOrganizer = currentUser?.id === meeting.organizer?.id;
    const state = statusLabel(meeting);
    const visual = sectionConfig(state.tone);

    return (
      <li key={meeting.id}>
        <Card
          className={`glass overflow-hidden border shadow-sm shadow-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md ${visual.cardClass}`}
        >
          <CardContent className="py-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${visual.iconWrap}`}
                  >
                    {ongoing ? (
                      <Flame className="h-5 w-5" />
                    ) : (
                      <CalendarClock className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`truncate text-base font-semibold tracking-tight ${
                          cancelled ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {meeting.title}
                      </p>
                      <Badge className={visual.badgeClass}>{state.label}</Badge>
                      {meeting.meeting_url ? (
                        <Badge variant="outline" className="capitalize">
                          {meeting.meeting_mode === "external"
                            ? "External"
                            : "Jitsi"}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        {formatRange(meeting.start_time, meeting.end_time)}
                      </span>
                      {meeting.room ? (
                        <span className="text-muted-foreground inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {meeting.room.name}
                          {meeting.room.building ? ` · ${meeting.room.building}` : ""}
                        </span>
                      ) : null}
                      {participants > 0 ? (
                        <span className="text-muted-foreground inline-flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          {participants} participant{participants === 1 ? "" : "s"}
                        </span>
                      ) : null}
                    </div>
                    {meeting.description ? (
                      <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
                        {meeting.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-stretch gap-2 lg:min-w-44 lg:items-end">
                {!cancelled && !ended && isOrganizer ? (
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/meetings/${meeting.id}/edit`}>
                        <Pencil />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={cancellingId === meeting.id}
                      onClick={() => handleCancelMeeting(meeting)}
                    >
                      <Trash2 />
                      {cancellingId === meeting.id ? "Cancelling…" : "Cancel"}
                    </Button>
                  </div>
                ) : null}

                {!cancelled && !ended && meeting.meeting_url ? (
                  meeting.meeting_mode === "jitsi" ? (
                    <Button asChild size="sm" className="gap-2 lg:min-w-32">
                      <Link href={`/dashboard/meetings/${meeting.id}/join`}>
                        <Video />
                        Join
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild size="sm" variant="secondary" className="gap-2 lg:min-w-32">
                      <a
                        href={meeting.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink />
                        Join
                      </a>
                    </Button>
                  )
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </li>
    );
  }

  function renderMeetingSection({
    sectionKey,
    title,
    description,
    items,
    emptyTitle,
    emptyDescription,
    accent,
    delay,
  }: {
    sectionKey: MeetingSectionKey;
    title: string;
    description: string;
    items: Meeting[];
    emptyTitle: string;
    emptyDescription: string;
    accent: string;
    delay: string;
  }) {
    const isExpanded = expandedSections[sectionKey];
    const contentId = `${sectionKey}-meetings-section`;

    return (
      <section className="motion-section space-y-4" style={{ animationDelay: delay }}>
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => toggleSection(sectionKey)}
          className="motion-section-header hover:bg-muted/35 focus-visible:ring-ring/60 flex w-full items-center justify-between gap-3 rounded-2xl p-1.5 text-left transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className={`motion-section-dot h-2.5 w-2.5 rounded-full ${accent}`} />
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <Badge variant="secondary" className="motion-section-count">
                {items.length}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          </div>
          <div className="text-muted-foreground flex shrink-0 items-center gap-2 self-start pt-1">
            <span className="hidden text-xs font-medium sm:inline">
              {isExpanded ? "Collapse" : "Expand"}
            </span>
            <span className="bg-background/80 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm">
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </div>
        </button>

        <div
          id={contentId}
          className={`grid transition-all duration-300 ease-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="pt-1">
              {items.length === 0 ? (
                <SectionEmpty title={emptyTitle} description={emptyDescription} />
              ) : (
                <ul className="motion-section-list space-y-3">
                  {items.map(renderMeetingCard)}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="rise-in space-y-8">
      <Card className="glass border-white/40 shadow-lg shadow-black/5">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">
                  Your meetings, beautifully organized
                </CardTitle>
                <CardDescription className="mt-2 max-w-2xl text-sm leading-6">
                  Track what is live right now, what is coming next, and what has
                  already happened from one polished command center.
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={startQuickMeeting}
                disabled={startingQuick}
                className="min-w-36"
              >
                <Zap />
                {startingQuick ? "Starting…" : "Meet now"}
              </Button>
              <Button asChild className="min-w-40">
                <Link href="/dashboard/meetings/new">
                  <CalendarPlus />
                  Schedule meeting
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        {!loading && !error && meetings.length > 0 && (
          <CardContent className="pt-0">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Live now"
                value={stats.ongoing}
                tone="emerald"
                caption="Meetings happening right now"
                icon={CalendarCheck}
              />
              <StatCard
                label="Upcoming"
                value={stats.upcoming}
                tone="violet"
                caption="Next sessions on your schedule"
                icon={CalendarClock}
              />
              <StatCard
                label="Past"
                value={stats.past}
                tone="rose"
                caption="Completed sessions kept for reference"
                icon={CalendarX}
              />
              <StatCard
                label="Cancelled"
                value={stats.cancelled}
                tone="rose"
                caption="Meetings that will no longer happen"
                icon={CalendarX}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {loading && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Card key={i} className="glass">
                <CardContent className="flex items-center gap-4 py-5">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {[0, 1, 2].map((i) => (
            <Card key={i} className="glass">
              <CardContent className="flex items-center gap-4 py-5">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-72" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <Skeleton className="h-9 w-28 rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && !loading && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && meetings.length === 0 && (
        <Card className="glass border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <div className="bg-primary text-primary-foreground flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm">
              <CalendarPlus className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">No meetings yet</h2>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              Start an instant Jitsi call, or schedule a meeting with clash
              detection and academic constraints.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={startQuickMeeting}
                disabled={startingQuick}
              >
                <Zap />
                {startingQuick ? "Starting…" : "Meet now"}
              </Button>
              <Button asChild>
                <Link href="/dashboard/meetings/new">
                  <CalendarPlus />
                  Schedule meeting
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && meetings.length > 0 && (
        <div className="space-y-8">
          {renderMeetingSection({
            sectionKey: "ongoing",
            title: "Ongoing now",
            description: "Meetings currently in progress and ready to join.",
            items: groupedMeetings.ongoing,
            emptyTitle: "Nothing live right now",
            emptyDescription: "Any meeting happening at the current time will appear here.",
            accent: "bg-emerald-500",
            delay: "0.02s",
          })}
          {renderMeetingSection({
            sectionKey: "upcoming",
            title: "Coming up",
            description: "Your next scheduled sessions, ordered by time.",
            items: groupedMeetings.upcoming,
            emptyTitle: "No upcoming meetings",
            emptyDescription: "Schedule a meeting or start a quick Jitsi call to fill this section.",
            accent: "bg-primary",
            delay: "0.08s",
          })}
          {renderMeetingSection({
            sectionKey: "past",
            title: "Past meetings",
            description: "Recently completed meetings kept as read-only history.",
            items: groupedMeetings.past,
            emptyTitle: "No meeting history yet",
            emptyDescription: "Finished meetings will appear here once they end.",
            accent: "bg-muted-foreground/50",
            delay: "0.14s",
          })}
          {renderMeetingSection({
            sectionKey: "cancelled",
            title: "Cancelled",
            description: "Meetings that were cancelled and can no longer be joined.",
            items: groupedMeetings.cancelled,
            emptyTitle: "No cancelled meetings",
            emptyDescription: "Cancelled items stay here for visibility and tracking.",
            accent: "bg-rose-500",
            delay: "0.2s",
          })}
        </div>
      )}
    </div>
  );
}
