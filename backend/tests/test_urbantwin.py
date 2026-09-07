"""
UrbanTwin AI — Backend Test Suite.
Tests camera ingestion, cross-camera vehicle matching with multi-signal confidence scores,
traffic state analytics, 5/15/30-min predictions, anomaly detection, and what-if simulation.
"""
import pytest
from backend.services.urbantwin_service import urbantwin_service


def test_cameras_retrieval():
    cameras = urbantwin_service.get_cameras()
    assert len(cameras) >= 8
    cam1 = next(c for c in cameras if c["camera_id"] == "CAM_01")
    assert "Indiranagar" in cam1["name"]
    assert cam1["status"] == "ONLINE"
    assert cam1["fps"] > 25.0


def test_camera_detail_and_detections():
    cam = urbantwin_service.get_camera("CAM_01")
    assert cam is not None
    assert "live_detections" in cam
    assert len(cam["live_detections"]) >= 3
    det0 = cam["live_detections"][0]
    assert "bbox" in det0
    assert "confidence" in det0
    assert det0["confidence"] > 0.85


def test_traffic_current():
    status = urbantwin_service.get_traffic_current()
    assert "network_congestion_pct" in status
    assert "average_network_speed_kmh" in status
    assert status["active_cameras"] >= 8
    assert status["total_tracked_vehicles"] > 100


def test_cross_camera_vehicle_trajectory():
    traj = urbantwin_service.get_vehicle_trajectory("V1023")
    assert traj is not None
    assert traj["global_vehicle_id"] == "V1023"
    assert len(traj["camera_sequence"]) >= 3
    # Check multi-signal confidence scoring (Module 5 from PDF)
    matching = traj["multi_signal_matching"]
    assert matching["plate_similarity"] == 0.95
    assert matching["vehicle_type_match"] == 0.90
    assert matching["appearance_features"] == 0.81
    assert matching["travel_time_plausibility"] == 0.87
    assert matching["route_consistency"] == 0.92
    assert matching["final_confidence_score"] == 0.91


def test_predictions_5_15_30_min():
    preds = urbantwin_service.get_predictions()
    assert len(preds) > 0
    p0 = preds[0]
    assert "predictions" in p0
    assert "5_min" in p0["predictions"]
    assert "15_min" in p0["predictions"]
    assert "30_min" in p0["predictions"]


def test_traffic_anomalies():
    anomalies = urbantwin_service.get_anomalies()
    assert len(anomalies) >= 3
    # Verify sudden speed collapse (Sector 5 -> Junction B)
    anom1 = next(a for a in anomalies if a["anomaly_id"] == "ANOM-TRAF-01")
    assert anom1["expected_speed_kmh"] == 42.0
    assert anom1["current_speed_kmh"] == 11.0
    assert anom1["anomaly_score"] == 0.94


def test_what_if_simulation_killer_feature():
    # Test pre-configured scenario
    res = urbantwin_service.run_simulation("signal_optimization_junction_a")
    assert "before" in res and "after" in res and "delta" in res
    assert res["before"]["congestion"] == "64%"
    assert res["after"]["congestion"] == "51%"
    assert res["delta"]["congestion"] == "-13%"

    # Test custom dynamic simulation
    custom_res = urbantwin_service.run_simulation("custom", {
        "traffic_increase_pct": 20,
        "close_road_a": True,
        "green_time_seconds": 35
    })
    assert "before" in custom_res and "after" in custom_res
    assert custom_res["after"]["congestion"] != custom_res["before"]["congestion"]
