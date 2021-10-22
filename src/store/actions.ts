import { Category } from "../types";

export const GET_CATEGORIES = "GET_CATEGORIES";
export const SET_CATEGORY = "SET_CATEGORY";
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

export type Action = SetCarList | SetTargetCat