import { forwardGet } from '@/lib/api-forwarder'

export async function GET() {
  return forwardGet('/api/cameras', [
    { camera_id: 'CAM_01', name: 'Indiranagar 100ft Road North', latitude: 12.9716, longitude: 77.6412, road_id: 'ROAD-101', status: 'ONLINE', fps: 29.8, active_vehicles: 42 },
    { camera_id: 'CAM_02', name: 'Indiranagar 12th Main Crossing', latitude: 12.9735, longitude: 77.6438, road_id: 'ROAD-102', status: 'ONLINE', fps: 30.0, active_vehicles: 28 },
    { camera_id: 'CAM_03', name: 'Old Airport Road / Domlur Inflow', latitude: 12.9610, longitude: 77.6385, road_id: 'ROAD-103', status: 'ONLINE', fps: 29.5, active_vehicles: 67 },
    { camera_id: 'CAM_04', name: 'MG Road / Trinity Circle', latitude: 12.9733, longitude: 77.6205, road_id: 'ROAD-104', status: 'ONLINE', fps: 29.9, active_vehicles: 54 },
    { camera_id: 'CAM_05', name: 'Koramangala 80ft Road Junction', latitude: 12.9352, longitude: 77.6245, road_id: 'ROAD-105', status: 'ONLINE', fps: 29.7, active_vehicles: 39 },
    { camera_id: 'CAM_06', name: 'Outer Ring Road / Marathahalli', latitude: 12.9560, longitude: 77.7011, road_id: 'ROAD-106', status: 'ONLINE', fps: 30.0, active_vehicles: 88 },
    { camera_id: 'CAM_07', name: 'Whitefield ITPL Main Gate', latitude: 12.9855, longitude: 77.7280, road_id: 'ROAD-107', status: 'ONLINE', fps: 28.9, active_vehicles: 71 },
    { camera_id: 'CAM_08', name: 'Bellandur EcoSpace Transit Hub', latitude: 12.9260, longitude: 77.6762, road_id: 'ROAD-108', status: 'ONLINE', fps: 29.6, active_vehicles: 82 },
  ])
}
