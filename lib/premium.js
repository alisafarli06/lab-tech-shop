export const PREMIUM_STORAGE_KEY = "techcart-premium";
export const PREMIUM_CHANGE_EVENT = "techcart-premium-change";

export function isPremium() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PREMIUM_STORAGE_KEY) === "true";
}

export function setPremium() {
  localStorage.setItem(PREMIUM_STORAGE_KEY, "true");
  window.dispatchEvent(new Event(PREMIUM_CHANGE_EVENT));
}

export function clearPremium() {
  localStorage.removeItem(PREMIUM_STORAGE_KEY);
  window.dispatchEvent(new Event(PREMIUM_CHANGE_EVENT));
}
