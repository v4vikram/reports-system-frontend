import axios, { isAxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { env } from "./env";
import type { ApiErrorBody, ApiSuccessBody } from "@/types/api";

export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

type RequestConfig = Omit<AxiosRequestConfig, "url" | "method" | "data">;

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

const REFRESH_PATH = "/api/auth/refresh";

// 401s from these are a real "wrong credentials" failure, never a stale
// access token — retrying them via refresh would be pointless.
const NO_REFRESH_RETRY_PATHS = new Set([REFRESH_PATH, "/api/auth/login", "/api/auth/register"]);

const http = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// The backend's refresh-token rotation revokes the whole session if a
// token gets presented twice (reuse = treated as theft). If several
// requests 401 at once, they must share a single refresh call rather than
// each firing their own — otherwise the second call could hand the
// already-rotated token back to the server and get every session killed.
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = http
      .post(REFRESH_PATH)
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError<ApiErrorBody>(error)) {
      throw error;
    }

    const config = error.config as RetryableConfig | undefined;

    if (
      error.response?.status === 401 &&
      config &&
      !config._retried &&
      !NO_REFRESH_RETRY_PATHS.has(config.url ?? "")
    ) {
      const refreshed = await refreshSession();
      if (refreshed) {
        config._retried = true;
        return http.request(config);
      }
    }

    throw new ApiClientError(
      error.response?.status ?? 0,
      error.response?.data?.message ?? error.message,
      error.response?.data?.details
    );
  }
);

async function request<T>(
  path: string,
  method: string,
  data?: unknown,
  config?: RequestConfig
): Promise<T> {
  const res = await http.request<ApiSuccessBody<T>>({ ...config, url: path, method, data });
  return res.data.data;
}

export const apiClient = {
  get: <T>(path: string, config?: RequestConfig) => request<T>(path, "GET", undefined, config),
  post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, "POST", body, config),
  patch: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, "PATCH", body, config),
  put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, "PUT", body, config),
  delete: <T>(path: string, config?: RequestConfig) => request<T>(path, "DELETE", undefined, config),
};
