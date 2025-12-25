/* eslint-disable no-restricted-imports */
import NextLink from "next/link";
/* eslint-enable no-restricted-imports */
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

export const linkVariants = cva(
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
  {
    variants: {
      variant: {
        default: "text-foreground hover:underline",
        nav: "text-foreground/60 hover:text-foreground/80",
        heading: "hover:text-primary",
        muted: "text-muted-foreground hover:text-foreground",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ExternalLinkProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {}

export const ExternalLink = React.forwardRef<
  HTMLAnchorElement,
  ExternalLinkProps
>(({ className, variant, ...props }, ref) => {
  return (
    <a
      ref={ref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(linkVariants({ variant, className }))}
      {...props}
    />
  );
});

ExternalLink.displayName = "ExternalLink";

export interface LinkProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof NextLink>, "href">,
    VariantProps<typeof linkVariants> {
  path: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, path, ...props }, ref) => {
    if (!path.startsWith("/") && !path.startsWith("#")) {
      throw new Error(
        `Link should not be used for absolute URLs: ${path}. Use ExternalLink instead.`,
      );
    }

    return (
      <NextLink
        ref={ref}
        href={path}
        className={cn(linkVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

Link.displayName = "Link";
