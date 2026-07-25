/**
 * WordPress media / API base for Bellux.
 * Point NEXT_PUBLIC_WP_URL at the WP install that serves uploads & REST.
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

export const wpMedia = {
  heroVideo: wpUpload("2026/07/hero.mp4"),
} as const;
