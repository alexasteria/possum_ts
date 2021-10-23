import {Action, GET_CATEGORIES, SET_CATEGORY, SET_DELIVERY_CITY} from "./actions";
import {ReduxState} from "../types";

const initialState: ReduxState = {
  categories: null,
  targetCategory: null,
  deliveryCity: null
};
export const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return { ...state, categories: action.payload };
    case SET_CATEGORY:
      return { ...state, targetCategory: action.payload };
    case SET_DELIVERY_CITY:
      return { ...state, deliveryCity: action.payload };
    default:
      return state;
  }
};
