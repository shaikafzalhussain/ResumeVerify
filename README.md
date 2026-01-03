<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1XeQjXOjT23KPqrujk3Z9y1CAe-FUdNTK

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

Notes for local development (no cloud required):

- If you don't have a Gemini API key, the app will fall back to a deterministic mock AI analysis so the UI remains fully usable locally.
- To preview a built, static version on port 5500 (matching some local preview workflows) you can build and preview:
  - `npm run build`
  - `npm run preview:5500`  # serves built app on port 5500

Or, to serve a built `dist/` directory with Python's simple server:

```bash
# after `npm run build`
python -m http.server 5500 --directory dist
```

Environment file:

- Copy `.env.local.example` → `.env.local` and set `GEMINI_API_KEY` if you want real Gemini calls. If the var is unset, the app will use a mock analysis locally (safer for development).

Backend (optional local mock)

This repo does not require a backend to run the frontend, but a minimal FastAPI mock backend is included at `backend/` to emulate server-side analysis and keep API keys off the browser.

1. Install Python dependencies (Python 3.10+):

```bash
cd backend
python3 -m pip install -r requirements.txt
```

2. Start the backend server:

```bash
uvicorn backend.main:app --reload --port 8000
```

Health: http://127.0.0.1:8000/health

The frontend will prefer the local backend at `http://127.0.0.1:8000` during development when running on `localhost` and will POST resumes to `/analyze` or `/analyze-for-job`.

Troubleshooting:

- If you see missing module/type errors, run `npm install` from the project root.
- Use `npm run dev` (Vite) for the fastest edit/refresh cycle — it provides HMR and TypeScript checks.
# HireTrust-solana
# HireTrust-solana
