import { useState } from "react"
import { CopyButton, CodeBlock } from "./Code"
import { PROXY_URL } from "../lib/snippets"

export function ClientSetup() {
  const [open, setOpen] = useState(false)
  const baseUrl = `${PROXY_URL}/v1`
  const envSnippet = `export OPENAI_API_KEY=sk-pxy-…\nexport OPENAI_BASE_URL=${baseUrl}`

  return (
    <section className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">Base URL</span>
          <code className="text-sm">{baseUrl}</code>
          <CopyButton value={baseUrl} />
        </div>
        <span className="text-xs text-[var(--color-muted)]">{open ? "접기" : "사용법 보기"}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-[var(--color-muted)]">
            기존 OpenAI SDK는 이 두 환경변수만 바꾸면 그대로 동작합니다. 키는 발급된 <code>sk-pxy-…</code>로 교체.
          </p>
          <CodeBlock code={envSnippet} lang="bash" />
        </div>
      )}
    </section>
  )
}
