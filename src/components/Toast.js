import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
const ToastCtx = createContext(() => { });
export function useToast() {
    return useContext(ToastCtx);
}
let nextId = 1;
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const push = useCallback((msg, tone = "ok") => {
        const id = nextId++;
        setToasts((cur) => [...cur, { id, tone, msg }]);
        setTimeout(() => setToasts((cur) => cur.filter((t) => t.id !== id)), 3000);
    }, []);
    return (_jsxs(ToastCtx.Provider, { value: push, children: [children, _jsx("div", { className: "pointer-events-none fixed right-4 top-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col gap-2", children: toasts.map((t) => _jsx(Pill, { t: t }, t.id)) })] }));
}
function Pill({ t }) {
    const [show, setShow] = useState(false);
    useEffect(() => { setShow(true); }, []);
    const tone = t.tone === "ok" ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200" :
        t.tone === "err" ? "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/40 dark:text-red-200" :
            "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-fg)]";
    return (_jsx("div", { className: `pointer-events-auto rounded-md border px-3 py-2 text-sm shadow-sm transition-opacity ${tone} ${show ? "opacity-100" : "opacity-0"}`, children: t.msg }));
}
