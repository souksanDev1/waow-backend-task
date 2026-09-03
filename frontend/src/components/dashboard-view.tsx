"use client";

import { PhoneIcon, ShieldCheckIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DashboardView() {
  const { data } = useProfile();

  if (!data) return null;

  const joined = new Date(data.created_at).toLocaleDateString();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <p className="text-sm text-muted-foreground">Dashboard</p>
      <h1 className="mt-1 font-heading text-4xl">Hello, {data.name}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Your account is signed in. Open Profile from the navbar to update your
        name or photo.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Account</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <UserRoundIcon className="size-4" />
              {data.name}
            </CardTitle>
          </CardHeader>
          <CardContent>Signed in with OTP.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Phone</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <PhoneIcon className="size-4" />
              {data.phone_number}
            </CardTitle>
          </CardHeader>
          <CardContent>This number cannot be changed.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Status</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheckIcon className="size-4" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>Member since {joined}.</CardContent>
        </Card>
      </div>

      <Button asChild size="lg" className="mt-8 h-11">
        <Link href="/profile">Go to profile</Link>
      </Button>
    </main>
  );
}
