import React from "react";
import { ExternalLink, type ExternalLinkProps } from "@/components/common/Link";
import { Icon, type IconName } from "@/components/common/Icon";
import { socials } from "@/lib/utils/url";

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
    url: socials.bluesky,
    label: "Bluesky (freakyfelt.bsky.social)",
  },
  github: {
    icon: "github",
    url: socials.github,
    label: "GitHub (freakyfelt)",
  },
  linkedin: {
    icon: "linkedin",
    url: socials.linkedin,
    label: "LinkedIn",
  },
  twitter: {
    icon: "twitter",
    url: socials.twitter,
    label: "Twitter (@freakyfelt)",
  },
  instagram: {
    icon: "instagram",
    url: socials.instagram,
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
