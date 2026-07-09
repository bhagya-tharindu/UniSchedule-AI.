"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  TriangleAlert,
} from "lucide-react";
import { api, setToken } from "@/lib/api";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      router.push(
        res.user.role === "admin" ? "/dashboard/admin/users" : "/dashboard",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-bg relative flex h-full min-h-0 flex-col overflow-y-auto">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="rise-in glass grid w-full max-w-4xl gap-0 overflow-hidden border-white/40 p-0 shadow-2xl shadow-black/10 lg:grid-cols-2">
          <AuthBrandPanel />

          <div className="flex items-center justify-center bg-card/40 p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="bg-primary text-primary-foreground flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-tight">
                    UniSchedule AI
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Sign in to your account
                  </p>
                </div>
              </div>

              <div className="auth-stagger space-y-6">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-6">
                    Sign in to manage your meetings. Accounts are created by an
                    administrator.
                  </p>
                </div>

                {error ? (
                  <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@canterbury.ac.nz"
                        className="pl-10 transition-shadow focus-visible:ring-primary/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pr-10 pl-10 transition-shadow focus-visible:ring-primary/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className={cn(
                    "w-full gap-2 shadow-sm transition-all",
                    !loading && "hover:shadow-md",
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
