export function formatInt(n) {
    if (n == null)
        return "—";
    return Number(n).toLocaleString();
}
export function formatDollar(v) {
    if (v == null)
        return "—";
    if (v === 0)
        return "$0";
    const abs = Math.abs(v);
    if (abs < 0.01)
        return `$${v.toFixed(6)}`;
    if (abs < 1)
        return `$${v.toFixed(4)}`;
    return `$${v.toFixed(2)}`;
}
export function formatTime(iso) {
    if (!iso)
        return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime()))
        return iso;
    return d.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });
}
export function relativeTime(iso) {
    if (!iso)
        return "—";
    const t = new Date(iso).getTime();
    if (isNaN(t))
        return iso;
    const diff = Math.round((Date.now() - t) / 1000);
    const abs = Math.abs(diff);
    const suffix = diff < 0 ? "후" : "전";
    if (abs < 60)
        return diff < 0 ? "곧" : "방금";
    if (abs < 3600)
        return `${Math.round(abs / 60)}분 ${suffix}`;
    if (abs < 86400)
        return `${Math.round(abs / 3600)}시간 ${suffix}`;
    if (abs < 86400 * 30)
        return `${Math.round(abs / 86400)}일 ${suffix}`;
    return new Date(iso).toLocaleDateString("ko-KR");
}
