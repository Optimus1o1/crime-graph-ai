# 🚀 Vercel Deployment Guide — CrimeGraph AI

This repository is pre-configured for seamless, zero-friction deployment to **Vercel** with Next.js 16 (App Router + Turbopack).

---

## ⚡ Option 1: Deploy via Vercel Web Dashboard (Recommended)

1. **Import Repository**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository: `Optimus1o1/CrimeGraph_AI` (or your personal fork).

2. **Configure Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Select `frontend` (or leave as root `/` — both work thanks to root `vercel.json` and monorepo scripts).
   - **Build Command**: `next build` (or `npm run build`)
   - **Output Directory**: `.next`

3. **Environment Variables**:
   In the **Environment Variables** section, add the following (values can be copied from `.env.example`):
   
   | Variable | Description | Example / Recommended |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Public Key | `eyJhbGciOi...` |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | `eyJhbGciOi...` |
   | `NEXT_PUBLIC_API_URL` | Production FastAPI GNN Backend | `https://crimegraph-ai-backend.onrender.com` |
   | `JWT_SECRET` | 32+ character random secret string | `your-secure-production-jwt-secret-key` |
   | `NODE_ENV` | Environment Flag | `production` |

4. **Click Deploy**:
   - Deployment typically completes in under 60 seconds with 100% static asset optimization and automated Edge Function distribution.

---

## 💻 Option 2: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from repository root
vercel

# 4. Deploy to Production
vercel --prod
```

---

## 🛡️ Production Security Features Active on Vercel

- **OWASP Content-Security-Policy (CSP)**: Hardened headers with scoped script, style, font, and connect policies.
- **Clickjacking Protection**: `X-Frame-Options: SAMEORIGIN`.
- **MIME-Sniffing Prevention**: `X-Content-Type-Options: nosniff`.
- **Strict HTTPS**: `Strict-Transport-Security` preload active for 2 years.
- **Edge Sliding-Window Rate Limiting**: Built-in 150 req/min edge firewall protecting API endpoints.
- **Automated Malicious Scanner Detection**: Instant 403 blocks against `sqlmap`, `nikto`, `masscan`, `acunetix`.

---

## 🔗 Hybrid Architecture: Vercel Frontend + Render Backend

- **Frontend & Edge Gateway**: Hosted on **Vercel** (`https://crimegraph-ai.vercel.app`).
- **GNN Deep Learning Engine & NetworkX Graph Engine**: Hosted on **Render** using FastAPI (`render.yaml` included in repo).
- When the backend is offline or waking up from sleep, the frontend seamlessly switches to its self-contained, client-side fallback engine with zero loss of interactive capabilities!
