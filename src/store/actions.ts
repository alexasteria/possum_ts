import {Category, City, DeliveryInfo} from "../types";

export const GET_CATEGORIES = "GET_CATEGORIES";
export const SET_CATEGORY = "SET_CATEGORY";
export const SET_DELIVERY_CITY = "SET_DELIVERY_CITY"
export const SET_DELIVERY_INFO = "SET_DELIVERY_INFO"
export const SET_VK_PARAMS = "SET_VK_PARAMS"
export const setVkParams: (params: any) => void = (params) => {
  return {
    type: SET_VK_PARAMS,
    payload: params,
  };
};
export const setDeliveryInfo: (info: DeliveryInfo) => void = (info) => {
  return {
    type: SET_DELIVERY_INFO,
    payload: info,
  };
};
export const setDeliveryCity: (city: City) => void = (city) => {
  return {
    type: SET_DELIVERY_CITY,
    payload: city,
  };
};
export const setCategoriesList: (categories: Category[]) => void = (
  categories
) => {
  return {
    type: GET_CATEGORIES,
    payload: categories,
  };
};
export const setTargetCategory: (category: Category) => void = (category) => {
  return {
    type: SET_CATEGORY,
    payload: category,
  };
};

export interface SetCarList {
  type: typeof GET_CATEGORIES;
  payload: Category[];
}

export interface SetTargetCat {
  type: typeof SET_CATEGORY;
  payload: Category;
}

export interface SetDelivCity {
  type: typeof SET_DELIVERY_CITY;
  payload: City;
}
export interface SetDelivInfo {
  type: typeof SET_DELIVERY_INFO;
  payload: DeliveryInfo;
}
export interface SetVkParams {
  type: typeof SET_VK_PARAMS;
  payload: any;
}

export type Action = SetCarList | SetTargetCat | SetDelivCity | SetDelivInfo | SetVkParams