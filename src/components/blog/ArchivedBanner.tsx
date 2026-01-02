import React from "react";
import { Callout } from "@/components/common/Callout";
import { Link } from "@/components/common/Link";
import { Button } from "@/components/ui/button";
import { paths } from "@/lib/utils/url";

export function ArchivedBanner() {
  return (
    <Callout
      variant="warning"
      icon="package"
      title="This post is archived"
      className="mb-8"
    >
      <p className="mb-6">
        This post is no longer actively maintained and may contain outdated
        information.
      </p>
      <Button variant="secondary">
        <Link path={paths.blogPosts()} variant="none">
          Back to the blog
        </Link>
      </Button>
    </Callout>
  );
}
