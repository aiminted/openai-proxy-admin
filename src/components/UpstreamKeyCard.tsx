import { FormEvent, useEffect, useState } from "react"
import { api, UpstreamKeyMeta } from "../lib/api"
import { formatTime, relativeTime } from "../lib/format"
import { useToast } from "./Toast"

export function UpstreamKeyCard() {
  const [history, setHistory] = useState<UpstreamKeyMeta[] | null>(null)
  const [open, setOpen] = useState(false)
  const toast = useToast()

  async function reload() {
    const rows = await api.get<UpstreamKeyMeta[]>("/admin/api/upstream-keys")
    setHistory(rows ?? [])
  }
  useEffect(() => { reload().catch(console.error) }, [])

  const active = history?.find((k) => k.active)
  const retired = (history ?? []).filter((k) => !k.active)

  return (
    <section className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">Upstream key</span>
          {active ? (
            <>
              <code className="text-sm">{active.prefix}</code>
              <span className="text-[11px] text-[var(--color-muted)]" title={active.created_at}>
                set {relativeTime(active.created_at)}
              </span>
            </>
          ) : (
            <span className="text-sm text-red-500">미설정</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          {open ? "닫기" : active ? "회전" : "설정"}
        </button>
      </div>

      {open && (
        <RotateForm
          hasExisting={!!active}
          onDone={async () => {
            await reload()
            setOpen(false)
            toast("upstream key 회전됨", "ok")
          }}
        />
      )}

      {open && retired.length > 0 && (
        <details className="mt-4 text-[12px]">
          <summary className="cursor-pointer text-[var(--color-muted)]">
            과거 키 {retired.length}개
          </summary>
          <ul className="mt-2 divide-y divide-[var(--color-border)]">
            {retired.map((k) => (
              <li key={k.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-1.5">
                <code>{k.prefix}</code>
                <span className="text-[var(--color-muted)]" title={k.created_at}>
                  set {formatTime(k.created_at)}
                </span>
                <span className="text-[var(--color-muted)]" title={k.retired_at ?? ""}>
                  retired {k.retired_at ? formatTime(k.retired_at) : "—"}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}

function RotateForm({ hasExisting, onDone }: { hasExisting: boolean; onDone: () => Promise<void> }) {
  const toast = useToast()
  const [key, setKey] = useState("")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!key.trim().startsWith("sk-")) {
      toast("키는 sk- 로 시작해야 합니다", "err")
      return
    }
    if (hasExisting && !confirm("기존 키를 즉시 비활성화하고 새 키로 교체합니다. 계속할까요?")) return
    setSubmitting(true)
    try {
      await api.post("/admin/api/upstream-keys", { key: key.trim(), note: note.trim() })
      setKey("")
      setNote("")
      await onDone()
    } catch (err: any) {
      toast(err?.message || "회전 실패", "err")
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = "rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"

  return (
    <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2">
      <p className="text-[11px] text-[var(--color-muted)]">
        새 OpenAI 키를 붙여넣으세요. 화면에 다시 표시되지 않습니다 — 평문은 클러스터 안에서 즉시 암호화되어 저장됩니다.
      </p>
      <input
        type="password"
        autoFocus
        required
        className={inputCls}
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="sk-proj-..."
        autoComplete="off"
      />
      <input
        type="text"
        className={inputCls}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="메모 (선택) — e.g. 2026-04-28 rotation"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || !key}
          className="rounded-md bg-[var(--color-accent)] px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {submitting ? "..." : hasExisting ? "회전" : "설정"}
        </button>
      </div>
    </form>
  )
}
