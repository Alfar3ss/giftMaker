import type { TemplateId } from "@/lib/types";
import { buildFallbackContent, sanitizeText } from "@/lib/validation";

const BLOCKED_TERMS = ["explicit", "sexual", "hate", "harass", "violence", "kill", "suicide"];

export function moderateContent(content: Record<string, unknown>, templateId: TemplateId, recipientName: string, occasion: string): Record<string, unknown> {
  const compact = JSON.stringify(content).toLowerCase();
  const hasBlockedTerm = BLOCKED_TERMS.some((term) => compact.includes(term));

  if (hasBlockedTerm) {
    return buildFallbackContent(templateId, sanitizeText(recipientName, 30), sanitizeText(occasion, 40));
  }

  return content;
}
