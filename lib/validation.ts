import type { TemplateId, Tone } from "@/lib/types";

const ALLOWED_TEMPLATES: TemplateId[] = [
  "runaway_button",
  "terminal_boot",
  "happy_birthday_redirect",
];

const SUSPICIOUS_PATTERNS = [
  "<script",
  "javascript:",
  "onerror",
  "drop table",
  "union select",
  "eval(",
  "document.cookie",
];

export function sanitizeText(value: string | undefined, maxLength = 400): string {
  if (!value) return "";
  const cleaned = value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

  return cleaned;
}

export function validateTemplateId(value: string | undefined): TemplateId | null {
  if (!value) return null;
  return ALLOWED_TEMPLATES.includes(value as TemplateId) ? (value as TemplateId) : null;
}

export function validateRedirectUrl(value: string | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("javascript:") || value.includes("<")) return null;
  if (!/^https?:\/\//i.test(value)) return null;
  return value;
}

export function looksUnsafe(value: string | undefined): boolean {
  const text = (value ?? "").toLowerCase();
  return SUSPICIOUS_PATTERNS.some((pattern) => text.includes(pattern));
}

export function getToneLabel(tone?: Tone): string {
  switch (tone) {
    case "sincere":
      return "sincere";
    case "dramatic-funny":
      return "dramatic-funny";
    case "minimal-elegant":
      return "minimal-elegant";
    default:
      return "playful";
  }
}

export function buildFallbackContent(templateId: TemplateId, recipientName: string, occasion: string): Record<string, unknown> {
  const safeRecipient = sanitizeText(recipientName, 30) || "friend";
  const safeOccasion = sanitizeText(occasion, 40) || "a special moment";

  if (templateId === "terminal_boot") {
    return {
      recipient_name: safeRecipient,
      eyebrow_tag: "signal received",
      headline: `Welcome, ${safeRecipient}`,
      subtext: `Your ${safeOccasion} gift is loading with a smile.`,
      reveal_heading: "Access granted",
      reveal_message: `A little spark of joy is on the way for ${safeRecipient}.`,
      stat_cards: [
        { value: "100%", label: "surprise" },
        { value: "1", label: "heartfelt moment" },
      ],
      no_button_teases: ["Just a little more", "Almost there", "Keep going"],
    };
  }

  if (templateId === "happy_birthday_redirect") {
    return {
      recipient_name: safeRecipient,
      eyebrow_tag: "birthday mode",
      headline: `Happy birthday, ${safeRecipient}!`,
      subtext: `The best part of ${safeOccasion} is celebrating with you.`,
      reveal_heading: "Open your surprise",
      reveal_message: "You deserve a wonderful day filled with laughter and love.",
      stat_cards: [
        { value: "🎉", label: "party" },
        { value: "✨", label: "smiles" },
      ],
      no_button_teases: ["One more tap", "Almost there", "Ready?"],
    };
  }

  return {
    recipient_name: safeRecipient,
    eyebrow_tag: "gift unlocked",
    headline: `A little surprise for ${safeRecipient}`,
    subtext: `This ${safeOccasion} message is crafted to feel personal and warm.`,
    reveal_heading: "You found it",
    reveal_message: `A tiny celebration is ready for ${safeRecipient}.`,
    stat_cards: [
      { value: "✨", label: "warmth" },
      { value: "💛", label: "care" },
    ],
    no_button_teases: ["Nope", "Try again", "Still no"],
  };
}
