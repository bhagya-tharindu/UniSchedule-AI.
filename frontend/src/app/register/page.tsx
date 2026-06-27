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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      setToken(res.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
                Create your account
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Join as a student or lecturer to start scheduling.
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
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Student"
                />
              </div>

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
                <Label>I am a</Label>
                <Tabs
                  value={role}
                  onValueChange={(v) => setRole(v as "student" | "lecturer")}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="student" className="flex-1">
                      Student
                    </TabsTrigger>
                    <TabsTrigger value="lecturer" className="flex-1">
                      Lecturer
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm</Label>
                  <Input
                    id="confirm"
                    type="password"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating…" : "Create account"}
              {!loading && <ArrowRight />}
            </Button>

            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
}
