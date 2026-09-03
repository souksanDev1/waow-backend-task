import { AuthScene } from "@/components/auth-scene";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <AuthScene
      title="Sign in with OTP."
      kicker="We’ll send a one-minute code to your phone number."
    >
      <LoginForm />
    </AuthScene>
  );
}
