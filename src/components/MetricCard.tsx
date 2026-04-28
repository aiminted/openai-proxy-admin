import { ReactNode } from "react"
import { UsageDay } from "../lib/api"

type Props = {
  label: string
  value: ReactNode
  hint?: ReactNode
  trend?: { data: UsageDay[]; field: "tokens" | "cost_usd" | "requests" }
}

export function MetricCard({ label, value, hint, trend }: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
        {hint && <span className="text-[11px] tabular-nums text-[var(--color-muted)]">{hint}</span>}
      </div>
      <div className="text-[26px] font-semibold leading-none tabular-nums">{value}</div>
      {trend && trend.data.length > 0 && <Spark data={trend.data} field={trend.field} />}
    </div>
  )
}

function Spark({ data, field }: { data: UsageDay[]; field: "tokens" | "cost_usd" | "requests" }) {
  const W = 200
  const H = 32
  const values = data.map((d) => Number(d[field] || 0))
  const max = Math.max(1, ...values)
  const stepX = data.length > 1 ? W / (data.length - 1) : 0
  const points = values.map((v, i) => [i * stepX, H - (v / max) * (H - 2) - 1] as const)
  const path = points.length
    ? "M " + points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")
    : ""
  const area = points.length
    ? path + ` L ${points[points.length - 1][0].toFixed(1)},${H} L 0,${H} Z`
    : ""
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-7 w-full">
      {area && <path d={area} fill="var(--color-accent)" opacity="0.12" />}
      {path && <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />}
    </svg>
  )
}
