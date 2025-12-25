import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <main className={cn("container mx-auto px-4 py-8", className)}>
      {children}
    </main>
  );
}
