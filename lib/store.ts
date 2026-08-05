import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";
import type { GiftRecord, TemplateId } from "@/lib/types";

export async function createGiftRecord(input: {
  template_id: TemplateId;
  content_json: Record<string, unknown>;
  theme?: string;
  redirect_url?: string | null;
}): Promise<GiftRecord> {
  const slug = nanoid(6);

  const payload = {
    slug,
    template_id: input.template_id,
    content_json: input.content_json,
    theme: input.theme ?? "default",
    redirect_url: input.redirect_url ?? null,
  };

  const { data, error } = await supabase.from("gifts").insert([payload]).select().single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to save gift record");
  }

  return {
    id: data.id,
    slug: data.slug,
    template_id: data.template_id,
    theme: data.theme ?? "default",
    content_json: data.content_json,
    redirect_url: data.redirect_url ?? null,
    status: data.status ?? "published",
    view_count: data.view_count ?? 0,
    interaction_json: data.interaction_json ?? {},
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.updated_at ?? data.created_at ?? new Date().toISOString(),
  };
}

export async function getGiftBySlug(slug: string): Promise<GiftRecord | null> {
  const { data, error } = await supabase.from("gifts").select().eq("slug", slug).single();
  if (error) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    template_id: data.template_id,
    theme: data.theme ?? "default",
    content_json: data.content_json,
    redirect_url: data.redirect_url ?? null,
    status: data.status ?? "published",
    view_count: data.view_count ?? 0,
    interaction_json: data.interaction_json ?? {},
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.updated_at ?? data.created_at ?? new Date().toISOString(),
  };
}

export async function incrementViewCount(id: string): Promise<void> {
  try {
    await supabase.from("gifts").update({ view_count: supabase.rpc("increment", { value: 1 }) }).eq("id", id);
  } catch {
    // ignore if the column or function is not present
  }
}

export async function updateInteraction(slug: string, interaction: Record<string, unknown>): Promise<void> {
  try {
    await supabase
      .from("gifts")
      .update({ interaction_json: interaction })
      .eq("slug", slug);
  } catch {
    // ignore if not configured
  }
}
