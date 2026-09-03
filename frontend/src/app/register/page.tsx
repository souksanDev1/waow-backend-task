import { AuthScene } from "@/components/auth-scene";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <AuthScene
      title="Create your account."
      kicker="Verify a code, then we’ll keep this phone number as your login."
    >
      <RegisterForm />
    </AuthScene>
  );
}
