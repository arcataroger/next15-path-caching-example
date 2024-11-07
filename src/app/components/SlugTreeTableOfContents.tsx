import type { SlugToIdMap } from "@/types/types";
import Link from "next/link";

type SlugTreeHierarchyLevel = {
  [key: string]: SlugTreeHierarchyLevel;
};

export const SlugTreeTableOfContents = ({
  slugMap,
}: {
  slugMap: SlugToIdMap;
}) => {
  // Build the hierarchy as a nested object
  const hierarchy: SlugTreeHierarchyLevel = {};

  Object.keys(slugMap).forEach((slug) => {
    const parts = slug.split("/");
    let currentLevel = hierarchy;

    parts.forEach((part) => {
      if (!currentLevel[part]) {
        currentLevel[part] = {};
      }
      currentLevel = currentLevel[part];
    });
  });

  // Render the nested list recursively
  const renderList = (items: SlugTreeHierarchyLevel, path: string[] = []) => (
    <ul>
      {Object.keys(items).map((key) => {
        const newPath = [...path, key];
        const slugPath = newPath.join("/");
        return (
          <li key={slugPath}>
            <Link href={`/pages/${slugPath}`} prefetch>
              {key}
            </Link>
            {Object.keys(items[key]).length > 0 &&
              renderList(items[key], newPath)}
          </li>
        );
      })}
    </ul>
  );

  return <>{renderList(hierarchy)}</>;
};
