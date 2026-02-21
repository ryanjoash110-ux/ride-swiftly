import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const pickupIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const dropoffIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const driverIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface LatLng {
  lat: number;
  lng: number;
}

interface LeafletMapProps {
  center?: LatLng;
  zoom?: number;
  pickup?: LatLng | null;
  dropoff?: LatLng | null;
  driverLocations?: LatLng[];
  showUserLocation?: boolean;
  className?: string;
  onMapClick?: (latlng: LatLng) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center = { lat: 12.9716, lng: 77.5946 }, // Bangalore default
  zoom = 13,
  pickup,
  dropoff,
  driverLocations = [],
  showUserLocation = true,
  className = "",
  onMapClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routeRef = useRef<L.Polyline | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  // Get user location
  useEffect(() => {
    if (!showUserLocation) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
        },
        () => console.log("Geolocation denied"),
        { enableHighAccuracy: true }
      );
    }
  }, [showUserLocation]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [userLocation?.lat || center.lat, userLocation?.lng || center.lng],
      zoom,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    if (onMapClick) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    mapInstanceRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when user location is found
  useEffect(() => {
    if (userLocation && mapInstanceRef.current && !pickup && !dropoff) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14);
    }
  }, [userLocation, pickup, dropoff]);

  // Update markers & route
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;

    markers.clearLayers();
    if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }

    // User location
    if (userLocation && !pickup) {
      const circle = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        fillColor: "hsl(145, 63%, 42%)",
        color: "white",
        weight: 3,
        fillOpacity: 1,
      }).bindPopup("You are here");
      markers.addLayer(circle);
    }

    // Pickup marker
    if (pickup) {
      const m = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).bindPopup("Pickup");
      markers.addLayer(m);
    }

    // Dropoff marker
    if (dropoff) {
      const m = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon }).bindPopup("Drop-off");
      markers.addLayer(m);
    }

    // Driver markers
    driverLocations.forEach((loc, i) => {
      const m = L.marker([loc.lat, loc.lng], { icon: driverIcon }).bindPopup(`Driver ${i + 1}`);
      markers.addLayer(m);
    });

    // Draw route line between pickup and dropoff
    if (pickup && dropoff) {
      const routeLine = L.polyline(
        [
          [pickup.lat, pickup.lng],
          [(pickup.lat + dropoff.lat) / 2 + 0.005, (pickup.lng + dropoff.lng) / 2 + 0.008],
          [dropoff.lat, dropoff.lng],
        ],
        { color: "hsl(145, 63%, 42%)", weight: 4, opacity: 0.8, dashArray: "10 6" }
      );
      routeLine.addTo(map);
      routeRef.current = routeLine;

      // Fit bounds
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
      ]);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [pickup, dropoff, driverLocations, userLocation]);

  return <div ref={mapRef} className={`w-full h-full ${className}`} />;
};

export default LeafletMap;
