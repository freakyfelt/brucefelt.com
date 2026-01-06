import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon, IconName } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "warning" | "error" | "success";

interface CalloutProps {
  title?: string;
  children: React.ReactNode;
  variant?: CalloutVariant;
  icon?: IconName;
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
  error: {
    className: "border-red-500/50 [&>svg]:text-red-500",
    iconName: "warning",
  },
  success: {
    className: "border-green-500/50 [&>svg]:text-green-500",
    iconName: "success",
  },
};

export function Callout({
  title,
  children,
  variant = "info",
  icon,
  className,
}: CalloutProps) {
  const { className: variantClassName, iconName: defaultIconName } =
    VARIANT_CONFIG[variant];

  return (
    <Alert className={cn("mb-6", variantClassName, className)}>
      <Icon name={icon || defaultIconName} />
      {title && <AlertTitle>{title}</AlertTitle>}
      {children && (
        <AlertDescription className="[&_p:last-child]:mb-0">
          {children}
        </AlertDescription>
      )}
    </Alert>
  );
}
