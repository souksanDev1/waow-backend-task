"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import { mediaUrl, updateProfile } from "@/lib/api/users";
import { profileSchema, type ProfileValues } from "@/lib/validations/auth";
import { profileQueryKey, useProfile } from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth-scene";

export function ProfileForm() {
  const queryClient = useQueryClient();
  const { data } = useProfile();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | undefined>();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (data?.name) {
      form.reset({ name: data.name });
    }
  }, [data, form]);

  const saveMutation = useMutation({
    mutationFn: (values: ProfileValues) =>
      updateProfile({ name: values.name, image: imageFile }),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKey, profile);
      setImageFile(undefined);
      toast.success("Profile updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Could not update profile"
      );
    },
  });

  if (!data) return null;

  const imageSrc = preview ?? mediaUrl(data.profile_image);
  const initials = data.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-10">
      <h1 className="font-heading text-4xl">Your profile</h1>
      <p className="mt-2 text-muted-foreground">
        Phone number stays locked to this account.
      </p>

      <form
        className="mt-10 space-y-6"
        onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
      >
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            {imageSrc ? (
              <AvatarImage src={imageSrc} alt={data.name} />
            ) : (
              <AvatarFallback>{initials || "W"}</AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-2">
            <Label htmlFor="profile_image">Profile image</Label>
            <Input
              id="profile_image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="h-10"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setImageFile(file);
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone number</Label>
          <Input id="phone_number" value={data.phone_number} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" className="h-11" {...form.register("name")} />
          <FieldError message={form.formState.errors.name?.message} />
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full"
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? <Loader2Icon className="animate-spin" /> : null}
          Save changes
        </Button>
      </form>
    </main>
  );
}
