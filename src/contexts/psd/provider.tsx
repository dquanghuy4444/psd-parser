import { createContext , useReducer } from "react";
import { SET_DESCENDENTS, SET_PSD } from "./actions";
import psdReducer from "./reducer";

type State = {
  psd:any,
  descendants:any[]
}

type Props = {
  children: React.ReactNode;
};

const PsdContext = createContext([]);

const intialState:State = {
  psd: null,
  descendants:[]
};


const PsdProvider = ({ children }: Props) => {

  const [state, dispatch] = useReducer(psdReducer, intialState);

  const setPsd = (psd:any = {}) => {
    dispatch({
      type: SET_PSD,
      payload: psd,
    });
  };

  const setDescendants = (descendants:any = []) => {
    dispatch({
      type: SET_DESCENDENTS,
      payload: descendants,
    });
  };

  return (
    <PsdContext.Provider
      value={{
        ...state,
        setPsd,
        setDescendants
      }}
    >
      { children }
    </PsdContext.Provider>
  );
}

export { PsdContext };
export default PsdProvider;

