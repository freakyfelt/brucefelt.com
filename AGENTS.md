# Agents file

## Project instructions

This is a Next.js static site generation (SSG) project that generates a static website hosted via S3+CloudFront CDN.

- All pages must be renderable via static site generation (SSG) and not be server side rendered (SSR) or client side rendered (CSR)
- After any refactoring or file deletions, you MUST run the full test suite (`npm run test`) to ensure no broken imports or regressions.
- When splitting or moving components, prefer keeping related components and their shared styles/variants in a single file if they are tightly coupled.
- Blog posts are managed using MDX 3.x. Content is stored in `src/content/posts` as `.mdx` files.

## Project structure

- `src/app` - Contains the Next.js pages and non-reusable components
- `src/components` - Contains the React components used by the pages
  - `ui` - Reserved for shadcn components. Only use shadcn components here and never modify them directly
  - `common` - Shared components
  - `pages` - Page-level elements
  - `posts` - Post-related components (e.g., `PostContent`, `PostList`)
- `src/content/posts` - Contains the blog post MDX files
- `src/lib/data` - Contains the data fetching functions (e.g., `posts.ts` for reading MDX files)
- `src/styles` - Contains the CSS files
- `public` - Contains the static assets

## Useful commands

- `npm run clean` - Clean the project by removing the `out` directory
- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run start` - Start the production server
- `npm run lint` - Run the linter in error mode
- `npm run format` - Run the linter in write mode
- `npm run test` - Run the tests using Vitest

## Dependencies

This project uses the following dependencies:

- Node.js 24 (can also be found in .nvmrc file)
- Typescript 5
- Next.js 16
- React 19
- Tailwind CSS 4
- Prettier 3
- ESlint 9
- Vitest 4
- React Testing Library
- MDX 3.x (`@next/mdx`, `@mdx-js/react`)
