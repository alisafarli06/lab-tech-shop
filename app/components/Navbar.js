"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isPremium, PREMIUM_CHANGE_EVENT } from "../../lib/premium";

export default function Navbar() {
  const pathname = usePathname();
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    function syncPaidStatus() {
      setPaid(isPremium());
    }

    syncPaidStatus();
    window.addEventListener(PREMIUM_CHANGE_EVENT, syncPaidStatus);

    return () => {
      window.removeEventListener(PREMIUM_CHANGE_EVENT, syncPaidStatus);
    };
  }, []);

  const isHomeActive = pathname === "/";
  const isPremiumActive = pathname === "/premium";

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={`text-lg font-bold tracking-tight transition-colors ${
              isHomeActive
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
            }`}
          >
            ⚡ TechCart
          </Link>
          {paid && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              ⭐ Premium
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isHomeActive
                ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            Shop
          </Link>
          
          <Link
            href="/premium"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              paid
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : isPremiumActive
                ? "bg-indigo-700 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            {paid ? "Premium ✓" : "Go Premium"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
