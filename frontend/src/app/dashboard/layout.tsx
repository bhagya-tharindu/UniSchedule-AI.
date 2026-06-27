"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, setToken, type User } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
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
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-lg font-semibold text-slate-900">UniSchedule AI</p>
            {user && (
              <p className="text-sm text-slate-500">
                {user.name} · {user.role}
              </p>
            )}
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className={
                pathname === "/dashboard"
                  ? "font-medium text-indigo-600"
                  : "text-slate-600 hover:text-slate-900"
              }
            >
              Meetings
            </Link>
            <Link
              href="/dashboard/meetings/new"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
            >
              New meeting
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-slate-600 hover:text-slate-900"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
