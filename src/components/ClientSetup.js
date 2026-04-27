import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { CopyButton, CodeBlock } from "./Code";
import { PROXY_URL } from "../lib/snippets";
export function ClientSetup() {
    const [open, setOpen] = useState(false);
    const baseUrl = `${PROXY_URL}/v1`;
    const envSnippet = `export OPENAI_API_KEY=sk-pxy-…\nexport OPENAI_BASE_URL=${baseUrl}`;
    return (_jsxs("section", { className: "mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4", children: [_jsxs("button", { type: "button", onClick: () => setOpen((v) => !v), className: "flex w-full items-center justify-between gap-3 text-left", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-[11px] uppercase tracking-wider text-[var(--color-muted)]", children: "Base URL" }), _jsx("code", { className: "text-sm", children: baseUrl }), _jsx(CopyButton, { value: baseUrl })] }), _jsx("span", { className: "text-xs text-[var(--color-muted)]", children: open ? "접기" : "사용법 보기" })] }), open && (_jsxs("div", { className: "mt-3 space-y-2", children: [_jsxs("p", { className: "text-xs text-[var(--color-muted)]", children: ["\uAE30\uC874 OpenAI SDK\uB294 \uC774 \uB450 \uD658\uACBD\uBCC0\uC218\uB9CC \uBC14\uAFB8\uBA74 \uADF8\uB300\uB85C \uB3D9\uC791\uD569\uB2C8\uB2E4. \uD0A4\uB294 \uBC1C\uAE09\uB41C ", _jsx("code", { children: "sk-pxy-\u2026" }), "\uB85C \uAD50\uCCB4."] }), _jsx(CodeBlock, { code: envSnippet, lang: "bash" })] }))] }));
}
