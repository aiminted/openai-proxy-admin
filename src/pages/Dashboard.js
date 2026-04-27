import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { formatDollar, formatInt, formatTime, relativeTime } from "../lib/format";
function StatCard({ label, value }) {
    return (_jsxs("div", { className: "flex flex-col gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3", children: [_jsx("span", { className: "text-[11px] uppercase tracking-wider text-[var(--color-muted)]", children: label }), _jsx("span", { className: "text-2xl font-semibold tabular-nums", children: value })] }));
}
function Card({ title, children, action }) {
    return (_jsxs("section", { className: "mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5", children: [(title || action) && (_jsxs("div", { className: "mb-3 flex items-baseline justify-between gap-3", children: [title && _jsx("h2", { className: "text-sm font-semibold", children: title }), action] })), children] }));
}
export function Dashboard() {
    const [stats, setStats] = useState(null);
    const [keys, setKeys] = useState([]);
    const [issued, setIssued] = useState(null);
    const [search, setSearch] = useState("");
    const [hideInactive, setHideInactive] = useState(true);
    async function reload() {
        const [s, k] = await Promise.all([
            api.get("/admin/api/stats"),
            api.get("/admin/api/keys"),
        ]);
        setStats(s);
        setKeys(k ?? []);
    }
    useEffect(() => { reload().catch(console.error); }, []);
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return keys.filter((k) => {
            if (hideInactive && !k.active)
                return false;
            if (!q)
                return true;
            return [k.owner, k.prefix, k.note].some((s) => (s ?? "").toLowerCase().includes(q));
        });
    }, [keys, search, hideInactive]);
    return (_jsxs(_Fragment, { children: [stats && (_jsxs("div", { className: "mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4", children: [_jsx(StatCard, { label: "total keys", value: formatInt(stats.total_keys) }), _jsx(StatCard, { label: "active", value: formatInt(stats.active_keys) }), _jsx(StatCard, { label: "tokens today", value: formatInt(stats.today_tokens) }), _jsx(StatCard, { label: "cost today", value: formatDollar(stats.today_cost_usd) })] })), issued && (_jsxs(Card, { title: "\uC0C8 \uD0A4 \uBC1C\uAE09\uB428", action: _jsx("button", { onClick: () => setIssued(null), className: "text-xs text-[var(--color-muted)] underline", children: "\uB2EB\uAE30" }), children: [_jsx("p", { className: "mb-2 text-xs text-[var(--color-muted)]", children: "\uC774 \uAC12\uC740 \uD55C \uBC88\uB9CC \uD45C\uC2DC\uB429\uB2C8\uB2E4. \uC548\uC804\uD55C \uACF3\uC5D0 \uC62E\uACA8\uC8FC\uC138\uC694." }), _jsxs("div", { className: "flex items-center gap-2 rounded-md bg-black/5 px-3 py-2 dark:bg-white/5", children: [_jsx("code", { className: "flex-1 break-all", children: issued.key }), _jsx(CopyButton, { value: issued.key })] })] })), _jsx(IssueForm, { onIssued: (k) => { setIssued(k); reload(); } }), _jsx(Card, { title: `키 목록 (${keys.length})`, action: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "search", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "owner / prefix / note \uAC80\uC0C9\u2026", className: "rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-xs outline-none focus:border-[var(--color-accent)]" }), _jsxs("label", { className: "flex items-center gap-1 text-xs text-[var(--color-muted)]", children: [_jsx("input", { type: "checkbox", checked: hideInactive, onChange: (e) => setHideInactive(e.target.checked) }), _jsx("span", { children: "\uBE44\uD65C\uC131 \uC228\uAE40" })] })] }), children: _jsx("div", { className: "-mx-5 overflow-x-auto px-5", children: _jsxs("table", { className: "w-full min-w-[760px] text-[13px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-[var(--color-border)] text-[11px] uppercase tracking-wider text-[var(--color-muted)]", children: [_jsx(Th, { children: "prefix" }), _jsx(Th, { children: "owner" }), _jsx(Th, { align: "right", children: "tokens" }), _jsx(Th, { align: "right", children: "cost" }), _jsx(Th, { children: "expires" }), _jsx(Th, { align: "right", children: "RPM" }), _jsx(Th, { children: "last used" }), _jsx(Th, { children: "active" }), _jsx(Th, {})] }) }), _jsxs("tbody", { children: [filtered.map((k) => (_jsxs("tr", { className: "border-b border-[var(--color-border)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]", children: [_jsx(Td, { children: _jsx(Link, { to: `/keys/${k.id}`, className: "text-[var(--color-accent)] underline-offset-2 hover:underline", children: _jsxs("code", { children: [k.prefix, "\u2026"] }) }) }), _jsx(Td, { title: k.owner, className: "max-w-[220px] truncate", children: k.owner }), _jsx(Td, { align: "right", children: formatInt(k.total_tokens) }), _jsx(Td, { align: "right", children: formatDollar(k.total_cost_usd) }), _jsx(Td, { className: "text-[var(--color-muted)]", children: formatTime(k.expires_at) }), _jsx(Td, { align: "right", children: k.rpm_limit ?? "—" }), _jsx(Td, { className: "text-[var(--color-muted)]", title: k.last_used_at ?? "", children: relativeTime(k.last_used_at) }), _jsx(Td, { children: k.active
                                                    ? _jsx("span", { className: "rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", children: "on" })
                                                    : _jsx("span", { className: "rounded-full bg-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400", children: "off" }) }), _jsx(Td, { align: "right", children: _jsx(RowActions, { k: k, reload: reload }) })] }, k.id))), filtered.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 9, className: "py-6 text-center text-[var(--color-muted)]", children: keys.length === 0 ? "아직 발급된 키가 없습니다." : "검색 결과 없음." }) }))] })] }) }) })] }));
}
function Th({ children, align }) {
    return _jsx("th", { className: `px-2 py-2 font-medium ${align === "right" ? "text-right" : "text-left"}`, children: children });
}
function Td({ children, align, className, title }) {
    return _jsx("td", { title: title, className: `px-2 py-2 align-middle ${align === "right" ? "text-right tabular-nums" : ""} ${className ?? ""}`, children: children });
}
function CopyButton({ value }) {
    const [copied, setCopied] = useState(false);
    return (_jsx("button", { type: "button", onClick: () => {
            navigator.clipboard.writeText(value).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
            });
        }, className: `rounded-md border px-2 py-1 text-xs ${copied ? "border-emerald-500 text-emerald-600" : "border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"}`, children: copied ? "copied" : "copy" }));
}
function RowActions({ k, reload }) {
    async function toggle() {
        const msg = k.active ? "이 키를 비활성화할까요? 즉시 차단됩니다." : "이 키를 다시 활성화할까요?";
        if (!confirm(msg))
            return;
        await api.post(`/admin/api/keys/${k.id}/active`, { active: !k.active });
        await reload();
    }
    async function remove() {
        if (!confirm("이 키와 모든 사용 기록을 영구 삭제합니다. 복구 불가."))
            return;
        await api.delete(`/admin/api/keys/${k.id}`);
        await reload();
    }
    return (_jsxs("span", { className: "space-x-3 whitespace-nowrap", children: [_jsx("button", { onClick: toggle, className: "text-xs text-[var(--color-accent)] underline-offset-2 hover:underline", children: k.active ? "revoke" : "reactivate" }), _jsx("button", { onClick: remove, className: "text-xs text-red-500 underline-offset-2 hover:underline", children: "delete" })] }));
}
function IssueForm({ onIssued }) {
    const [owner, setOwner] = useState("");
    const [note, setNote] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [rpm, setRpm] = useState("");
    const [tokens, setTokens] = useState("");
    const [dollars, setDollars] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    function preset(days) {
        if (days == null) {
            setExpiresAt("");
            return;
        }
        const d = new Date();
        d.setDate(d.getDate() + days);
        setExpiresAt(d.toISOString().slice(0, 10));
    }
    async function onSubmit(e) {
        e.preventDefault();
        if (!owner.trim()) {
            setError("owner is required");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const params = {
                owner: owner.trim(),
                note: note,
                expires_at: expiresAt ? new Date(expiresAt + "T00:00:00Z").toISOString() : null,
                rpm_limit: rpm ? parseInt(rpm, 10) : null,
                token_quota: tokens ? parseInt(tokens, 10) : null,
                dollar_quota: dollars ? parseFloat(dollars) : null,
            };
            const k = await api.post("/admin/api/keys", params);
            onIssued(k);
            setOwner("");
            setNote("");
            setExpiresAt("");
            setRpm("");
            setTokens("");
            setDollars("");
        }
        catch (err) {
            setError(err?.message || "발급 실패");
        }
        finally {
            setSubmitting(false);
        }
    }
    const inputCls = "rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]";
    const labelCls = "flex flex-col gap-1 text-xs text-[var(--color-muted)]";
    return (_jsx(Card, { title: "\uC0C8 API \uD0A4 \uBC1C\uAE09", children: _jsxs("form", { onSubmit: onSubmit, className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [_jsxs("label", { className: `${labelCls} sm:col-span-2`, children: [_jsxs("span", { children: ["owner ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", required: true, className: inputCls, value: owner, onChange: (e) => setOwner(e.target.value), placeholder: "user@example.com \uB610\uB294 \uC774\uB984" })] }), _jsxs("label", { className: `${labelCls} sm:col-span-2`, children: [_jsx("span", { children: "note" }), _jsx("input", { type: "text", className: inputCls, value: note, onChange: (e) => setNote(e.target.value), placeholder: "\uC790\uC720 \uBA54\uBAA8" })] }), _jsxs("label", { className: labelCls, children: [_jsx("span", { children: "expires" }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("input", { type: "date", className: `${inputCls} flex-1 min-w-[140px]`, value: expiresAt, onChange: (e) => setExpiresAt(e.target.value) }), [
                                    { label: "+7d", days: 7 },
                                    { label: "+30d", days: 30 },
                                    { label: "+90d", days: 90 },
                                    { label: "없음", days: null },
                                ].map((p) => (_jsx("button", { type: "button", onClick: () => preset(p.days), className: "rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-xs hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]", children: p.label }, p.label)))] })] }), _jsxs("label", { className: labelCls, children: [_jsx("span", { children: "RPM limit" }), _jsx("input", { type: "number", min: 1, className: inputCls, value: rpm, onChange: (e) => setRpm(e.target.value), placeholder: "\uBD84\uB2F9 \uC694\uCCAD\uC218" })] }), _jsxs("label", { className: labelCls, children: [_jsx("span", { children: "token quota" }), _jsx("input", { type: "number", min: 1, className: inputCls, value: tokens, onChange: (e) => setTokens(e.target.value), placeholder: "\uB204\uC801 \uD1A0\uD070 \uD55C\uB3C4" })] }), _jsxs("label", { className: labelCls, children: [_jsx("span", { children: "dollar quota" }), _jsx("input", { type: "number", min: 0, step: 0.01, className: inputCls, value: dollars, onChange: (e) => setDollars(e.target.value), placeholder: "\uB204\uC801 \uB2EC\uB7EC \uD55C\uB3C4" })] }), _jsxs("div", { className: "sm:col-span-2 flex items-center gap-3", children: [_jsx("button", { type: "submit", disabled: submitting, className: "rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50", children: submitting ? "..." : "발급" }), error && _jsx("span", { className: "text-xs text-red-500", children: error })] })] }) }));
}
