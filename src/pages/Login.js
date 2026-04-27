import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";
export function Login() {
    const nav = useNavigate();
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    async function onSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const res = await api.post("/admin/api/login", { password });
            setToken(res.token, res.expires_in);
            nav("/", { replace: true });
        }
        catch (err) {
            setError(err?.status === 401 ? "비밀번호가 올바르지 않습니다." : err?.message || "로그인 실패");
        }
        finally {
            setSubmitting(false);
        }
    }
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center px-6", children: _jsxs("form", { onSubmit: onSubmit, className: "w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm", children: [_jsx("h1", { className: "mb-4 text-base font-semibold", children: "openai-proxy" }), error && _jsx("p", { className: "mb-3 text-sm text-red-500", children: error }), _jsx("label", { className: "mb-1 block text-xs text-[var(--color-muted)]", children: "admin password" }), _jsx("input", { type: "password", autoFocus: true, required: true, autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), className: "mb-4 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 outline-none focus:border-[var(--color-accent)]" }), _jsx("button", { type: "submit", disabled: submitting, className: "w-full rounded-md bg-[var(--color-accent)] py-2 font-semibold text-white disabled:opacity-50", children: submitting ? "..." : "sign in" })] }) }));
}
