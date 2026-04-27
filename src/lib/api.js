import { clearToken, getToken } from "./auth";
// In dev (vite serve) we go through the local proxy in vite.config.ts.
// In production we hit the deployed backend directly. Override with
// VITE_API_BASE_URL only if you need to point at a different backend.
const PROD_DEFAULT = "https://openai-proxy.dsmhs.kr";
const ENV_OVERRIDE = import.meta.env.VITE_API_BASE_URL;
const BASE = (ENV_OVERRIDE ?? (import.meta.env.DEV ? "" : PROD_DEFAULT)).replace(/\/$/, "");
export class ApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
async function request(method, path, body) {
    const headers = {};
    if (body !== undefined)
        headers["Content-Type"] = "application/json";
    const tok = getToken();
    if (tok)
        headers["Authorization"] = `Bearer ${tok}`;
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) {
        clearToken();
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
        throw new ApiError("unauthorized", 401);
    }
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new ApiError(text || `HTTP ${res.status}`, res.status);
    }
    if (res.status === 204)
        return undefined;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json"))
        return undefined;
    return res.json();
}
export const api = {
    get: (p) => request("GET", p),
    post: (p, b) => request("POST", p, b),
    patch: (p, b) => request("PATCH", p, b),
    delete: (p) => request("DELETE", p),
};
