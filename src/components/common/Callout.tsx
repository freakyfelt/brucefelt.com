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
  error: {
    className:
      "border-red-500 bg-red-50 dark:bg-red-500/5 [&>svg]:text-red-500",
    iconName: "error",
  },
  info: {
    className:
      "border-blue-500 bg-blue-50 dark:bg-blue-500/5 [&>svg]:text-blue-500",
    iconName: "info",
  },
  success: {
    className:
      "border-green-500 bg-green-50 dark:bg-green-500/5 [&>svg]:text-green-500",
    iconName: "success",
  },
  warning: {
    className:
      "border-yellow-500 bg-yellow-50 dark:bg-yellow-500/5 [&>svg]:text-yellow-500",
    iconName: "warning",
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
