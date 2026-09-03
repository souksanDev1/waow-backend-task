"use client";

import type { ReactNode } from "react";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAccessToken } from "@/lib/auth/tokens";
import { useProfile } from "@/hooks/use-profile";
import { AppNavbar } from "@/components/app-navbar";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError } = useProfile();

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
    }
  }, [router]);

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
        <Loader2Icon className="mr-2 size-4 animate-spin" />
        Loading
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
        <p>Could not load your session.</p>
        <Button onClick={() => router.replace("/login")}>Back to sign in</Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <AppNavbar user={data} />
      {children}
    </div>
  );
}
