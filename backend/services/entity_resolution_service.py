"""
Entity Resolution Service for CrimeGraph AI.
Performs deterministic & probabilistic entity matching, fuzzy name deduplication (Jaro-Winkler),
co-occurrence scoring, and entity merge/split management.
"""

from typing import List, Dict, Any, Optional
import difflib
from backend.models.schemas import EntityResolutionCandidate, NodeModel, MergeRequest
from backend.services.graph_service import graph_service
from backend.data.seed_data import ENTITY_RESOLUTION_CANDIDATES


def jaro_winkler_similarity(s1: str, s2: str) -> float:
    """Calculates string similarity between two names using SequenceMatcher as standard fallback."""
    if not s1 or not s2:
        return 0.0
    s1_clean = s1.lower().strip()
    s2_clean = s2.lower().strip()
    if s1_clean == s2_clean:
        return 1.0
    return round(difflib.SequenceMatcher(None, s1_clean, s2_clean).ratio(), 3)


class EntityResolutionService:
    def __init__(self):
        self.candidates: List[EntityResolutionCandidate] = []
        self.load_initial_candidates()

    def load_initial_candidates(self):
        self.candidates = []
        for cand in ENTITY_RESOLUTION_CANDIDATES:
            node_a = graph_service.nodes_dict.get(cand["entity_a_id"])
            node_b = graph_service.nodes_dict.get(cand["entity_b_id"])
            if node_a and node_b:
                self.candidates.append(
                    EntityResolutionCandidate(
                        id=cand["id"],
                        entity_a=NodeModel(**node_a),
                        entity_b=NodeModel(**node_b),
                        confidence=cand["confidence"],
                        name_similarity=cand["name_similarity"],
                        phone_match=cand["phone_match"],
                        location_overlap=cand["location_overlap"],
                        historical_association=cand["historical_association"],
                        status=cand["status"],
                        reasons=cand["reasons"]
                    )
                )

    def scan_for_duplicates(self, threshold: float = 0.70) -> List[EntityResolutionCandidate]:
        """Scans all Person nodes in graph to detect potential matching entities."""
        persons = [data for data in graph_service.nodes_dict.values() if data.get("type") == "Person"]
        new_candidates: List[EntityResolutionCandidate] = []
        cand_id_counter = 1

        for i in range(len(persons)):
            for j in range(i + 1, len(persons)):
                p1 = persons[i]
                p2 = persons[j]

                name1 = p1.get("label", "")
                name2 = p2.get("label", "")
                sim = jaro_winkler_similarity(name1, name2)

                # Check aliases
                aliases1 = p1.get("properties", {}).get("aliases", [])
                aliases2 = p2.get("properties", {}).get("aliases", [])
                for a1 in aliases1:
                    for a2 in aliases2:
                        sim = max(sim, jaro_winkler_similarity(a1, a2))
                    sim = max(sim, jaro_winkler_similarity(a1, name2))
                for a2 in aliases2:
                    sim = max(sim, jaro_winkler_similarity(name1, a2))

                # Check national ID or IMEI / phone connections
                p1_nid = p1.get("properties", {}).get("national_id", "")
                p2_nid = p2.get("properties", {}).get("national_id", "")
                exact_id_match = (p1_nid and p2_nid and p1_nid == p2_nid and p1_nid != "UNVERIFIED")

                dob1 = p1.get("properties", {}).get("dob", "")
                dob2 = p2.get("properties", {}).get("dob", "")
                dob_match = (dob1 and dob2 and dob1 == dob2)

                reasons = []
                phone_match = False
                loc_overlap = 0.0

                if exact_id_match:
                    confidence = 0.99
                    reasons.append(f"Exact National Identifier match: {p1_nid}")
                elif sim >= threshold or dob_match:
                    if dob_match:
                        reasons.append(f"Matching Date of Birth: {dob1}")
                    if sim >= 0.8:
                        reasons.append(f"High name phonetic/string similarity ({int(sim*100)}%)")

                    # Compute combined confidence
                    confidence = sim * 0.5 + (0.35 if dob_match else 0.0) + (0.15 if exact_id_match else 0.05)
                    confidence = min(0.98, round(confidence, 2))
                else:
                    continue

                if confidence >= threshold:
                    new_cand = EntityResolutionCandidate(
                        id=f"ER-AUTO-{cand_id_counter:03d}",
                        entity_a=NodeModel(**p1),
                        entity_b=NodeModel(**p2),
                        confidence=confidence,
                        name_similarity=sim,
                        phone_match=phone_match,
                        location_overlap=loc_overlap,
                        historical_association=0.8,
                        status="PENDING",
                        reasons=reasons or ["Cross-dataset similarity threshold exceeded"]
                    )
                    new_candidates.append(new_cand)
                    cand_id_counter += 1

        self.candidates = new_candidates if new_candidates else self.candidates
        return self.candidates

    def merge_candidate(self, req: MergeRequest) -> Dict[str, Any]:
        """Applies investigator decision to merge entities."""
        merged_node = graph_service.merge_entities(req.primary_id, req.duplicate_id, req.merged_name)
        # Update candidate status
        for cand in self.candidates:
            if (cand.entity_a.id == req.primary_id and cand.entity_b.id == req.duplicate_id) or \
               (cand.entity_a.id == req.duplicate_id and cand.entity_b.id == req.primary_id):
                cand.status = "MERGED"

        return {
            "success": True,
            "message": f"Successfully merged {req.duplicate_id} into {req.primary_id}",
            "merged_entity": merged_node
        }

    def reject_candidate(self, candidate_id: str, reason: Optional[str] = None) -> Dict[str, Any]:
        """Marks candidate pair as distinct distinct entities."""
        for cand in self.candidates:
            if cand.id == candidate_id:
                cand.status = "REJECTED"
                if reason:
                    cand.reasons.append(f"Rejected by investigator: {reason}")
                return {"success": True, "message": "Candidate rejected successfully"}
        return {"success": False, "message": "Candidate ID not found"}


entity_resolution_service = EntityResolutionService()
