import {getSlugToIdMap} from "@/lib/datocms/getSlugToIdMap";
import {SlugTreeTableOfContents} from "@/app/components/SlugTreeTableOfContents";

export default async function PagesIndex() {
  const slugTree = await getSlugToIdMap()
  return <>
    <h1>Slug Tree Pages</h1>
    <SlugTreeTableOfContents slugMap={slugTree}/>
    </>
}
