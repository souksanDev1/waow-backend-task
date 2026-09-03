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
import { loginUser, requestOtp } from "@/lib/api/users";
import { clearTempToken, setAccessToken } from "@/lib/auth/tokens";
import {
  otpSchema,
  phoneSchema,
  type OtpValues,
  type PhoneValues,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FieldError } from "@/components/auth-scene";

export function LoginForm() {
  const router = useRouter();
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone_number: "" },
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp_code: "" },
  });

  const otpMutation = useMutation({
    mutationFn: (phone_number: string) => requestOtp(phone_number),
    onSuccess: (data) => {
      setDemoOtp(data.otp_code);
      otpForm.reset({ otp_code: "" });
      toast.success("OTP sent");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Could not send OTP");
    },
  });

  const loginMutation = useMutation({
    mutationFn: (otp_code: string) => loginUser(otp_code),
    onSuccess: (data) => {
      setAccessToken(data.access_token);
      clearTempToken();
      toast.success("Signed in");
      router.push("/dashboard");
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Could not sign in";
      toast.error(message);
      if (error instanceof ApiError && error.code === "USER_ERR_NOT_FOUND") {
        router.push("/register");
      }
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
            onSubmit={otpForm.handleSubmit((values) =>
              loginMutation.mutate(values.otp_code)
            )}
          >
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
                {...otpForm.register("otp_code")}
              />
              <FieldError
                className="text-red-200"
                message={otpForm.formState.errors.otp_code?.message}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : null}
              Sign in
            </Button>
          </form>
        </div>
      ) : null}

      <p className="mt-8 text-sm text-white/70">
        New here?{" "}
        <Link href="/register" className="text-white underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </div>
  );
}
