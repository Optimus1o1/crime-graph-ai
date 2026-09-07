# CrimeGraph AI — runnable MVP

One command, full stack: FastAPI backend + graph engine + workbench UI.

## Run it

```bash
./run.sh                      # or manually:
pip install -r requirements.txt
python3 generate_dataset.py   # only if data/ is missing
uvicorn backend.app:app --port 8000
```

Open **http://localhost:8000** — the workbench UI.
Open **http://localhost:8000/docs** — live OpenAPI docs (show judges this).

Windows: `pip install -r requirements.txt && python generate_dataset.py && uvicorn backend.app:app --port 8000`

## What is real in this MVP

- Graph engine: 112 entities / ~300 relationships loaded from CSVs; live betweenness
  centrality, Louvain-style community detection, dual shortest-path search
  (evidentiary + case-excluded corroborating path).
- Detectors (computed, not hardcoded): mule-account structuring, cross-FIR phone
  match, low-visibility coordinator, mule-chain intermediary. All four fire on the
  planted ground truth (see data/ground_truth.json).
- Entity resolution: rapidfuzz matching with confidence scores; live CSV ingestion
  raises "possible duplicate" merge suggestions for officer review (never auto-merged).
- NL query box -> server-side template translation (path / neighborhood / mastermind /
  anomalies / suggestions / entity focus).
- Hash-chained audit log (SHA-256 linked, persisted to audit.log) + printable dossier
  export per entity.
- AI suggestions endpoint: serves predictions.json if you have run train_gnn.py
  (GraphSAGE); until then it serves a clearly-labelled shared-neighbour topology
  placeholder. Run the trainer tonight and the overlay upgrades automatically.

## Demo flow (matches the build report, Section 8)

1. Overview panel shows 4 live alerts -> click each.
2. Trace paths (pre-set: accused -> vehicle) -> two independent evidence channels.
3. Find mastermind -> coordinator flagged with degree/rank/why + records.
4. AI suggestions toggle -> dashed predicted links (P002-P018 is the planted one).
5. Anomalies toggle -> mule chain highlighted with structuring explanation.
6. Ingest CSV -> data/live_feed_sample.csv -> merge suggestion fires live on stage.
7. Export dossier from any flagged entity -> print to PDF. Audit chain in left rail.

## Architecture note

The API layer only talks to backend/engine.py's public methods. Swapping NetworkX
for Neo4j (same signatures, Cypher inside) changes zero API or UI code — that is
the fallback-first strategy from the build report. React rebuild of static/index.html
is optional polish, not a prerequisite: this UI is complete.
