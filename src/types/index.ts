export type ReduxState = {
  categories: Category[] | null;
  targetCategory: Category | null;
  deliveryCity: City | null;
  deliveryInfo: DeliveryInfo | null;
  vkParams: any;
};

export type Category = {
  id: number;
  parent_id: number | null;
  depth: number;
  name: string;
  description: string;
};

export interface Product {
  id: number;
  section_id: number | null;
  name: string;
  detail: string;
  weight: number;
  measure: number;
  available: "Y" | "N";
  quantity: number;
  quantity_reserved: number;
  image_url: string | null;
  elements: ProductElement[];
}
//
// export type Product = {
//   id: number,
//   section_id: number | null,
//   name: string,
//   detail: string,
//   weight: number,
//   measure: number,
//   available: "Y" | "N",
//   quantity: number,
//   quantity_reserved: number,
//   image_url: string | null,
//   elements: ProductElement[]
// }

export interface ProductElement {
  id: number;
  item: {
    id: number;
    section_id: number | null;
    name: string;
    detail: string;
    weight: number;
    measure: number;
    available: "Y" | "N";
    quantity: number;
    quantity_reserved: number;
    image_url: string | null;
    elements: ProductElement[] | null;
  };
  properties: ProductElementProp[] | null;
  prices: {
    items: ProductElementPrice[] | null;
  };
}

export type ProductElementProp = {
  property_id: number;
  value: string;
};

export type ProductElementPrice = {
  id: number;
  price: number;
  quantity_from: number | null;
  quantity_to: number | null;
  discount_price: number | null;
  discount_value_percents: number | null;
};
export interface OrderProductElement extends ProductElement {
  id: number;
  item: {
    id: number;
    section_id: number | null;
    name: string;
    detail: string;
    weight: number;
    measure: number;
    available: "Y" | "N";
    quantity: number;
    quantity_reserved: number;
    image_url: string | null;
    elements: ProductElement[] | null;
  };
  properties: ProductElementProp[] | null;
  prices: {
    items: ProductElementPrice[] | null;
  };
  active?: boolean;
}
export interface OrderProductItem extends Product {
  id: number;
  section_id: number | null;
  name: string;
  detail: string;
  weight: number;
  measure: number;
  available: "Y" | "N";
  quantity: number;
  quantity_reserved: number;
  image_url: string | null;
  elements: OrderProductElement[];
}
export type OrderProduct = { count: number; item: OrderProductItem };
export type OrderMeta = { count: number; sum: number; weight: number };
export type Order = {
  items: { [key: number]: OrderProduct };
  meta: OrderMeta;
};

export type City = {
  id: number;
  name: string;
  region: string;
  country: string;
  postal: string;
};

export type DeliveryInfo = {
  sdek: {
    price: string;
    deliveryPeriodMin: number;
    deliveryPeriodMax: number;
    deliveryDateMin: string;
    deliveryDateMax: string;
    tariffId: number;
    priceByCurrency: number;
    currency: string;
  };
  PR: {
    price: number;
    deliveryDateMax: string;
  };
};

export type SuccessOrder = {
  _id: string;
  sum: number;
  user: number;
  num: number;
  jsonParams: {
    order: {[key: number]: string};
    info: {[key: string]: string};
    contacts: {
      address: string;
      phone: string;
      name: string;
    };
  };
  status: string;
  track: string;
};
