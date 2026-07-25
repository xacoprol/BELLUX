import { getInstagramPosts } from "@/lib/instagram";
import Instagram from "./Instagram";

export default async function InstagramSection() {
  const posts = await getInstagramPosts();
  return <Instagram posts={posts} />;
}
