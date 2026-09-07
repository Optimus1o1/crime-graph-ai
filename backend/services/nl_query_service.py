"""
CrimeGraph AI — NL Query Translator (template-based MVP).
Translates ~6 question patterns to graph operations.
Deterministic on stage; LLM-to-Cypher is a stretch goal.
"""
import re
from typing import Optional, Tuple, Any


def find_entity(text: str, nodes_dict: dict) -> Optional[str]:
    """Fuzzy entity lookup by label."""
    text = text.strip().lower()
    if not text:
        return None
    # Exact match
    for nid, data in nodes_dict.items():
        if data["label"].lower() == text:
            return nid
    # Partial match
    for nid, data in nodes_dict.items():
        if text in data["label"].lower():
            return nid
    # First-word match
    for nid, data in nodes_dict.items():
        if text in data["label"].lower().split(" ")[0]:
            return nid
    # ID match
    for nid in nodes_dict:
        if text == nid.lower():
            return nid
    return None


def translate_query(text: str, nodes_dict: dict) -> dict:
    """
    Returns {"intent": str, "params": dict} or {"intent": "unknown"}.
    Intents: path, neighborhood, mastermind, anomalies, hidden_links, entity_focus, unknown
    """
    ql = text.strip().lower()

    # path between X and Y
    m = re.match(r'(?:path|connection|link)s?\s+between\s+(.+?)\s+and\s+(.+)', ql)
    if m:
        a = find_entity(m.group(1), nodes_dict)
        b = find_entity(m.group(2), nodes_dict)
        if a and b:
            return {"intent": "path", "params": {"from": a, "to": b}}

    # connections of X within N hops
    m = re.match(r'connections?\s+of\s+(.+?)\s+within\s+(\d+)', ql)
    if m:
        a = find_entity(m.group(1), nodes_dict)
        if a:
            return {"intent": "neighborhood", "params": {"node_id": a, "hops": min(4, int(m.group(2)))}}

    # mastermind / kingpin
    if re.search(r'mastermind|kingpin|organiser|organizer|coordinator', ql):
        return {"intent": "mastermind", "params": {}}

    # anomalies
    if re.search(r'anomal|mule|suspicious|smurf', ql):
        return {"intent": "anomalies", "params": {}}

    # hidden links
    if re.search(r'hidden|suggest|predict', ql):
        return {"intent": "hidden_links", "params": {}}

    # single entity lookup
    entity = find_entity(ql, nodes_dict)
    if entity:
        return {"intent": "entity_focus", "params": {"node_id": entity}}

    return {"intent": "unknown", "params": {}}
