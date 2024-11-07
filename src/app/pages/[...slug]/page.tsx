import { getSlugToIdMap } from "@/lib/datocms/getSlugToIdMap";
import { graphql } from "@/lib/datocms/graphql";
import { typedDatoQueryWithCacheTags } from "@/lib/datocms/typedDatoQueryWithCacheTags";
import { notFound } from "next/navigation";
import { SlugTreeTableOfContents } from "@/app/components/SlugTreeTableOfContents";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugMap = await getSlugToIdMap();
  const allPaths = Object.keys(slugMap).map((slugPath) => ({
    slug: slugPath.split("/"),
    id: slugMap[slugPath],
  }));

  return allPaths;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[]; id: string }>;
}) {
  const { slug, id } = await params;

  const slugMap = await getSlugToIdMap();

  const pageId = id ?? slugMap[slug.join("/")];

  const pageQuery = graphql(`
        query PagesQuery {
            page(filter: {id: {eq: "${pageId}"}}) {
                ...PageFragment
            }
        }

        fragment PageFragment on PageRecord {
            position
            slug
            id
            title
            body
        }`);

  const data = await typedDatoQueryWithCacheTags({
    query: pageQuery,
    cacheTags: [pageId],
  });
  const { page } = data;

  if (!page) {
    return notFound();
  }

  const { title, body } = page;

  return (
    <>
      <h1>{title}</h1>
      <p>{body}</p>
      <h2>Navigate to another page</h2>
      <SlugTreeTableOfContents slugMap={slugMap} />
      <h2>Debug:</h2>
      <pre>Params: {JSON.stringify(params, null, 2)}</pre>
      <pre>pageId: {JSON.stringify(pageId, null, 2)}</pre>
      <pre>Page: {JSON.stringify(page, null, 2)}</pre>
      <pre>slugMap: {JSON.stringify(slugMap, null, 2)}</pre>
    </>
  );
}

export const dynamicParams = false;
