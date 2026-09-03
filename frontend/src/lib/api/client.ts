import axios, { AxiosError, AxiosHeaders } from "axios";
import { clearSession, getAccessToken, getTempToken } from "@/lib/auth/tokens";
import type { ApiFailure, ApiSuccess } from "@/lib/api/types";

export class ApiError extends Error {
  code: string;
  status?: number;

  constructor(code: string, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const headers = AxiosHeaders.from(config.headers);
  const url = config.url ?? "";

  if (config.data instanceof FormData) {
    headers.delete("Content-Type");
  } else {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    if (url.includes("/api/users/profile")) {
      const token = getAccessToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
    } else if (
      url.includes("/api/users/register") ||
      url.includes("/api/users/login")
    ) {
      const token = getTempToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
  }

  config.headers = headers;
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as ApiSuccess<unknown> | ApiFailure | undefined;
    if (body && body.error) {
      throw new ApiError(String(body.code), body.message, response.status);
    }
    return response;
  },
  (error: AxiosError<ApiFailure>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearSession();
    }

    const data = error.response?.data;
    if (data?.error) {
      throw new ApiError(
        String(data.code),
        data.message,
        error.response?.status
      );
    }

    throw new ApiError(
      "NETWORK_ERR",
      error.message || "Unable to reach the API",
      error.response?.status
    );
  }
);
