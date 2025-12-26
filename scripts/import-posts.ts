import { importPosts } from "@/lib/data/posts";

importPosts()
  .then((imported) => {
    console.log(`Imported ${imported.length} posts.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  });
