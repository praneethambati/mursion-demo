# SimEval — Mursion AI Simulation Evaluation

A live simulation room where a learner has a spoken conversation with an AI avatar.
Camera reads facial state, speech is transcribed and evaluated in real time, and a full
behavioral performance report is generated at the end.

## How it works

- The browser captures camera + mic and runs speech recognition.
- A small serverless function (`/api/claude.js`) proxies requests to the Anthropic API,
  so the API key stays on the server and never reaches the browser.
- Two seeded scenarios: Classroom Management and Performance Review.

---

## Deploy to Vercel (shareable link for the team)

### 1. Get an Anthropic API key
Sign in at https://console.anthropic.com → API Keys → create a key. Copy it.

### 2. Push this folder to GitHub
```bash
cd mursion-sim
git init
git add .
git commit -m "SimEval prototype"
git branch -M main
git remote add origin https://github.com/<you>/mursion-sim.git
git push -u origin main
```

### 3. Import into Vercel
- Go to https://vercel.com → Add New → Project → import your GitHub repo.
- Framework preset: **Vite** (auto-detected).
- Before deploying, open **Environment Variables** and add:
  - Name: `ANTHROPIC_API_KEY`
  - Value: your key from step 1
- Click **Deploy**.

Vercel gives you an HTTPS URL like `https://mursion-sim.vercel.app`. Share that with the team.

> HTTPS matters: camera, mic, and speech recognition only work over HTTPS or localhost.

---

## Run locally first (to test)

```bash
npm install
```

Create a file named `.env` in the project root:
```
ANTHROPIC_API_KEY=your-key-here
```

Then:
```bash
npm run dev
```

Open the localhost URL **in Chrome** (Safari's speech recognition is unreliable).

> Note: `npm run dev` serves the frontend but does NOT run the `/api` function.
> To test the full flow locally, use the Vercel CLI instead:
> ```bash
> npm i -g vercel
> vercel dev
> ```
> `vercel dev` runs both the frontend and the serverless function together.

---

## Testing checklist

1. Lobby loads, both scenario cards visible
2. Tap a card → browser asks for camera + mic → Allow
3. Avatar speaks the first line (you hear it)
4. Input shows RECORDING → speak a response
5. Submit → your words appear, scores update, avatar replies
6. Camera tile state label changes every ~5 seconds
7. End session → final report generates
8. Open the same URL on your phone → check the stacked mobile layout

---

## Cost note

Each turn makes API calls (one for evaluation, plus a vision call every ~5s for emotion).
A full session is a handful of cents. Monitor usage in the Anthropic console. If the team
will use it heavily, consider raising the emotion-capture interval (currently 5000ms in
`captureEmotion`) to reduce vision calls.
