"use client";

import { useEffect, useMemo, useState } from "react";

interface TerminalBootProps {
  content: Record<string, unknown>;
  theme?: string;
  redirectUrl?: string | null;
}

export default function TerminalBoot({ content, theme, redirectUrl }: TerminalBootProps) {
  const [visibleText, setVisibleText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const safeContent = useMemo(() => ({
    recipientName: String((content.recipient_name as string) ?? "friend"),
    eyebrowTag: String((content.eyebrow_tag as string) ?? "signal received"),
    headline: String((content.headline as string) ?? "Welcome"),
    subtext: String((content.subtext as string) ?? "A special message is loading."),
    revealHeading: String((content.reveal_heading as string) ?? "Access granted"),
    revealMessage: String((content.reveal_message as string) ?? "The surprise is yours."),
    statCards: Array.isArray(content.stat_cards) ? content.stat_cards as Array<{ value: string; label: string }> : [],
    noButtonTeases: Array.isArray(content.no_button_teases) ? content.no_button_teases as string[] : [],
  }), [content]);

  useEffect(() => {
    const full = `> boot sequence started...\n> loading warmth...\n> welcome ${safeContent.recipientName}...\n> message ready.`;
    let index = 0;
    const timer = window.setInterval(() => {
      setVisibleText(full.slice(0, index));
      index += 1;
      if (index > full.length) {
        window.clearInterval(timer);
        setIsComplete(true);
        if (redirectUrl) {
          window.setTimeout(() => window.location.assign(redirectUrl), 800);
        }
      }
    }, 35);
    return () => window.clearInterval(timer);
  }, [redirectUrl, safeContent.recipientName]);

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-emerald-300" style={{ background: theme === "dark" ? "#000" : "#07110f" }}>
      <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-800/50 bg-slate-950/90 p-6 shadow-2xl">
        <div className="mb-4 text-xs uppercase tracking-[0.3em] text-emerald-500">{safeContent.eyebrowTag}</div>
        <h1 className="text-3xl font-semibold text-emerald-200">{safeContent.headline}</h1>
        <p className="mt-3 text-sm text-emerald-100/80">{safeContent.subtext}</p>
        <pre className="mt-6 overflow-x-auto rounded-2xl border border-emerald-800/50 bg-black p-4 font-mono text-sm leading-7">
          {visibleText}
          {!isComplete && <span className="animate-pulse">|</span>}
        </pre>
        {isComplete && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-emerald-200">{safeContent.revealHeading}</h2>
            <p className="text-sm text-emerald-100/80">{safeContent.revealMessage}</p>
            <div className="flex flex-wrap gap-3">
              {safeContent.statCards.slice(0, 2).map((item, index) => (
                <div key={`${item.label}-${index}`} className="rounded-2xl border border-emerald-700/40 bg-emerald-950/40 px-4 py-3">
                  <div className="text-lg font-semibold">{item.value}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-emerald-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
