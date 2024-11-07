import { graphql } from "@/lib/datocms/graphql";
import { typedDatoQueryWithCacheTags } from "@/lib/datocms/typedDatoQueryWithCacheTags";
import { notFound, permanentRedirect } from "next/navigation";
import { ProductsListing } from "@/app/components/ProductsListing";

export async function generateStaticParams() {
  const allSkusQuery = graphql(`
    query allSkusQuery {
      allProducts(orderBy: sku_ASC) {
        sku
        slug
      }
    }
  `);

  const data = await typedDatoQueryWithCacheTags({
    query: allSkusQuery,
    cacheTags: ["all-skus"],
  });

  const { allProducts } = data;

  return allProducts.map((product) => ({
    path: `${product.sku}-${product.slug}`,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  const skuMatch = path.match(/^(\d+)-?/);
  if (!skuMatch) {
    return notFound();
  }

  const sku = skuMatch[1];

  const productQuery = graphql(`
        query ProductQuery {
            product(filter: { sku: { eq: "${sku}" } }) {
                ...ProductFragment
            }
        }

        fragment ProductFragment on ProductRecord {
            id
            name
            slug
            description
        }
    `);

  const data = await typedDatoQueryWithCacheTags({
    query: productQuery,
    cacheTags: [`product-${sku}`],
  });

  const { product } = data;

  if (!product) {
    return notFound();
  }

  const { name, description, slug } = product;

  const canonicalUrl = `${sku}-${slug}`;
  if (path !== canonicalUrl) {
    permanentRedirect(canonicalUrl);
  }

  return (
    <>
      <h1>{name}</h1>
      <p>{description}</p>
      <h2>Navigate to another product</h2>
      <ProductsListing />
      <h2>Debug:</h2>
      <pre>Params: {JSON.stringify(params, null, 2)}</pre>
      <pre>Product: {JSON.stringify(product, null, 2)}</pre>
    </>
  );
}
