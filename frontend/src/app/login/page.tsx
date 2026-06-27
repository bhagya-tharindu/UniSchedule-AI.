"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, CalendarDays, TriangleAlert } from "lucide-react";
import { api, setToken } from "@/lib/api";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student@unischedule.test");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-bg flex min-h-full flex-1 items-center justify-center px-4 py-10">
      <Card className="rise-in grid w-full max-w-4xl gap-0 overflow-hidden p-0 shadow-2xl lg:grid-cols-2">
        <AuthBrandPanel />

        <div className="flex items-center justify-center p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl">
                <CalendarDays className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">UniSchedule AI</span>
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Sign in to manage your meetings.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@canterbury.ac.nz"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <ArrowRight />}
            </Button>

            <p className="text-muted-foreground text-center text-sm">
              No account?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
}
