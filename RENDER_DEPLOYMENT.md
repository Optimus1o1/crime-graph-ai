# CrimeGraph AI — Render Deployment Guide

This guide walks you through deploying the complete **CrimeGraph AI** platform on [Render](https://render.com) using the free tier.

The platform includes two orchestrated services:
1. **`crimegraph-frontend`** (Node.js): Next.js 16 Web Intelligence Console & API Gateway
2. **`crimegraph-backend`** (Python): FastAPI Analytical Engine, GNN graph topology, and cryptographic vault

---

## Method 1: Automated Blueprint Deployment (Recommended — 1 Click)

The repository includes a ready-to-use [`render.yaml`](./render.yaml) Blueprint that automatically provisions, builds, connects, and configures both services together.

### Steps:
1. Log into your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click the **"New +"** button in the top navigation bar.
3. Select **"Blueprint"**.
4. Connect your GitHub account and select the repository:
   ```text
   Optimus1o1/CrimeGraph_AI
   ```
5. Render will automatically read `render.yaml` and detect:
   - `crimegraph-frontend` (Node Web Service)
   - `crimegraph-backend` (Python Web Service)
6. Give your Blueprint group a name (e.g. `crimegraph-platform`).
7. In the environment variables prompt, fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://wzfdgeinifohztpeyrkw.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZmRnZWluaWZvaHp0cGV5cmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTk5MjksImV4cCI6MjEwNDAzNTkyOX0.K5y5mAT7Cnx6beT2sqKPQAumI1H_jWae2ofI-VTl01M`
8. Click **"Apply"**.
9. Render will automatically build and deploy both services!

---

## Method 2: Manual Web Service Deployment

If you prefer to deploy services individually on Render:

### Service 1: Python Backend (`crimegraph-backend`)
1. Click **New +** → **Web Service**.
2. Select `Optimus1o1/CrimeGraph_AI`.
3. Configure settings:
   - **Name:** `crimegraph-backend`
   - **Region:** Ohio (US East) or Frankfurt (EU)
   - **Branch:** `main`
   - **Root Directory:** Leave empty / default (`.`)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install --upgrade pip && pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free`
4. Expand **Environment Variables**:
   - `PYTHON_VERSION`: `3.12.0`
   - `JWT_SECRET`: `crimegraph-classified-secret-token-2026`
   - `ALLOWED_ORIGINS`: `*`
5. Click **Create Web Service**.
6. Once deployed, note down the URL (e.g., `https://crimegraph-backend.onrender.com`).

---

### Service 2: Next.js Frontend (`crimegraph-frontend`)
1. Click **New +** → **Web Service**.
2. Select `Optimus1o1/CrimeGraph_AI`.
3. Configure settings:
   - **Name:** `crimegraph-frontend`
   - **Region:** Same region as backend
   - **Branch:** `main`
   - **Root Directory:** Leave empty / default (`.`)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Instance Type:** `Free`
4. Expand **Environment Variables**:
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://wzfdgeinifohztpeyrkw.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6ZmRnZWluaWZvaHp0cGV5cmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NTk5MjksImV4cCI6MjEwNDAzNTkyOX0.K5y5mAT7Cnx6beT2sqKPQAumI1H_jWae2ofI-VTl01M`
   - `FASTAPI_BASE_URL`: The URL of your backend (e.g. `https://crimegraph-backend.onrender.com` or private `http://crimegraph-backend:10000`)
   - `JWT_SECRET`: `crimegraph-classified-secret-token-2026`
5. Click **Create Web Service**.

---

## Health Checks

Once deployed, you can verify your services:
- Frontend Health: `https://<your-frontend>.onrender.com/api/health`
- Backend Health: `https://<your-backend>.onrender.com/health`
