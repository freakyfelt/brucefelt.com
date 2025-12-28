import { Project } from "@/interfaces/project";

const FEATURED_PROJECTS: Project[] = [
  {
    name: "@freakyfelt/secrets-js",
    url: "https://github.com/freakyfelt/secrets-js",
    description:
      "Simple and secure fetching of secrets from AWS Secrets Manager",
    icon: "github",
  },
  {
    name: "@freakyfelt/could-could",
    url: "https://github.com/freakyfelt/could-could",
    description: "An authorization library built on top of JsonLogic",
    icon: "github",
  },
  {
    name: "@freakyfelt/yet-another-json-rpc",
    url: "https://github.com/freakyfelt/yet-another-json-rpc",
    description: "Create RPC-oriented APIs on OpenAPI 3.1",
    icon: "github",
  },
];

export async function getFeaturedProjects(): Promise<Project[]> {
  return FEATURED_PROJECTS;
}
