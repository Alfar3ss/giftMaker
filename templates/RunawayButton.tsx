"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface RunawayButtonProps {
  content: Record<string, unknown>;
  theme?: string;
  redirectUrl?: string | null;
}

export default function RunawayButton({ content, theme, redirectUrl }: RunawayButtonProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [clicked, setClicked] = useState(false);

  const safeContent = useMemo(() => ({
    recipientName: String((content.recipient_name as string) ?? "friend"),
    eyebrowTag: String((content.eyebrow_tag as string) ?? "gift unlocked"),
    headline: String((content.headline as string) ?? "A little surprise"),
    subtext: String((content.subtext as string) ?? "A warm message is ready."),
    revealHeading: String((content.reveal_heading as string) ?? "You found it"),
    revealMessage: String((content.reveal_message as string) ?? "The surprise is yours."),
    statCards: Array.isArray(content.stat_cards) ? content.stat_cards as Array<{ value: string; label: string }> : [],
    noButtonTeases: Array.isArray(content.no_button_teases) ? content.no_button_teases as string[] : [],
  }), [content]);

  useEffect(() => {
    if (!clicked) return;
    const timer = window.setTimeout(() => {
      if (redirectUrl) {
        window.location.assign(redirectUrl);
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [clicked, redirectUrl]);

  const handleMove = () => {
    setPosition({
      x: 18 + Math.random() * 64,
      y: 20 + Math.random() * 60,
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white" style={{ background: theme === "dark" ? "#020617" : "#0f172a" }}>
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
        <div className="text-sm uppercase tracking-[0.35em] text-cyan-300">{safeContent.eyebrowTag}</div>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold sm:text-5xl">{safeContent.headline}</h1>
            <p className="max-w-xl text-lg text-slate-200">{safeContent.subtext}</p>
            <div className="flex flex-wrap gap-3">
              {safeContent.statCards.slice(0, 2).map((item, index) => (
                <div key={`${item.label}-${index}`} className="rounded-2xl border border-white/15 bg-slate-900/70 px-4 py-3">
                  <div className="text-xl font-semibold">{item.value}</div>
                  <div className="text-sm text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.25),_transparent_60%)]" />
            <div className="relative space-y-4">
              <h2 className="text-2xl font-semibold">{safeContent.revealHeading}</h2>
              <p className="text-sm leading-7 text-slate-300">{safeContent.revealMessage}</p>
              <div className="relative h-48 rounded-2xl border border-dashed border-cyan-400/30 bg-slate-950/80">
                <button
                  type="button"
                  className="absolute rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition-all duration-200 hover:scale-105"
                  style={{ left: `${position.x}%`, top: `${position.y}%`, transform: "translate(-50%, -50%)" }}
                  onMouseEnter={handleMove}
                  onFocus={handleMove}
                  onClick={() => setClicked(true)}
                >
                  Open surprise
                </button>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                {safeContent.noButtonTeases.slice(0, 4).map((tease) => (
                  <div key={tease}>• {tease}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
