import { NextResponse } from "next/server";
import { generateGiftContent } from "@/lib/ai";
import { sanitizeText, validateTemplateId } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const templateId = validateTemplateId(body?.template_id);

    if (!templateId) {
      return NextResponse.json({ error: "Invalid template_id" }, { status: 400 });
    }

    const safeBody = {
      template_id: templateId,
      recipient_name: sanitizeText(body?.recipient_name, 30),
      occasion: sanitizeText(body?.occasion, 40),
      tone: body?.tone ?? "playful",
      free_text_details: sanitizeText(body?.free_text_details, 240),
    };

    const content_json = await generateGiftContent(safeBody);

    return NextResponse.json({ content_json });
  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
