export type ContentfulConfig = {
  spaceId?: string;
  accessToken?: string;
};

export class ContentfulGraphQLClient {
  constructor(private config: ContentfulConfig) {}

  async fetch(query: string, variables: Record<string, unknown> = {}) {
    const {
      spaceId: CONTENTFUL_SPACE_ID,
      accessToken: CONTENTFUL_ACCESS_TOKEN,
    } = this.config;
    if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
      throw new Error("Contentful credentials are not set");
    }
    const res = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ query, variables }),
      },
    );
    if (!res.ok) {
      console.error("GraphQL Error:", await res.text());
      throw new Error("Failed to fetch data from Contentful");
    }
    return res.json();
  }

  /**
   * uses a skip/limit approach to fetch all results
   */
  async batchFetch<TOut>(
    query: string,
    variables: Record<string, unknown> = {},
    batchSize: number = 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformer: (data: any) => TOut[],
  ): Promise<TOut[]> {
    const results: TOut[] = [];
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const res = await this.fetch(query, {
        ...variables,
        skip,
        limit: batchSize,
      });
      const batchResults = transformer(res.data);
      results.push(...batchResults);
      hasMore = batchResults.length === batchSize;
      skip += batchSize;
    }

    return results;
  }
}
