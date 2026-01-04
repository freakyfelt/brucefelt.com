import { PageContent } from "@/components/layout/PageContent";
import { Heading } from "@/components/common/Heading";
import { ExternalLink } from "@/components/common/Link";
import { socials } from "@/lib/utils/url";
import { Text } from "@/components/common/Text";
import { ImageItem } from "@/components/images/ImageItem";
import { getImageById, staticImageAssets } from "@/lib/data/assets";

export default async function AboutPage() {
  const selfPortrait = await getImageById(staticImageAssets.self);

  return (
    <PageContent>
      <Heading as="h1">About Me</Heading>
      <article>
        <aside className="inline-block md:float-right mb-4 md:ml-4 w-[400px] max-w-full">
          <ImageItem asset={selfPortrait} showCaption={false} priority />
        </aside>

        <div>
          <Text as="p">
            I&rsquo;m Bruce, a software engineer currently based out of Berlin,
            Germany. I grew up in Nebraska and moved to Seattle in 2012 for
            Amazon (2012-2018). From there I did a year in London, UK, and have
            been in Berlin since the start of 2020.
          </Text>

          <Text>
            In my career I&rsquo;ve worked for four Fortune 500 companies, a
            small start up, and various SaaS products ranging from tax and HR
            software through to CMS infrastructure powering some of the largest
            websites on the internet. Throughout my career I&rsquo;ve learned
            how to (and--sometimes more importantly--how not to) architect,
            write, and support software in various environments (cloud, on
            premise, air gapped) in a way that helps other people get their job
            done faster while attempting to balance right versus right now.
          </Text>

          <Text>
            My day to day these days is primarily Kotlin, though my favorite
            language is definitely still TypeScript, mostly on the backend. You
            can see a few open source projects I&rsquo;ve written (including
            this website) on my{" "}
            <ExternalLink href={socials.github}>GitHub</ExternalLink> account.
          </Text>

          <Heading as="h2">Job Opportunities</Heading>

          <Text>
            Right now I&rsquo;m not actively looking, but I&rsquo;m always
            keeping an eye out for interesting challenges. I&rsquo;ve worked in
            companies of all sizes and have been able to make a positive impact
            on their processes and ways of working, so it comes down to looking
            at what your current needs are, if I&rsquo;m looking to change
            things up, and if we match.
          </Text>

          <Text>
            Reach out to me on{" "}
            <ExternalLink href={socials.linkedin}>LinkedIn</ExternalLink> with
            your sales pitch and let&rsquo;s talk.
          </Text>
        </div>
      </article>
    </PageContent>
  );
}
