export type ReduxState = {
  categories: Category[] | null,
  targetCategory: Category | null
}

export type Category = {
  id: number;
  parent_id: number | null;
  depth: number;
  name: string;
  description: string;
};
