"use client";

import { useEffect, useState } from "react";
import {
  isPremium,
  PREMIUM_CHANGE_EVENT,
  setPremium,
  clearPremium,
} from "../../lib/premium";

const initialForm = {
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvc: "",
  email: "",
};

export default function PremiumPage() {
  const [form, setForm] = useState(initialForm);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

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

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    // 1. Validate Cardholder Name
    if (form.cardholderName.trim().length < 2) {
      setError("Cardholder name must be at least 2 characters.");
      return;
    }

    // 2. Validate Card Number (13 to 19 digits)
    const cardDigits = form.cardNumber.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(cardDigits)) {
      setError("Card number must be between 13 and 19 digits.");
      return;
    }

    // 3. Validate Expiry Date (MM/YY)
    const expiryMatch = form.expiryDate.trim().match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
    if (!expiryMatch) {
      setError("Expiry date must be in MM/YY format.");
      return;
    }
    const [_, monthStr, yearStr] = expiryMatch;
    const expMonth = parseInt(monthStr, 10);
    const expYear = parseInt("20" + yearStr, 10);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      setError("The card has expired.");
      return;
    }

    // 4. Validate CVC (3 or 4 digits)
    if (!/^\d{3,4}$/.test(form.cvc.trim())) {
      setError("CVC must be 3 or 4 digits.");
      return;
    }

    setPremium();
    setPaid(true);
  }

  if (paid) {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-12">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50 p-8 text-center dark:border-emerald-500/40 dark:bg-emerald-950/40">
          <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
            ✅ Payment complete, ads removed!
          </p>
          <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">
            Enjoy your ad-free TechCart experience. Your premium status is saved
            in this browser.
          </p>
          <button
            onClick={() => {
              clearPremium();
              setPaid(false);
              setForm(initialForm);
            }}
            className="mt-6 inline-block rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            Restore ads (Cancel Premium)
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-6 py-12">
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Go Premium</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Pay once (mock payment, no real charge) and remove every ad from
          TechCart for good.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"
      >
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-50 p-3 text-sm font-medium text-red-800 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200 animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <div>
          <label htmlFor="cardholderName" className="mb-1 block text-sm font-medium">
            Cardholder name
          </label>
          <input
            id="cardholderName"
            name="cardholderName"
            type="text"
            required
            value={form.cardholderName}
            onChange={handleChange}
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-white/15 dark:bg-zinc-950"
          />
        </div>

        <div>
          <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium">
            Card number
          </label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            inputMode="numeric"
            placeholder="1234 5678 1234 5678"
            required
            value={form.cardNumber}
            onChange={handleChange}
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-white/15 dark:bg-zinc-950"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="mb-1 block text-sm font-medium">
              Expiry date
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="text"
              placeholder="MM/YY"
              required
              value={form.expiryDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-white/15 dark:bg-zinc-950"
            />
          </div>
          <div>
            <label htmlFor="cvc" className="mb-1 block text-sm font-medium">
              CVC
            </label>
            <input
              id="cvc"
              name="cvc"
              type="text"
              inputMode="numeric"
              placeholder="123"
              required
              value={form.cvc}
              onChange={handleChange}
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-white/15 dark:bg-zinc-950"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-white/15 dark:bg-zinc-950"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Pay $9.99 / month
        </button>
      </form>
    </main>
  );
}
