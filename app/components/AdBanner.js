"use client";

import { useEffect, useState } from "react";
import { isPremium, PREMIUM_CHANGE_EVENT } from "../../lib/premium";

const MARQUEE_ADS = [
  "🔥 MEGA DEAL: buy 1 cable, get 0 free!",
  "📣 You are visitor number 1,000,000, claim your prize!",
  "💸 Lower your mortgage with this ONE weird gadget!",
  "🚀 Download more RAM today (legally?!)",
  "🎁 A wild discount appeared! Act in the next 4 seconds!",
];

export default function AdBanner() {
  const [showAds, setShowAds] = useState(true);

  useEffect(() => {
    function syncPremiumStatus() {
      setShowAds(!isPremium());
    }

    syncPremiumStatus();
    window.addEventListener(PREMIUM_CHANGE_EVENT, syncPremiumStatus);

    return () => {
      window.removeEventListener(PREMIUM_CHANGE_EVENT, syncPremiumStatus);
    };
  }, []);

  if (!showAds) {
    return null;
  }

  return (
    <>
      <div className="overflow-hidden border-y border-yellow-500/40 bg-yellow-300 text-sm font-bold text-black">
        <div className="ad-marquee flex w-max gap-12 py-2 pl-12">
          {[...MARQUEE_ADS, ...MARQUEE_ADS].map((text, i) => (
            <span key={i} className="whitespace-nowrap">
              {text}
            </span>
          ))}
        </div>
      </div>

      <aside className="ad-blink fixed bottom-4 right-4 z-50 w-60 rounded-xl border-2 border-pink-500 bg-gradient-to-br from-fuchsia-500 to-orange-400 p-4 text-white shadow-2xl">
        <p className="text-xs uppercase tracking-widest opacity-90">
          Advertisement
        </p>
        <p className="mt-1 text-lg font-black leading-tight">
          CONGRATULATIONS! 🎉
        </p>
        <p className="mt-1 text-sm">
          A surprise discount is waiting. Tap fast before it runs away!
        </p>
        <button className="mt-3 w-full rounded-md bg-white/90 py-1.5 text-sm font-bold text-fuchsia-700">
          CLAIM NOW
        </button>
      </aside>
    </>
  );
}
