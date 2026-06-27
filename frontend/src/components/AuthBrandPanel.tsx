import { CalendarDays, Shield, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Natural language booking",
    desc: "Describe a meeting in plain English and let the assistant draft it.",
  },
  {
    icon: Zap,
    title: "Real-time clash detection",
    desc: "Conflicts across people, rooms and availability are caught instantly.",
  },
  {
    icon: Shield,
    title: "Academic-aware rules",
    desc: "Exam blackouts, capacity and availability validated before booking.",
  },
];

export function AuthBrandPanel() {
  return (
    <div className="brand-gradient relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
          <CalendarDays className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight">UniSchedule AI</p>
          <p className="text-xs text-white/70">University of Canterbury</p>
        </div>
      </div>

      <div className="relative space-y-8">
        <div>
          <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight">
            Intelligent scheduling for academic meetings.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            Hybrid AI that interprets requests and validates every booking
            against university constraints.
          </p>
        </div>

        <ul className="space-y-5">
          {features.map((f) => (
            <li key={f.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-sm text-white/75">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/60">
        Final Year Project · Hybrid NLP + constraint engine
      </p>
    </div>
  );
}
