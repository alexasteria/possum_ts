import {Category, City} from "../types";

export const GET_CATEGORIES = "GET_CATEGORIES";
export const SET_CATEGORY = "SET_CATEGORY";
export const SET_DELIVERY_CITY = "SET_DELIVERY_CITY"
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

export type Action = SetCarList | SetTargetCat | SetDelivCity