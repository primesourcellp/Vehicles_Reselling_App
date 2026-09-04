import { apiRequest, digitsOnly, normalizeMobile } from '@/lib/api';

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type AuthUser = {
  id: string;
  full_name: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  pin_code: string;
  is_mobile_verified: boolean;
  accepted_terms: boolean;
  date_joined: string;
};

export type OtpRequestResponse = {
  message: string;
  mobile: string;
  email?: string;
  expires_in_minutes: number;
  user_id?: string;
  /** Present only when Django DEBUG=true */
  dev_otp?: string;
};

export type AuthSuccessResponse = {
  message: string;
  user: AuthUser;
  tokens: AuthTokens;
};

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function storeSession(tokens: AuthTokens) {
  accessToken = tokens.access;
}

export type RegisterPayload = {
  full_name: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  pin_code: string;
  password?: string;
  accepted_terms: boolean;
};

export async function registerAccount(payload: RegisterPayload) {
  return apiRequest<OtpRequestResponse>('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      mobile: normalizeMobile(payload.mobile),
      pin_code: digitsOnly(payload.pin_code),
      password: payload.password || '',
    }),
  });
}

export async function verifyRegisterOtp(mobile: string, otp: string) {
  return apiRequest<AuthSuccessResponse>('/api/auth/register/verify-otp/', {
    method: 'POST',
    body: JSON.stringify({ mobile: normalizeMobile(mobile), otp }),
  });
}

export async function resendRegisterOtp(mobile: string) {
  return apiRequest<OtpRequestResponse>('/api/auth/register/resend-otp/', {
    method: 'POST',
    body: JSON.stringify({ mobile: normalizeMobile(mobile) }),
  });
}

export async function requestLoginOtp(mobile: string) {
  return apiRequest<OtpRequestResponse>('/api/auth/login/otp/request/', {
    method: 'POST',
    body: JSON.stringify({ mobile: normalizeMobile(mobile) }),
  });
}

export async function verifyLoginOtp(mobile: string, otp: string) {
  return apiRequest<AuthSuccessResponse>('/api/auth/login/otp/verify/', {
    method: 'POST',
    body: JSON.stringify({ mobile: normalizeMobile(mobile), otp }),
  });
}

export async function loginWithPassword(params: {
  email?: string;
  mobile?: string;
  password: string;
}) {
  return apiRequest<AuthSuccessResponse>('/api/auth/login/password/', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email?.trim().toLowerCase() || '',
      mobile: params.mobile ? normalizeMobile(params.mobile) : '',
      password: params.password,
    }),
  });
}
