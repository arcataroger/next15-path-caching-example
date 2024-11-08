import {getSlugToIdMap} from "@/lib/datocms/getSlugToIdMap";
import {SlugTreeTableOfContents} from "@/app/components/SlugTreeTableOfContents";
import {ProductsListing} from "@/app/components/ProductsListing";

export default async function Home() {
  const slugTree = await getSlugToIdMap()
  return <>
    <h1>Next15 Slug Tree & Caching Demo</h1>
    <h2>Slug tree pages</h2>
    <SlugTreeTableOfContents slugMap={slugTree}/>
    <h2>Products</h2>
    <ProductsListing/>
    </>
}
