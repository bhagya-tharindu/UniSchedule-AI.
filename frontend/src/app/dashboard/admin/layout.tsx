"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarRange,
  GraduationCap,
  Users,
} from "lucide-react";
import { api, type User } from "@/lib/api";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/courses", label: "Courses", icon: GraduationCap },
  {
    href: "/dashboard/admin/exams",
    label: "Campus blackouts",
    icon: CalendarRange,
  },
  { href: "/dashboard/admin/timetables", label: "Timetables", icon: BookOpen },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api
      .me()
      .then((res) => {
        if (res.user.role !== "admin") {
          router.replace("/dashboard");
          return;
        }
        setUser(res.user);
        setReady(true);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  if (!ready || !user) {
    return (
      <p className="text-muted-foreground text-sm">Checking admin access…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="text-muted-foreground text-sm">
          Manage users, exam periods, and lecture timetables.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
