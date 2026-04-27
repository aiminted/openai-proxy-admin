import { FormEvent, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { api, IssuedKey, IssueParams, Key, Stats } from "../lib/api"
import { formatDollar, formatInt, formatTime, relativeTime } from "../lib/format"

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
      <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
    </div>
  )
}

function Card({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      {(title || action) && (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [keys, setKeys] = useState<Key[]>([])
  const [issued, setIssued] = useState<IssuedKey | null>(null)
  const [search, setSearch] = useState("")
  const [hideInactive, setHideInactive] = useState(true)

  async function reload() {
    const [s, k] = await Promise.all([
      api.get<Stats>("/admin/api/stats"),
      api.get<Key[]>("/admin/api/keys"),
    ])
    setStats(s)
    setKeys(k ?? [])
  }
  useEffect(() => { reload().catch(console.error) }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return keys.filter((k) => {
      if (hideInactive && !k.active) return false
      if (!q) return true
      return [k.owner, k.prefix, k.note].some((s) => (s ?? "").toLowerCase().includes(q))
    })
  }, [keys, search, hideInactive])

  return (
    <>
      {stats && (
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="total keys" value={formatInt(stats.total_keys)} />
          <StatCard label="active" value={formatInt(stats.active_keys)} />
          <StatCard label="tokens today" value={formatInt(stats.today_tokens)} />
          <StatCard label="cost today" value={formatDollar(stats.today_cost_usd)} />
        </div>
      )}

      {issued && (
        <Card title="새 키 발급됨" action={<button onClick={() => setIssued(null)} className="text-xs text-[var(--color-muted)] underline">닫기</button>}>
          <p className="mb-2 text-xs text-[var(--color-muted)]">이 값은 한 번만 표시됩니다. 안전한 곳에 옮겨주세요.</p>
          <div className="flex items-center gap-2 rounded-md bg-black/5 px-3 py-2 dark:bg-white/5">
            <code className="flex-1 break-all">{issued.key}</code>
            <CopyButton value={issued.key} />
          </div>
        </Card>
      )}

      <IssueForm onIssued={(k) => { setIssued(k); reload() }} />

      <Card
        title={`키 목록 (${keys.length})`}
        action={
          <div className="flex items-center gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="owner / prefix / note 검색…"
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-xs outline-none focus:border-[var(--color-accent)]"
            />
            <label className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
              <input type="checkbox" checked={hideInactive} onChange={(e) => setHideInactive(e.target.checked)} />
              <span>비활성 숨김</span>
            </label>
          </div>
        }
      >
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                <Th>prefix</Th><Th>owner</Th>
                <Th align="right">tokens</Th><Th align="right">cost</Th>
                <Th>expires</Th><Th align="right">RPM</Th>
                <Th>last used</Th><Th>active</Th><Th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((k) => (
                <tr key={k.id} className="border-b border-[var(--color-border)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <Td><Link to={`/keys/${k.id}`} className="text-[var(--color-accent)] underline-offset-2 hover:underline"><code>{k.prefix}…</code></Link></Td>
                  <Td title={k.owner} className="max-w-[220px] truncate">{k.owner}</Td>
                  <Td align="right">{formatInt(k.total_tokens)}</Td>
                  <Td align="right">{formatDollar(k.total_cost_usd)}</Td>
                  <Td className="text-[var(--color-muted)]">{formatTime(k.expires_at)}</Td>
                  <Td align="right">{k.rpm_limit ?? "—"}</Td>
                  <Td className="text-[var(--color-muted)]" title={k.last_used_at ?? ""}>{relativeTime(k.last_used_at)}</Td>
                  <Td>{k.active
                    ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">on</span>
                    : <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">off</span>}
                  </Td>
                  <Td align="right">
                    <RowActions k={k} reload={reload} />
                  </Td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-6 text-center text-[var(--color-muted)]">{keys.length === 0 ? "아직 발급된 키가 없습니다." : "검색 결과 없음."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

function Th({ children, align }: { children?: React.ReactNode; align?: "right" }) {
  return <th className={`px-2 py-2 font-medium ${align === "right" ? "text-right" : "text-left"}`}>{children}</th>
}
function Td({ children, align, className, title }: { children?: React.ReactNode; align?: "right"; className?: string; title?: string }) {
  return <td title={title} className={`px-2 py-2 align-middle ${align === "right" ? "text-right tabular-nums" : ""} ${className ?? ""}`}>{children}</td>
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1200)
        })
      }}
      className={`rounded-md border px-2 py-1 text-xs ${copied ? "border-emerald-500 text-emerald-600" : "border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"}`}
    >
      {copied ? "copied" : "copy"}
    </button>
  )
}

function RowActions({ k, reload }: { k: Key; reload: () => Promise<void> }) {
  async function toggle() {
    const msg = k.active ? "이 키를 비활성화할까요? 즉시 차단됩니다." : "이 키를 다시 활성화할까요?"
    if (!confirm(msg)) return
    await api.post(`/admin/api/keys/${k.id}/active`, { active: !k.active })
    await reload()
  }
  async function remove() {
    if (!confirm("이 키와 모든 사용 기록을 영구 삭제합니다. 복구 불가.")) return
    await api.delete(`/admin/api/keys/${k.id}`)
    await reload()
  }
  return (
    <span className="space-x-3 whitespace-nowrap">
      <button onClick={toggle} className="text-xs text-[var(--color-accent)] underline-offset-2 hover:underline">{k.active ? "revoke" : "reactivate"}</button>
      <button onClick={remove} className="text-xs text-red-500 underline-offset-2 hover:underline">delete</button>
    </span>
  )
}

function IssueForm({ onIssued }: { onIssued: (k: IssuedKey) => void }) {
  const [owner, setOwner] = useState("")
  const [note, setNote] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [rpm, setRpm] = useState("")
  const [tokens, setTokens] = useState("")
  const [dollars, setDollars] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  function preset(days: number | null) {
    if (days == null) { setExpiresAt(""); return }
    const d = new Date()
    d.setDate(d.getDate() + days)
    setExpiresAt(d.toISOString().slice(0, 10))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!owner.trim()) { setError("owner is required"); return }
    setSubmitting(true)
    setError("")
    try {
      const params: IssueParams = {
        owner: owner.trim(),
        note: note,
        expires_at: expiresAt ? new Date(expiresAt + "T00:00:00Z").toISOString() : null,
        rpm_limit: rpm ? parseInt(rpm, 10) : null,
        token_quota: tokens ? parseInt(tokens, 10) : null,
        dollar_quota: dollars ? parseFloat(dollars) : null,
      }
      const k = await api.post<IssuedKey>("/admin/api/keys", params)
      onIssued(k)
      setOwner(""); setNote(""); setExpiresAt(""); setRpm(""); setTokens(""); setDollars("")
    } catch (err: any) {
      setError(err?.message || "발급 실패")
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = "rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
  const labelCls = "flex flex-col gap-1 text-xs text-[var(--color-muted)]"

  return (
    <Card title="새 API 키 발급">
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className={`${labelCls} sm:col-span-2`}>
          <span>owner <span className="text-red-500">*</span></span>
          <input type="text" required className={inputCls} value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="user@example.com 또는 이름" />
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          <span>note</span>
          <input type="text" className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="자유 메모" />
        </label>
        <label className={labelCls}>
          <span>expires</span>
          <div className="flex flex-wrap items-center gap-2">
            <input type="date" className={`${inputCls} flex-1 min-w-[140px]`} value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            {[
              { label: "+7d", days: 7 },
              { label: "+30d", days: 30 },
              { label: "+90d", days: 90 },
              { label: "없음", days: null },
            ].map((p) => (
              <button key={p.label} type="button" onClick={() => preset(p.days)}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                {p.label}
              </button>
            ))}
          </div>
        </label>
        <label className={labelCls}>
          <span>RPM limit</span>
          <input type="number" min={1} className={inputCls} value={rpm} onChange={(e) => setRpm(e.target.value)} placeholder="분당 요청수" />
        </label>
        <label className={labelCls}>
          <span>token quota</span>
          <input type="number" min={1} className={inputCls} value={tokens} onChange={(e) => setTokens(e.target.value)} placeholder="누적 토큰 한도" />
        </label>
        <label className={labelCls}>
          <span>dollar quota</span>
          <input type="number" min={0} step={0.01} className={inputCls} value={dollars} onChange={(e) => setDollars(e.target.value)} placeholder="누적 달러 한도" />
        </label>
        <div className="sm:col-span-2 flex items-center gap-3">
          <button type="submit" disabled={submitting}
            className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {submitting ? "..." : "발급"}
          </button>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      </form>
    </Card>
  )
}
