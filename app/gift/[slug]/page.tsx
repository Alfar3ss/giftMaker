import { notFound } from "next/navigation";
import { getGiftBySlug, incrementViewCount } from "@/lib/store";
import RunawayButton from "@/templates/RunawayButton";
import TerminalBoot from "@/templates/TerminalBoot";
import HappyBirthdayRedirect from "@/templates/HappyBirthdayRedirect";

const TEMPLATES: Record<string, React.ComponentType<any>> = {
  runaway_button: RunawayButton,
  terminal_boot: TerminalBoot,
  happy_birthday_redirect: HappyBirthdayRedirect,
};

export default async function GiftPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gift = await getGiftBySlug(slug);

  if (!gift) return notFound();

  // If the gift includes pre-rendered HTML, serve it directly (sanitized at generation time)
  if (gift.html_content) {
    void incrementViewCount(gift.id);
    return <div dangerouslySetInnerHTML={{ __html: gift.html_content }} />;
  }

  const Template = TEMPLATES[gift.template_id];
  if (!Template) return notFound();

  void incrementViewCount(gift.id);

  return <Template content={gift.content_json} theme={gift.theme} redirectUrl={gift.redirect_url ?? undefined} />;
}
