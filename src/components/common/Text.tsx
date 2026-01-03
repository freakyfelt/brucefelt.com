import { cn } from "@/lib/utils";

type TextProps = {
  as?: "p" | "span";
  children: React.ReactNode;
  className?: string;
};

const styles = {
  p: "text-base mb-4",
  span: "text-base inline",
};

export function Text({ as: Component = "p", children, className }: TextProps) {
  return (
    <Component className={cn(styles[Component], className)}>
      {children}
    </Component>
  );
}
