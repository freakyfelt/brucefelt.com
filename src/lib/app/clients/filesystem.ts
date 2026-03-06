import fs from "fs";
import path from "path";
import Yaml from "yaml";
import z from "zod";

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

  forMdx<TRaw extends HasSlug & HasContent, T extends HasSlug>(
    config: Omit<MarkdownFilesystemStorageConfig, "rootDir">,
  ) {
    return new MdxFilesystemStorage<TRaw, T>({
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

  /**
   * Reads all files as plain text, parsing YAML frontmatter and returning
   * the raw data without going through the MDX compiler.
   */
  async readAllAsText(): Promise<TRaw[]> {
    this.assertBasePath();

    const allData = this.listFiles().map(async (file) => {
      const text = await file.text();
      const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!match) {
        throw new Error(`Invalid frontmatter in ${file.name}`);
      }
      const frontmatter = Yaml.parse(match[1]);
      const content = match[2].trim();
      return { ...frontmatter, content } as unknown as TRaw;
    });

    return Promise.all(allData);
  }

  async read(slug: string): Promise<T | null> {
    this.assertBasePath();

    if (!slug) {
      throw new Error("slug is required");
    }

    const file = this.getFile(slug);
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

  private getFile(slug: string): File | null {
    const fileName = `${slug}.${this.config.extension}`;
    const filePath = path.join(this.basePath, fileName);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return {
      slug,
      name: fileName,
      absolutePath: filePath,
      path: path.join(this.config.pathPrefix, fileName),
      text: async () => fs.readFileSync(filePath, "utf8"),
    };
  }

  protected listFiles(): File[] {
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

  protected assertBasePath() {
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
> & {
  schema?: z.ZodObject<z.ZodRawShape>;
};

/**
 * Handles reading and writing JSON to the filesystem
 *
 * Each file will be named after the slug of the object, e.g. [slug].json
 */
export class JsonFilesystemStorage<
  T extends HasSlug,
> extends BaseFilesystemStorage<T, T> {
  private schema?: z.ZodObject<z.ZodRawShape>;

  constructor(jsonConfig: JsonFilesystemStorageConfig) {
    super({
      extension: "json",
      ...jsonConfig,
    });

    this.schema = jsonConfig.schema;
  }

  protected async encodeItem(item: T): Promise<string> {
    try {
      const validated = this.schema ? this.schema.parse(item) : item;
      return JSON.stringify(validated, null, 2);
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        throw new Error(`Cannot persist ${item.slug}: ${e}`, { cause: e });
      }
      throw e;
    }
  }

  protected async decodeItem(file: File): Promise<T> {
    const content = await file.text();
    const parsed = JSON.parse(content) as T;
    try {
      return this.schema ? (this.schema.parse(parsed) as T) : parsed;
    } catch (e: unknown) {
      throw new Error(`Error parsing content in ${file.path}: ${e}`, {
        cause: e,
      });
    }
  }
}

type MarkdownFilesystemStorageConfig = Omit<
  BaseFilesystemStorageConfig,
  "extension"
> & {
  schema?: z.ZodObject<z.ZodRawShape>;
};

/**
 * Outputs a markdown file with frontmatter
 */
export class MdxFilesystemStorage<
  TRaw extends HasContent & HasSlug,
  T extends HasSlug,
> extends BaseFilesystemStorage<T, TRaw> {
  private schema?: z.ZodObject<z.ZodRawShape>;

  constructor(private mdConfig: MarkdownFilesystemStorageConfig) {
    super({
      extension: "mdx",
      ...mdConfig,
    });

    this.schema = mdConfig.schema;
  }

  protected async encodeItem(item: TRaw): Promise<string> {
    const { content, ...rest } = item;

    const frontmatter = this.schema ? this.schema.parse(rest) : rest;
    const yaml = Yaml.stringify(frontmatter);

    return `---\n${yaml}---\n${content}\n`;
  }

  protected async decodeItem(file: File): Promise<T> {
    const { default: content, frontmatter: rest } = await import(
      `@data/${file.path}`
    );

    try {
      const frontmatter = this.schema ? this.schema.parse(rest) : rest;

      return { ...frontmatter, content } as unknown as T;
    } catch (e: unknown) {
      throw new Error(`Error parsing frontmatter in ${file.path}: ${e}`, {
        cause: e,
      });
    }
  }

  /**
   * Reads all .mdx files as plain text, parsing YAML frontmatter manually
   * and returning raw data with string content.
   *
   * Use this in build-time scripts where the MDX compiler is not available.
   * Handles both LF and CRLF line endings.
   */
  async readAllRaw(): Promise<TRaw[]> {
    this.assertBasePath();

    const allData = this.listFiles().map(async (file) => {
      const text = (await file.text()).replace(/\r\n/g, "\n");
      const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!match) {
        throw new Error(`Invalid frontmatter in ${file.name}`);
      }
      const frontmatter = Yaml.parse(match[1]);
      const content = match[2].trim();
      return { ...frontmatter, content } as unknown as TRaw;
    });

    return Promise.all(allData);
  }
}
