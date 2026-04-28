import { ModelUsage } from "../lib/api"
import { formatDollar, formatInt } from "../lib/format"

export function TopModels({ rows }: { rows: ModelUsage[] }) {
  if (!rows.length) {
    return <p className="text-sm text-[var(--color-muted)]">아직 호출 기록이 없습니다.</p>
  }
  const max = Math.max(1, ...rows.map((r) => r.tokens))
  return (
    <ul className="space-y-1.5">
      {rows.map((r) => (
        <li key={r.model} className="grid grid-cols-[1fr_auto] items-center gap-3">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-sm" title={r.model}>{r.model}</span>
              <span className="text-[11px] tabular-nums text-[var(--color-muted)]">
                {formatInt(r.tokens)} tok · {formatDollar(r.cost_usd)} · {formatInt(r.requests)}회
              </span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
              <div
                className="h-full bg-[var(--color-accent)]"
                style={{ width: `${(r.tokens / max) * 100}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
