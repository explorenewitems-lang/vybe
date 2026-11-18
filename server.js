const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const aiRequestWindowMs = 60_000;
const aiRequestLimit = 20;
const aiRequestTimes = [];
const revalidateFiles = new Set(["index.html", "app.js", "styles.css", "manifest.json", "service-worker.js", "icon.svg", "icon-192.png", "icon-512.png", "icon-512-maskable.png"]);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

function reply(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(data));
}

function allowAiRequest() {
  const now = Date.now();
  while (aiRequestTimes.length && aiRequestTimes[0] <= now - aiRequestWindowMs) aiRequestTimes.shift();
  if (aiRequestTimes.length >= aiRequestLimit) return false;
  aiRequestTimes.push(now);
  return true;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (req.method === "POST" && url.pathname === "/api/ai") {
    if (process.env.AI_ENABLED !== "true") return reply(res, 503, { error: "AI is paused. Enable it on the server only after confirming your provider has available credits." });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return reply(res, 503, { error: "AI is not configured yet. Set OPENAI_API_KEY in the server environment and restart VYBE." });
    if (!allowAiRequest()) return reply(res, 429, { error: "VYBE is receiving too many AI requests. Please wait a minute and try again." });

    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 64_000) return reply(res, 413, { error: "This request is too large. Please shorten your message." });
    }

    let input;
    try { input = JSON.parse(raw); } catch { return reply(res, 400, { error: "The AI request could not be read. Please try again." }); }
    if (!Array.isArray(input.messages) || input.messages.length === 0 || input.messages.length > 20 ||
        input.messages.some(message => !["system", "user", "assistant"].includes(message.role) || typeof message.content !== "string" || message.content.length > 12_000)) {
      return reply(res, 400, { error: "Please provide a valid prompt of up to 12,000 characters." });
    }

    const endpoint = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
    try {
      const aiResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "gpt-4o-mini",
          messages: input.messages.map(message => ({
            role: message.role,
            content: message.content
          })),
          temperature: 0.7
        }),
        signal: AbortSignal.timeout(45_000)
      });
      const result = await aiResponse.json().catch(() => ({}));
      if (!aiResponse.ok) {
        console.error(`AI provider returned HTTP ${aiResponse.status}`);
        return reply(res, 502, { error: result.error?.message || `The AI provider returned an error (${aiResponse.status}).` });
      }
      const content = result.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) return reply(res, 502, { error: "The AI provider returned an empty response. Please try again." });
      return reply(res, 200, { content });
    } catch (error) {
      console.error("AI request failed:", error.message);
      return reply(res, 502, { error: "Could not reach the AI provider. Check your connection and server configuration." });
    }
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    return res.end();
  }
  const requested = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname).replace(/^[/\\]+/, "");
  const filename = path.resolve(root, requested);
  if (!filename.startsWith(root + path.sep) && filename !== path.join(root, "index.html")) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(filename, (error, content) => {
    if (error) {
      res.writeHead(error.code === "ENOENT" ? 404 : 500);
      return res.end(error.code === "ENOENT" ? "Not found" : "Unable to read this file");
    }
    res.writeHead(200, {
      "Content-Type": mime[path.extname(filename)] || "application/octet-stream",
      "Cache-Control": revalidateFiles.has(path.basename(filename)) ? "no-cache" : "public, max-age=3600"
    });
    if (req.method === "HEAD") return res.end();
    res.end(content);
  });
});

server.listen(port, "0.0.0.0", () => console.log(`VYBE is listening on port ${port}`));
