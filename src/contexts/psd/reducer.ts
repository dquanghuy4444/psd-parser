import { SET_PSD , SET_DESCENDENTS } from "./actions";
import { v4 as uuidv4 } from 'uuid';

const psdReducer = (state:any, action:any) => {
  switch (action.type) {
    case SET_PSD:
      const psd = action.payload;

      return {
        ...state,
        psd
      };
    case SET_DESCENDENTS:
      let descendants = action.payload;
      
      descendants = descendants.reverse();

      descendants.forEach((desc:any) => {
        desc.id = uuidv4();
      })

      return {
        ...state,
        descendants
      };

    default:
      return state;
  }
};

export default psdReducer;
