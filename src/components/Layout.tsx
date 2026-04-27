import { Link, Outlet, useNavigate } from "react-router-dom"
import { clearToken } from "../lib/auth"

export function Layout() {
  const nav = useNavigate()
  function logout() {
    clearToken()
    nav("/login", { replace: true })
  }
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-6 py-3">
        <Link to="/" className="font-semibold text-[var(--color-fg)]">openai-proxy</Link>
        <button onClick={logout} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] underline underline-offset-2">
          logout
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
