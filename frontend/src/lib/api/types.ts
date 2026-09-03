export type ApiSuccess<T> = {
  error: false;
  code: 0;
  message: string;
  data: T;
};

export type ApiFailure = {
  error: true;
  code: string;
  message: string;
  data: Record<string, unknown>;
};

export type UserProfile = {
  id: number;
  phone_number: string;
  name: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthPayload = {
  access_token: string;
  user: UserProfile;
};

export type OtpPayload = {
  otp_code: string;
  expires_in: number;
};
