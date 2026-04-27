import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { formatDollar, formatInt, formatTime, relativeTime } from "../lib/format";
export function KeyDetail() {
    const { id } = useParams();
    const [k, setK] = useState(null);
    const [recent, setRecent] = useState(null);
    const [error, setError] = useState("");
    async function reload() {
        if (!id)
            return;
        const [d, r] = await Promise.all([
            api.get(`/admin/api/keys/${id}`),
            api.get(`/admin/api/usage/${id}/recent?limit=50`),
        ]);
        setK(d);
        setRecent(r ?? []);
    }
    useEffect(() => { reload().catch((e) => setError(e.message)); }, [id]);
    if (error)
        return _jsx("p", { className: "text-sm text-red-500", children: error });
    if (!k)
        return _jsx("p", { className: "text-sm text-[var(--color-muted)]", children: "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" });
    return (_jsxs(_Fragment, { children: [_jsx("p", { className: "mb-3 text-sm", children: _jsx(Link, { to: "/", className: "text-[var(--color-accent)] underline-offset-2 hover:underline", children: "\u2190 \uD0A4 \uBAA9\uB85D" }) }), _jsxs("section", { className: "mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("h2", { className: "font-mono text-base", children: [k.prefix, "\u2026"] }), k.active
                                ? _jsx("span", { className: "rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", children: "active" })
                                : _jsx("span", { className: "rounded-full bg-zinc-200 px-3 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400", children: "revoked" })] }), _jsx(EditForm, { initial: k, onSaved: reload })] }), _jsxs("section", { className: "mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5", children: [_jsx("h3", { className: "mb-3 text-sm font-semibold text-[var(--color-muted)]", children: "\uC694\uC57D" }), _jsxs("dl", { className: "grid grid-cols-[120px_1fr] gap-y-1 gap-x-4 text-sm", children: [_jsx("dt", { className: "text-[var(--color-muted)]", children: "created" }), _jsx("dd", { children: formatTime(k.created_at) }), _jsx("dt", { className: "text-[var(--color-muted)]", children: "last used" }), _jsx("dd", { children: formatTime(k.last_used_at) }), _jsx("dt", { className: "text-[var(--color-muted)]", children: "total tokens" }), _jsx("dd", { children: formatInt(k.total_tokens) }), _jsx("dt", { className: "text-[var(--color-muted)]", children: "total cost" }), _jsx("dd", { children: formatDollar(k.total_cost_usd) })] })] }), _jsxs("section", { className: "rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5", children: [_jsx("h3", { className: "mb-3 text-sm font-semibold text-[var(--color-muted)]", children: "\uCD5C\uADFC \uC694\uCCAD" }), recent === null ? _jsx("p", { className: "text-sm text-[var(--color-muted)]", children: "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" })
                        : recent.length === 0 ? _jsx("p", { className: "text-sm text-[var(--color-muted)]", children: "\uC544\uC9C1 \uC694\uCCAD\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })
                            : (_jsx("div", { className: "-mx-5 overflow-x-auto px-5", children: _jsxs("table", { className: "w-full min-w-[760px] text-[12px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-[var(--color-border)] text-[11px] uppercase tracking-wider text-[var(--color-muted)]", children: [_jsx("th", { className: "px-2 py-2 text-left", children: "time" }), _jsx("th", { className: "px-2 py-2 text-left", children: "endpoint" }), _jsx("th", { className: "px-2 py-2 text-left", children: "model" }), _jsx("th", { className: "px-2 py-2 text-right", children: "in" }), _jsx("th", { className: "px-2 py-2 text-right", children: "out" }), _jsx("th", { className: "px-2 py-2 text-right", children: "cost" }), _jsx("th", { className: "px-2 py-2 text-right", children: "status" }), _jsx("th", { className: "px-2 py-2 text-right", children: "ms" })] }) }), _jsx("tbody", { children: recent.map((r, i) => (_jsxs("tr", { className: "border-b border-[var(--color-border)]", children: [_jsx("td", { className: "px-2 py-1.5", title: r.created_at, children: relativeTime(r.created_at) }), _jsx("td", { className: "px-2 py-1.5", children: _jsx("code", { className: "rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/5", children: r.endpoint }) }), _jsx("td", { className: "px-2 py-1.5", children: r.model || "—" }), _jsx("td", { className: "px-2 py-1.5 text-right tabular-nums", children: r.input_tokens }), _jsx("td", { className: "px-2 py-1.5 text-right tabular-nums", children: r.output_tokens }), _jsx("td", { className: "px-2 py-1.5 text-right tabular-nums", children: formatDollar(r.cost_usd) }), _jsx("td", { className: `px-2 py-1.5 text-right tabular-nums ${r.status >= 400 ? "text-red-500" : ""}`, children: r.status }), _jsx("td", { className: "px-2 py-1.5 text-right tabular-nums", children: r.duration_ms })] }, i))) })] }) }))] })] }));
}
function EditForm({ initial, onSaved }) {
    const [owner, setOwner] = useState(initial.owner);
    const [note, setNote] = useState(initial.note);
    const [expiresAt, setExpiresAt] = useState(initial.expires_at ? toLocalDatetime(initial.expires_at) : "");
    const [rpm, setRpm] = useState(initial.rpm_limit?.toString() ?? "");
    const [tokens, setTokens] = useState(initial.token_quota?.toString() ?? "");
    const [dollars, setDollars] = useState(initial.dollar_quota?.toString() ?? "");
    const [status, setStatus] = useState(null);
    const [saving, setSaving] = useState(false);
    async function onSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setStatus(null);
        try {
            await api.patch(`/admin/api/keys/${initial.id}`, {
                owner: owner.trim(),
                note,
                expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
                rpm_limit: rpm ? parseInt(rpm, 10) : null,
                token_quota: tokens ? parseInt(tokens, 10) : null,
                dollar_quota: dollars ? parseFloat(dollars) : null,
            });
            setStatus({ tone: "ok", msg: "저장됨" });
            await onSaved();
        }
        catch (err) {
            setStatus({ tone: "err", msg: err?.message || "저장 실패" });
        }
        finally {
            setSaving(false);
        }
    }
    const inputCls = "rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]";
    const labelCls = "flex flex-col gap-1 text-xs text-[var(--color-muted)]";
    return (_jsxs("form", { onSubmit: onSubmit, className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [_jsxs("label", { className: `${labelCls} sm:col-span-2`, children: [_jsx("span", { children: "owner" }), _jsx("input", { type: "text", required: true, className: inputCls, value: owner, onChange: (e) => setOwner(e.target.value) })] }), _jsxs("label", { className: `${labelCls} sm:col-span-2`, children: [_jsx("span", { children: "note" }), _jsx("input", { type: "text", className: inputCls, value: note, onChange: (e) => setNote(e.target.value) })] }), _jsxs("label", { className: labelCls, children: [_jsx("span", { children: "expires" }), _jsx("input", { type: "datetime-local", className: inputCls, value: expiresAt, onChange: (e) => setExpiresAt(e.target.value) })] }), _jsxs("label", { className: labelCls, children: [_jsx("span", { children: "RPM limit" }), _jsx("input", { type: "number", min: 1, className: inputCls, value: rpm, onChange: (e) => setRpm(e.target.value) })] }), _jsxs("label", { className: labelCls, children: [_jsx("span", { children: "token quota" }), _jsx("input", { type: "number", min: 1, className: inputCls, value: tokens, onChange: (e) => setTokens(e.target.value) })] }), _jsxs("label", { className: labelCls, children: [_jsx("span", { children: "dollar quota" }), _jsx("input", { type: "number", min: 0, step: 0.0001, className: inputCls, value: dollars, onChange: (e) => setDollars(e.target.value) })] }), _jsxs("div", { className: "sm:col-span-2 flex items-center gap-3", children: [_jsx("button", { type: "submit", disabled: saving, className: "rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50", children: saving ? "..." : "변경 사항 저장" }), status && _jsx("span", { className: `text-xs ${status.tone === "ok" ? "text-emerald-600" : "text-red-500"}`, children: status.msg })] })] }));
}
// turn an ISO string from the server into the value format the
// <input type="datetime-local"> expects (local-time, no seconds, no tz).
function toLocalDatetime(iso) {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
