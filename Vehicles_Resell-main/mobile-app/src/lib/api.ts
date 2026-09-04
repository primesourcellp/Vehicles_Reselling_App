import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Resolve API host for:
 * - Physical device / Expo Go → same LAN IP Metro uses (e.g. 192.168.1.45)
 * - Android emulator → 10.0.2.2
 * - iOS simulator / web → 127.0.0.1
 */
function resolveApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.linkingUri ||
    (Constants as { debuggerHost?: string }).debuggerHost ||
    '';

  // hostUri examples: "192.168.1.45:8081", "exp://192.168.1.45:8081"
  const match = String(hostUri).match(/(\d{1,3}(?:\.\d{1,3}){3})/);
  if (match?.[1]) {
    return `http://${match[1]}:8000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  return 'http://127.0.0.1:8000';
}

export const API_BASE_URL = resolveApiBaseUrl();

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function pickErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback;
  const data = body as Record<string, unknown>;

  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail) && typeof data.detail[0] === 'string') {
    return data.detail[0];
  }

  for (const value of Object.values(data)) {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  }

  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = options;
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(
      `Cannot reach API at ${API_BASE_URL}. On a phone, run Django as: py manage.py runserver 0.0.0.0:8000`,
      0,
    );
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      pickErrorMessage(body, `Request failed (${response.status})`),
      response.status,
      body,
    );
  }

  return body as T;
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** India-style: keep the last 10 digits when a country code is included. */
export function normalizeMobile(value: string): string {
  const digits = digitsOnly(value);
  return digits.length > 10 ? digits.slice(-10) : digits;
}
