import fs from "fs";
import path from "path";

type HasSlug = {
  slug: string;
};

type WriteOptions = {
  deleteExisting?: boolean;
};

/**
 * Handles reading and writing JSON to the filesystem
 *
 * Each file will be named after the slug of the object, e.g. [slug].json
 */
export class FilesystemStorage<T extends HasSlug> {
  constructor(private basePath: string) {}

  /** reads all JSON files in the basePath directory */
  async readAll(): Promise<T[]> {
    if (!fs.existsSync(this.basePath)) {
      throw new Error(
        `No data found in the data directory. Need to run \`npm run import\``,
      );
    }

    const fileNames = fs.readdirSync(this.basePath);
    const allData = fileNames
      .filter((fileName) => fileName.endsWith(".json"))
      .map((fileName) => {
        const filePath = path.join(this.basePath, fileName);
        const fileContent = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContent) as T;
      });

    return allData;
  }

  /** writes all items to the filesystem and returns the list of paths */
  async writeAll(
    items: T[],
    { deleteExisting = false }: WriteOptions = {},
  ): Promise<string[]> {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
    if (deleteExisting) {
      await this.deleteAll();
    }

    const paths: string[] = [];
    for (const item of items) {
      const filePath = path.join(this.basePath, `${item.slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
      paths.push(filePath);
    }
    return paths;
  }

  /** deletes all JSON files in the basePath directory */
  async deleteAll(): Promise<void> {
    if (!fs.existsSync(this.basePath)) {
      return;
    }

    const fileNames = fs.readdirSync(this.basePath);
    fileNames
      .filter((fileName) => fileName.endsWith(".json"))
      .forEach((fileName) => {
        const filePath = path.join(this.basePath, fileName);
        fs.unlinkSync(filePath);
      });
  }
}
