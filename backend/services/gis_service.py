"""
GIS & Spatial Intelligence Service for CrimeGraph AI.
Manages crime scenes, safehouses, tower ping radiuses, ANPR camera sighting pins,
and co-location spatial analytics.
"""

from typing import List, Optional, Dict, Any
from backend.models.schemas import GISLocationFeature
from backend.data.seed_data import GIS_FEATURES_DATA


class GISService:
    def __init__(self):
        self.features: List[GISLocationFeature] = [GISLocationFeature(**f) for f in GIS_FEATURES_DATA]

    def get_features(
        self,
        feature_types: Optional[List[str]] = None,
        entity_id: Optional[str] = None
    ) -> List[GISLocationFeature]:
        """Returns filtered geospatial features."""
        filtered = []
        for feat in self.features:
            if feature_types and feat.type not in feature_types:
                continue
            if entity_id and entity_id not in feat.associated_entities:
                continue
            filtered.append(feat)
        return filtered

    def add_feature(self, feature_data: Dict[str, Any]) -> GISLocationFeature:
        feat = GISLocationFeature(**feature_data)
        self.features.append(feat)
        return feat


gis_service = GISService()
