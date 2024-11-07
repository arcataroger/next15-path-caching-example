import { graphql } from "@/lib/datocms/graphql";
import { typedDatoQueryWithCacheTags } from "@/lib/datocms/typedDatoQueryWithCacheTags";
import Link from "next/link";

export const ProductsListing = async () => {
  const allProductsQuery = graphql(`
    query allProductsQuery {
      allProducts {
        ...ProductFragment
      }
    }

    fragment ProductFragment on ProductRecord {
      name
      sku
      slug
    }
  `);

  const data = await typedDatoQueryWithCacheTags({
    query: allProductsQuery,
    cacheTags: ["products-listing"],
  });

  const { allProducts } = data;

  return (
    <>
      <ul>
        {allProducts.map((product) => (
            <li key={product.sku}>
              <Link prefetch href={`/products/${product.sku}-${product.slug}`}>
                #{product.sku} - {product.name}
              </Link>
            </li>
        ))}
      </ul>
    </>
  );
};
