import { importPosts } from "@/lib/data/blog";

importPosts()
  .then((imported) => {
    console.log(
      `Imported ${imported.posts.length} posts and ${imported.tags.length} tags.`,
    );
    process.exit(0);
  })
  .catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  });
