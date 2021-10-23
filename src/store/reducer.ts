import {
  Action,
  GET_CATEGORIES,
  SET_CATEGORY,
  SET_DELIVERY_CITY,
  SET_DELIVERY_INFO,
  SET_VK_PARAMS,
} from "./actions";
import { ReduxState } from "../types";

const initialState: ReduxState = {
  categories: null,
  targetCategory: null,
  deliveryCity: null,
  deliveryInfo: null,
  vkParams: null,
};
export const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return { ...state, categories: action.payload };
    case SET_CATEGORY:
      return { ...state, targetCategory: action.payload };
    case SET_DELIVERY_CITY:
      return { ...state, deliveryCity: action.payload };
    case SET_DELIVERY_INFO:
      return { ...state, deliveryInfo: action.payload };
    case SET_VK_PARAMS:
      return { ...state, vkParams: action.payload };
    default:
      return state;
  }
};
