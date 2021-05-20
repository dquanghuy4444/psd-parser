import { createContext , useCallback, useReducer } from "react";
import fabric from "libraries/utils/create-new-fabric";
import { ADD_CANVAS } from "./actions";
import canvasReducer from "./reducer";

type State = {
  canvas:any
}

type Props = {
  children: React.ReactNode;
};

const CanvasContext = createContext([]);

const intialState:State = {
  canvas: null,
};

const CanvasProvider = ({ children }: Props) => {

  const [state, dispatch] = useReducer(canvasReducer, intialState);

  const addCanvas = (canvas:any = {}) => {
    dispatch({
      type: ADD_CANVAS,
      payload: canvas,
    });
  };

  const initCanvas:any = useCallback((el:any) => {
    const canvasOptions = {
        preserveObjectStacking: true,
        selection: true,
        defaultCursor: "default",
        backgroundColor: "#f3f3f3",
        imageSmoothingEnabled: false
    }
    let c = new fabric.Canvas(el , canvasOptions);
    // initAligningGuidelines(c)
    c.renderAll()
    addCanvas(c)
}, [])

  return (
    <CanvasContext.Provider
      value={{
        ...state,
        addCanvas,
        initCanvas
      }}
    >
      { children }
    </CanvasContext.Provider>
  );
}

export { CanvasContext };
export default CanvasProvider;

