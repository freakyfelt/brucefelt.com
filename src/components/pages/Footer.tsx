import Link from "next/link";
import { ExternalLinkIcon } from "@/components/common/ExternalLinkIcon";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </Link>
          <Link
            href="/posts"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ExternalLinkIcon
            variant="github"
            className="text-foreground/60 hover:text-foreground/80 transition-colors"
          />
          <ExternalLinkIcon
            variant="linkedin"
            className="text-foreground/60 hover:text-foreground/80 transition-colors"
          />
          <ExternalLinkIcon
            variant="bluesky"
            className="text-foreground/60 hover:text-foreground/80 transition-colors"
          />
          <ExternalLinkIcon
            variant="twitter"
            className="text-foreground/60 hover:text-foreground/80 transition-colors"
          />
        </div>
      </div>
    </footer>
  );
}
