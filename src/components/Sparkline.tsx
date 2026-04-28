import { UsageDay } from "../lib/api"
import { formatDollar, formatInt } from "../lib/format"

type Props = {
  data: UsageDay[]
  field: "tokens" | "cost_usd" | "requests"
  label: string
  width?: number
  height?: number
}

export function Sparkline({ data, field, label, width = 280, height = 60 }: Props) {
  const values = data.map((d) => Number(d[field] || 0))
  const max = Math.max(1, ...values)
  const last = values[values.length - 1] ?? 0
  const total = values.reduce((a, b) => a + b, 0)

  const stepX = data.length > 1 ? width / (data.length - 1) : 0
  const points = values.map((v, i) => {
    const x = i * stepX
    const y = height - (v / max) * (height - 4) - 2
    return [x, y] as const
  })
  const path = points.length
    ? "M " + points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")
    : ""
  const area = points.length
    ? path + ` L ${(points[points.length - 1][0]).toFixed(1)},${height} L 0,${height} Z`
    : ""

  const fmt = field === "cost_usd" ? formatDollar : formatInt
  const sumDisplay = field === "cost_usd" ? formatDollar(total) : formatInt(total)
  const lastDisplay = field === "cost_usd" ? formatDollar(last) : formatInt(last)

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
        <span className="text-[11px] text-[var(--color-muted)]" title={`최근 ${data.length}일 합계`}>
          최근 {data.length}일 · 합 {sumDisplay}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-14 w-full">
        {area && <path d={area} fill="var(--color-accent)" opacity="0.12" />}
        {path && <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-[var(--color-muted)]">
        <span title={data[0]?.day}>{data[0]?.day ?? "—"}</span>
        <span className="text-[var(--color-fg)]" title={`오늘: ${fmt(last)}`}>오늘 {lastDisplay}</span>
        <span title={data[data.length - 1]?.day}>{data[data.length - 1]?.day ?? "—"}</span>
      </div>
    </div>
  )
}
