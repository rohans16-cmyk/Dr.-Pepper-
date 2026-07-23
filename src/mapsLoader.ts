/**
 * Load the Google Maps JavaScript API (with Places) once per page.
 */

const SCRIPT_ID = 'google-maps-js';

declare global {
  interface Window {
    google?: typeof google;
    __drPepperMapsReady?: Promise<typeof google>;
  }
}

export function getMapsApiKey(): string {
  return (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() ?? '';
}

export function loadGoogleMaps(): Promise<typeof google> {
  const key = getMapsApiKey();
  if (!key) {
    return Promise.reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY'));
  }

  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (window.__drPepperMapsReady) {
    return window.__drPepperMapsReady;
  }

  window.__drPepperMapsReady = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => {
        if (window.google?.maps) resolve(window.google);
        else reject(new Error('Google Maps failed to initialize'));
      });
      existing.addEventListener('error', () => reject(new Error('Google Maps script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}` +
      `&libraries=places&v=weekly`;
    script.onload = () => {
      if (window.google?.maps) resolve(window.google);
      else reject(new Error('Google Maps failed to initialize'));
    };
    script.onerror = () => reject(new Error('Google Maps script failed to load'));
    document.head.appendChild(script);
  });

  return window.__drPepperMapsReady;
}

/** Custom event name: Find Near Me CTAs dispatch this after scrolling to #locator. */
export const LOCATE_EVENT = 'drpepper:locate';

export function requestLocateNearMe() {
  document.getElementById('locator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.dispatchEvent(new CustomEvent(LOCATE_EVENT));
}
