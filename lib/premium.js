export const PREMIUM_STORAGE_KEY = "techcart-premium";
export const PREMIUM_PLAN_KEY = "techcart-premium-plan";
export const PREMIUM_CHANGE_EVENT = "techcart-premium-change";

export function isPremium() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PREMIUM_STORAGE_KEY) === "true";
}

export function getPremiumPlan() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PREMIUM_PLAN_KEY) || "monthly";
}

export function setPremium(plan = "monthly") {
  localStorage.setItem(PREMIUM_STORAGE_KEY, "true");
  localStorage.setItem(PREMIUM_PLAN_KEY, plan);
  window.dispatchEvent(new Event(PREMIUM_CHANGE_EVENT));
}

export function clearPremium() {
  localStorage.removeItem(PREMIUM_STORAGE_KEY);
  localStorage.removeItem(PREMIUM_PLAN_KEY);
  window.dispatchEvent(new Event(PREMIUM_CHANGE_EVENT));
}
