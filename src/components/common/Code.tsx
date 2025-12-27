"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface CodeBlockProps {
  children: string;
  language?: string;
}

export function CodeBlock({ children, language }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <pre>
        <code>{children}</code>
      </pre>
    );
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 bg-muted dark:border-gray-800">
      <SyntaxHighlighter
        language={language || "text"}
        style={resolvedTheme === "dark" ? oneDark : oneLight}
        className="!m-0 !bg-transparent !p-4 !text-sm !leading-relaxed"
        codeTagProps={{
          className: "font-mono",
        }}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  );
}

interface InlineCodeProps {
  children: React.ReactNode;
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
      {children}
    </code>
  );
}
