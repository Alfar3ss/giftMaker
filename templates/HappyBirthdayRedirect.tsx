"use client";

import { useEffect, useMemo, useState } from "react";

interface HappyBirthdayRedirectProps {
  content: Record<string, unknown>;
  theme?: string;
  redirectUrl?: string | null;
}

export default function HappyBirthdayRedirect({ content, theme, redirectUrl }: HappyBirthdayRedirectProps) {
  const [countdown, setCountdown] = useState(3);

  const safeContent = useMemo(() => ({
    recipientName: String((content.recipient_name as string) ?? "friend"),
    eyebrowTag: String((content.eyebrow_tag as string) ?? "birthday mode"),
    headline: String((content.headline as string) ?? "Happy birthday!"),
    subtext: String((content.subtext as string) ?? "A lovely surprise is coming your way."),
    revealHeading: String((content.reveal_heading as string) ?? "Open your surprise"),
    revealMessage: String((content.reveal_message as string) ?? "The celebration is here."),
    statCards: Array.isArray(content.stat_cards) ? content.stat_cards as Array<{ value: string; label: string }> : [],
    noButtonTeases: Array.isArray(content.no_button_teases) ? content.no_button_teases as string[] : [],
  }), [content]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          if (redirectUrl) {
            window.location.assign(redirectUrl);
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [redirectUrl]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-600 via-rose-500 to-amber-400 px-4 py-10 text-white" style={{ background: theme === "dark" ? "#4c0519" : undefined }}>
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-[2rem] border border-white/20 bg-slate-950/20 p-8 text-center shadow-2xl backdrop-blur">
        <div className="mb-4 text-sm uppercase tracking-[0.35em] text-pink-100">{safeContent.eyebrowTag}</div>
        <h1 className="text-4xl font-semibold sm:text-5xl">{safeContent.headline}</h1>
        <p className="mt-4 max-w-xl text-lg text-pink-50/90">{safeContent.subtext}</p>
        <div className="mt-8 rounded-full border border-white/20 bg-white/15 px-8 py-4 text-4xl font-semibold">{countdown}</div>
        <div className="mt-8 space-y-3 text-left">
          <h2 className="text-2xl font-semibold">{safeContent.revealHeading}</h2>
          <p className="max-w-lg text-sm leading-7 text-pink-50/90">{safeContent.revealMessage}</p>
        </div>
      </div>
    </main>
  );
}
