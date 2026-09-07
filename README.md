# 🌐 CrimeGraph AI — Investigative Intelligence Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-white?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PyTorch Geometric](https://img.shields.io/badge/PyTorch-Geometric-ee4c2c?style=for-the-badge&logo=pytorch)](https://pytorch-geometric.readthedocs.io/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Security Hardened](https://img.shields.io/badge/Security-OWASP%20Hardened-emerald?style=for-the-badge&logo=shield)](https://owasp.org/)

[render live link-https://crime-graph-ai.onrender.com]

**CrimeGraph AI** is an enterprise-grade, explainable criminal network analysis and cyber intelligence platform. Engineered for law enforcement agencies, cybercrime divisions, intelligence analysts, and financial crime investigators, it transforms raw, fragmented multi-source intelligence—Call Detail Records (CDRs), hawala financial transactions, ANPR automated license plate cameras, company registries, and physical evidence—into an interactive, multidimensional tactical intelligence matrix.

Designed with a high-contrast **tactical cyber HUD aesthetic** (inspired by Palantir Gotham and aerospace defense consoles), CrimeGraph AI merges graph theory, Graph Neural Networks (GNNs), hardware-accelerated 3D WebGL visualizations, and tamper-evident cryptographic chain of custody into a unified command environment.

---

## 📌 Table of Contents

1. [What is CrimeGraph AI?](#-what-is-crimegraph-ai)
2. [How It Works (System Architecture & Pipeline)](#-how-it-works)
3. [What Services It Provides](#-what-services-it-provides)
   - [1. Intel Core Operations Dashboard](#1-intel-core-operations-dashboard)
   - [2. Tactical Knowledge Graph Workbench](#2-tactical-knowledge-graph-workbench)
   - [3. CCTV & ANPR Automated Tracking Hub](#3-cctv--anpr-automated-tracking-hub)
   - [4. Case Evidence Dossiers Hub](#4-case-evidence-dossiers-hub)
   - [5. Criminal Entity Dossier (360° Profile)](#5-criminal-entity-dossier-360-profile)
   - [6. Crime Analytics & GNN Predictive Intelligence](#6-crime-analytics--gnn-predictive-intelligence)
   - [7. Forensic Evidence & Audit Vault](#7-forensic-evidence--audit-vault)
   - [8. 3D Urban Digital Twin & Congestion Radar](#8-3d-urban-digital-twin--congestion-radar)
   - [9. Operations Management & System Configuration](#9-operations-management--system-configuration)
   - [Controlled Modal Engines](#controlled-modal-engines)
4. [Tech Stack Breakdown (What Is Used Where)](#-tech-stack-breakdown)
5. [Enterprise Security & Resilience](#-enterprise-security--resilience)
6. [Quickstart & Local Development](#-quickstart--local-development)
7. [Cloud Deployment Guide](#-cloud-deployment-guide)
8. [License & Acknowledgments](#-license--acknowledgments)

---

## 🔍 What is CrimeGraph AI?

Modern criminal syndicates operate across decentralized, covert channels—using burner phones, shell corporations, mule bank accounts, encrypted messaging apps, and layered hawala money networks. Traditional relational databases and tabular spreadsheets fail to capture the complex, multi-hop topological connections between these illicit entities.

**CrimeGraph AI solves this challenge by providing:**
- **Automated Network Synthesis**: Converts tabular logs (CDRs, bank statements, surveillance feeds) into heterogeneous knowledge graphs.
- **Graph Neural Network Link Prediction**: Predicts undisclosed relationships, hidden kingpins, and proxy coordinators using inductive graph embeddings.
- **Explainable AI (XAI)**: Generates human-verifiable subgraphs, feature attribution weights, and plain-English investigative justifications for every AI prediction.
- **Hardware-Accelerated 3D Situational Awareness**: Renders multi-tiered syndicates, arterial traffic flows, and sensor arrays in Three.js WebGL with real-time camera manipulation.
- **Tamper-Evident Chain of Custody**: Cryptographically secures all ingested evidence and investigator actions using SHA-256 hash chains compliant with forensic legal standards.

---

## 🏛️ Comprehensive System Architecture

CrimeGraph AI is engineered around a **decoupled, multi-tier defense architecture** that guarantees high availability, sub-second query latency, and zero data leakage:

```mermaid
graph TB
    subgraph ClientTier["1. PRESENTATION & CLIENT TIER (Next.js 16 + React 19)"]
        UI_Shell["Next.js 16 Tactical HUD Shell<br>Turbopack App Router • Responsive Cyber Rail"]
        Cytoscape_Engine["Cytoscape.js 2D Workbench<br>CoSE • Concentric • Mastermind Mode"]
        ThreeJS_Canvases["Three.js Hardware-Accelerated 3D Engines<br>• Holographic Network • 3D Urban Twin • Volumetric Radar"]
        Zustand_Store["Zustand Reactive State Store<br>Offline Cache • Optimistic UI • Fallback Graph Engine"]
    end

    subgraph GatewayTier["2. EDGE GATEWAY & SECURITY TIER (Vercel Edge / Node.js)"]
        Edge_Proxy["Next.js Edge API Router / Reverse Proxy<br>Routes 40+ REST Endpoints"]
        Rate_Limiter["Sliding-Window Rate Limiter<br>150 req/min per IP • Anti-DoS Protection"]
        Scanner_Shield["Vulnerability Scanner Shield<br>Blocks sqlmap, nikto, masscan, acunetix"]
        OWASP_Headers["OWASP Hardened Security Layer<br>Strict CSP • X-Frame-Options • HSTS Preload"]
        Auth_Validator["Session & Clearance Validator<br>JWT Verification • Role-Based Access Control"]
    end

    subgraph BackendTier["3. CORE INTELLIGENCE & ANALYTICS TIER (FastAPI + Python 3.11)"]
        FastAPI_Core["FastAPI High-Throughput Gateway<br>Async REST API • Pydantic Schema Validation"]
        Graph_Service["NetworkX Graph Theory Engine<br>PageRank • Betweenness • Louvain Communities"]
        Entity_Resolution["Entity Resolution Service<br>Jaro-Winkler • Levenshtein • Phone Normalization"]
        Timeline_GIS["Temporal Timeline & GIS Engine<br>Spatial Clustering • Chronological Event Replay"]
        Evidence_Vault["Forensic Evidence & Chain-of-Custody<br>SHA-256 Cryptographic Chaining"]
    end

    subgraph AITier["4. DEEP LEARNING & GNN PREDICTION TIER (PyTorch Geometric)"]
        GNN_Model["Graph Neural Network Engine<br>2-Layer GraphSAGE / GCN Inductive Embedding"]
        Link_Predictor["Link Formation Predictor<br>Dot-Product Edge Scorer • Anomaly Detector"]
        GNN_Explainer["GNNExplainer Subgraph Engine<br>Node Feature Masking • Edge Attribution Scoring"]
    end

    subgraph StorageTier["5. DATA PERSISTENCE & CRYPTOGRAPHIC LEDGER TIER"]
        Supabase_DB["Supabase Cloud Database<br>PostgreSQL with Row-Level Security (RLS)"]
        Hash_Ledger["Cryptographic Evidence Ledger<br>Sequential SHA-256 Merkle Block Hash Chains"]
        Local_Cache["In-Memory & Local Storage Fallback<br>Zero-Downtime Offline Resilience"]
    end

    %% Tier connections
    UI_Shell --> Edge_Proxy
    Cytoscape_Engine --> Zustand_Store
    ThreeJS_Canvases --> Zustand_Store
    Zustand_Store <--> Edge_Proxy
    
    Edge_Proxy --> Rate_Limiter
    Rate_Limiter --> Scanner_Shield
    Scanner_Shield --> OWASP_Headers
    OWASP_Headers --> Auth_Validator
    Auth_Validator --> FastAPI_Core
    
    FastAPI_Core --> Graph_Service
    FastAPI_Core --> Entity_Resolution
    FastAPI_Core --> Timeline_GIS
    FastAPI_Core --> Evidence_Vault
    
    Graph_Service <--> GNN_Model
    GNN_Model --> Link_Predictor
    Link_Predictor --> GNN_Explainer
    GNN_Explainer --> FastAPI_Core
    
    FastAPI_Core <--> Supabase_DB
    Evidence_Vault <--> Hash_Ledger
    Zustand_Store <--> Local_Cache
```

---

### Layer-by-Layer Subsystem Specifications

#### 1. Presentation & Client Tier
- **Framework**: Next.js 16.3.4 (App Router) paired with React 19.2.0.
- **Dynamic Chunk Streaming**: Heavy visualization libraries (Three.js WebGL and Cytoscape.js) are strictly decoupled and streamed dynamically (`ssr: false`) with tactical HUD loading skeletons to ensure the primary dashboard loads in under 500ms.
- **WebGL Context Decoupling**: Three.js canvases use reactive state refs (`useRef`) to decouple animation frames from UI state. Toggling auto-rotation, sweeping radars, or selecting suspect nodes executes at 60 FPS without destroying or reallocating WebGL buffers.
- **Global State & Offline Fallback**: The Zustand store caches active syndicate graph snapshots in `localStorage`. If the backend service is offline, cold-starting, or unreachable, CrimeGraph AI automatically falls back to its embedded client-side graph engine with zero broken UI states.

#### 2. Edge Gateway & Security Tier
- **Reverse Proxy Routing**: Next.js API routes act as an edge reverse-proxy forwarding requests to the Python FastAPI backend (`/api/*` $\rightarrow$ `backend:8000/*`).
- **Sliding-Window Rate Limiter**: Monitors incoming IP addresses using a 60-second sliding window capped at 150 requests/minute to prevent scraping and denial-of-service attempts.
- **Automated Threat Blocking**: Inspects incoming `User-Agent` headers and returns immediate `403 Forbidden` responses for automated penetration testing tools (`sqlmap`, `nikto`, `masscan`, `w3af`, `acunetix`, `havij`).
- **OWASP Compliance**: Enforces hardened headers including strict `Content-Security-Policy`, `X-Frame-Options: SAMEORIGIN` (anti-clickjacking), `X-Content-Type-Options: nosniff` (anti-MIME-sniffing), and 2-year `Strict-Transport-Security` (HSTS).

#### 3. Core Intelligence & Analytics Tier
- **Gateway**: FastAPI asynchronous REST service executing with Uvicorn workers.
- **Network Topology Analysis**: NetworkX calculates graph-theoretic metrics in real time:
  - **Betweenness Centrality**: Flags financial brokers and hawala transit operators.
  - **PageRank & Degree**: Identifies syndicate coordinators and central kingpins.
  - **Louvain Modularity**: Clusters nodes into criminal syndicates and sub-factions.
- **Multimodal Entity Resolution**: Employs Jaro-Winkler distance, Levenshtein edit distance, phone canonicalization (`+91` E.164 standard), and spatial-temporal co-location to resolve aliases to unique physical entities.

#### 4. Deep Learning & GNN Prediction Tier
- **Architecture**: 2-Layer Graph Convolutional Network (GCN) and GraphSAGE implemented in **PyTorch Geometric (PyG)**.
- **Inductive Node Embeddings**: Combines structural topological features (degree, centrality, clustering coefficient) with entity attribute vectors (risk rating, entity type, transaction frequency) into a 64-dimensional latent embedding space.
- **Link Formation Inference**: Computes dot-product similarity scores between node pairs, applying an empirical threshold ($\tau = 0.85$) to predict hidden or unrecorded criminal links.
- **Explainability (GNNExplainer)**: Extracts the 2-hop computational subgraph for each predicted link, computing edge importance weights and ranking top predictive features for plain-English courtroom explanation.

#### 5. Storage & Cryptographic Ledger Tier
- **Relational Cloud Persistence**: Supabase PostgreSQL database storing case records, warrants, suspect dossiers, and user accounts protected by Row-Level Security (RLS).
- **Cryptographic Evidence Chain of Custody**: Every digital evidence item is hashed using SHA-256 and chained into a tamper-evident audit ledger. Each audit block contains:
  $$\text{Block Hash} = \text{SHA256}(\text{Index} + \text{PrevBlockHash} + \text{Timestamp} + \text{Action} + \text{PayloadHash} + \text{InvestigatorBadge})$$
  Any alteration of prior evidence records instantly invalidates the entire chain, guaranteeing forensic defensibility in judicial proceedings.

---

## ⚙️ How It Works (Data Pipeline & Life Cycle)

The lifecycle of an investigation from ingestion to legal export follows an automated 5-stage pipeline:

```
[Raw Intelligence] ➔ [Entity Resolution] ➔ [Knowledge Graph] ➔ [GNN Inference & XAI] ➔ [Forensic Ledger]
```

1. **Multi-Source Ingestion**: CDR call logs, hawala transfers, ANPR license plate detections, and registered bank accounts are ingested into the platform.
2. **Identity Resolution**: The Entity Resolution Engine merges aliases (e.g. `R. Kumar` $\leftrightarrow$ `Rahul Kumar`) while preserving provenance trails.
3. **Graph Topology Computation**: NetworkX constructs the heterogeneous multi-relational graph and computes centrality scores.
4. **Predictive GNN Inference**: PyTorch Geometric infers hidden connections and anomalous communications, generating explainable feature masks.
5. **Interactive Exploration & Custody**: Investigators explore the 2D/3D dual-canvas interface, run what-if disruption simulations, and export cryptographically sealed case dossiers.

---

## 🛡️ What Services It Provides

CrimeGraph AI delivers **9 dedicated intelligence views** and **5 controlled analytical modals**:

### 1. Intel Core Operations Dashboard
- **Threat Level Telemetry**: Real-time syndicated threat meters, high-priority alert cards, and active incident streams.
- **3D Volumetric Radar HUD**: Real-time rotating spatial radar scanning monitored surveillance zones.
- **Multi-Vector Telemetry Ribbon**: 3D extruded ribbon chart tracking weekly cyber fraud incidents, financial volume, and hawala bursts.
- **Quick Action Bar**: One-click shortcuts to spawn cases, trigger GNN anomaly sweeps, or query the AI Copilot.

### 2. Tactical Knowledge Graph Workbench
- **2D/3D Dual-Mode Visualizer**: Toggle between Cytoscape.js interactive node-link diagrams and Three.js 3D holographic graphs.
- **Algorithmic Layout Engine**: Force-directed (CoSE), Concentric (hierarchy-based), Radial, and Grid network projections.
- **Centrality & Mastermind Isolation**: Highlights top brokers, kingpins, and isolated sub-clusters.
- **Shortest Path Intelligence**: Identifies multi-hop laundering and communication chains between any two suspects.

### 3. CCTV & ANPR Automated Tracking Hub
- **Optical Plate Telemetry**: Real-time feeds with automatic plate recognition, confidence scores, and vehicle classification.
- **Speed & Velocity Computation**: Calculates vehicle speed against highway limits and flags transit violations.
- **3D ANPR Camera Matrix Grid**: 3D spatial terrain showing active, standby, and maintenance-mode surveillance nodes.
- **Trajectory Interception**: Projects vehicle route history across timestamped camera gates.

### 4. Case Evidence Dossiers Hub
- **Syndicate Case Management**: Organize active operations (Operation Blacklist, Hawala Syndicate 09, Shadow Bank 201).
- **Warrant & Arrest Tracking**: Monitor judicial authorization, charge sheets, and arrest warrants.
- **Evidence Cross-Referencing**: Link CCTV clips, CDR transcripts, and bank statements directly to case folders.

### 5. Criminal Entity Dossier (360° Profile)
- **Suspect Biometrics & Identifiers**: National IDs, biometric photos, aliases, threat rating, and current operational status.
- **3D Orbiting CDR Satellite Cluster**: Interactive 3D visualization showing devices, bank accounts, and shell entities orbiting the primary suspect.
- **Associated Syndicate Nodes**: Direct access to linked confederates, mule accounts, and meeting locations.

### 6. Crime Analytics & GNN Predictive Intelligence
- **AI Link Prediction Matrix**: AI-inferred criminal linkages with confidence scores (e.g. 94.2% confidence link between S-201 and S-089).
- **GNN Model Transparency Card**: Architecture details (2-Layer GraphSAGE, AUC-ROC: 0.941), precision/recall metrics, and training hyperparameters.
- **Temporal Crime Snapshots**: Historical comparison showing how criminal syndicates evolve over 30, 60, and 90-day windows.
- **What-If Disruptive Simulation**: Simulates syndicate collapse or rerouting when specific kingpins or bank accounts are frozen.

### 7. Forensic Evidence & Audit Vault
- **Cryptographic Chain of Custody**: Every digital evidence item is hashed with SHA-256 and linked into a tamper-evident audit ledger.
- **One-Click Integrity Verification**: Instant cryptographic proof verifying that records have not been altered or tampered with.
- **Courtroom Evidence Export**: Generate signed PDF/JSON compliance dossiers for legal prosecution.

### 8. 3D Urban Digital Twin & Congestion Radar
- **Metropolitan Arterial Mesh**: 3D hardware-accelerated city road network with glowing traffic splines.
- **Congestion Elevation Towers**: Extruded 3D towers indicating traffic density, choke points, and surveillance density.
- **Live Kinetic Telemetry**: Animate suspect vehicle journeys through metropolitan road networks in real-time.

### 9. Operations Management & System Configuration
- **API & Connector Health Matrix**: Monitor real-time status of FastAPI GNN engine, Supabase PostgreSQL, ANPR connectors, and CDR ingest pipelines.
- **Security Policy Controls**: Configure JWT expiration, IP rate limits, and audit verbosity.
- **Data Pipeline Management**: Trigger test dataset seeding, database backups, or cache purges.

### Controlled Modal Engines
- **AI Investigation Copilot**: Controlled 7-part intelligence report assistant with tool-orchestration capabilities.
- **GNN Explainer Modal**: Interactive node-by-node feature attribution breakdown for inferred links.
- **Vehicle Journey Modal**: Interactive map replay of suspect vehicle movements across camera gates.
- **Prediction Analytics Modal**: Deep-dive GNN ROC curve analytics and link probability histograms.
- **Supabase Auth Modal**: Secure role-based authentication with badge verification.

---

## 💻 Tech Stack Breakdown

| Layer | Technology | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.3.4 (App Router)** | Monorepo architecture with Turbopack, static page generation, server routes, and fast edge proxying. |
| **Client UI Library** | **React 19.2.0** | Concurrent rendering, dynamic module streaming (`next/dynamic`), and zero-latency view routing. |
| **3D Graphics Engine** | **Three.js 0.185.1** | Custom WebGL scenes, procedural mesh geometry, particle buffers, volumetric radars, and lighting models. |
| **2D Graph Engine** | **Cytoscape.js 3.34.2** | Interactive node-link workbench with CoSE, concentric, breadth-first, and radial layout physics. |
| **State Management** | **Zustand 5.0.15** | Global reactive store with offline persistence, client-side fallback engines, and zero prop drilling. |
| **Styling & HUD Design** | **Tailwind CSS v4** | Dark tactical cyber HUD palette, glassmorphic panels, glowing laser borders, and responsive mobile nav. |
| **Icons & Typography** | **Lucide React + Google Fonts** | Self-hosted `Inter` and `JetBrains Mono` via `next/font/google` for zero layout shifts and modern telemetry iconography. |
| **Backend Framework** | **FastAPI 0.115 + Uvicorn** | Asynchronous Python REST gateway with automatic OpenAPI documentation and strict Pydantic models. |
| **Graph Theory Engine** | **NetworkX 3.2** | Algorithmic centrality (PageRank, Betweenness, Closeness), community detection, and shortest-path calculation. |
| **Deep Learning / GNN** | **PyTorch Geometric (PyG)** | Graph Convolutional Networks (GCN) and GraphSAGE models for inductive edge prediction and anomaly detection. |
| **Database & Identity** | **Supabase (PostgreSQL)** | Cloud-hosted relational persistence, JWT authentication, and Row Level Security (RLS). |
| **Security & Firewall** | **Starlette + Next Middleware** | Dual-layer sliding-window IP rate limiting (150 req/min), scanner blocklist (`sqlmap`, `nikto`), and OWASP headers. |
| **Deployment Targets** | **Vercel + Render** | Frontend and API routes on Vercel; Python GNN backend on Render with seamless client-side fallbacks. |

---

## 🔒 Enterprise Security & Resilience

1. **Zero Secret Leaks Guaranteed**:
   - Comprehensive `.gitignore` strictly blocks all `.env`, `.env*.local`, `*.env`, build directories, and temporary data dumps from Git tracking.
   - Clean `.env.example` provided for safe team onboarding.
2. **OWASP Content Security Policy (CSP)**:
   - Configured in `frontend/next.config.mjs` with scoped script-src, style-src, font-src, and connect-src rules.
3. **Anti-Clickjacking & Anti-Sniffing**:
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
4. **Dual Sliding-Window Rate Limiting**:
   - Edge rate limiter on Next.js routes (150 req/min).
   - In-memory sliding-window rate limiter on FastAPI backend endpoints.
5. **Automated Vulnerability Scanner Blocking**:
   - Automatic 403 Forbidden responses triggered for scanner user agents (`sqlmap`, `nikto`, `masscan`, `acunetix`, `havij`).
6. **Graceful Offline Fallback Engine**:
   - When the backend Python service is sleeping or offline, CrimeGraph AI automatically falls back to an embedded client-side graph engine, ensuring all 9 views and 3D canvases continue functioning with zero broken interfaces.

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: v18.17.0 or newer (v20+ recommended)
- **Python**: 3.10 or newer (for backend GNN engine)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Optimus1o1/CrimeGraph_AI.git
cd CrimeGraph_AI
```

### 2. Frontend Setup (Next.js 16)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment template
cp ../.env.example .env.local

# Run Turbopack development server
npm run dev
```
The application will be live at `http://localhost:3000`.

### 3. Backend Setup (FastAPI + GNN Engine - Optional)
In a separate terminal window:
```bash
# Navigate to root or backend
cd backend

# Create virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Launch FastAPI gateway
uvicorn main:app --reload --port 8000
```
Backend API interactive docs will be available at `http://localhost:8000/docs`.

---

## ☁️ Cloud Deployment Guide

### Deploy Frontend to Vercel (1-Click)
See the complete step-by-step instructions in [VERCEL_DEPLOYMENT.md](file:///c:/Users/ANIKET/OneDrive/Documents/CrimeGraph_AI/VERCEL_DEPLOYMENT.md).

```bash
# Deploy with Vercel CLI from project root
vercel --prod
```

### Deploy Backend to Render
The repository includes a ready-to-use [`render.yaml`](file:///c:/Users/ANIKET/OneDrive/Documents/CrimeGraph_AI/render.yaml) blueprint that automatically provisions the Python FastAPI service on Render.

---

## 📄 License & Acknowledgments

This project is licensed under the **MIT License**.

Developed with passion by **Aniket Nandi ([@Optimus1o1](https://github.com/Optimus1o1))**.  
Special thanks to the open-source communities behind **Next.js**, **Three.js**, **Cytoscape.js**, and **PyTorch Geometric**.
