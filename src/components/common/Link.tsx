import Link from "next/link";
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

export interface StyledLinkProps
  extends
    React.ComponentPropsWithoutRef<typeof Link>,
    VariantProps<typeof linkVariants> {}

export const StyledLink = React.forwardRef<HTMLAnchorElement, StyledLinkProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(linkVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

StyledLink.displayName = "StyledLink";
