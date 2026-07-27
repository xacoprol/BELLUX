import { createHash } from "crypto";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/lib/i18n/types";

type TranslateTarget = Exclude<Locale, "pt">;

type MyMemoryResponse = {
  responseStatus?: number;
  responseData?: { translatedText?: string };
  quotaFinished?: boolean;
};

async function fetchMyMemory(
  text: string,
  to: TranslateTarget
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", trimmed.slice(0, 450));
  url.searchParams.set("langpair", `pt|${to}`);

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return text;

    const data = (await res.json()) as MyMemoryResponse;
    const translated = data.responseData?.translatedText?.trim();
    if (
      !translated ||
      data.responseStatus !== 200 ||
      data.quotaFinished ||
      /MYMEMORY WARNING/i.test(translated)
    ) {
      return text;
    }
    return translated;
  } catch {
    return text;
  }
}

function cachedTranslate(text: string, to: TranslateTarget): Promise<string> {
  const hash = createHash("sha256")
    .update(`${to}:${text}`)
    .digest("hex")
    .slice(0, 24);

  return unstable_cache(
    async () => fetchMyMemory(text, to),
    [`mymemory-${hash}`],
    { revalidate: 86400 }
  )();
}

/** Translate PT source strings to the target locale (no-op for `pt`). */
export async function translateTexts(
  texts: string[],
  locale: Locale
): Promise<string[]> {
  if (locale === "pt" || texts.length === 0) return texts;

  const to = locale as TranslateTarget;
  const unique = [...new Set(texts.filter((t) => t.trim().length > 0))];
  const map = new Map<string, string>();

  await Promise.all(
    unique.map(async (text) => {
      map.set(text, await cachedTranslate(text, to));
    })
  );

  return texts.map((text) => map.get(text) ?? text);
}

export async function translateText(
  text: string,
  locale: Locale
): Promise<string> {
  const [out] = await translateTexts([text], locale);
  return out;
}
