"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOutIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearSession } from "@/lib/auth/tokens";
import { profileQueryKey } from "@/hooks/use-profile";
import type { UserProfile } from "@/lib/api/types";
import { mediaUrl } from "@/lib/api/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppNavbar({ user }: { user: UserProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const imageSrc = mediaUrl(user.profile_image);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Link href="/dashboard" className="font-heading text-xl tracking-tight">
          WAOW
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            asChild
            variant={pathname === "/profile" ? "default" : "ghost"}
            size="lg"
            className={cn("h-9")}
          >
            <Link href="/profile">
              <UserRoundIcon />
              Profile
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-9"
            onClick={() => {
              clearSession();
              queryClient.removeQueries({ queryKey: profileQueryKey });
              toast.success("Signed out");
              router.replace("/login");
            }}
          >
            <LogOutIcon />
            Sign out
          </Button>
          <Avatar className="h-9 w-9">
            {imageSrc ? (
              <AvatarImage src={imageSrc} alt={user.name} />
            ) : (
              <AvatarFallback>{initials(user.name) || "W"}</AvatarFallback>
            )}
          </Avatar>
        </nav>
      </div>
    </header>
  );
}
