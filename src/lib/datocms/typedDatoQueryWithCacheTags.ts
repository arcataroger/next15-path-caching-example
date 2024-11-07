import { executeQuery as libExecuteQuery } from "@datocms/cda-client";
import type { TadaDocumentNode } from "gql.tada";

// export const cacheTag = 'datocms';
type ExecuteQueryOptions<Variables> = {
  variables?: Variables;
  includeDrafts?: boolean;
};

/**
 * Executes a GraphQL query using the DatoCMS Content Delivery API, and caches
 * the result in Next.js Data Cache using the `cache: 'force-cache'` option.
 */
export async function typedDatoQueryWithCacheTags<Result, Variables>({
  query,
  cacheTags,
  options,
}: {
  query: TadaDocumentNode<Result, Variables>;
  cacheTags?: string[];
  options?: ExecuteQueryOptions<Variables>;
}) {
  const result = await libExecuteQuery(query, {
    variables: options?.variables,
    excludeInvalid: true,
    includeDrafts: options?.includeDrafts,
    token: options?.includeDrafts
      ? process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN!
      : process.env.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN!,
    requestInitOptions: {
      cache: "force-cache",
      next: {
        revalidate: cacheTags?.length ? 0 : 60, // Don't use time-based ISR if cache tags are specified
        tags: cacheTags ?? undefined,
      },
    },
  });

  return result;
}
