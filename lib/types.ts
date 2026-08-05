export type TemplateId = "runaway_button" | "terminal_boot" | "happy_birthday_redirect";

export type Tone = "playful" | "sincere" | "dramatic-funny" | "minimal-elegant";

export interface GiftRecord {
  id: string;
  slug: string;
  template_id: TemplateId;
  theme: string;
  content_json: Record<string, unknown>;
  redirect_url?: string | null;
  status: string;
  view_count: number;
  interaction_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface GenerateInput {
  template_id: string;
  recipient_name?: string;
  occasion?: string;
  tone?: Tone;
  free_text_details?: string;
}

export interface GenerateResponse {
  content_json: Record<string, unknown>;
}

export interface CreateGiftInput {
  template_id: string;
  content_json: Record<string, unknown>;
  theme?: string;
  redirect_url?: string;
}
