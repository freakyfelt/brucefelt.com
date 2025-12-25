import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const linkVariants = cva(
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

export interface StyledLinkProps
  extends
    React.ComponentPropsWithoutRef<typeof Link>,
    VariantProps<typeof linkVariants> {
  external?: boolean;
}

export const StyledLink = React.forwardRef<HTMLAnchorElement, StyledLinkProps>(
  ({ className, variant, external, ...props }, ref) => {
    const isExternal =
      external ||
      (typeof props.href === "string" && props.href.startsWith("http"));

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={props.href.toString()}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkVariants({ variant, className }))}
        >
          {props.children}
        </a>
      );
    }

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
