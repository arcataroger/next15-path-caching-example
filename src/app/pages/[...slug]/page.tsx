export const dynamic = 'force-static';
import {graphql} from '@/lib/datocms/graphql'
import {executeTypedQuery} from "@/lib/datocms/executeTypedQuery";
import {notFound} from "next/navigation";

function generatePaths(data) {
  const getPaths = (page, parentSlugs = []) => {
    const currentSlugs = [...parentSlugs, page.slug];
    // Collect the path for the current page
    const paths = [{ params: { slug: currentSlugs } }];

    // Recursively collect paths from children
    const childPaths = page.children?.flatMap(child =>
        getPaths(child, currentSlugs)
    ) ?? [];

    return [...paths, ...childPaths];
  };

  // Start collecting paths from the top-level pages
  return data.allPages.flatMap(page => getPaths(page));
}

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

export async function generateStaticParams() {
  const allPages = await executeTypedQuery(allPagesQuery)
  return generatePaths(allPages)
}

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ slug: string[] }>;
}) {

  const {slug} = await params;

  const finalSlug = slug.at(-1)

  const pageQuery = graphql(`
    query PagesQuery {
      page(filter: {slug: {eq: "${finalSlug}"}}) {
        ...PageFragment
      }
    }

    fragment PageFragment on PageRecord {
      position
      slug
      id
      title
      body
    }`)


  const data = await executeTypedQuery(pageQuery);
  const {page} = data;

  if (!page) {
    return notFound()
  }

  return <div>My Post TEST {JSON.stringify(page, null, 2)}</div>;
}


export const dynamicParams = false;