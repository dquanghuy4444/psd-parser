import { ADD_CANVAS } from "./actions";

const canvasReducer = (state:any, action:any) => {
  switch (action.type) {
    case ADD_CANVAS:
      return {
        ...state,
        canvas: action.payload
      };

    default:
      return state;
  }
};

export default canvasReducer;
