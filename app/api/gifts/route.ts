import { NextResponse } from "next/server";
import { createGiftRecord } from "@/lib/store";
import { sanitizeText, validateRedirectUrl, validateTemplateId } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const templateId = validateTemplateId(body?.template_id);
    const redirectUrl = validateRedirectUrl(body?.redirect_url);

    if (!templateId) {
      return NextResponse.json({ error: "Invalid template_id" }, { status: 400 });
    }

    if (body?.content_json == null || typeof body.content_json !== "object") {
      return NextResponse.json({ error: "content_json is required" }, { status: 400 });
    }

    const gift = await createGiftRecord({
      template_id: templateId,
      content_json: body.content_json,
      theme: sanitizeText(body?.theme, 20) || "default",
      redirect_url: redirectUrl,
    });

    return NextResponse.json({ slug: gift.slug, url: `https://ichou.icu/giftmaker/gift/${gift.slug}` });
  } catch {
    return NextResponse.json({ error: "Gift creation failed" }, { status: 500 });
  }
}
