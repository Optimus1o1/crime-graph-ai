"""
Obsidian Case Vault Export Service for CrimeGraph AI.
Generates structured Markdown case notes with YAML frontmatter,
[[wikilinks]], evidence traceability tables, and Mermaid graph diagrams.
"""

from typing import Dict, Any, List
import io
import zipfile
from backend.services.graph_service import graph_service
from backend.services.anomaly_service import anomaly_service
from backend.data.seed_data import CASES_DATA


class ObsidianService:
    def generate_markdown_notes(self) -> Dict[str, str]:
        notes: Dict[str, str] = {}

        # 1. Main Overview Note
        overview_md = self._generate_overview_note()
        notes["Investigation/00_Syndicate_Overview.md"] = overview_md

        # 2. Case Notes
        for case in CASES_DATA:
            cid = case["case_id"]
            title = case["title"].replace(" ", "_")
            notes[f"Investigation/Cases/{cid}_{title}.md"] = self._generate_case_note(case)

        # 3. Entity Notes
        for node_id, data in graph_service.nodes_dict.items():
            ntype = data.get("type", "Entity")
            label_clean = data.get("label", node_id).replace(" ", "_").replace("/", "-").replace("+", "")
            path = f"Investigation/{ntype}s/{node_id}_{label_clean}.md"
            notes[path] = self._generate_entity_note(data)

        # 4. Anomalies Note
        notes["Investigation/99_Syndicate_Anomalies.md"] = self._generate_anomalies_note()

        return notes

    def _generate_overview_note(self) -> str:
        nodes = list(graph_service.nodes_dict.values())
        edges = list(graph_service.edges_dict.values())
        anomalies = anomaly_service.anomalies

        mermaid_lines = ["```mermaid", "graph TD"]
        for e in edges[:25]:  # top 25 edges for readability
            src = graph_service.nodes_dict.get(e["source"], {}).get("label", e["source"]).replace(" ", "_").replace("+", "")
            tgt = graph_service.nodes_dict.get(e["target"], {}).get("label", e["target"]).replace(" ", "_").replace("+", "")
            lbl = e.get("type", "RELATED_TO")
            mermaid_lines.append(f"    {e['source']}[\"{src}\"] -->|{lbl}| {e['target']}[\"{tgt}\"]")
        mermaid_lines.append("```")

        md = f"""---
title: Criminal Syndicate Network Intelligence Dossier
generated_by: CrimeGraph AI
total_entities: {len(nodes)}
total_relationships: {len(edges)}
critical_anomalies: {len(anomalies)}
tags: [crimegraph, intelligence, case-dossier]
---

# 🕵️ Criminal Syndicate Network Intelligence Dossier

> **CONFIDENTIAL // LAW ENFORCEMENT INVESTIGATIVE WORKSPACE**

## Executive Summary
This knowledge vault has been automatically assembled by **CrimeGraph AI**. It synthesizes heterogeneous intelligence data including FIR filings, Call Detail Records (CDR), Hawala financial transactions, ANPR vehicle tracking, and cellular tower co-locations.

## High-Risk Bridge Entities
| Entity ID | Name / Label | Type | Centrality (Betweenness) | Community |
|---|---|---|---|---|
"""
        for n in sorted(nodes, key=lambda x: x.get("betweenness", 0), reverse=True)[:5]:
            md += f"| [[{n['id']}_{n['label'].replace(' ', '_')}]] | {n['label']} | `{n['type']}` | **{n.get('betweenness')}** | Cluster {n.get('community_id')} |\n"

        md += f"""
## Syndicate Network Topology (Mermaid Preview)
{chr(10).join(mermaid_lines)}

## Key Cases
- [[CASE-FIR-102_Operation_Falcon_Syndicate_-_Multi-State_Hawala_&_Cyber_Extortion]]
- [[CASE-FIR-208_Narcotics_&_Darknet_Logistics_Nexus_-_Coastal_Corridor]]

## Critical Anomalies
- [[99_Syndicate_Anomalies]]
"""
        return md

    def _generate_case_note(self, case: Dict[str, Any]) -> str:
        cid = case["case_id"]
        return f"""---
case_id: "{cid}"
fir_number: "{case.get('fir_number')}"
police_station: "{case.get('police_station')}"
registration_date: "{case.get('incident_date')}"
status: "{case.get('status')}"
tags: [case, fir, crimegraph]
---

# 📋 Case File: {case.get('fir_number')}

## Legal Classification
- **Section of Law:** `{case.get('section_law')}`
- **Police Station:** {case.get('police_station')}
- **Date Registered:** {case.get('incident_date')}
- **Investigation Status:** `{case.get('status')}`

## Case Narrative
{case.get('description')}

## Connected Suspects
""" + "".join([f"- [[{p}]]\n" for p in case.get("primary_accused", [])])

    def _generate_entity_note(self, node: Dict[str, Any]) -> str:
        nid = node["id"]
        ntype = node.get("type", "Entity")
        label = node.get("label", nid)
        props = node.get("properties", {})
        records = node.get("source_records", [])

        # Find incoming & outgoing links
        connected_edges = []
        for eid, e in graph_service.edges_dict.items():
            if e["source"] == nid:
                tgt_label = graph_service.nodes_dict.get(e["target"], {}).get("label", e["target"])
                connected_edges.append(f"- **{e['type']}** $\\to$ [[{e['target']}_{tgt_label.replace(' ', '_')}]] ({e.get('label', '')})")
            elif e["target"] == nid:
                src_label = graph_service.nodes_dict.get(e["source"], {}).get("label", e["source"])
                connected_edges.append(f"- $\\leftarrow$ **{e['type']}** from [[{e['source']}_{src_label.replace(' ', '_')}]] ({e.get('label', '')})")

        md = f"""---
entity_id: "{nid}"
entity_type: "{ntype}"
label: "{label}"
risk_level: "{node.get('risk_level', 'MEDIUM')}"
community_id: {node.get('community_id', 0)}
betweenness_score: {node.get('betweenness', 0.0)}
degree: {node.get('degree', 0)}
is_bridge: {str(node.get('is_bridge', False)).lower()}
tags: [{ntype.lower()}, entity, risk-{node.get('risk_level', 'medium').lower()}]
---

# {label} (`{ntype}`)

**Entity ID:** `{nid}` | **Risk Level:** `{node.get('risk_level')}` | **Syndicate Cluster:** `Community {node.get('community_id')}`

## Structural Metrics
- **Degree Connections:** {node.get('degree')}
- **Betweenness Centrality:** {node.get('betweenness')}
- **Bridge Entity Status:** {"⚠️ Key Strategic Broker" if node.get('is_bridge') else "Standard Node"}

## Properties & Intelligence
"""
        for k, v in props.items():
            md += f"- **{k.replace('_', ' ').title()}:** {v}\n"

        md += "\n## Interconnected Graph Relationships\n"
        if connected_edges:
            md += "\n".join(connected_edges)
        else:
            md += "- *No direct edge traversals registered.*"

        md += "\n\n## Evidentiary Source Records\n"
        if records:
            for r in records:
                md += f"- `{r}`\n"
        else:
            md += "- *Primary Graph Inference*\n"

        return md

    def _generate_anomalies_note(self) -> str:
        md = """---
title: Syndicate Network Anomalies & Flagged Patterns
tags: [anomalies, fraud, laundering, bursts]
---

# 🚨 Network Anomalies & Investigative Leads

"""
        for a in anomaly_service.anomalies:
            md += f"""### {a.severity} — {a.title}
- **Type:** `{a.type}`
- **Confidence:** {int(a.confidence * 100)}%
- **Description:** {a.description}
- **Involved Entities:** {', '.join([f'`{e}`' for e in a.involved_node_ids])}
- **Evidentiary Basis:** {', '.join([f'`{e}`' for e in a.evidence_records])}
- **Recommended Action:** *{a.recommended_action}*

---
"""
        return md

    def create_vault_zip(self) -> bytes:
        notes = self.generate_markdown_notes()
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            for path, content in notes.items():
                zf.writestr(path, content)
        zip_buffer.seek(0)
        return zip_buffer.getvalue()


obsidian_service = ObsidianService()
