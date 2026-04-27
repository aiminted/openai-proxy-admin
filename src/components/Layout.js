import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../lib/auth";
export function Layout() {
    const nav = useNavigate();
    function logout() {
        clearToken();
        nav("/login", { replace: true });
    }
    return (_jsxs("div", { className: "min-h-screen", children: [_jsxs("header", { className: "sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-6 py-3", children: [_jsx(Link, { to: "/", className: "font-semibold text-[var(--color-fg)]", children: "openai-proxy" }), _jsx("button", { onClick: logout, className: "text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] underline underline-offset-2", children: "logout" })] }), _jsx("main", { className: "mx-auto max-w-5xl px-6 py-6", children: _jsx(Outlet, {}) })] }));
}
