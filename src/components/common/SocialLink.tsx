import React from "react";
import { ExternalLink, type ExternalLinkProps } from "@/components/common/Link";
import { Icon, type IconName } from "@/components/common/Icon";

export type SocialLinkTarget =
  | "github"
  | "twitter"
  | "bluesky"
  | "linkedin"
  | "instagram";

interface LinkConfig {
  icon: IconName;
  url: string;
  label: string;
}

const LINK_CONFIGS: Record<SocialLinkTarget, LinkConfig> = {
  bluesky: {
    icon: "bluesky",
    url: "https://bsky.app/profile/freakyfelt.bsky.social",
    label: "Bluesky (freakyfelt.bsky.social)",
  },
  github: {
    icon: "github",
    url: "https://github.com/freakyfelt",
    label: "GitHub (freakyfelt)",
  },
  linkedin: {
    icon: "linkedin",
    url: "https://linkedin.com/in/brucefelt",
    label: "LinkedIn",
  },
  twitter: {
    icon: "twitter",
    url: "https://x.com/freakyfelt",
    label: "Twitter (@freakyfelt)",
  },
  instagram: {
    icon: "instagram",
    url: "https://instagram.com/freakyfelt",
    label: "Instagram (@freakyfelt)",
  },
} as const;

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
  const { icon, url, label } = LINK_CONFIGS[target];

  return (
    <ExternalLink
      href={url}
      className={className}
      aria-label={label}
      title={label}
      variant={variant}
    >
      <Icon name={icon} className="h-5 w-5" />
    </ExternalLink>
  );
}
