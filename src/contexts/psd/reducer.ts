import { ADD_PSD } from "./actions";

const psdReducer = (state:any, action:any) => {
  switch (action.type) {
    case ADD_PSD:
      return {
        ...state,
        psd: action.payload
      };

    default:
      return state;
  }
};

export default psdReducer;
