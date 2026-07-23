/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Free store locator: Leaflet + OpenStreetMap tiles, Nominatim geocoding, Overpass POIs.
 * No API key or billing required.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader2, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LOCATE_EVENT } from './mapsLoader';

type PlaceResult = {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
};

const DEFAULT_CENTER = { lat: 31.5497, lng: -97.1467 }; // Waco, TX
const SEARCH_RADIUS_M = 8000;
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const OVERPASS = 'https://overpass-api.de/api/interpreter';
const USER_AGENT = 'DrPepperPortfolioSite/1.0 (fan project; contact via GitHub rohans16-cmyk/Dr.-Pepper-)';

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:9999px;background:#711F25;border:2px solid #F5F2ED;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const youIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#F5F2ED;border:3px solid #711F25;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function formatAddress(tags: Record<string, string>): string {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:city'] || tags['addr:town'],
    tags['addr:state'],
    tags['addr:postcode'],
  ].filter(Boolean);
  if (parts.length) return parts.join(' ');
  return tags.brand || tags.operator || 'Nearby store';
}

async function geocodeQuery(q: string): Promise<{ lat: number; lng: number } | null> {
  const url = `${NOMINATIM}?format=json&limit=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (!data[0]) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

async function fetchNearbyStores(center: { lat: number; lng: number }): Promise<PlaceResult[]> {
  const { lat, lng } = center;
  const query = `
[out:json][timeout:25];
(
  node["shop"="convenience"](around:${SEARCH_RADIUS_M},${lat},${lng});
  node["shop"="supermarket"](around:${SEARCH_RADIUS_M},${lat},${lng});
  way["shop"="convenience"](around:${SEARCH_RADIUS_M},${lat},${lng});
  way["shop"="supermarket"](around:${SEARCH_RADIUS_M},${lat},${lng});
);
out center 25;
`.trim();

  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) throw new Error('Store search failed');
  const data = (await res.json()) as {
    elements: Array<{
      id: number;
      type: string;
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: Record<string, string>;
    }>;
  };

  const places: PlaceResult[] = [];
  for (const el of data.elements ?? []) {
    const tags = el.tags ?? {};
    const plat = el.lat ?? el.center?.lat;
    const plng = el.lon ?? el.center?.lon;
    if (plat == null || plng == null) continue;
    places.push({
      id: `${el.type}-${el.id}`,
      name: tags.name || tags.brand || 'Convenience / Grocery',
      address: formatAddress(tags),
      location: { lat: plat, lng: plng },
    });
    if (places.length >= 12) break;
  }
  return places;
}

export default function StoreLocator() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const userMarker = useRef<L.Marker | null>(null);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<PlaceResult[]>([]);

  const searchNearby = useCallback(async (center: { lat: number; lng: number }) => {
    const map = mapRef.current;
    const layer = markersLayer.current;
    if (!map || !layer) return;

    setBusy(true);
    setErrorMsg('');
    layer.clearLayers();

    try {
      const places = await fetchNearbyStores(center);
      const bounds = L.latLngBounds([center.lat, center.lng], [center.lat, center.lng]);

      places.forEach((place) => {
        L.marker(place.location, { icon: pinIcon })
          .bindPopup(`<strong>${place.name}</strong><br/>${place.address}`)
          .addTo(layer);
        bounds.extend(place.location);
      });

      if (places.length > 0) {
        map.fitBounds(bounds.pad(0.2));
      } else {
        map.setView(center, 13);
        setErrorMsg('No grocery or convenience stores found nearby. Try another area.');
      }
      setResults(places);
    } catch {
      setResults([]);
      setErrorMsg('Could not load nearby stores. Try again in a moment.');
      map.setView(center, 13);
    } finally {
      setBusy(false);
    }
  }, []);

  const focusOn = useCallback(
    async (center: { lat: number; lng: number }) => {
      const map = mapRef.current;
      if (!map) return;
      map.setView(center, 13);
      if (userMarker.current) {
        userMarker.current.setLatLng(center);
      } else {
        userMarker.current = L.marker(center, { icon: youIcon, title: 'You are here' }).addTo(map);
      }
      await searchNearby(center);
    },
    [searchNearby]
  );

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported in this browser.');
      return;
    }
    setBusy(true);
    setErrorMsg('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void focusOn({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setBusy(false);
        setErrorMsg('Could not read your location. Allow location access or search by zip/city.');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, [focusOn]);

  const searchByQuery = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    setBusy(true);
    setErrorMsg('');
    try {
      const loc = await geocodeQuery(q);
      if (!loc) {
        setBusy(false);
        setErrorMsg('No results for that zip or city. Try another search.');
        return;
      }
      await focusOn(loc);
    } catch {
      setBusy(false);
      setErrorMsg('Search failed. Please try again.');
    }
  }, [focusOn, query]);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;

    const map = L.map(mapEl.current, {
      center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
      zoom: 12,
      scrollWheelZoom: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markersLayer.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setStatus('ready');
    void searchNearby(DEFAULT_CENTER);

    // Leaflet needs a size recalc after the section paints
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayer.current = null;
      userMarker.current = null;
    };
  }, [searchNearby]);

  useEffect(() => {
    const onLocate = () => {
      if (status === 'ready') useCurrentLocation();
    };
    window.addEventListener(LOCATE_EVENT, onLocate);
    return () => window.removeEventListener(LOCATE_EVENT, onLocate);
  }, [status, useCurrentLocation]);

  return (
    <section id="locator" className="py-24 bg-[#F5F2ED]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="order-2 md:order-1">
            <div className="bg-white p-4 rounded-[2rem] shadow-2xl">
              <div className="bg-gray-100 rounded-2xl h-[400px] relative overflow-hidden">
                <div ref={mapEl} className="absolute inset-0 rounded-2xl z-0" />

                {status === 'loading' && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F5F2ED]/80">
                    <Loader2 className="animate-spin text-[#711F25] mb-3" size={32} />
                    <p className="text-[#711F25] text-xs font-black uppercase tracking-widest">
                      Loading map…
                    </p>
                  </div>
                )}

                {busy && status === 'ready' && (
                  <div className="absolute top-3 right-3 z-10 bg-white/95 text-[#711F25] px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" />
                    Searching
                  </div>
                )}
              </div>

              {results.length > 0 && (
                <ul className="mt-4 max-h-48 overflow-y-auto divide-y divide-[#711F25]/10">
                  {results.map((place) => (
                    <li key={place.id}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-3 hover:bg-[#711F25]/5 rounded-xl transition-colors"
                        onClick={() => {
                          mapRef.current?.setView(place.location, 15);
                        }}
                      >
                        <span className="block font-black text-[#711F25] text-sm uppercase italic">
                          {place.name}
                        </span>
                        <span className="block text-[#711F25]/60 text-xs font-medium mt-0.5">
                          {place.address}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="order-1 md:order-2">
            <span className="text-[#711F25] font-black uppercase tracking-[0.4em] text-xs mb-4 block">
              Availability
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-[#711F25] italic uppercase leading-none mb-8">
              Find Your <br />
              <span className="text-black/20">Fix.</span>
            </h2>
            <p className="text-[#711F25]/60 text-lg mb-12 font-medium">
              Craving that unique 23-flavor blend? Search nearby grocery and convenience stores on a
              free OpenStreetMap — no Google billing required.
            </p>

            <div className="flex flex-col gap-4">
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  void searchByQuery();
                }}
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Zip Code or City"
                  disabled={status !== 'ready'}
                  className="w-full bg-white border-2 border-[#711F25]/10 rounded-2xl px-6 py-5 font-bold text-[#711F25] focus:outline-none focus:border-[#711F25] transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status !== 'ready' || busy}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#711F25] text-white p-3 rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                  aria-label="Search"
                >
                  <ArrowRight size={20} />
                </button>
              </form>
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={status !== 'ready' || busy}
                className="flex items-center justify-center gap-2 text-[#711F25] font-black uppercase tracking-widest text-sm hover:underline disabled:opacity-50"
              >
                <MapPin size={16} />
                Use My Current Location
              </button>
              {errorMsg && (
                <p className="text-[#711F25] text-sm font-medium">{errorMsg}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
