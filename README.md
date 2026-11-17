# VYBE

A responsive personal productivity app with local browser storage, installable PWA support, charts, and AI tools.

## Run it

Requires Node.js 18 or newer. From this folder:

```powershell
node server.js
```

Open [http://localhost:4173](http://localhost:4173). The app works without an AI key; to enable AI tools, configure the key in the server environment and restart:

```powershell
$env:OPENAI_API_KEY = "your-key"
node server.js
```

Never put the key in `app.js`, HTML, or another browser-delivered file. Optionally set `AI_API_URL` (OpenAI-compatible chat completions endpoint), `AI_MODEL`, and `PORT` on the server.

Your productivity data is stored in this browser's localStorage. Use Settings to export or import a JSON backup. Chart.js and the optional web fonts are loaded from their public CDNs; core app features do not require them.

Enable browser notifications in Settings and choose a reminder when creating an event. Local reminders are delivered while VYBE is open in this browser.

## Deploy the app and AI server on Render

Push this project to a GitHub repository, then create a new **Blueprint** in Render and connect that repository. Render reads `render.yaml`, builds the Node service, and serves both the app and its `/api/ai` endpoint over HTTPS. During setup, enter your API key for `OPENAI_API_KEY` as a secret in Render; never commit it to GitHub.

The AI endpoint is limited to 20 requests per minute per server instance. Keep the Render URL private and configure usage limits with your AI provider. The free Render plan may spin down when idle, so the first request after inactivity can be slower.

