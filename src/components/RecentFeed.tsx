import { Link } from "react-router-dom"
import { RecentEvent } from "../lib/api"
import { formatDollar, relativeTime } from "../lib/format"

export function RecentFeed({ events }: { events: RecentEvent[] }) {
  if (!events.length) {
    return <p className="text-sm text-[var(--color-muted)]">아직 활동이 없습니다.</p>
  }
  return (
    <ul className="-my-1 divide-y divide-[var(--color-border)]">
      {events.map((e, i) => (
        <li key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-1.5 text-[12px]">
          <span className="text-[var(--color-muted)] tabular-nums" title={e.created_at}>
            {relativeTime(e.created_at)}
          </span>
          <div className="min-w-0">
            <Link
              to={`/keys/${e.key_id}`}
              className="text-[var(--color-accent)] underline-offset-2 hover:underline"
              title={e.key_owner}
            >
              <code>{e.key_prefix}…</code>
            </Link>{" "}
            <span className="text-[var(--color-muted)]">{e.endpoint}</span>{" "}
            {e.model && <span className="text-[var(--color-muted)]">· {e.model}</span>}
          </div>
          <span className={`tabular-nums text-[11px] ${e.status >= 400 ? "text-red-500" : "text-[var(--color-muted)]"}`}>
            {e.input_tokens + e.output_tokens}t · {formatDollar(e.cost_usd)} · {e.status}
          </span>
        </li>
      ))}
    </ul>
  )
}
