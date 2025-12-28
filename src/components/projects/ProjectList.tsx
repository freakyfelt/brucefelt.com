import * as React from "react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  ItemMedia,
} from "@/components/ui/item";
import { Project } from "@/interfaces/project";
import { Icon } from "@/components/common/Icon";
import { ExternalLink } from "../common/Link";

interface ProjectListProps {
  projects: Project[];
  variant?: "default" | "outline";
}

export function ProjectList({ projects, variant }: ProjectListProps) {
  return (
    <ItemGroup aria-label="Project list">
      {projects.map((project) => (
        <Item key={project.name} variant={variant} asChild>
          <ExternalLink href={project.url} variant="none">
            {project.icon === "github" && (
              <ItemMedia variant="icon">
                <Icon name="github" />
              </ItemMedia>
            )}
            <ItemContent>
              <ItemTitle>{project.name}</ItemTitle>
              <ItemDescription>{project.description}</ItemDescription>
            </ItemContent>
          </ExternalLink>
        </Item>
      ))}
    </ItemGroup>
  );
}
