import type { GenerateInput, TemplateId, Tone } from "@/lib/types";
import { buildFallbackContent, getToneLabel, sanitizeText, validateTemplateId } from "@/lib/validation";
import { moderateContent } from "@/lib/moderation";

function buildSystemPrompt(templateId: TemplateId, tone: Tone, recipientName: string, occasion: string) {
  return [
    "You are a gift content generator.",
    "Return valid JSON only, no markdown, no explanation.",
    `Template: ${templateId}`,
    `Tone: ${getToneLabel(tone)}`,
    `Recipient: ${sanitizeText(recipientName, 30)}`,
    `Occasion: ${sanitizeText(occasion, 40)}`,
    "Use warm, concise, safe language.",
    "Do not include scripts, HTML, or unsafe content.",
    "Keep values short and elegant.",
  ].join("\n");
}

export async function generateGiftContent(input: GenerateInput): Promise<Record<string, unknown>> {
  const templateId = validateTemplateId(input.template_id) ?? "runaway_button";
  const recipientName = sanitizeText(input.recipient_name, 30) || "friend";
  const occasion = sanitizeText(input.occasion, 40) || "a celebration";
  const tone = (input.tone ?? "playful") as Tone;
  const details = sanitizeText(input.free_text_details, 240) || "a heartfelt surprise";

  const fallback = buildFallbackContent(templateId, recipientName, occasion);

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: buildSystemPrompt(templateId, tone, recipientName, occasion),
            },
            {
              role: "user",
              content: `Create the content payload for this gift. Add details: ${details}`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.choices?.[0]?.message?.content ?? "";
        const parsed = safeParseJson(rawText);
        if (parsed) {
          const moderated = moderateContent(parsed as Record<string, unknown>, templateId, recipientName, occasion);
          return moderated;
        }
      }
    } catch {
      // fall back to deterministic content if the API call fails
    }
  }

  const moderated = moderateContent(fallback, templateId, recipientName, occasion);
  return moderated;
}

function safeParseJson(input: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(input);
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
