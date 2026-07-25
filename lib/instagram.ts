export type InstagramPost = {
  id: string;
  image: string;
  permalink: string;
  year: string;
  place: string;
};

/** Fallback until Graph API credentials are provided */
export const placeholderPosts: InstagramPost[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
    permalink: "https://www.instagram.com/belluxentertainment",
    year: "2025",
    place: "Algarve",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=900&q=80",
    permalink: "https://www.instagram.com/belluxentertainment",
    year: "2025",
    place: "Portimão",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
    permalink: "https://www.instagram.com/belluxentertainment",
    year: "2024",
    place: "Lisboa",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80",
    permalink: "https://www.instagram.com/belluxentertainment",
    year: "2024",
    place: "Huelva",
  },
  {
    id: "5",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80",
    permalink: "https://www.instagram.com/belluxentertainment",
    year: "2024",
    place: "Faro",
  },
  {
    id: "6",
    image:
      "https://images.unsplash.com/photo-1482517969863-f23c920ce9ca?auto=format&fit=crop&w=900&q=80",
    permalink: "https://www.instagram.com/belluxentertainment",
    year: "2023",
    place: "Lagos",
  },
];

type GraphMedia = {
  id: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  media_type?: string;
};

/**
 * Fetches latest posts when INSTAGRAM_ACCESS_TOKEN is set.
 * Needs an Instagram Business/Creator account + long-lived token.
 */
export async function getInstagramPosts(
  limit = 8
): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID ?? "me";

  if (!token) return placeholderPosts;

  try {
    const fields = "id,media_url,thumbnail_url,permalink,timestamp,media_type";
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=${limit}&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return placeholderPosts;

    const data = (await res.json()) as { data?: GraphMedia[] };
    const items = (data.data ?? [])
      .filter((m) => m.media_type !== "VIDEO" || m.thumbnail_url || m.media_url)
      .map((m) => {
        const year = m.timestamp
          ? String(new Date(m.timestamp).getFullYear())
          : "";
        return {
          id: m.id,
          image: m.thumbnail_url || m.media_url || "",
          permalink:
            m.permalink || "https://www.instagram.com/belluxentertainment",
          year,
          place: "Bellux",
        };
      })
      .filter((p) => p.image);

    return items.length ? items : placeholderPosts;
  } catch {
    return placeholderPosts;
  }
}
