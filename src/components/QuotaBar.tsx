import { formatDollar, formatInt } from "../lib/format"

type Props =
  | { kind: "tokens"; used: number; limit: number | null }
  | { kind: "cost"; used: number; limit: number | null }

export function QuotaBar(props: Props) {
  if (props.limit == null) return <span className="text-[var(--color-muted)]">—</span>
  const pct = Math.min(100, (props.used / props.limit) * 100)
  const color =
    pct >= 100 ? "bg-red-500" :
    pct >= 80  ? "bg-amber-500" :
                 "bg-[var(--color-accent)]"

  const fmt = props.kind === "cost" ? formatDollar : formatInt
  return (
    <div className="flex w-32 flex-col gap-0.5">
      <div className="flex justify-between text-[10px] tabular-nums text-[var(--color-muted)]">
        <span title={`${fmt(props.used)} / ${fmt(props.limit)}`}>
          {Math.round(pct)}%
        </span>
        <span>{fmt(props.limit)}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
