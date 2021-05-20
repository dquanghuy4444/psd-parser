import { ADD_PSD } from "./actions";

const psdReducer = (state:any, action:any) => {
  switch (action.type) {
    case ADD_PSD:
      const psd = action.payload;

      return {
        ...state,
        psd,
        width: psd.tree().export().document.width * 1 / 2,
        height: psd.tree().export().document.height * 1  / 2,
      };

    default:
      return state;
  }
};

export default psdReducer;
