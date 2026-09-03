import Link from "next/link";
import { AuthScene } from "@/components/auth-scene";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <AuthScene
      title="Your number is the key."
      kicker="Request an OTP, then sign in or create an account."
    >
      <div className="flex max-w-sm flex-col gap-3">
        <Button asChild size="lg" className="h-12 text-base">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 border-white/30 bg-transparent text-base text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/register">Create account</Link>
        </Button>
      </div>
    </AuthScene>
  );
}
