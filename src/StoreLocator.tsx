/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader2, MapPin } from 'lucide-react';
import { getMapsApiKey, loadGoogleMaps, LOCATE_EVENT } from './mapsLoader';

type PlaceResult = {
  id: string;
  name: string;
  address: string;
  rating?: number;
  openNow?: boolean;
  location: google.maps.LatLngLiteral;
};

const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 31.5497, lng: -97.1467 }; // Waco, TX
const SEARCH_RADIUS_M = 8000;

function placeId(p: google.maps.places.PlaceResult, index: number): string {
  return p.place_id ?? `${p.name ?? 'place'}-${index}`;
}

export default function StoreLocator() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const placesRef = useRef<google.maps.places.PlacesService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'no-key' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<PlaceResult[]>([]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  }, []);

  const searchNearby = useCallback(
    (center: google.maps.LatLngLiteral) => {
      const service = placesRef.current;
      const map = mapRef.current;
      if (!service || !map) return;

      setBusy(true);
      clearMarkers();

      service.nearbySearch(
        {
          location: center,
          radius: SEARCH_RADIUS_M,
          type: 'convenience_store',
          keyword: 'Dr Pepper soda grocery',
        },
        (nearby, nearbyStatus) => {
          const finish = (places: google.maps.places.PlaceResult[]) => {
            const mapped: PlaceResult[] = places.slice(0, 10).map((p, i) => ({
              id: placeId(p, i),
              name: p.name ?? 'Store',
              address: p.vicinity ?? p.formatted_address ?? '',
              rating: p.rating,
              openNow: p.opening_hours?.isOpen?.() ?? p.opening_hours?.open_now,
              location: {
                lat: p.geometry!.location!.lat(),
                lng: p.geometry!.location!.lng(),
              },
            }));

            const bounds = new google.maps.LatLngBounds();
            bounds.extend(center);

            mapped.forEach((place) => {
              const marker = new google.maps.Marker({
                map,
                position: place.location,
                title: place.name,
              });
              markersRef.current.push(marker);
              bounds.extend(place.location);
            });

            if (mapped.length > 0) {
              map.fitBounds(bounds, 64);
            } else {
              map.setCenter(center);
              map.setZoom(13);
            }

            setResults(mapped);
            setBusy(false);
          };

          if (
            nearbyStatus === google.maps.places.PlacesServiceStatus.OK &&
            nearby &&
            nearby.length > 0
          ) {
            finish(nearby);
            return;
          }

          // Fallback: broader grocery / supermarket search if convenience is sparse
          service.nearbySearch(
            {
              location: center,
              radius: SEARCH_RADIUS_M,
              type: 'supermarket',
            },
            (markets, marketStatus) => {
              if (
                marketStatus === google.maps.places.PlacesServiceStatus.OK &&
                markets &&
                markets.length > 0
              ) {
                finish(markets);
              } else {
                setResults([]);
                map.setCenter(center);
                map.setZoom(13);
                setBusy(false);
              }
            }
          );
        }
      );
    },
    [clearMarkers]
  );

  const setUserPin = useCallback((center: google.maps.LatLngLiteral) => {
    const map = mapRef.current;
    if (!map) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(center);
    } else {
      userMarkerRef.current = new google.maps.Marker({
        map,
        position: center,
        title: 'You are here',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#711F25',
          fillOpacity: 1,
          strokeColor: '#F5F2ED',
          strokeWeight: 2,
        },
      });
    }
  }, []);

  const focusOn = useCallback(
    (center: google.maps.LatLngLiteral) => {
      setUserPin(center);
      mapRef.current?.panTo(center);
      searchNearby(center);
    },
    [searchNearby, setUserPin]
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
        focusOn({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setBusy(false);
        setErrorMsg('Could not read your location. Allow location access or search by zip/city.');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, [focusOn]);

  const searchByQuery = useCallback(() => {
    const q = query.trim();
    if (!q || !geocoderRef.current) return;
    setBusy(true);
    setErrorMsg('');
    geocoderRef.current.geocode({ address: q }, (results, geocodeStatus) => {
      if (geocodeStatus === google.maps.GeocoderStatus.OK && results?.[0]?.geometry?.location) {
        const loc = results[0].geometry.location;
        focusOn({ lat: loc.lat(), lng: loc.lng() });
      } else {
        setBusy(false);
        setErrorMsg('No results for that zip or city. Try another search.');
      }
    });
  }, [focusOn, query]);

  useEffect(() => {
    if (!getMapsApiKey()) {
      setStatus('no-key');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    loadGoogleMaps()
      .then((g) => {
        if (cancelled || !mapEl.current) return;
        const map = new g.maps.Map(mapEl.current, {
          center: DEFAULT_CENTER,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          ],
        });
        mapRef.current = map;
        placesRef.current = new g.maps.places.PlacesService(map);
        geocoderRef.current = new g.maps.Geocoder();
        setStatus('ready');
        searchNearby(DEFAULT_CENTER);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(err.message || 'Map failed to load.');
      });

    return () => {
      cancelled = true;
    };
  }, [searchNearby]);

  useEffect(() => {
    const onLocate = () => {
      if (status === 'ready') useCurrentLocation();
    };
    window.addEventListener(LOCATE_EVENT, onLocate);
    return () => window.removeEventListener(LOCATE_EVENT, onLocate);
  }, [status, useCurrentLocation]);

  const showMap = status === 'ready' || status === 'loading';

  return (
    <section id="locator" className="py-24 bg-[#F5F2ED]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="order-2 md:order-1">
            <div className="bg-white p-4 rounded-[2rem] shadow-2xl">
              <div className="bg-gray-100 rounded-2xl h-[400px] relative overflow-hidden">
                {showMap && (
                  <div ref={mapEl} className="absolute inset-0 rounded-2xl" />
                )}

                {status === 'loading' && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F5F2ED]/80">
                    <Loader2 className="animate-spin text-[#711F25] mb-3" size={32} />
                    <p className="text-[#711F25] text-xs font-black uppercase tracking-widest">
                      Loading map…
                    </p>
                  </div>
                )}

                {(status === 'no-key' || status === 'error') && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                    <div className="relative z-10 text-center p-8 max-w-sm">
                      <MapPin size={48} className="text-[#711F25] mx-auto mb-4" />
                      <h3 className="text-2xl font-black italic uppercase text-[#711F25] mb-2">
                        Interactive Map
                      </h3>
                      <p className="text-[#711F25]/60 text-sm font-bold uppercase tracking-widest mb-3">
                        {status === 'no-key' ? 'Map unavailable' : 'Map error'}
                      </p>
                      <p className="text-[#711F25]/70 text-sm font-medium">
                        {status === 'no-key'
                          ? 'Add a VITE_GOOGLE_MAPS_API_KEY (Maps JavaScript + Places) to enable the locator.'
                          : errorMsg || 'Something went wrong loading Google Maps.'}
                      </p>
                    </div>
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
                          mapRef.current?.panTo(place.location);
                          mapRef.current?.setZoom(15);
                        }}
                      >
                        <span className="block font-black text-[#711F25] text-sm uppercase italic">
                          {place.name}
                        </span>
                        <span className="block text-[#711F25]/60 text-xs font-medium mt-0.5">
                          {place.address}
                          {place.rating != null ? ` · ★ ${place.rating.toFixed(1)}` : ''}
                          {place.openNow === true ? ' · Open' : ''}
                          {place.openNow === false ? ' · Closed' : ''}
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
              Craving that unique 23-flavor blend? Use our store locator to find nearby grocery and
              convenience stores that typically stock soft drinks like Dr Pepper.
            </p>

            <div className="flex flex-col gap-4">
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  searchByQuery();
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
              {errorMsg && status === 'ready' && (
                <p className="text-[#711F25] text-sm font-medium">{errorMsg}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
