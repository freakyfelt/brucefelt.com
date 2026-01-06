import React from "react";
import {
  SiGithub,
  SiLinkedin,
  SiX,
  SiBluesky,
  SiInstagram,
} from "react-icons/si";
import {
  LuSun,
  LuMoon,
  LuTriangleAlert,
  LuInfo,
  LuPackage,
  LuMenu,
  LuCheck,
  LuCircleX,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

export const ICONS = {
  github: SiGithub,
  linkedin: SiLinkedin,
  twitter: SiX,
  bluesky: SiBluesky,
  instagram: SiInstagram,
  sun: LuSun,
  moon: LuMoon,
  error: LuCircleX,
  info: LuInfo,
  warning: LuTriangleAlert,
  package: LuPackage,
  menu: LuMenu,
  success: LuCheck,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName;
}

export function Icon({ name, className, ...props }: IconProps) {
  const IconComponent = ICONS[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={cn("h-4 w-4", className)} {...props} />;
}
