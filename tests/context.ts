import fs from "fs";
import path from "path";
import os from "os";
import { AppContext, createAppContext } from "@/lib/app/context";
import { MockGraphQLServer } from "./utils/mock-server";

export type TestContext = AppContext & {
  mocks: {
    graphql: MockGraphQLServer;
  };
  teardown(): void;
};

export function createTestContext(): TestContext {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "brucefelt-test-"));
  const mockServer = new MockGraphQLServer();

  const context = createAppContext({
    contentful: {
      spaceId: "test-space",
      accessToken: "test-token",
    },
    storage: {
      rootDir: tmpDir,
    },
  });

  return {
    ...context,
    mocks: {
      graphql: mockServer,
    },
    teardown() {
      try {
        mockServer.stop();
      } catch (e) {
        console.error("Failed to stop mock server", e);
      }

      try {
        if (fs.existsSync(tmpDir)) {
          fs.rmSync(tmpDir, { recursive: true, force: true });
        }
      } catch (e) {
        console.error("Failed to remove temporary directory", e);
      }
    },
  };
}
