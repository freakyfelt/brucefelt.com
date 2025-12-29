import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon, IconName } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "warning";

interface CalloutProps {
  title?: string;
  children: React.ReactNode;
  variant?: CalloutVariant;
  className?: string;
}

type CalloutVariantConfig = {
  className: string;
  iconName: IconName;
};

const VARIANT_CONFIG: Record<CalloutVariant, CalloutVariantConfig> = {
  info: {
    className: "border-blue-500/50 [&>svg]:text-blue-500",
    iconName: "info",
  },
  warning: {
    className: "border-yellow-500/50 [&>svg]:text-yellow-500",
    iconName: "warning",
  },
};

export function Callout({
  title,
  children,
  variant = "info",
  className,
}: CalloutProps) {
  const { className: variantClassName, iconName } = VARIANT_CONFIG[variant];

  return (
    <Alert className={cn("mb-6", variantClassName, className)}>
      <Icon name={iconName} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
