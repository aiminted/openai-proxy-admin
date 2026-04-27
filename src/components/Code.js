import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useToast } from "./Toast";
export function CopyButton({ value, label = "copy" }) {
    const toast = useToast();
    const [copied, setCopied] = useState(false);
    return (_jsx("button", { type: "button", onClick: () => {
            navigator.clipboard.writeText(value).then(() => {
                setCopied(true);
                toast("복사됨", "ok");
                setTimeout(() => setCopied(false), 1500);
            }).catch(() => toast("복사 실패", "err"));
        }, className: `rounded-md border px-2 py-1 text-xs ${copied ? "border-emerald-500 text-emerald-600" : "border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"}`, children: copied ? "copied" : label }));
}
export function CodeBlock({ code, lang }) {
    return (_jsxs("div", { className: "relative", children: [_jsx("pre", { className: "overflow-x-auto rounded-md bg-black/5 p-3 pr-16 text-[12px] leading-relaxed dark:bg-white/5", children: _jsx("code", { "data-lang": lang, children: code }) }), _jsx("div", { className: "absolute right-2 top-2", children: _jsx(CopyButton, { value: code }) })] }));
}
export function SnippetTabs({ snippets }) {
    const [active, setActive] = useState(0);
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "flex gap-1 border-b border-[var(--color-border)]", children: snippets.map((s, i) => (_jsx("button", { type: "button", onClick: () => setActive(i), className: `px-3 py-1.5 text-xs font-medium transition-colors ${i === active
                        ? "border-b-2 border-[var(--color-accent)] text-[var(--color-fg)]"
                        : "border-b-2 border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)]"}`, children: s.label }, s.label))) }), _jsx(CodeBlock, { code: snippets[active].code, lang: snippets[active].lang })] }));
}
