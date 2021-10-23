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

export type Product = {
  id: number,
  section_id: number | null,
  name: string,
  detail: string,
  weight: number,
  measure: number,
  available: "Y" | "N",
  quantity: number,
  quantity_reserved: number,
  image_url: string | null,
  elements: ProductElement[] | null
}

export type ProductElement = {
  id: number,
  item: Product,
  properties: ProductElementProp[] | null,
  prices: {
    items: ProductElementPrice[] | null
  }
}

export type ProductElementProp = {
  property_id: number,
  value: string
}

export type ProductElementPrice = {
  id: number,
  price: number,
  quantity_from: number | null,
  quantity_to: number | null,
  discount_price: number | null,
  "discount_value_percents": number | null
}