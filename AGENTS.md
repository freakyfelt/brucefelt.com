# Agents file

## Project instructions

This is a Next.js static site generation (SSG) project that generates a static website hosted via S3+CloudFront CDN.

- All pages must be renderable via static site generation (SSG) and not be server side rendered (SSR) or client side rendered (CSR)


## Project structure

- `src/app` - Contains the Next.js pages and non-reusable components
- `src/components` - Contains the React components used by the pages
- `src/lib/data` - Contains the data fetching functions
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
