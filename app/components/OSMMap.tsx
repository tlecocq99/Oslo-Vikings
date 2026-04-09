"use client";

import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const KNOWN_COORDS: Record<string, [number, number]> = {
  stadium: [59.927581, 10.70957], // Middelthuns gate 26, 0368 Oslo
  office: [59.929873, 10.756192], // Mølleparken 4, 0459 Oslo
  gym: [59.914433, 10.727493], // Kronprinsens gate 5, 0251 Oslo
  "nih-field": [59.966746, 10.732216], // Sognsveien 220, 0863 Oslo
};

const DEFAULT_ICON = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SELECTED_ICON = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type MapLocation = { id: string; title: string; address: string };

type OSMMapProps = {
  locations: MapLocation[];
  height?: number | string;
  initialSelectedId?: string;
};

function buildDirectionsUrl(loc: MapLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.address)}`;
}

function buildOSMUrl(loc: MapLocation): string {
  const coords = KNOWN_COORDS[loc.id];
  return coords
    ? `https://www.openstreetmap.org/?mlat=${coords[0]}&mlon=${coords[1]}&zoom=16`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(loc.address)}`;
}

export default function OSMMap({
  locations,
  height = 384,
  initialSelectedId,
}: OSMMapProps) {
  const heightPx = typeof height === "number" ? `${height}px` : height;
  const initialId =
    initialSelectedId && locations.some((l) => l.id === initialSelectedId)
      ? initialSelectedId
      : (locations[0]?.id ?? null);

  const [selectedId, setSelectedId] = React.useState<string | null>(initialId);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<L.Map | null>(null);
  const markersRef = React.useRef<Record<string, L.Marker>>({});

  React.useEffect(() => {
    if (!initialSelectedId) return;
    if (locations.some((l) => l.id === initialSelectedId))
      setSelectedId(initialSelectedId);
  }, [initialSelectedId, locations]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const center: L.LatLngExpression = (initialId &&
      KNOWN_COORDS[initialId]) || [59.9139, 10.7522];
    const map = L.map(container, { center, zoom: 13, scrollWheelZoom: false });
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(map);
    locations.forEach((loc) => {
      const coords = KNOWN_COORDS[loc.id];
      if (!coords) return;
      const marker = L.marker(coords, {
        icon: loc.id === initialId ? SELECTED_ICON : DEFAULT_ICON,
      }).addTo(map);
      marker.bindPopup(
        `<div style='min-width:160px;font-size:13px;line-height:1.5'><p style='font-weight:600;margin:0 0 2px'>${loc.title}</p><p style='color:#555;margin:0 0 6px'>${loc.address}</p><a href='${buildDirectionsUrl(loc)}' target='_blank' rel='noopener noreferrer' style='color:#c0392b;font-weight:500;text-decoration:none'>Get Directions ↗</a></div>`,
      );
      marker.on("click", () => setSelectedId(loc.id));
      markersRef.current[loc.id] = marker;
    });
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.setIcon(id === selectedId ? SELECTED_ICON : DEFAULT_ICON);
    });
    if (selectedId) {
      const coords = KNOWN_COORDS[selectedId];
      if (coords) map.setView(coords, 15, { animate: true });
    }
  }, [selectedId]);

  const selectedLocation = locations.find((l) => l.id === selectedId);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <select
          className="border rounded-md px-2 py-1 text-sm bg-white dark:bg-viking-surface dark:text-gray-100 dark:border-gray-600"
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
        {selectedLocation && (
          <>
            <a
              href={buildDirectionsUrl(selectedLocation)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-viking-red text-white text-sm hover:bg-viking-red/90 transition-colors"
            >
              Get Directions
            </a>
            <a
              href={buildOSMUrl(selectedLocation)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-sm dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Open in OpenStreetMap
            </a>
          </>
        )}
      </div>
      <div
        ref={containerRef}
        style={{ height: heightPx, position: "relative", zIndex: 0 }}
        className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      />
    </div>
  );
}
