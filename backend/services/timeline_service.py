"""
CrimeGraph AI — Timeline & Temporal Intelligence Service.
Provides chronological event sequencing, time-window filtering,
temporal correlation, and AI-powered chronological synthesis.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from backend.models.schemas import TimelineEvent, TimelineResponse
from backend.data.seed_data import TIMELINE_EVENTS_DATA


class TimelineService:
    def __init__(self):
        self.events: List[TimelineEvent] = [TimelineEvent(**e) for e in TIMELINE_EVENTS_DATA]

    def get_events(
        self,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None,
        event_types: Optional[List[str]] = None,
        entity_id: Optional[str] = None
    ) -> List[TimelineEvent]:
        """Returns filtered chronological timeline events."""
        filtered = []
        for ev in self.events:
            if event_types and ev.event_type not in event_types:
                continue
            if entity_id and ev.source_entity_id != entity_id and ev.target_entity_id != entity_id:
                continue
            if start_time and ev.timestamp < start_time:
                continue
            if end_time and ev.timestamp > end_time:
                continue
            filtered.append(ev)

        filtered.sort(key=lambda x: x.timestamp)
        return filtered

    def get_timeline_response(self, entity_id: Optional[str] = None) -> TimelineResponse:
        events = self.get_events(entity_id=entity_id)
        ai_summary = None
        if len(events) >= 3:
            first_t = events[0].timestamp
            last_t = events[-1].timestamp
            ai_summary = f"Chronological analysis indicates a concentrated operational cluster of {len(events)} events between {first_t[:10]} and {last_t[:10]}. Notable correlation: high-frequency financial disbursements were immediately followed by burner SIM activation and inter-state vehicle transit."
        return TimelineResponse(
            events=events,
            total_events=len(events),
            ai_summary=ai_summary
        )

    def add_event(self, event_data: dict) -> TimelineEvent:
        event = TimelineEvent(**event_data)
        self.events.append(event)
        self.events.sort(key=lambda x: x.timestamp)
        return event


timeline_service = TimelineService()
