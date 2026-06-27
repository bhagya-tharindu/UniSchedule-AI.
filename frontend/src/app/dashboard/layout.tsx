"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, LogOut, Plus, UserRound } from "lucide-react";
import { api, setToken, type User } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("unischedule_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    api
      .me()
      .then((res) => setUser(res.user))
      .catch(() => {
        setToken(null);
        router.replace("/login");
      });
  }, [router]);

  async function logout() {
    try {
      await api.logout();
    } finally {
      setToken(null);
      router.push("/login");
    }
  }

  return (
    <div className="app-bg min-h-full">
      <header className="glass border-border/60 sticky top-0 z-20 border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl shadow-sm">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">UniSchedule AI</p>
              <p className="text-muted-foreground text-[11px]">
                Meeting scheduler
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href="/dashboard/meetings/new">
                <Plus />
                <span className="hidden sm:inline">New meeting</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>

            <ModeToggle />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Account menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-muted-foreground text-xs capitalize">
                        {user.role} · {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <UserRound />
                      My meetings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={logout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
