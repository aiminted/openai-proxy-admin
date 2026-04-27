import { FormEvent, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { api, Key, RecentRow } from "../lib/api"
import { formatDollar, formatInt, formatTime, relativeTime } from "../lib/format"
import { useToast } from "../components/Toast"

export function KeyDetail() {
  const { id } = useParams()
  const [k, setK] = useState<Key | null>(null)
  const [recent, setRecent] = useState<RecentRow[] | null>(null)
  const [error, setError] = useState("")

  async function reload() {
    if (!id) return
    const [d, r] = await Promise.all([
      api.get<Key>(`/admin/api/keys/${id}`),
      api.get<RecentRow[]>(`/admin/api/usage/${id}/recent?limit=50`),
    ])
    setK(d)
    setRecent(r ?? [])
  }
  useEffect(() => { reload().catch((e) => setError(e.message)) }, [id])

  if (error) return <p className="text-sm text-red-500">{error}</p>
  if (!k) return <p className="text-sm text-[var(--color-muted)]">불러오는 중…</p>

  return (
    <>
      <p className="mb-3 text-sm">
        <Link to="/" className="text-[var(--color-accent)] underline-offset-2 hover:underline">← 키 목록</Link>
      </p>

      <section className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-base">{k.prefix}…</h2>
          {k.active
            ? <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">active</span>
            : <span className="rounded-full bg-zinc-200 px-3 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">revoked</span>}
        </div>

        <EditForm initial={k} onSaved={reload} />
      </section>

      <section className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-muted)]">요약</h3>
        <dl className="grid grid-cols-[120px_1fr] gap-y-1 gap-x-4 text-sm">
          <dt className="text-[var(--color-muted)]">created</dt><dd>{formatTime(k.created_at)}</dd>
          <dt className="text-[var(--color-muted)]">last used</dt><dd>{formatTime(k.last_used_at)}</dd>
          <dt className="text-[var(--color-muted)]">total tokens</dt><dd>{formatInt(k.total_tokens)}</dd>
          <dt className="text-[var(--color-muted)]">total cost</dt><dd>{formatDollar(k.total_cost_usd)}</dd>
        </dl>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-muted)]">최근 요청</h3>
        {recent === null ? <p className="text-sm text-[var(--color-muted)]">불러오는 중…</p>
          : recent.length === 0 ? <p className="text-sm text-[var(--color-muted)]">아직 요청이 없습니다.</p>
          : (
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[760px] text-[12px]">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                  <th className="px-2 py-2 text-left">time</th>
                  <th className="px-2 py-2 text-left">endpoint</th>
                  <th className="px-2 py-2 text-left">model</th>
                  <th className="px-2 py-2 text-right">in</th>
                  <th className="px-2 py-2 text-right">out</th>
                  <th className="px-2 py-2 text-right">cost</th>
                  <th className="px-2 py-2 text-right">status</th>
                  <th className="px-2 py-2 text-right">ms</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)]">
                    <td className="px-2 py-1.5" title={r.created_at}>{relativeTime(r.created_at)}</td>
                    <td className="px-2 py-1.5"><code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/5">{r.endpoint}</code></td>
                    <td className="px-2 py-1.5">{r.model || "—"}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{r.input_tokens}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{r.output_tokens}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{formatDollar(r.cost_usd)}</td>
                    <td className={`px-2 py-1.5 text-right tabular-nums ${r.status >= 400 ? "text-red-500" : ""}`}>{r.status}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{r.duration_ms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

function EditForm({ initial, onSaved }: { initial: Key; onSaved: () => Promise<void> }) {
  const toast = useToast()
  const [owner, setOwner] = useState(initial.owner)
  const [note, setNote] = useState(initial.note)
  const [expiresAt, setExpiresAt] = useState(
    initial.expires_at ? toLocalDatetime(initial.expires_at) : "")
  const [rpm, setRpm] = useState(initial.rpm_limit?.toString() ?? "")
  const [tokens, setTokens] = useState(initial.token_quota?.toString() ?? "")
  const [dollars, setDollars] = useState(initial.dollar_quota?.toString() ?? "")
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.patch(`/admin/api/keys/${initial.id}`, {
        owner: owner.trim(),
        note,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        rpm_limit: rpm ? parseInt(rpm, 10) : null,
        token_quota: tokens ? parseInt(tokens, 10) : null,
        dollar_quota: dollars ? parseFloat(dollars) : null,
      })
      toast("저장됨", "ok")
      await onSaved()
    } catch (err: any) {
      toast(err?.message || "저장 실패", "err")
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
  const labelCls = "flex flex-col gap-1 text-xs text-[var(--color-muted)]"

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className={`${labelCls} sm:col-span-2`}>
        <span>owner</span>
        <input type="text" required className={inputCls} value={owner} onChange={(e) => setOwner(e.target.value)} />
      </label>
      <label className={`${labelCls} sm:col-span-2`}>
        <span>note</span>
        <input type="text" className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <label className={labelCls}>
        <span>expires</span>
        <input type="datetime-local" className={inputCls} value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
      </label>
      <label className={labelCls}>
        <span>RPM limit</span>
        <input type="number" min={1} className={inputCls} value={rpm} onChange={(e) => setRpm(e.target.value)} />
      </label>
      <label className={labelCls}>
        <span>token quota</span>
        <input type="number" min={1} className={inputCls} value={tokens} onChange={(e) => setTokens(e.target.value)} />
      </label>
      <label className={labelCls}>
        <span>dollar quota</span>
        <input type="number" min={0} step={0.0001} className={inputCls} value={dollars} onChange={(e) => setDollars(e.target.value)} />
      </label>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "..." : "변경 사항 저장"}
        </button>
      </div>
    </form>
  )
}

// turn an ISO string from the server into the value format the
// <input type="datetime-local"> expects (local-time, no seconds, no tz).
function toLocalDatetime(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
