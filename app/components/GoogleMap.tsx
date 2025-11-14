"use client";
import React from "react";

type LocationInput =
  | { id: string; title: string; address: string }
  | { id: string; title: string; lat: number; lng: number };

type GoogleMapProps = {
  apiKey?: string;
  locations: LocationInput[];
  height?: number | string;
  initialSelectedId?: string;
};

declare global {
  interface Window {
    google?: any;
  }
}

let googleMapsScriptLoadingPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (googleMapsScriptLoadingPromise) {
    return googleMapsScriptLoadingPromise;
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[data-google-maps-loader="true"]'
  );

  if (existingScript) {
    googleMapsScriptLoadingPromise = new Promise((resolve, reject) => {
      const handleLoad = () => {
        existingScript.setAttribute("data-loaded", "true");
        resolve();
      };
      const handleError = () => {
        googleMapsScriptLoadingPromise = null;
        reject(new Error("Failed to load Google Maps script."));
      };

      if (existingScript.getAttribute("data-loaded") === "true") {
        handleLoad();
        return;
      }

      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
    });

    return googleMapsScriptLoadingPromise;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.setAttribute("data-google-maps-loader", "true");

  googleMapsScriptLoadingPromise = new Promise((resolve, reject) => {
    const handleLoad = () => {
      script.setAttribute("data-loaded", "true");
      resolve();
    };
    const handleError = () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
      script.remove();
      googleMapsScriptLoadingPromise = null;
      reject(new Error("Failed to load Google Maps script."));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
  });

  document.head.appendChild(script);
  return googleMapsScriptLoadingPromise;
}

export default function GoogleMap({
  apiKey,
  locations,
  height = 384,
  initialSelectedId,
}: GoogleMapProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<any>(null);
  const directionsServiceRef = React.useRef<any>(null);
  const directionsRendererRef = React.useRef<any>(null);
  const markersRef = React.useRef<any[]>([]);
  const markerByIdRef = React.useRef<Record<string, any>>({});
  const initialSelection = React.useMemo(() => {
    if (
      initialSelectedId &&
      locations.some((location) => location.id === initialSelectedId)
    ) {
      return initialSelectedId;
    }
    return locations[0]?.id ?? null;
  }, [initialSelectedId, locations]);

  const [selectedId, setSelectedId] = React.useState<string | null>(
    initialSelection
  );
  const [userPos, setUserPos] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [status, setStatus] = React.useState<string>("");
  const [isScriptReady, setIsScriptReady] = React.useState(false);

  const publicKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  React.useEffect(() => {
    if (!initialSelectedId) return;
    const exists = locations.some(
      (location) => location.id === initialSelectedId
    );
    if (exists && selectedId !== initialSelectedId) {
      setSelectedId(initialSelectedId);
    }
  }, [initialSelectedId, locations, selectedId]);

  React.useEffect(() => {
    if (!selectedId && locations.length) {
      setSelectedId(locations[0].id);
    } else if (
      selectedId &&
      !locations.some((location) => location.id === selectedId)
    ) {
      setSelectedId(locations[0]?.id ?? null);
    }
  }, [locations, selectedId]);

  // Load Google Maps script once
  React.useEffect(() => {
    if (!publicKey) {
      setStatus(
        "Missing Google Maps API key. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY."
      );
      return;
    }

    let isCancelled = false;

    loadGoogleMapsScript(publicKey)
      .then(() => {
        if (!isCancelled) {
          setIsScriptReady(true);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          setStatus(error.message || "Failed to load Google Maps script.");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [publicKey]);

  // Initialize map and content
  const initMap = React.useCallback(() => {
    if (!containerRef.current || !window.google?.maps) return;
    const center = { lat: 59.927, lng: 10.735 }; // Oslo approx
    mapRef.current = new window.google.maps.Map(containerRef.current, {
      center,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
    directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false,
    });
    directionsRendererRef.current.setMap(mapRef.current);
  }, []);

  const geocodeIfNeeded = React.useCallback(
    async (
      loc: LocationInput
    ): Promise<{ lat: number; lng: number; title: string; id: string }> => {
      if ("lat" in loc && "lng" in loc)
        return { lat: loc.lat, lng: loc.lng, title: loc.title, id: loc.id };
      const address = loc.address;
      return new Promise((resolve, reject) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results: any, status: string) => {
          if (status === "OK" && results?.[0]) {
            const { lat, lng } = results[0].geometry.location;
            resolve({ lat: lat(), lng: lng(), title: loc.title, id: loc.id });
          } else {
            reject(new Error(`Geocode failed for ${address}: ${status}`));
          }
        });
      });
    },
    []
  );

  const plotLocations = React.useCallback(
    async (locs: LocationInput[]) => {
      // Clear markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      markerByIdRef.current = {};
      for (const loc of locs) {
        try {
          const { lat, lng, title, id } = await geocodeIfNeeded(loc);
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapRef.current,
            title,
          });
          marker.addListener("click", () => setSelectedId(id));
          markersRef.current.push(marker);
          markerByIdRef.current[id] = marker;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(e);
        }
      }
    },
    [geocodeIfNeeded]
  );

  const fitBoundsToMarkers = React.useCallback(() => {
    if (!markersRef.current.length || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    markersRef.current.forEach((m) => bounds.extend(m.getPosition()));
    mapRef.current.fitBounds(bounds);
  }, []);

  const locateMe = React.useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(coords);
        // Place a marker for the user
        new window.google.maps.Marker({
          position: coords,
          map: mapRef.current,
          title: "Your location",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: "#2563eb",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 2,
          },
        });
        mapRef.current.setCenter(coords);
        mapRef.current.setZoom(13);
      },
      (err) => setStatus(err.message || "Unable to retrieve your location.")
    );
  }, []);

  const renderRoute = React.useCallback(() => {
    if (!userPos || !selectedId) {
      setStatus("Select a destination and enable location first.");
      return;
    }
    const marker = markerByIdRef.current[selectedId];
    const dest = marker?.getPosition?.();
    if (!dest) {
      setStatus("Destination not found on map.");
      return;
    }
    directionsServiceRef.current.route(
      {
        origin: userPos,
        destination: dest,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result: any, status: string) => {
        if (status === "OK") {
          directionsRendererRef.current.setDirections(result);
          setStatus("");
        } else {
          setStatus(`Directions request failed: ${status}`);
        }
      }
    );
  }, [selectedId, userPos]);

  // Pan/zoom when dropdown selection changes
  React.useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const marker = markerByIdRef.current[selectedId];
    if (marker) {
      const pos = marker.getPosition();
      mapRef.current.panTo(pos);
      const currentZoom = mapRef.current.getZoom?.();
      if (!currentZoom || currentZoom < 13) {
        mapRef.current.setZoom(13);
      }
    }
  }, [selectedId]);

  const openInGoogleMaps = React.useCallback(() => {
    const dest = locations.find((l) => l.id === selectedId);
    if (!dest) return;
    const origin = userPos ? `${userPos.lat},${userPos.lng}` : "";
    const destination =
      "address" in dest
        ? encodeURIComponent(dest.address)
        : `${dest.lat},${dest.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}${
      origin ? `&origin=${origin}` : ""
    }`;
    window.open(url, "_blank");
  }, [locations, selectedId, userPos]);

  // Re-init if locations change after script ready
  React.useEffect(() => {
    if (!isScriptReady || !window.google?.maps || !containerRef.current) {
      return;
    }

    if (!mapRef.current) {
      initMap();
    }

    if (mapRef.current) {
      plotLocations(locations)
        .then(() => {
          fitBoundsToMarkers();
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn(error);
        });
    }
  }, [isScriptReady, locations, initMap, plotLocations, fitBoundsToMarkers]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <select
          className="border rounded-md px-2 py-1 text-sm bg-white dark:bg-viking-surface dark:text-gray-100"
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
        <button
          className="px-3 py-1.5 rounded-md bg-viking-red text-white text-sm hover:bg-viking-red/90"
          onClick={locateMe}
        >
          Use my location
        </button>
        <button
          className="px-3 py-1.5 rounded-md bg-viking-red-dark text-white text-sm hover:bg-viking-red"
          onClick={renderRoute}
        >
          Route
        </button>
        <button
          className="px-3 py-1.5 rounded-md border text-sm dark:text-gray-100"
          onClick={openInGoogleMaps}
        >
          Open in Google Maps
        </button>
        {status && <span className="text-xs text-gray-500">{status}</span>}
      </div>
      <div
        ref={containerRef}
        style={{ height: typeof height === "number" ? `${height}px` : height }}
        className="w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
      />
    </div>
  );
}
