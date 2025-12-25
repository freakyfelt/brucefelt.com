import { StyledLink } from "@/components/common/Link";
import { SocialLink } from "@/components/common/SocialLink";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <StyledLink href="/" variant="nav">
            Home
          </StyledLink>
          <StyledLink href="/posts" variant="nav">
            Blog
          </StyledLink>
          <StyledLink href="/about" variant="nav">
            About
          </StyledLink>
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
