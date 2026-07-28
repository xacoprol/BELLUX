/**
 * WordPress media / API base for Bellux.
 * Point NEXT_PUBLIC_WP_URL at the WP install that serves uploads & REST.
 *
 * Note: pretty permalinks for /wp-json may 404 on this host — use ?rest_route=.
 */
import type { Locale } from "@/lib/i18n/types";
import { translateTexts } from "@/lib/translate";

export const WP_URL =
  process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "") ??
  "https://admin.belluxentertainment.com";

/** Absolute URL to a file under wp-content/uploads */
export function wpUpload(path: string): string {
  const clean = path.replace(/^\//, "");
  return `${WP_URL}/wp-content/uploads/${clean}`;
}

/** Absolute URL to any WP path (e.g. /wp-json/…) */
export function wpUrl(path = ""): string {
  if (!path) return WP_URL;
  if (path.startsWith("http")) return path;
  return `${WP_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** REST via query string (works when /wp-json pretty permalinks 404) */
export function wpRest(route: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams({
    rest_route: route.startsWith("/") ? route : `/${route}`,
    ...params,
  });
  return `${WP_URL}/?${qs.toString()}`;
}

export const wpMedia = {
  heroVideo: wpUpload("2026/07/hero.mp4"),
} as const;

export type WpProject = {
  id: number;
  title: string;
  description: string;
  tag: string;
  image: string;
  images: string[];
  video?: string;
  year: number;
  accent: "cyan" | "magenta" | "yellow";
};

type WpRendered = { rendered?: string; raw?: string };
type WpTerm = { id: number; name: string; taxonomy: string };
type WpMedia = {
  id: number;
  source_url?: string;
  mime_type?: string;
  media_details?: { sizes?: Record<string, { source_url?: string }> };
};

type WpProyecto = {
  id: number;
  title?: WpRendered;
  excerpt?: WpRendered;
  content?: WpRendered;
  featured_media?: number;
  "cat-proyecto"?: number[];
  acf?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
  };
};

const ACCENTS: Array<"cyan" | "magenta" | "yellow"> = [
  "cyan",
  "magenta",
  "yellow",
];

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-fA-F]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, num: string) =>
      String.fromCodePoint(Number.parseInt(num, 10))
    )
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function pickImage(media?: WpMedia): string {
  if (!media) return "";
  // Featured video attachments are not cover images
  if (media.mime_type?.startsWith("video/")) return "";
  const large = media.media_details?.sizes?.large?.source_url;
  const full = media.source_url;
  return large || full || "";
}

type VideoRef = { url?: string; id?: number };

function pickYear(post: WpProyecto): number {
  const bags: Array<Record<string, unknown> | undefined> = [
    post.acf,
    post.meta,
  ];
  const keys = ["ano", "year", "anyo", "año"];

  for (const bag of bags) {
    if (!bag) continue;
    for (const key of keys) {
      const val = bag[key];
      if (typeof val === "number" && Number.isFinite(val) && val > 0) {
        return Math.trunc(val);
      }
      if (typeof val === "string") {
        const match = val.match(/\d{4}/);
        if (match) return Number(match[0]);
      }
    }
  }
  return 0;
}

function pickVideoRef(post: WpProyecto): VideoRef {
  const bags: Array<Record<string, unknown> | undefined> = [
    post.acf,
    post.meta,
  ];
  const keys = [
    "video_destacado",
    "video",
    "featured_video",
    "video_url",
    "proyecto_video",
  ];

  for (const bag of bags) {
    if (!bag) continue;
    for (const key of keys) {
      const val = bag[key];
      if (typeof val === "number" && val > 0) return { id: val };
      if (typeof val === "string" && /^\d+$/.test(val.trim())) {
        return { id: Number(val.trim()) };
      }
      if (typeof val === "string" && /\.(mp4|webm|mov)(\?|$)/i.test(val)) {
        return { url: val.startsWith("http") ? val : wpUrl(val) };
      }
      if (val && typeof val === "object") {
        const obj = val as {
          id?: number;
          ID?: number;
          url?: string;
          source_url?: string;
        };
        if (typeof obj.id === "number" && obj.id > 0) return { id: obj.id };
        if (typeof obj.ID === "number" && obj.ID > 0) return { id: obj.ID };
        const url = obj.url || obj.source_url;
        if (url && /\.(mp4|webm|mov)(\?|$)/i.test(url)) return { url };
      }
    }
  }
  return {};
}

function pickVideoFromContent(html?: string): string | undefined {
  if (!html) return undefined;
  const src =
    html.match(/<video[^>]+src=["']([^"']+)["']/i)?.[1] ||
    html.match(/<source[^>]+src=["']([^"']+\.(?:mp4|webm|mov)[^"']*)["']/i)?.[1] ||
    html.match(/https?:\/\/[^\s"'<>]+\.(?:mp4|webm|mov)/i)?.[0];
  return src;
}

async function fetchMediaSourceUrl(id: number): Promise<string | undefined> {
  try {
    const res = await fetch(wpRest(`/wp/v2/media/${id}`), {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as WpMedia;
    if (!data.source_url) return undefined;
    if (data.mime_type && !data.mime_type.startsWith("video/")) {
      return undefined;
    }
    return data.source_url;
  } catch {
    return undefined;
  }
}

function pickGalleryImageUrl(media: WpMedia): string {
  if (media.mime_type?.startsWith("video/")) return "";
  const large = media.media_details?.sizes?.large?.source_url;
  const full = media.source_url;
  return large || full || "";
}

/** Attached image gallery for a proyecto (excludes videos). */
async function fetchProjectGallery(postId: number): Promise<string[]> {
  try {
    const url = wpRest("/wp/v2/media", {
      parent: String(postId),
      per_page: "40",
      media_type: "image",
      orderby: "date",
      order: "asc",
    });
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as WpMedia[];
    if (!Array.isArray(data)) return [];

    const seen = new Set<string>();
    const urls: string[] = [];
    for (const item of data) {
      const src = pickGalleryImageUrl(item);
      if (!src || seen.has(src)) continue;
      seen.add(src);
      urls.push(src);
    }
    return urls;
  } catch {
    return [];
  }
}

async function resolveProjectVideo(post: WpProyecto): Promise<string | undefined> {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const ref = pickVideoRef(post);

  if (ref.url) return ref.url;
  if (ref.id) {
    const fromId = await fetchMediaSourceUrl(ref.id);
    if (fromId) return fromId;
  }

  const fromContent = pickVideoFromContent(post.content?.rendered);
  if (fromContent) return fromContent;

  if (media?.mime_type?.startsWith("video/") && media.source_url) {
    return media.source_url;
  }

  return undefined;
}

async function mapProyecto(
  post: WpProyecto,
  index: number
): Promise<WpProject | null> {
  const title = stripHtml(post.title?.rendered || "");
  if (!title) return null;

  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const terms = (post._embedded?.["wp:term"] ?? []).flat();
  const category =
    terms.find((t) => t.taxonomy === "cat-proyecto")?.name ||
    terms[0]?.name ||
    "";

  const featured = pickImage(media);
  const [gallery, video] = await Promise.all([
    fetchProjectGallery(post.id),
    resolveProjectVideo(post),
  ]);

  const images =
    gallery.length > 0
      ? gallery
      : featured
        ? [featured]
        : [];

  return {
    id: post.id,
    title,
    description: stripHtml(post.excerpt?.rendered || ""),
    tag: category,
    image: featured || images[0] || "",
    images,
    video: video || undefined,
    year: pickYear(post),
    accent: ACCENTS[index % ACCENTS.length],
  };
}

function sortProjects(projects: WpProject[]): WpProject[] {
  return [...projects].sort((a, b) => {
    const yearDiff = (b.year || 0) - (a.year || 0);
    if (yearDiff !== 0) return yearDiff;
    return a.title.localeCompare(b.title, "pt", { sensitivity: "base" });
  });
}

/** Latest published proyectos from WP CPT `proyecto` (PT source, translated when needed). */
export async function getWpProjects(
  limit = 12,
  locale: Locale = "pt"
): Promise<WpProject[]> {
  try {
    // Fetch a wider window, then sort by ACF `ano` + title (newest first)
    const fetchLimit = Math.min(Math.max(limit, 40), 100);
    const url = wpRest("/wp/v2/proyecto", {
      per_page: String(fetchLimit),
      _embed: "1",
      orderby: "date",
      order: "desc",
      status: "publish",
    });

    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as WpProyecto[];
    if (!Array.isArray(data) || data.length === 0) return [];

    const mapped = await Promise.all(data.map((post, i) => mapProyecto(post, i)));
    const projects = sortProjects(
      mapped.filter((p): p is WpProject => Boolean(p))
    )
      .slice(0, limit)
      .map((p, i) => ({
        ...p,
        accent: ACCENTS[i % ACCENTS.length],
      }));

    if (locale === "pt" || projects.length === 0) return projects;

    const titles = projects.map((p) => p.title);
    const descriptions = projects.map((p) => p.description);
    const tags = projects.map((p) => p.tag);
    const [tTitles, tDescriptions, tTags] = await Promise.all([
      translateTexts(titles, locale),
      translateTexts(descriptions, locale),
      translateTexts(tags, locale),
    ]);

    return projects.map((p, i) => ({
      ...p,
      title: tTitles[i] || p.title,
      description: tDescriptions[i] || p.description,
      tag: tTags[i] || p.tag,
    }));
  } catch {
    return [];
  }
}

export type WpService = {
  id: number;
  tag: string;
  lines: { text: string; accent?: "cyan" | "magenta" | "yellow" }[][];
  image: string;
};

type WpServicio = {
  id: number;
  title?: WpRendered;
  excerpt?: WpRendered;
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
  };
};

/** Split WP title into stacked display lines (Boldonse carousel style). */
function titleToServiceLines(
  title: string
): { text: string; accent?: "cyan" | "magenta" | "yellow" }[][] {
  const words = title.toUpperCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  return words.map((word, i) => [
    {
      text: word,
      accent: i % 2 === 1 ? ACCENTS[i % ACCENTS.length] : undefined,
    },
  ]);
}

function mapServicio(post: WpServicio): WpService | null {
  const title = stripHtml(post.title?.rendered || "");
  if (!title) return null;
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const image = pickImage(media);
  const excerpt = stripHtml(post.excerpt?.rendered || "").trim();
  const fallbackTag = title.split(/\s+/).slice(0, 2).join(" ").toUpperCase();

  return {
    id: post.id,
    tag: (excerpt || fallbackTag || title).toUpperCase(),
    lines: titleToServiceLines(title),
    image,
  };
}

/** Published servicios from WP CPT `servicio` (PT source, translated when needed). */
export async function getWpServices(
  limit = 12,
  locale: Locale = "pt"
): Promise<WpService[]> {
  try {
    const url = wpRest("/wp/v2/servicio", {
      per_page: String(limit),
      _embed: "1",
      orderby: "date",
      order: "desc",
      status: "publish",
    });

    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as WpServicio[];
    if (!Array.isArray(data) || data.length === 0) return [];

    const services = data
      .map(mapServicio)
      .filter((s): s is WpService => Boolean(s));
    if (locale === "pt" || services.length === 0) return services;

    const titles = services.map((s) =>
      s.lines
        .flat()
        .map((line) => line.text)
        .join(" ")
    );
    const tags = services.map((s) => s.tag);
    const [tTitles, tTags] = await Promise.all([
      translateTexts(titles, locale),
      translateTexts(tags, locale),
    ]);

    return services.map((s, i) => {
      const translatedTitle = tTitles[i] || titles[i];
      return {
        ...s,
        tag: (tTags[i] || s.tag).toUpperCase(),
        lines: titleToServiceLines(translatedTitle),
      };
    });
  } catch {
    return [];
  }
}

export type WpClient = {
  id: number;
  title: string;
  logo: string;
  /** silhouette = force white mark; knockout = invert so light bg disappears on dark */
  logoTone: "silhouette" | "knockout";
};

type WpCliente = {
  id: number;
  title?: WpRendered;
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
  };
};

function mapCliente(post: WpCliente): WpClient | null {
  const title = stripHtml(post.title?.rendered || "");
  if (!title) return null;
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  // Opaque light-backed marks (e.g. 3HB) break with brightness(0) invert
  const logoTone =
    /3hb/i.test(title) || /3hb/i.test(media?.source_url || "")
      ? "knockout"
      : "silhouette";

  return {
    id: post.id,
    title,
    logo: pickImage(media),
    logoTone,
  };
}

/** Published clients from WP CPT `clientes` (title + featured image as logo). */
export async function getWpClients(limit = 40): Promise<WpClient[]> {
  try {
    const url = wpRest("/wp/v2/clientes", {
      per_page: String(limit),
      _embed: "1",
      orderby: "title",
      order: "asc",
      status: "publish",
    });

    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as WpCliente[];
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map(mapCliente).filter((c): c is WpClient => Boolean(c));
  } catch {
    return [];
  }
}
