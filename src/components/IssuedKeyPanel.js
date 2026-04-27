import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { CopyButton, SnippetTabs } from "./Code";
import { exampleSnippets, PROXY_URL } from "../lib/snippets";
import { useToast } from "./Toast";
export function IssuedKeyPanel({ apiKey, onClose }) {
    return (_jsxs("section", { className: "mb-5 rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-card)] p-5", children: [_jsxs("div", { className: "mb-3 flex items-baseline justify-between gap-3", children: [_jsx("h2", { className: "text-sm font-semibold text-[var(--color-accent)]", children: "\uC0C8 \uD0A4 \uBC1C\uAE09\uB428" }), _jsx("button", { onClick: onClose, className: "text-xs text-[var(--color-muted)] underline-offset-2 hover:underline", children: "\uB2EB\uAE30" })] }), _jsx("p", { className: "mb-3 text-xs text-[var(--color-muted)]", children: "\uC774 \uD0A4\uB294 \uC774 \uD654\uBA74\uC744 \uB2EB\uC73C\uBA74 \uB2E4\uC2DC \uBCFC \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC548\uC804\uD55C \uACF3\uC5D0 \uC62E\uACA8\uC8FC\uC138\uC694." }), _jsxs("div", { className: "mb-2 grid grid-cols-1 gap-2", children: [_jsx(KVRow, { label: "API key", value: apiKey, mono: true }), _jsx(KVRow, { label: "Base URL", value: `${PROXY_URL}/v1`, mono: true })] }), _jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]", children: "\uC0AC\uC6A9 \uC608\uC2DC" }), _jsx(SnippetTabs, { snippets: exampleSnippets(apiKey) })] }), _jsx("div", { className: "mt-4", children: _jsx(TestButton, { apiKey: apiKey }) })] }));
}
function KVRow({ label, value, mono }) {
    return (_jsxs("div", { className: "flex items-center gap-2 rounded-md bg-black/5 px-3 py-2 dark:bg-white/5", children: [_jsx("span", { className: "w-16 shrink-0 text-[11px] uppercase tracking-wider text-[var(--color-muted)]", children: label }), _jsx("code", { className: `flex-1 break-all ${mono ? "" : "font-sans"}`, children: value }), _jsx(CopyButton, { value: value })] }));
}
function TestButton({ apiKey }) {
    const toast = useToast();
    const [state, setState] = useState("idle");
    const [detail, setDetail] = useState("");
    async function run() {
        setState("running");
        setDetail("");
        try {
            const res = await fetch(`${PROXY_URL}/v1/models`, {
                headers: { Authorization: `Bearer ${apiKey}` },
            });
            if (!res.ok) {
                const text = await res.text();
                setState("err");
                setDetail(`HTTP ${res.status} — ${text.slice(0, 120)}`);
                toast("테스트 실패", "err");
                return;
            }
            const body = await res.json();
            const n = Array.isArray(body?.data) ? body.data.length : 0;
            setState("ok");
            setDetail(`${n}개 모델 응답됨`);
            toast("프록시 정상 동작", "ok");
        }
        catch (e) {
            setState("err");
            setDetail(e?.message || "network error");
            toast("테스트 실패", "err");
        }
    }
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { type: "button", onClick: run, disabled: state === "running", className: "rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50", children: state === "running" ? "테스트 중…" : "이 키로 즉시 테스트 (/v1/models)" }), state === "ok" && _jsxs("span", { className: "text-xs text-emerald-600", children: ["\u2713 ", detail] }), state === "err" && _jsxs("span", { className: "text-xs text-red-500", children: ["\u2717 ", detail] })] }));
}
