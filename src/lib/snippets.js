export const PROXY_URL = import.meta.env.VITE_API_BASE_URL ?? "https://openai-proxy.dsmhs.kr";
export function exampleSnippets(apiKey) {
    const base = `${PROXY_URL}/v1`;
    return [
        {
            label: "bash (curl)",
            lang: "bash",
            code: `curl ${base}/chat/completions \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role":"user","content":"hello"}]
  }'`,
        },
        {
            label: "python",
            lang: "python",
            code: `from openai import OpenAI

client = OpenAI(
    api_key="${apiKey}",
    base_url="${base}",
)

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "hello"}],
)
print(resp.choices[0].message.content)`,
        },
        {
            label: "node",
            lang: "javascript",
            code: `import OpenAI from "openai"

const client = new OpenAI({
  apiKey: "${apiKey}",
  baseURL: "${base}",
})

const resp = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "hello" }],
})
console.log(resp.choices[0].message.content)`,
        },
        {
            label: "env (existing app)",
            lang: "bash",
            code: `# point your existing OpenAI SDK at the proxy by setting these two:
export OPENAI_API_KEY=${apiKey}
export OPENAI_BASE_URL=${base}`,
        },
    ];
}
