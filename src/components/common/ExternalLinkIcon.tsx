import React from "react";
import { SiGithub, SiLinkedin, SiX, SiBluesky } from "react-icons/si";

export type ExternalLinkVariant = "github" | "twitter" | "bluesky" | "linkedin";

interface LinkConfig {
  icon: React.ElementType;
  url: string;
  label: string;
}

const LINK_CONFIGS: Record<ExternalLinkVariant, LinkConfig> = {
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

interface ExternalLinkIconProps {
  variant: ExternalLinkVariant;
  className?: string;
}

export function ExternalLinkIcon({
  variant,
  className,
}: ExternalLinkIconProps) {
  const { icon: Icon, url, label } = LINK_CONFIGS[variant];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
