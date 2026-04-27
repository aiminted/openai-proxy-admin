import { clearToken, getToken } from "./auth"

const BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "")

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"
  const tok = getToken()
  if (tok) headers["Authorization"] = `Bearer ${tok}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    clearToken()
    if (window.location.pathname !== "/login") {
      window.location.href = "/login"
    }
    throw new ApiError("unauthorized", 401)
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new ApiError(text || `HTTP ${res.status}`, res.status)
  }

  if (res.status === 204) return undefined as T
  const ct = res.headers.get("content-type") || ""
  if (!ct.includes("application/json")) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get:    <T>(p: string)            => request<T>("GET",    p),
  post:   <T>(p: string, b?: unknown) => request<T>("POST",   p, b),
  patch:  <T>(p: string, b?: unknown) => request<T>("PATCH",  p, b),
  delete: <T>(p: string)            => request<T>("DELETE", p),
}

// types
export type Stats = {
  total_keys: number
  active_keys: number
  today_tokens: number
  today_cost_usd: number
}

export type Key = {
  id: string
  prefix: string
  owner: string
  note: string
  expires_at: string | null
  rpm_limit: number | null
  token_quota: number | null
  dollar_quota: number | null
  active: boolean
  created_at: string
  last_used_at: string | null
  total_tokens: number
  total_cost_usd: number
}

export type IssuedKey = {
  id: string
  prefix: string
  key: string
  owner: string
}

export type RecentRow = {
  created_at: string
  endpoint: string
  model: string
  streaming: boolean
  input_tokens: number
  output_tokens: number
  cost_usd: number
  status: number
  duration_ms: number
}

export type IssueParams = {
  owner: string
  note?: string
  expires_at?: string | null
  rpm_limit?: number | null
  token_quota?: number | null
  dollar_quota?: number | null
}
