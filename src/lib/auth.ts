const TOKEN_KEY = "openai-proxy-admin-token"
const EXPIRES_KEY = "openai-proxy-admin-expires"

export function getToken(): string | null {
  const tok = localStorage.getItem(TOKEN_KEY)
  if (!tok) return null
  const exp = Number(localStorage.getItem(EXPIRES_KEY) || "0")
  if (exp && exp < Date.now() / 1000) {
    clearToken()
    return null
  }
  return tok
}

export function setToken(token: string, expiresIn: number) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EXPIRES_KEY, String(Math.floor(Date.now() / 1000) + expiresIn))
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}
