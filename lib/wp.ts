/**
 * WordPress media / API base for Bellux.
 * Point NEXT_PUBLIC_WP_URL at the WP install that serves uploads & REST.
 *
 * Note: pretty permalinks for /wp-json may 404 on this host — use ?rest_route=.
 */
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
  video?: string;
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
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/\s+/g, " ")
    .trim();
}

function pickImage(media?: WpMedia): string {
  if (!media) return "";
  const large = media.media_details?.sizes?.large?.source_url;
  const full = media.source_url;
  return large || full || "";
}

function pickVideoFromAcfOrMeta(post: WpProyecto): string | undefined {
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
      if (typeof val === "string" && /\.(mp4|webm|mov)(\?|$)/i.test(val)) {
        return val.startsWith("http") ? val : wpUrl(val);
      }
      if (val && typeof val === "object") {
        const obj = val as { url?: string; source_url?: string };
        const url = obj.url || obj.source_url;
        if (url && /\.(mp4|webm|mov)(\?|$)/i.test(url)) return url;
      }
    }
  }
  return undefined;
}

function pickVideoFromContent(html?: string): string | undefined {
  if (!html) return undefined;
  const src =
    html.match(/<video[^>]+src=["']([^"']+)["']/i)?.[1] ||
    html.match(/<source[^>]+src=["']([^"']+\.(?:mp4|webm|mov)[^"']*)["']/i)?.[1] ||
    html.match(/https?:\/\/[^\s"'<>]+\.(?:mp4|webm|mov)/i)?.[0];
  return src;
}

function mapProyecto(post: WpProyecto, index: number): WpProject {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const terms = (post._embedded?.["wp:term"] ?? []).flat();
  const category =
    terms.find((t) => t.taxonomy === "cat-proyecto")?.name ||
    terms[0]?.name ||
    "";

  const image = pickImage(media);
  const video =
    pickVideoFromAcfOrMeta(post) ||
    pickVideoFromContent(post.content?.rendered) ||
    (media?.mime_type?.startsWith("video/") ? media.source_url : undefined);

  return {
    id: post.id,
    title: stripHtml(post.title?.rendered || ""),
    description: stripHtml(post.excerpt?.rendered || ""),
    tag: category,
    image: image || "",
    video: video || undefined,
    accent: ACCENTS[index % ACCENTS.length],
  };
}

/** Latest published proyectos from WP CPT `proyecto`. */
export async function getWpProjects(limit = 12): Promise<WpProject[]> {
  try {
    const url = wpRest("/wp/v2/proyecto", {
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

    const data = (await res.json()) as WpProyecto[];
    if (!Array.isArray(data) || data.length === 0) return [];

    return data
      .map(mapProyecto)
      .filter((p) => p.title);
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

/** Published servicios from WP CPT `servicio` (title, excerpt as tag, featured image). */
export async function getWpServices(limit = 12): Promise<WpService[]> {
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

    return data.map(mapServicio).filter((s): s is WpService => Boolean(s));
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
