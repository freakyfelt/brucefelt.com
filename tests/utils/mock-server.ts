import { setupServer } from "msw/node";
import { graphql, HttpResponse } from "msw";

export type MockQuery = {
  operationName: string;
  variables?: Record<string, unknown>;
  response: {
    data?: unknown;
    errors?: unknown[];
  };
};

export class MockGraphQLServer {
  private server = setupServer();
  private expectedQueries: MockQuery[] = [];

  constructor() {
    this.server.use(
      graphql.operation(async ({ operationName, variables }) => {
        const index = this.expectedQueries.findIndex((expected) => {
          const nameMatches = expected.operationName === operationName;
          const variablesMatch =
            !expected.variables ||
            this.isDeepEqual(expected.variables, variables);

          return nameMatches && variablesMatch;
        });

        if (index !== -1) {
          const expected = this.expectedQueries.splice(index, 1)[0];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return HttpResponse.json(expected.response as any);
        }

        console.error("Unexpected query received:");
        console.error("Operation Name:", operationName);
        console.error("Variables:", JSON.stringify(variables, null, 2));
        console.error(
          "Expected queries remaining:",
          this.expectedQueries.length,
        );
        this.expectedQueries.forEach((q, i) => {
          console.error(`Expected ${i}:`, q.operationName);
          console.error(
            `Expected Variables ${i}:`,
            JSON.stringify(q.variables, null, 2),
          );
        });

        return HttpResponse.json(
          {
            errors: [{ message: `Unexpected query: ${operationName}` }],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
          { status: 400 },
        );
      }),
    );
  }

  private isDeepEqual(obj1: unknown, obj2: unknown): boolean {
    if (obj1 === obj2) return true;
    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    )
      return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
      if (
        !keys2.includes(key) ||
        !this.isDeepEqual(
          (obj1 as Record<string, unknown>)[key],
          (obj2 as Record<string, unknown>)[key],
        )
      )
        return false;
    }
    return true;
  }

  expectQuery(query: MockQuery) {
    this.expectedQueries.push(query);
  }

  start() {
    this.server.listen({ onUnhandledRequest: "error" });
  }

  stop() {
    this.server.close();
  }

  reset() {
    this.server.resetHandlers();
    this.expectedQueries = [];
  }

  verify() {
    if (this.expectedQueries.length > 0) {
      throw new Error(
        `Expected queries were not called: ${this.expectedQueries
          .map((q) => q.operationName)
          .join(", ")}`,
      );
    }
  }
}
