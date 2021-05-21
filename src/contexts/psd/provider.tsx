import { createContext , useReducer } from "react";
import { ADD_PSD } from "./actions";
import psdReducer from "./reducer";

type State = {
  psd:any,
}

type Props = {
  children: React.ReactNode;
};

const PsdContext = createContext([]);

const intialState:State = {
  psd: null
};


const PsdProvider = ({ children }: Props) => {

  const [state, dispatch] = useReducer(psdReducer, intialState);

  const setPsd = (psd:any = {}) => {
    dispatch({
      type: ADD_PSD,
      payload: psd,
    });
  };

  return (
    <PsdContext.Provider
      value={{
        ...state,
        setPsd
      }}
    >
      { children }
    </PsdContext.Provider>
  );
}

export { PsdContext };
export default PsdProvider;

