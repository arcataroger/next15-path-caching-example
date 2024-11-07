export interface Page {
  id: string;
  slug: string;
  title: string;
  position: number;
  children: Page[];
}

export interface SlugToIdMap {
  [slugPath: string]: string;
}