import { promises as fs } from "fs";
import path from "path";
import type { GiftRecord, TemplateId } from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "data", "gifts.json");

async function ensureStore(): Promise<GiftRecord[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify([], null, 2));
    return [];
  }
}

async function writeStore(records: GiftRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(records, null, 2));
}

function makeSlug(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function createGiftRecord(input: {
  template_id: TemplateId;
  content_json: Record<string, unknown>;
  theme?: string;
  redirect_url?: string | null;
}): Promise<GiftRecord> {
  const records = await ensureStore();
  let slug = makeSlug();
  while (records.some((item) => item.slug === slug)) {
    slug = makeSlug();
  }

  const gift: GiftRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    slug,
    template_id: input.template_id,
    theme: input.theme ?? "default",
    content_json: input.content_json,
    redirect_url: input.redirect_url ?? null,
    status: "published",
    view_count: 0,
    interaction_json: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  records.push(gift);
  await writeStore(records);
  return gift;
}

export async function getGiftBySlug(slug: string): Promise<GiftRecord | null> {
  const records = await ensureStore();
  return records.find((item) => item.slug === slug) ?? null;
}

export async function incrementViewCount(id: string): Promise<void> {
  const records = await ensureStore();
  const target = records.find((item) => item.id === id);
  if (!target) return;
  target.view_count += 1;
  target.updated_at = new Date().toISOString();
  await writeStore(records);
}

export async function updateInteraction(slug: string, interaction: Record<string, unknown>): Promise<void> {
  const records = await ensureStore();
  const target = records.find((item) => item.slug === slug);
  if (!target) return;
  target.interaction_json = { ...target.interaction_json, ...interaction };
  target.updated_at = new Date().toISOString();
  await writeStore(records);
}
