import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PostList } from "./PostList";
import { post1, post2 } from "./__fixtures__/posts";

describe("PostList", () => {
  const mockPosts = [post1, post2];

  it("renders the default variant correctly", () => {
    render(<PostList posts={mockPosts} variant="default" />);

    expect(screen.getByLabelText("Post list")).toBeInTheDocument();
    expect(screen.getByText(post1.title)).toBeInTheDocument();
    expect(screen.getByText(post1.description)).toBeInTheDocument();
    // "2024-01-01" is now formatted as "January 1, 2024"
    expect(screen.getByText(/January 1, 2024/)).toBeInTheDocument();

    expect(screen.getByText(post2.title)).toBeInTheDocument();
    expect(screen.getByText(post2.description)).toBeInTheDocument();
    // "2024-01-02" is now formatted as "January 2, 2024"
    expect(screen.getByText(/January 2, 2024/)).toBeInTheDocument();
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
    expect(link).toHaveAttribute("href", "/blog/posts/test-post-1");
  });
});
