/** Find Near Me CTAs scroll to #locator and optionally trigger geolocation. */

export const LOCATE_EVENT = 'drpepper:locate';

export function requestLocateNearMe() {
  document.getElementById('locator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.dispatchEvent(new CustomEvent(LOCATE_EVENT));
}
