import { useState } from "react"
import { useToast } from "./Toast"

export function CopyButton({ value, label = "copy" }: { value: string; label?: string }) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true)
          toast("복사됨", "ok")
          setTimeout(() => setCopied(false), 1500)
        }).catch(() => toast("복사 실패", "err"))
      }}
      className={`rounded-md border px-2 py-1 text-xs ${copied ? "border-emerald-500 text-emerald-600" : "border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"}`}
    >
      {copied ? "copied" : label}
    </button>
  )
}

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-md bg-black/5 p-3 pr-16 text-[12px] leading-relaxed dark:bg-white/5">
        <code data-lang={lang}>{code}</code>
      </pre>
      <div className="absolute right-2 top-2">
        <CopyButton value={code} />
      </div>
    </div>
  )
}

export type Snippet = { label: string; code: string; lang: string }

export function SnippetTabs({ snippets }: { snippets: Snippet[] }) {
  const [active, setActive] = useState(0)
  return (
    <div className="space-y-2">
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {snippets.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              i === active
                ? "border-b-2 border-[var(--color-accent)] text-[var(--color-fg)]"
                : "border-b-2 border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <CodeBlock code={snippets[active].code} lang={snippets[active].lang} />
    </div>
  )
}
