import React from "react";
import { SiGithub, SiLinkedin, SiX, SiBluesky } from "react-icons/si";
import { ExternalLink, type ExternalLinkProps } from "@/components/common/Link";

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
  variant?: ExternalLinkProps["variant"];
}

export function SocialLink({
  target,
  className,
  variant = "none",
}: SocialLinkProps) {
  const { icon: Icon, url, label } = LINK_CONFIGS[target];

  return (
    <ExternalLink
      href={url}
      className={className}
      aria-label={label}
      variant={variant}
    >
      <Icon className="h-5 w-5" />
    </ExternalLink>
  );
}
