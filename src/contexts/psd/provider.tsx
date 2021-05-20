import { createContext , useReducer } from "react";
import { ADD_PSD } from "./actions";
import psdReducer from "./reducer";

type PSD = {
  name: string
}

type State = {
  psd:any
}

type Props = {
  children: React.ReactNode;
};

const PsdContext = createContext([]);

const intialState:State = {
  psd: {},
};


const PsdProvider = ({ children }: Props) => {

  const [state, dispatch] = useReducer(psdReducer, intialState);

  const addPsd = (psd:any = {}) => {
    dispatch({
      type: ADD_PSD,
      payload: psd,
    });
  };

  return (
    <PsdContext.Provider
      value={{
        ...state,
        addPsd
      }}
    >
      { children }
    </PsdContext.Provider>
  );
}

export { PsdContext };
export default PsdProvider;

