import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PostList } from "./PostList";
import { Post } from "@/interfaces/post";

const mockPosts: Post[] = [
  {
    title: "Test Post 1",
    slug: "test-post-1",
    date: "2024-01-01",
    excerpt: "Excerpt 1",
    content: "Content 1",
  },
  {
    title: "Test Post 2",
    slug: "test-post-2",
    date: "2024-01-02",
    excerpt: "Excerpt 2",
    content: "Content 2",
  },
];

describe("PostList", () => {
  it("renders the default variant correctly", () => {
    render(<PostList posts={mockPosts} variant="default" />);

    expect(screen.getByLabelText("Post list")).toBeInTheDocument();
    expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    expect(screen.getByText("Excerpt 1")).toBeInTheDocument();
    // "2024-01-01" is now formatted as "January 1, 2024"
    expect(screen.getByText(/January 1, 2024/)).toBeInTheDocument();
  });

  it("renders the compact variant correctly", () => {
    render(<PostList posts={mockPosts} variant="compact" />);

    expect(screen.getByLabelText("Compact post list")).toBeInTheDocument();
    expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    expect(screen.queryByText("Excerpt 1")).not.toBeInTheDocument();
    // "2024-01-01" is now formatted as "January 1, 2024"
    expect(screen.getByText(/January 1, 2024/)).toBeInTheDocument();
  });

  it("links to the correct post slug", () => {
    render(<PostList posts={mockPosts} />);

    const link = screen.getByRole("link", { name: /test post 1/i });
    expect(link).toHaveAttribute("href", "/posts/test-post-1");
  });
});
