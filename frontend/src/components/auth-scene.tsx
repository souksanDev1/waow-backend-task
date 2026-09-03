import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AuthScene({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/auth-field.svg')] bg-cover bg-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,28,24,0.92)_0%,rgba(8,28,24,0.78)_42%,rgba(8,28,24,0.35)_100%)]"
      />
      <div aria-hidden className="waow-grain" />
      <div
        aria-hidden
        className="animate-pulse-ring pointer-events-none absolute right-[18%] top-[42%] size-48 rounded-full border border-white/25"
      />

      <div className="relative mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="text-white">
          <p className="font-heading text-6xl leading-none tracking-tight sm:text-8xl">
            WAOW
          </p>
          <h1 className="mt-6 max-w-md font-heading text-3xl leading-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-sm text-sm text-white/75">{kicker}</p>
        </section>

        <section className="animate-rise">{children}</section>
      </div>
    </main>
  );
}

export function FieldError({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p className={cn("text-sm text-destructive", className)} role="alert">
      {message}
    </p>
  );
}
