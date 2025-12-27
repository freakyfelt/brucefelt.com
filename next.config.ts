import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  pageExtensions: ["js", "jsx", "ts", "tsx", "md"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      "remark-mdx-frontmatter",
      "remark-gfm",
      "remark-rehype",
      ["@shikijs/rehype", {
        themes: {
          light: "github-light",
          dark: "github-dark",
        }
      }],
    ],
  },
});

export default withMDX(nextConfig);
