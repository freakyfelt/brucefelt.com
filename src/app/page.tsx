import { PageContent } from "@/components/layout/PageContent";
import { Heading } from "@/components/common/Heading";
import { getRecentPosts } from "@/lib/data/blog";
import { PostList } from "@/components/blog/PostList";
import { ProjectList } from "@/components/projects/ProjectList";
import { getFeaturedProjects } from "@/lib/data/projects";

export default async function Home() {
  const recentPosts = await getRecentPosts();
  const featuredProjects = await getFeaturedProjects();

  return (
    <PageContent>
      <div className="mb-6">
        <p>Welcome to the overhauled website</p>
      </div>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 md:grid-cols-2">
        <section className="space-y-4 lg:col-span-6">
          <Heading as="h2">Recent Posts</Heading>
          <PostList posts={recentPosts} variant="compact" />
        </section>
        <section className="space-y-4 lg:col-span-5 lg:col-start-8">
          <Heading as="h2">Personal Projects</Heading>
          <ProjectList projects={featuredProjects} />
        </section>
      </div>
    </PageContent>
  );
}
