import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    children: ReactNode;
    className?: string;
}

const styles = {
    h1: "text-4xl font-bold mb-8",
    h2: "text-2xl font-bold mb-4",
    h3: "text-lg font-semibold mb-2",
    h4: "text-base font-semibold mb-1",
    h5: "text-sm font-semibold",
    h6: "text-xs font-semibold",
};

export function Heading({ as: Component = "h1", children, className }: HeadingProps) {
    return (
        <Component className={cn(styles[Component], className)}>
            {children}
        </Component>
    );
}
