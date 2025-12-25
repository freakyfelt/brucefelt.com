import React from "react";
import { SiGithub, SiLinkedin, SiX, SiBluesky } from "react-icons/si";
import { StyledLink } from "@/components/common/StyledLink";

export type SocialLinkTarget = "github" | "twitter" | "bluesky" | "linkedin";

interface LinkConfig {
  icon: React.ElementType;
  url: string;
  label: string;
}

const LINK_CONFIGS: Record<SocialLinkTarget, LinkConfig> = {
  bluesky: {
    icon: SiBluesky,
    url: "https://bsky.app/profile/freakyfelt.bsky.social",
    label: "Bluesky",
  },
  github: {
    icon: SiGithub,
    url: "https://github.com/freakyfelt",
    label: "GitHub",
  },
  linkedin: {
    icon: SiLinkedin,
    url: "https://linkedin.com/in/brucefelt",
    label: "LinkedIn",
  },
  twitter: {
    icon: SiX,
    url: "https://x.com/freakyfelt",
    label: "Twitter (X)",
  },
};

interface SocialLinkProps {
  target: SocialLinkTarget;
  className?: string;
}

export function SocialLink({
  target: variant,
  className,
}: SocialLinkProps) {
  const { icon: Icon, url, label } = LINK_CONFIGS[variant];

  return (
    <StyledLink
      href={url}
      className={className}
      aria-label={label}
      variant="none"
    >
      <Icon className="h-5 w-5" />
    </StyledLink>
  );
}
