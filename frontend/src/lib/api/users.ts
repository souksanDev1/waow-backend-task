import { apiClient } from "@/lib/api/client";
import type { ApiSuccess, AuthPayload, OtpPayload, UserProfile } from "@/lib/api/types";
import { setTempToken } from "@/lib/auth/tokens";

export async function requestOtp(phone_number: string) {
  const response = await apiClient.post<ApiSuccess<OtpPayload>>(
    "/api/users/otp",
    { phone_number }
  );
  const tempToken =
    response.headers["x-temp-token"] ||
    String(response.headers.authorization ?? "").replace(/^Bearer\s+/i, "");

  if (!tempToken) {
    throw new Error("Temporary token missing from OTP response");
  }

  setTempToken(tempToken);
  return response.data.data;
}

export async function registerUser(otp_code: string, name: string) {
  const response = await apiClient.post<ApiSuccess<AuthPayload>>(
    "/api/users/register",
    { otp_code, name }
  );
  return response.data.data;
}

export async function loginUser(otp_code: string) {
  const response = await apiClient.post<ApiSuccess<AuthPayload>>(
    "/api/users/login",
    { otp_code }
  );
  return response.data.data;
}

export async function getProfile() {
  const response = await apiClient.get<ApiSuccess<UserProfile>>(
    "/api/users/profile"
  );
  return response.data.data;
}

export async function updateProfile(input: { name?: string; image?: File }) {
  const form = new FormData();
  if (input.name) form.append("name", input.name);
  if (input.image) form.append("profile_image", input.image);

  const response = await apiClient.put<ApiSuccess<UserProfile>>(
    "/api/users/profile",
    form
  );
  return response.data.data;
}

export function mediaUrl(path: string | null | undefined) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}
