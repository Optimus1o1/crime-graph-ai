"""
UrbanTwin AI — Comprehensive Demo Dataset.
Follows the technical blueprint (PDF pages 1–9):
8 traffic cameras, 14 road segments, vehicle detections with YOLO bounding boxes,
multi-object tracking IDs, ANPR plate observations, cross-camera vehicle matching
with multi-signal confidence scoring, 5/15/30-min predictions, traffic anomalies,
and what-if simulation scenario baselines.
"""
from typing import Dict, Any, List

# ============================================================
# 1. Cameras (Module 1 — Camera Ingestion)
# ============================================================
CAMERAS_DATA: List[Dict[str, Any]] = [
    {
        "camera_id": "CAM_01",
        "name": "Indiranagar 100ft Road North Junction",
        "latitude": 12.9716,
        "longitude": 77.6412,
        "road_id": "ROAD-101",
        "road_name": "100ft Road Arterial",
        "stream_url": "rtsp://sim.urbantwin.internal/stream/cam01",
        "fps": 29.8,
        "status": "ONLINE",
        "direction": "SOUTHBOUND",
        "active_vehicles": 42,
        "total_detections_today": 18450,
    },
    {
        "camera_id": "CAM_02",
        "name": "Indiranagar 12th Main Crossing",
        "latitude": 12.9735,
        "longitude": 77.6438,
        "road_id": "ROAD-102",
        "road_name": "12th Main Corridor",
        "stream_url": "rtsp://sim.urbantwin.internal/stream/cam02",
        "fps": 30.0,
        "status": "ONLINE",
        "direction": "EASTBOUND",
        "active_vehicles": 28,
        "total_detections_today": 12890,
    },
    {
        "camera_id": "CAM_03",
        "name": "Old Airport Road / Domlur Flyover Inflow",
        "latitude": 12.9610,
        "longitude": 77.6385,
        "road_id": "ROAD-103",
        "road_name": "Airport Transit Corridor",
        "stream_url": "rtsp://sim.urbantwin.internal/stream/cam03",
        "fps": 29.5,
        "status": "ONLINE",
        "direction": "EASTBOUND",
        "active_vehicles": 67,
        "total_detections_today": 26400,
    },
    {
        "camera_id": "CAM_04",
        "name": "MG Road / Trinity Circle Intersection",
        "latitude": 12.9733,
        "longitude": 77.6205,
        "road_id": "ROAD-104",
        "road_name": "Central Business District Link",
        "stream_url": "rtsp://sim.urbantwin.internal/stream/cam04",
        "fps": 29.9,
        "status": "ONLINE",
        "direction": "WESTBOUND",
        "active_vehicles": 54,
        "total_detections_today": 23100,
    },
    {
        "camera_id": "CAM_05",
        "name": "Koramangala 80ft Road Junction",
        "latitude": 12.9352,
        "longitude": 77.6245,
        "road_id": "ROAD-105",
        "road_name": "Tech Corridor Connector",
        "stream_url": "rtsp://sim.urbantwin.internal/stream/cam05",
        "fps": 29.7,
        "status": "ONLINE",
        "direction": "SOUTHBOUND",
        "active_vehicles": 39,
        "total_detections_today": 16780,
    },
    {
        "camera_id": "CAM_06",
        "name": "Outer Ring Road / Marathahalli Bridge",
        "latitude": 12.9560,
        "longitude": 77.7011,
        "road_id": "ROAD-106",
        "road_name": "Outer Ring Express Corridor",
        "stream_url": "rtsp://sim.urbantwin.internal/stream/cam06",
        "fps": 30.0,
        "status": "ONLINE",
        "direction": "NORTHBOUND",
        "active_vehicles": 88,
        "total_detections_today": 34900,
    },
    {
        "camera_id": "CAM_07",
        "name": "Whitefield ITPL Main Gate Crossing",
        "latitude": 12.9855,
        "longitude": 77.7280,
        "road_id": "ROAD-107",
        "road_name": "Whitefield Tech Boulevard",
        "stream_url": "rtsp://sim.urbantwin.internal/stream/cam07",
        "fps": 28.9,
        "status": "ONLINE",
        "direction": "EASTBOUND",
        "active_vehicles": 71,
        "total_detections_today": 28600,
    },
    {
        "camera_id": "CAM_08",
        "name": "Bellandur EcoSpace Transit Hub",
        "latitude": 12.9260,
        "longitude": 77.6762,
        "road_id": "ROAD-108",
        "road_name": "Bellandur Rapid Transit",
        "stream_url": "rtsp://sim.urbantwin.internal/stream/cam08",
        "fps": 29.6,
        "status": "ONLINE",
        "direction": "NORTHBOUND",
        "active_vehicles": 82,
        "total_detections_today": 31200,
    }
]

# ============================================================
# 2. Road Network Graph (Module 6 — Road Network Graph)
# ============================================================
ROADS_DATA: List[Dict[str, Any]] = [
    {
        "road_id": "ROAD-101",
        "name": "100ft Road Arterial",
        "start_node": "JCT_INDIRA_N",
        "end_node": "JCT_INDIRA_S",
        "length_km": 2.4,
        "speed_limit_kmh": 50,
        "current_vehicles": 87,
        "average_speed": 19.4,
        "density": "High",
        "travel_time_min": 6.2,
        "congestion_pct": 78,
        "connected_camera_ids": ["CAM_01", "CAM_02"],
    },
    {
        "road_id": "ROAD-102",
        "name": "12th Main Corridor",
        "start_node": "JCT_INDIRA_S",
        "end_node": "JCT_DOMLUR",
        "length_km": 1.8,
        "speed_limit_kmh": 45,
        "current_vehicles": 44,
        "average_speed": 28.0,
        "density": "Medium",
        "travel_time_min": 3.8,
        "congestion_pct": 42,
        "connected_camera_ids": ["CAM_02"],
    },
    {
        "road_id": "ROAD-103",
        "name": "Airport Transit Corridor",
        "start_node": "JCT_DOMLUR",
        "end_node": "JCT_AIRPORT",
        "length_km": 4.5,
        "speed_limit_kmh": 60,
        "current_vehicles": 142,
        "average_speed": 18.2,
        "density": "Critical",
        "travel_time_min": 14.8,
        "congestion_pct": 86,
        "connected_camera_ids": ["CAM_03"],
    },
    {
        "road_id": "ROAD-104",
        "name": "Central Business District Link",
        "start_node": "JCT_MG_ROAD",
        "end_node": "JCT_INDIRA_N",
        "length_km": 3.2,
        "speed_limit_kmh": 50,
        "current_vehicles": 96,
        "average_speed": 24.5,
        "density": "Medium-High",
        "travel_time_min": 7.8,
        "congestion_pct": 62,
        "connected_camera_ids": ["CAM_04"],
    },
    {
        "road_id": "ROAD-105",
        "name": "Tech Corridor Connector",
        "start_node": "JCT_DOMLUR",
        "end_node": "JCT_KORAMANGALA",
        "length_km": 3.8,
        "speed_limit_kmh": 50,
        "current_vehicles": 78,
        "average_speed": 31.0,
        "density": "Medium",
        "travel_time_min": 7.3,
        "congestion_pct": 48,
        "connected_camera_ids": ["CAM_05"],
    },
    {
        "road_id": "ROAD-106",
        "name": "Outer Ring Express Corridor",
        "start_node": "JCT_MARATHAHALLI",
        "end_node": "JCT_BELLANDUR",
        "length_km": 5.6,
        "speed_limit_kmh": 70,
        "current_vehicles": 180,
        "average_speed": 22.0,
        "density": "Critical",
        "travel_time_min": 15.2,
        "congestion_pct": 82,
        "connected_camera_ids": ["CAM_06", "CAM_08"],
    },
    {
        "road_id": "ROAD-107",
        "name": "Whitefield Tech Boulevard",
        "start_node": "JCT_MARATHAHALLI",
        "end_node": "JCT_WHITEFIELD",
        "length_km": 4.2,
        "speed_limit_kmh": 50,
        "current_vehicles": 115,
        "average_speed": 16.5,
        "density": "Critical",
        "travel_time_min": 15.3,
        "congestion_pct": 89,
        "connected_camera_ids": ["CAM_07"],
    },
    {
        "road_id": "ROAD-108",
        "name": "Bellandur Rapid Transit",
        "start_node": "JCT_BELLANDUR",
        "end_node": "JCT_KORAMANGALA",
        "length_km": 3.5,
        "speed_limit_kmh": 60,
        "current_vehicles": 124,
        "average_speed": 21.5,
        "density": "High",
        "travel_time_min": 9.7,
        "congestion_pct": 74,
        "connected_camera_ids": ["CAM_08"],
    },
]

# ============================================================
# 3. Cross-Camera Vehicle Trajectories (Module 5 & Module 7)
# ============================================================
VEHICLE_TRAJECTORIES_DATA: List[Dict[str, Any]] = [
    {
        "global_vehicle_id": "V1023",
        "vehicle_type": "car",
        "model": "White Toyota Fortuner",
        "plate_number": "KA-01-MJ-4040",
        "first_seen": "2026-09-04 00:15:10",
        "last_seen": "2026-09-04 00:48:32",
        "total_travel_time_min": 33.3,
        "status": "ACTIVE_IN_TRANSIT",
        "camera_sequence": [
            {
                "camera_id": "CAM_01",
                "camera_name": "Indiranagar 100ft Road North",
                "timestamp": "2026-09-04 00:15:10",
                "speed_kmh": 38.2,
                "lane": 2,
                "bbox": [421, 238, 510, 320],
                "confidence": 0.94,
            },
            {
                "camera_id": "CAM_03",
                "camera_name": "Old Airport Road / Domlur Flyover",
                "timestamp": "2026-09-04 00:26:45",
                "speed_kmh": 28.5,
                "lane": 1,
                "bbox": [380, 190, 465, 275],
                "confidence": 0.92,
            },
            {
                "camera_id": "CAM_06",
                "camera_name": "Outer Ring Road / Marathahalli",
                "timestamp": "2026-09-04 00:39:10",
                "speed_kmh": 32.0,
                "lane": 3,
                "bbox": [512, 305, 604, 395],
                "confidence": 0.91,
            },
            {
                "camera_id": "CAM_07",
                "camera_name": "Whitefield ITPL Main Gate",
                "timestamp": "2026-09-04 00:48:32",
                "speed_kmh": 14.5,
                "lane": 2,
                "bbox": [449, 250, 538, 335],
                "confidence": 0.89,
            }
        ],
        "multi_signal_matching": {
            "plate_similarity": 0.95,
            "vehicle_type_match": 0.90,
            "appearance_features": 0.81,
            "travel_time_plausibility": 0.87,
            "route_consistency": 0.92,
            "final_confidence_score": 0.91,
        }
    },
    {
        "global_vehicle_id": "V1044",
        "vehicle_type": "truck",
        "model": "Tata LPK Logistics Hauler",
        "plate_number": "KA-51-B-9912",
        "first_seen": "2026-09-04 00:08:20",
        "last_seen": "2026-09-04 00:35:10",
        "total_travel_time_min": 26.8,
        "status": "COMPLETED_ROUTE",
        "camera_sequence": [
            {
                "camera_id": "CAM_04",
                "camera_name": "MG Road / Trinity Circle",
                "timestamp": "2026-09-04 00:08:20",
                "speed_kmh": 22.1,
                "lane": 1,
                "bbox": [210, 180, 390, 360],
                "confidence": 0.95,
            },
            {
                "camera_id": "CAM_01",
                "camera_name": "Indiranagar 100ft Road North",
                "timestamp": "2026-09-04 00:19:40",
                "speed_kmh": 18.0,
                "lane": 1,
                "bbox": [280, 210, 460, 390],
                "confidence": 0.93,
            },
            {
                "camera_id": "CAM_03",
                "camera_name": "Old Airport Road / Domlur",
                "timestamp": "2026-09-04 00:35:10",
                "speed_kmh": 20.4,
                "lane": 2,
                "bbox": [320, 240, 500, 410],
                "confidence": 0.90,
            }
        ],
        "multi_signal_matching": {
            "plate_similarity": 0.92,
            "vehicle_type_match": 0.95,
            "appearance_features": 0.88,
            "travel_time_plausibility": 0.85,
            "route_consistency": 0.90,
            "final_confidence_score": 0.90,
        }
    },
    {
        "global_vehicle_id": "V1089",
        "vehicle_type": "bus",
        "model": "BMTC Volvo Electric Transit",
        "plate_number": "KA-57-F-2210",
        "first_seen": "2026-09-04 00:25:00",
        "last_seen": "2026-09-04 00:52:14",
        "total_travel_time_min": 27.2,
        "status": "ACTIVE_IN_TRANSIT",
        "camera_sequence": [
            {
                "camera_id": "CAM_05",
                "camera_name": "Koramangala 80ft Road",
                "timestamp": "2026-09-04 00:25:00",
                "speed_kmh": 30.2,
                "lane": 1,
                "bbox": [150, 160, 360, 390],
                "confidence": 0.97,
            },
            {
                "camera_id": "CAM_08",
                "camera_name": "Bellandur EcoSpace Hub",
                "timestamp": "2026-09-04 00:38:50",
                "speed_kmh": 19.8,
                "lane": 2,
                "bbox": [180, 170, 390, 400],
                "confidence": 0.94,
            },
            {
                "camera_id": "CAM_06",
                "camera_name": "Outer Ring Road / Marathahalli",
                "timestamp": "2026-09-04 00:52:14",
                "speed_kmh": 16.0,
                "lane": 1,
                "bbox": [200, 185, 410, 415],
                "confidence": 0.92,
            }
        ],
        "multi_signal_matching": {
            "plate_similarity": 0.96,
            "vehicle_type_match": 0.98,
            "appearance_features": 0.92,
            "travel_time_plausibility": 0.91,
            "route_consistency": 0.94,
            "final_confidence_score": 0.94,
        }
    }
]

# ============================================================
# 4. Traffic Predictions (Module 7 — Traffic Prediction)
# 5, 15, and 30-minute horizons
# ============================================================
PREDICTIONS_DATA: List[Dict[str, Any]] = [
    {
        "road_id": "ROAD-101",
        "road_name": "100ft Road Arterial",
        "current_congestion": 78,
        "current_speed_kmh": 19.4,
        "predictions": {
            "5_min": {"congestion": 82, "speed_kmh": 17.5, "delta": "+4%"},
            "15_min": {"congestion": 87, "speed_kmh": 14.8, "delta": "+9%"},
            "30_min": {"congestion": 91, "speed_kmh": 12.0, "delta": "+13%"},
        },
        "model": "Temporal Transformer / XGBoost Ensemble",
        "metrics": {"mae": 2.4, "rmse": 3.8, "mape": "4.2%"}
    },
    {
        "road_id": "ROAD-103",
        "road_name": "Airport Transit Corridor",
        "current_congestion": 86,
        "current_speed_kmh": 18.2,
        "predictions": {
            "5_min": {"congestion": 89, "speed_kmh": 16.0, "delta": "+3%"},
            "15_min": {"congestion": 94, "speed_kmh": 11.5, "delta": "+8%"},
            "30_min": {"congestion": 85, "speed_kmh": 19.0, "delta": "-1%"},
        },
        "model": "Temporal Transformer / XGBoost Ensemble",
        "metrics": {"mae": 2.6, "rmse": 4.1, "mape": "4.6%"}
    },
    {
        "road_id": "ROAD-106",
        "road_name": "Outer Ring Express Corridor",
        "current_congestion": 82,
        "current_speed_kmh": 22.0,
        "predictions": {
            "5_min": {"congestion": 85, "speed_kmh": 20.2, "delta": "+3%"},
            "15_min": {"congestion": 90, "speed_kmh": 15.6, "delta": "+8%"},
            "30_min": {"congestion": 76, "speed_kmh": 26.5, "delta": "-6%"},
        },
        "model": "Temporal Transformer / XGBoost Ensemble",
        "metrics": {"mae": 2.1, "rmse": 3.5, "mape": "3.9%"}
    },
    {
        "road_id": "ROAD-107",
        "road_name": "Whitefield Tech Boulevard",
        "current_congestion": 89,
        "current_speed_kmh": 16.5,
        "predictions": {
            "5_min": {"congestion": 92, "speed_kmh": 14.1, "delta": "+3%"},
            "15_min": {"congestion": 95, "speed_kmh": 10.8, "delta": "+6%"},
            "30_min": {"congestion": 88, "speed_kmh": 17.0, "delta": "-1%"},
        },
        "model": "Temporal Transformer / XGBoost Ensemble",
        "metrics": {"mae": 2.8, "rmse": 4.3, "mape": "5.1%"}
    }
]

# ============================================================
# 5. Traffic Anomalies (Module 8 — Anomaly Detection)
# ============================================================
ANOMALIES_DATA: List[Dict[str, Any]] = [
    {
        "anomaly_id": "ANOM-TRAF-01",
        "camera_id": "CAM_07",
        "road_id": "ROAD-107",
        "road_name": "Whitefield Tech Boulevard",
        "location": "Sector 5 -> Junction B",
        "type": "SUDDEN_SPEED_COLLAPSE",
        "severity": "CRITICAL",
        "expected_speed_kmh": 42.0,
        "current_speed_kmh": 11.0,
        "anomaly_score": 0.94,
        "timestamp": "2026-09-04 00:44:12",
        "root_cause_hypothesis": "Multi-vehicle stall near ITPL Main Gate causing 1.4km bottleneck spillover.",
        "recommended_action": "Reroute outbound freight to Outer Ring Connector; extend Junction B green signal from 30s to 50s.",
    },
    {
        "anomaly_id": "ANOM-TRAF-02",
        "camera_id": "CAM_03",
        "road_id": "ROAD-103",
        "road_name": "Airport Transit Corridor",
        "location": "Domlur Flyover Inflow",
        "type": "ABNORMAL_QUEUE_LENGTH",
        "severity": "HIGH",
        "expected_speed_kmh": 52.0,
        "current_speed_kmh": 18.2,
        "anomaly_score": 0.88,
        "timestamp": "2026-09-04 00:36:00",
        "root_cause_hypothesis": "Ramp surge from Indiranagar feeder road exceeding flyover merge capacity.",
        "recommended_action": "Activate ramp metering on Indiranagar slip lane; dispatch patrol motorcycle unit.",
    },
    {
        "anomaly_id": "ANOM-TRAF-03",
        "camera_id": "CAM_06",
        "road_id": "ROAD-106",
        "road_name": "Outer Ring Express Corridor",
        "location": "Marathahalli Underpass",
        "type": "DENSITY_SPIKE_CONTRACTION",
        "severity": "HIGH",
        "expected_speed_kmh": 65.0,
        "current_speed_kmh": 22.0,
        "anomaly_score": 0.85,
        "timestamp": "2026-09-04 00:40:15",
        "root_cause_hypothesis": "Heavy logistics transport breakdown occupying lane 2.",
        "recommended_action": "Issue VMS alert on Outer Ring Road displays; dispatch recovery crane.",
    },
    {
        "anomaly_id": "ANOM-TRAF-04",
        "camera_id": "CAM_01",
        "road_id": "ROAD-101",
        "road_name": "100ft Road Arterial",
        "location": "North Crossing Feeder",
        "type": "TEMPORAL_VOLUME_ANOMALY",
        "severity": "MEDIUM",
        "expected_speed_kmh": 40.0,
        "current_speed_kmh": 24.0,
        "anomaly_score": 0.76,
        "timestamp": "2026-09-04 00:22:00",
        "root_cause_hypothesis": "Unusual post-midnight delivery vehicle cluster departing indiranagar depot.",
        "recommended_action": "Log vehicle plates for municipal transit permit verification.",
    }
]

# ============================================================
# 6. What-If Simulation Scenarios (Module 13 — Killer Feature)
# ============================================================
WHAT_IF_SCENARIOS = {
    "baseline": {
        "scenario_name": "Current Network Status",
        "congestion_pct": 64,
        "average_speed_kmh": 26.0,
        "average_delay_min": 8.2,
        "affected_corridors": 8,
    },
    "road_closure_road_a": {
        "scenario_name": "Close Road A (100ft Road Arterial Maintenance)",
        "inputs": {
            "closed_roads": ["ROAD-101"],
            "traffic_shift_target": "ROAD-102 & ROAD-104",
            "traffic_volume_delta": "0%"
        },
        "before": {"congestion": "64%", "avg_speed": "26 km/h", "delay": "8.2 min"},
        "after": {"congestion": "79%", "avg_speed": "18 km/h", "delay": "14.6 min"},
        "delta": {"congestion": "+15%", "avg_speed": "-8 km/h", "delay": "+6.4 min"},
        "impact_summary": "Closing Road A causes immediate saturation on 12th Main and CBD Link, increasing peak delay by 78%."
    },
    "traffic_surge_20": {
        "scenario_name": "Traffic Surge: +20% Volume across City Network",
        "inputs": {
            "traffic_volume_delta": "+20%",
            "signal_timing_mode": "FIXED_CYCLE"
        },
        "before": {"congestion": "64%", "avg_speed": "26 km/h", "delay": "8.2 min"},
        "after": {"congestion": "76%", "avg_speed": "21 km/h", "delay": "12.4 min"},
        "delta": {"congestion": "+12%", "avg_speed": "-5 km/h", "delay": "+4.2 min"},
        "impact_summary": "20% demand increase trips Airport Corridor and Outer Ring Road past critical breakdown density."
    },
    "signal_optimization_junction_a": {
        "scenario_name": "Junction A Signal Timing: 30 sec -> 40 sec Green",
        "inputs": {
            "junction_id": "JCT_INDIRA_N",
            "green_time_seconds": 40,
            "previous_green_seconds": 30
        },
        "before": {"congestion": "64%", "avg_speed": "26 km/h", "delay": "8.2 min"},
        "after": {"congestion": "51%", "avg_speed": "31 km/h", "delay": "6.4 min"},
        "delta": {"congestion": "-13%", "avg_speed": "+5 km/h", "delay": "-1.8 min"},
        "impact_summary": "Extending green time by 10s flushes arterial queues before cross-street gridlock locks the junction."
    }
}
