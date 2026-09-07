"""
Anomaly Detection Service for CrimeGraph AI.
Identifies money laundering cycles, sudden burner communication bursts,
and high-betweenness bridge brokers across criminal syndicates.
"""

from typing import List, Dict, Any
import networkx as nx
from backend.models.schemas import AnomalyReport
from backend.services.graph_service import graph_service
from backend.data.seed_data import ANOMALIES_DATA


class AnomalyService:
    def __init__(self):
        self.anomalies: List[AnomalyReport] = []
        self.load_initial_anomalies()

    def load_initial_anomalies(self):
        self.anomalies = [AnomalyReport(**a) for a in ANOMALIES_DATA]

    def detect_anomalies(self) -> List[AnomalyReport]:
        """Runs graph algorithms to detect new network anomalies."""
        detected = list(self.anomalies)

        # 1. Detect Financial Layering Cycles in Transaction Graph
        txn_graph = nx.DiGraph()
        for edge_id, edge in graph_service.edges_dict.items():
            if edge.get("type") == "TRANSFERRED_TO":
                src = edge["source"]
                tgt = edge["target"]
                txn_graph.add_edge(src, tgt, edge_id=edge_id, weight=edge.get("weight", 1))

        try:
            cycles = list(nx.simple_cycles(txn_graph))
            for i, cycle in enumerate(cycles):
                if len(cycle) >= 2:
                    cycle_nodes = list(cycle)
                    cycle_edges = []
                    for k in range(len(cycle_nodes)):
                        u = cycle_nodes[k]
                        v = cycle_nodes[(k + 1) % len(cycle_nodes)]
                        ed = txn_graph.get_edge_data(u, v)
                        if ed and "edge_id" in ed:
                            cycle_edges.append(ed["edge_id"])

                    # Check if already recorded
                    exists = any(a.type == "FINANCIAL_LAYERING_CYCLE" and set(a.involved_node_ids) == set(cycle_nodes) for a in detected)
                    if not exists:
                        rep = AnomalyReport(
                            id=f"ANOM-CYCLE-{i+1}",
                            type="FINANCIAL_LAYERING_CYCLE",
                            severity="CRITICAL",
                            title=f"Circular Transaction Flow ({len(cycle_nodes)} Nodes)",
                            description=f"Detected closed money flow loop: {' -> '.join(cycle_nodes)} -> {cycle_nodes[0]}",
                            involved_node_ids=cycle_nodes,
                            involved_edge_ids=cycle_edges,
                            evidence_records=["FIN-TXN-CYCLE-TRACE"],
                            confidence=0.95,
                            recommended_action="Submit Suspicious Transaction Report (STR) to FIU and flag accounts for audit."
                        )
                        detected.append(rep)
        except Exception:
            pass

        # 2. Detect High-Betweenness Bridges
        for node_id, data in graph_service.nodes_dict.items():
            btw = data.get("betweenness", 0.0)
            if btw > 0.40 and data.get("type") == "Person":
                exists = any(a.type == "BRIDGE_BROKER" and node_id in a.involved_node_ids for a in detected)
                if not exists:
                    rep = AnomalyReport(
                        id=f"ANOM-BRIDGE-{node_id}",
                        type="BRIDGE_BROKER",
                        severity="HIGH",
                        title=f"Strategic Broker Identified: {data.get('label')}",
                        description=f"{data.get('label')} has a betweenness centrality of {btw}, indicating a key conduit between disparate network sub-groups.",
                        involved_node_ids=[node_id],
                        involved_edge_ids=[],
                        evidence_records=data.get("source_records", []),
                        confidence=0.89,
                        recommended_action="Conduct targeted wiretap authorization and prioritize physical observation."
                    )
                    detected.append(rep)

        self.anomalies = detected
        return self.anomalies


anomaly_service = AnomalyService()
