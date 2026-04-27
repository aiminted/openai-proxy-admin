import { useState } from "react"
import { CopyButton, SnippetTabs } from "./Code"
import { exampleSnippets, PROXY_URL } from "../lib/snippets"
import { useToast } from "./Toast"

export function IssuedKeyPanel({ apiKey, onClose }: { apiKey: string; onClose: () => void }) {
  return (
    <section className="mb-5 rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-card)] p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-[var(--color-accent)]">새 키 발급됨</h2>
        <button onClick={onClose} className="text-xs text-[var(--color-muted)] underline-offset-2 hover:underline">닫기</button>
      </div>
      <p className="mb-3 text-xs text-[var(--color-muted)]">
        이 키는 이 화면을 닫으면 다시 볼 수 없습니다. 안전한 곳에 옮겨주세요.
      </p>

      <div className="mb-2 grid grid-cols-1 gap-2">
        <KVRow label="API key" value={apiKey} mono />
        <KVRow label="Base URL" value={`${PROXY_URL}/v1`} mono />
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">사용 예시</h3>
        <SnippetTabs snippets={exampleSnippets(apiKey)} />
      </div>

      <div className="mt-4">
        <TestButton apiKey={apiKey} />
      </div>
    </section>
  )
}

function KVRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-black/5 px-3 py-2 dark:bg-white/5">
      <span className="w-16 shrink-0 text-[11px] uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
      <code className={`flex-1 break-all ${mono ? "" : "font-sans"}`}>{value}</code>
      <CopyButton value={value} />
    </div>
  )
}

function TestButton({ apiKey }: { apiKey: string }) {
  const toast = useToast()
  const [state, setState] = useState<"idle" | "running" | "ok" | "err">("idle")
  const [detail, setDetail] = useState("")

  async function run() {
    setState("running")
    setDetail("")
    try {
      const res = await fetch(`${PROXY_URL}/v1/models`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      if (!res.ok) {
        const text = await res.text()
        setState("err")
        setDetail(`HTTP ${res.status} — ${text.slice(0, 120)}`)
        toast("테스트 실패", "err")
        return
      }
      const body = await res.json()
      const n = Array.isArray(body?.data) ? body.data.length : 0
      setState("ok")
      setDetail(`${n}개 모델 응답됨`)
      toast("프록시 정상 동작", "ok")
    } catch (e: any) {
      setState("err")
      setDetail(e?.message || "network error")
      toast("테스트 실패", "err")
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={run}
        disabled={state === "running"}
        className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
      >
        {state === "running" ? "테스트 중…" : "이 키로 즉시 테스트 (/v1/models)"}
      </button>
      {state === "ok"  && <span className="text-xs text-emerald-600">✓ {detail}</span>}
      {state === "err" && <span className="text-xs text-red-500">✗ {detail}</span>}
    </div>
  )
}
