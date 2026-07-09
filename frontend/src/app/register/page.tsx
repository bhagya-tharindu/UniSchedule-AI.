"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="app-bg flex h-full min-h-0 flex-col items-center justify-center overflow-y-auto px-4 py-10">
      <Card className="rise-in w-full max-w-md">
        <CardContent className="space-y-4 pt-6 text-center">
          <div className="bg-primary text-primary-foreground mx-auto flex h-12 w-12 items-center justify-center rounded-xl">
            <CalendarDays className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Registration is closed
          </h1>
          <p className="text-muted-foreground text-sm">
            Only system administrators can create accounts. Contact your admin
            or sign in if you already have access.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Go to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
