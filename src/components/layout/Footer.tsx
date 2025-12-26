import { Link } from "@/components/common/Link";
import { SocialLink } from "@/components/common/SocialLink";
import { paths } from "@/lib/utils/url";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link path="/" variant="nav">
            Home
          </Link>
          <Link path={paths.blogPosts()} variant="nav">
            Blog
          </Link>
          <Link path="/about" variant="nav">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <SocialLink target="github" variant="nav" />
          <SocialLink target="linkedin" variant="nav" />
          <SocialLink target="bluesky" variant="nav" />
          <SocialLink target="twitter" variant="nav" />
        </div>
      </div>
    </footer>
  );
}
