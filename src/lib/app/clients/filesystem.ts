import fs from "fs";
import path from "path";
import Yaml from "yaml";

type HasSlug = {
  slug: string;
};

export type HasContent = {
  content: string;
};

type WriteOptions = {
  deleteExisting?: boolean;
};

type File = {
  slug: string;
  name: string;
  /** fully qualified path */
  absolutePath: string;
  /** Path relative to the rootDir */
  path: string;
  text(): Promise<string>;
};

export type StorageConfig = {
  rootDir: string;
};

export class FilesystemStorage {
  constructor(private config: StorageConfig) {}

  forJSON<T extends HasSlug>(
    config: Omit<JsonFilesystemStorageConfig, "rootDir">,
  ) {
    return new JsonFilesystemStorage<T>({
      rootDir: this.config.rootDir,
      ...config,
    });
  }

  forMarkdown<TRaw extends HasSlug & HasContent, T extends HasSlug>(
    config: Omit<MarkdownFilesystemStorageConfig, "rootDir">,
  ) {
    return new MarkdownFilesystemStorage<TRaw, T>({
      rootDir: this.config.rootDir,
      ...config,
    });
  }
}

type BaseFilesystemStorageConfig = {
  /** the directory where all data is stored */
  rootDir: string;

  /** the subdirectory for all documents for this collection */
  pathPrefix: string;

  /** the file extension for all documents for this collection */
  extension: string;
};

const PATH_PREFIX_RE = new RegExp("[A-z0-9][a-z0-9\\-\\_\\/]*");

class BaseFilesystemStorage<T extends HasSlug, TRaw extends HasSlug> {
  private readonly basePath: string;
  constructor(private config: BaseFilesystemStorageConfig) {
    if (!PATH_PREFIX_RE.test(config.pathPrefix)) {
      throw new Error(
        `pathPrefix must be relative to DATA_DIR (received ${config.pathPrefix})`,
      );
    }
    this.basePath = path.join(config.rootDir, config.pathPrefix);
  }

  async readAll(): Promise<T[]> {
    this.assertBasePath();

    const allData = this.listFiles().map(async (file) => {
      return this.decodeItem(file);
    });

    return Promise.all(allData);
  }

  async read(slug: string): Promise<T | null> {
    const file = this.listFiles().find((f) => f.slug === slug);
    if (!file) {
      return null;
    }
    return this.decodeItem(file);
  }

  /** writes all items to the filesystem and returns the list of paths */
  async writeAll(
    items: TRaw[],
    { deleteExisting = false }: WriteOptions = {},
  ): Promise<string[]> {
    this.ensureBasePath();

    if (deleteExisting) {
      await this.deleteAll();
    }

    const paths: string[] = [];
    for (const item of items) {
      const filePath = path.join(
        this.basePath,
        `${item.slug}.${this.config.extension}`,
      );
      fs.writeFileSync(filePath, await this.encodeItem(item));
      paths.push(filePath);
    }
    return paths;
  }

  /** deletes all stored files in the basePath directory */
  async deleteAll(): Promise<void> {
    if (!fs.existsSync(this.basePath)) {
      return;
    }

    this.listFiles().forEach((file) => {
      fs.unlinkSync(file.absolutePath);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected decodeItem(_file: File): Promise<T> {
    throw new Error("Method not implemented.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected encodeItem(_item: TRaw): Promise<string> {
    throw new Error("Method not implemented.");
  }

  private listFiles(): File[] {
    const fileNames = fs
      .readdirSync(this.basePath)
      .filter((fileName) => fileName.endsWith(this.config.extension));

    return fileNames.map((fileName) => {
      const slug = fileName.replace(`.${this.config.extension}`, "");
      const filePath = path.join(this.config.pathPrefix, fileName);
      const absolutePath = path.join(this.basePath, fileName);
      return {
        slug,
        name: fileName,
        absolutePath,
        path: filePath,
        text: async () => fs.readFileSync(absolutePath, "utf8"),
      };
    });
  }

  private assertBasePath() {
    if (!fs.existsSync(this.basePath)) {
      throw new Error(
        `No data found in the data directory. Need to run \`npm run import\``,
      );
    }
  }

  private ensureBasePath() {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }
}

export type JsonFilesystemStorageConfig = Omit<
  BaseFilesystemStorageConfig,
  "extension"
>;

/**
 * Handles reading and writing JSON to the filesystem
 *
 * Each file will be named after the slug of the object, e.g. [slug].json
 */
export class JsonFilesystemStorage<
  T extends HasSlug,
> extends BaseFilesystemStorage<T, T> {
  constructor(jsonConfig: JsonFilesystemStorageConfig) {
    super({
      extension: "json",
      ...jsonConfig,
    });
  }

  protected async encodeItem(item: T): Promise<string> {
    return JSON.stringify(item, null, 2);
  }

  protected async decodeItem(file: File): Promise<T> {
    const content = await file.text();
    return JSON.parse(content) as T;
  }
}

type MarkdownFilesystemStorageConfig = Omit<
  BaseFilesystemStorageConfig,
  "extension"
>;

/**
 * Outputs a markdown file with frontmatter
 */
export class MarkdownFilesystemStorage<
  TRaw extends HasContent & HasSlug,
  T extends HasSlug,
> extends BaseFilesystemStorage<T, TRaw> {
  constructor(private mdConfig: MarkdownFilesystemStorageConfig) {
    super({
      extension: "mdx",
      ...mdConfig,
    });
  }
  protected async encodeItem(item: TRaw): Promise<string> {
    const { content, ...rest } = item;
    const yaml = Yaml.stringify(rest);

    return `---\n${yaml}---\n${content}\n`;
  }

  protected async decodeItem(file: File): Promise<T> {
    const { default: content, frontmatter } = await import(
      `@data/${file.path}`
    );

    return { ...frontmatter, content } as unknown as T;
  }
}
