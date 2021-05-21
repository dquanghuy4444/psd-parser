import { ADD_PSD } from "./actions";

const psdReducer = (state:any, action:any) => {
  switch (action.type) {
    case ADD_PSD:
      const psd = action.payload;

      return {
        ...state,
        psd
      };

    default:
      return state;
  }
};

export default psdReducer;
