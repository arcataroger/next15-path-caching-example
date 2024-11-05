/* eslint-disable */
/* prettier-ignore */
import type { TadaDocumentNode, $tada } from 'gql.tada';

declare module 'gql.tada' {
 interface setupCache {
    "\n      query PagesQuery {\n          allPages(\n              first: 100\n              filter: { parent: { exists: false } }\n              orderBy: position_ASC\n          ) {\n              ...PageFragment\n              children {\n                  ...PageFragment\n                  children {\n                      ...PageFragment\n                      # And however deep your hierarchy goes\n                  }\n              }\n          }\n      }\n      \n      fragment PageFragment on PageRecord {\n          position\n          slug\n          id\n          title\n      }\n  ":
      TadaDocumentNode<{ allPages: { position: unknown; slug: string | null; id: unknown; title: string | null; children: { position: unknown; slug: string | null; id: unknown; title: string | null; children: { position: unknown; slug: string | null; id: unknown; title: string | null; }[]; }[]; }[]; }, {}, void>;
    "\n  query PagesQuery {\n    allPages(\n      first: 100\n      filter: { parent: { exists: false } }\n      orderBy: position_ASC\n    ) {\n      ...PageFragment\n      children {\n        ...PageFragment\n        children {\n          ...PageFragment\n          # And however deep your hierarchy goes\n        }\n      }\n    }\n  }\n\n  fragment PageFragment on PageRecord {\n    position\n    slug\n    id\n    title\n  }\n":
      TadaDocumentNode<{ allPages: { position: unknown; slug: string | null; id: unknown; title: string | null; children: { position: unknown; slug: string | null; id: unknown; title: string | null; children: { position: unknown; slug: string | null; id: unknown; title: string | null; }[]; }[]; }[]; }, {}, void>;
  }
}
