"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, SmartphoneIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { registerUser, requestOtp } from "@/lib/api/users";
import { clearTempToken, setAccessToken } from "@/lib/auth/tokens";
import {
  phoneSchema,
  registerSchema,
  type PhoneValues,
  type RegisterValues,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FieldError } from "@/components/auth-scene";

export function RegisterForm() {
  const router = useRouter();
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone_number: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { otp_code: "", name: "" },
  });

  const otpMutation = useMutation({
    mutationFn: (phone_number: string) => requestOtp(phone_number),
    onSuccess: (data) => {
      setDemoOtp(data.otp_code);
      toast.success("OTP sent");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Could not send OTP");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (values: RegisterValues) =>
      registerUser(values.otp_code, values.name),
    onSuccess: (data) => {
      setAccessToken(data.access_token);
      clearTempToken();
      toast.success("Account created");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Could not create account"
      );
    },
  });

  return (
    <div className="max-w-md text-white">
      <form
        className="space-y-4"
        onSubmit={phoneForm.handleSubmit((values) =>
          otpMutation.mutate(values.phone_number)
        )}
      >
        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-white/80">
            Phone number
          </Label>
          <Input
            id="phone_number"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="8562056666666"
            className="h-11 border-white/25 bg-white/10 text-white placeholder:text-white/45"
            {...phoneForm.register("phone_number")}
          />
          <FieldError
            className="text-red-200"
            message={phoneForm.formState.errors.phone_number?.message}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-11 w-full"
          disabled={otpMutation.isPending}
        >
          {otpMutation.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <SmartphoneIcon />
          )}
          Send OTP
        </Button>
      </form>

      {demoOtp ? (
        <div className="mt-8 space-y-4">
          <Alert className="border-white/20 bg-white/10 text-white">
            <AlertTitle>Demo OTP</AlertTitle>
            <AlertDescription className="font-heading text-2xl tracking-[0.35em] text-white">
              {demoOtp}
            </AlertDescription>
          </Alert>

          <form
            className="space-y-4"
            onSubmit={registerForm.handleSubmit((values) =>
              registerMutation.mutate(values)
            )}
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80">
                Name
              </Label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="John Doe"
                className="h-11 border-white/25 bg-white/10 text-white placeholder:text-white/45"
                {...registerForm.register("name")}
              />
              <FieldError
                className="text-red-200"
                message={registerForm.formState.errors.name?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otp_code" className="text-white/80">
                OTP code
              </Label>
              <Input
                id="otp_code"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="h-11 border-white/25 bg-white/10 tracking-[0.4em] text-white placeholder:text-white/45"
                {...registerForm.register("otp_code")}
              />
              <FieldError
                className="text-red-200"
                message={registerForm.formState.errors.otp_code?.message}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : null}
              Create account
            </Button>
          </form>
        </div>
      ) : null}

      <p className="mt-8 text-sm text-white/70">
        Already registered?{" "}
        <Link href="/login" className="text-white underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
