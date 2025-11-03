Anthropic Claude local example

Files added:
- `package.json` - dependencies and start script
- `claude-server.js` - small Express server that forwards prompts to Anthropic
- `.env.example` - example environment file
- `client-example.js` - simple client to call the local server

Quick start (PowerShell)

1) Copy `.env.example` to `.env` and set your key:

```powershell
cp .env.example .env
# then edit .env (Not shown here) or set env var directly for the session:
$Env:ANTHROPIC_API_KEY = "sk-your-key-here"
```

2) Install dependencies (PowerShell):

```powershell
npm install
```

3) Run the server:

```powershell
npm start
```

4) Test with the client example (in a separate terminal) or curl:

```powershell
node client-example.js

# or using curl (PowerShell):
curl -Method POST -Uri http://localhost:3000/api/claude -ContentType 'application/json' -Body '{"prompt":"Hello from curl"}'
```

Notes
- Never commit your API key. Add `.env` to `.gitignore`.
- If Anthropic requires a different header (some docs use `x-api-key`) switch the `Authorization` header accordingly.
- For production, set `ANTHROPIC_API_KEY` in your hosting provider's secret/environment variable settings.
