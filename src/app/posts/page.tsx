import { paths } from "@/lib/utils/url";
import { permanentRedirect } from "next/navigation";

export default function PostsRedirect() {
  permanentRedirect(paths.blogPosts());
}
