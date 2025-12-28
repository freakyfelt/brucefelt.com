import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

interface AlertBannerProps {
  title?: string;
  children: React.ReactNode;
  variant?: "info" | "warning";
  className?: string;
}

export function AlertBanner({
  title,
  children,
  variant = "info",
  className,
}: AlertBannerProps) {
  const iconName = variant === "info" ? "info" : "warning";
  const variantClasses =
    variant === "info"
      ? "border-blue-500/50 [&>svg]:text-blue-500"
      : "border-yellow-500/50 [&>svg]:text-yellow-500";

  return (
    <Alert className={cn("mb-6", variantClasses, className)}>
      <Icon name={iconName} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
