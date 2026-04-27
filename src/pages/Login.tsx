import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import { setToken } from "../lib/auth"

export function Login() {
  const nav = useNavigate()
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const res = await api.post<{ token: string; expires_in: number }>(
        "/admin/api/login", { password })
      setToken(res.token, res.expires_in)
      nav("/", { replace: true })
    } catch (err: any) {
      setError(err?.status === 401 ? "비밀번호가 올바르지 않습니다." : err?.message || "로그인 실패")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={onSubmit}
            className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
        <h1 className="mb-4 text-base font-semibold">openai-proxy</h1>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <label className="mb-1 block text-xs text-[var(--color-muted)]">admin password</label>
        <input
          type="password"
          autoFocus
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 outline-none focus:border-[var(--color-accent)]"
        />
        <button type="submit" disabled={submitting}
          className="w-full rounded-md bg-[var(--color-accent)] py-2 font-semibold text-white disabled:opacity-50">
          {submitting ? "..." : "sign in"}
        </button>
      </form>
    </div>
  )
}
