import { graphql } from "@/lib/datocms/graphql";
import { executeTypedQuery } from "@/lib/datocms/executeTypedQuery";
import { Page, SlugToIdMap } from "@/types/types";

// This shared instance of the promise can be re-used across different pages
let slugToIdMapPromise: Promise<SlugToIdMap> | undefined;

let numberOfTimesCalled = 0;

const allPagesQuery = graphql(`
  query PagesQuery {
    allPages(
      first: 100
      filter: { parent: { exists: false } }
      orderBy: position_ASC
    ) {
      ...PageFragment
      children {
        ...PageFragment
        children {
          ...PageFragment
          # And however deep your hierarchy goes
        }
      }
    }
  }

  fragment PageFragment on PageRecord {
    position
    slug
    id
    title
  }
`);

export async function getSlugToIdMap(): Promise<SlugToIdMap> {
  if (slugToIdMapPromise) {
    return slugToIdMapPromise;
  }

  numberOfTimesCalled++;
  console.log(`Calling getSlugToIdMap() #${numberOfTimesCalled}`);

  slugToIdMapPromise = (async () => {
    const data = (await executeTypedQuery(allPagesQuery)) as {
      allPages: Page[];
    };

    function buildMap(
      pages: Page[],
      parentSlug: string[] = [],
    ): Record<string, string> {
      return pages.reduce<SlugToIdMap>((accumulator, page) => {
        const currentSlug = [...parentSlug, page.slug];
        const slugPath = currentSlug.join("/");

        const currentEntry = { [slugPath]: page.id };

        const childrenEntries =
          page.children && page.children.length > 0
            ? buildMap(page.children, currentSlug)
            : {};

        return {
          ...accumulator,
          ...currentEntry,
          ...childrenEntries,
        };
      }, {});
    }

    const slugToIdMap = buildMap(data.allPages);

    return slugToIdMap;
  })();

  return slugToIdMapPromise;
}