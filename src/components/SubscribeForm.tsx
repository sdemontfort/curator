"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-accent text-white rounded-lg p-8 text-center">
        <p className="text-[15px] font-medium">
          You&apos;re on the list. Check your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-accent text-white rounded-lg p-8">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-[20px] font-semibold mb-1">
          The Curated Investor Brief
        </h2>
        <p className="text-[14px] text-white/70 mb-5">
          The top ASX stories, handpicked daily. Delivered to your inbox.
        </p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-[13px] text-white/60">
            <span className="inline-block w-1 h-1 rounded-full bg-green" />
            $5/month
          </div>
          <span className="text-white/30">|</span>
          <span className="text-[13px] text-white/60">Cancel anytime</span>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="flex-1 bg-white/10 border border-white/20 rounded-md px-4 py-2.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-white text-accent font-medium px-5 py-2.5 rounded-md text-[14px] hover:bg-white/90 transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-[13px] text-red-300 mt-2">
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </div>
  );
}
