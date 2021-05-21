import { ADD_CANVAS , SET_ACTIVE_OBJECT } from "./actions";

const canvasReducer = (state:any, action:any) => {
  switch (action.type) {
    case ADD_CANVAS:
      return {
        ...state,
        canvas: action.payload
      };
    case SET_ACTIVE_OBJECT:
      return {
        ...state,
        activeObject: action.payload
      };

    default:
      return state;
  }
};

export default canvasReducer;
