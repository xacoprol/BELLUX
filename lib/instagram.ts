export type InstagramPost = {
  id: string;
  image: string;
  permalink: string;
  year: string;
  place: string;
};

const PROFILE = "https://www.instagram.com/belluxentertainment";

/** Fallback until Graph API credentials are provided */
export const placeholderPosts: InstagramPost[] = [
  {
    id: "1",
    image: "/assets/images/instagram/1.png",
    permalink: PROFILE,
    year: "2025",
    place: "Algarve",
  },
  {
    id: "2",
    image: "/assets/images/instagram/2.png",
    permalink: PROFILE,
    year: "2025",
    place: "Hotel",
  },
  {
    id: "3",
    image: "/assets/images/instagram/3.png",
    permalink: PROFILE,
    year: "2025",
    place: "Natal",
  },
  {
    id: "4",
    image: "/assets/images/instagram/4.png",
    permalink: PROFILE,
    year: "2024",
    place: "Show",
  },
  {
    id: "5",
    image: "/assets/images/instagram/5.png",
    permalink: PROFILE,
    year: "2024",
    place: "Temático",
  },
  {
    id: "6",
    image: "/assets/images/instagram/6.png",
    permalink: PROFILE,
    year: "2024",
    place: "Animação",
  },
  {
    id: "7",
    image: "/assets/images/instagram/7.png",
    permalink: PROFILE,
    year: "2024",
    place: "Espetáculo",
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
          permalink: m.permalink || PROFILE,
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
