import { createContext , useCallback, useReducer } from "react";
import fabric from "libraries/functions/create-new-fabric";
import { ADD_CANVAS, SET_ACTIVE_OBJECT } from "./actions";
import canvasReducer from "./reducer";

type State = {
  canvas:any,
  activeObject:any
}

type Props = {
  children: React.ReactNode;
};

const CanvasContext = createContext([]);

const intialState:State = {
  canvas: null,
  activeObject: null,
};

const CanvasProvider = ({ children }: Props) => {

  const [state, dispatch] = useReducer(canvasReducer, intialState);

  const addCanvas = (canvas:any = {}) => {
    dispatch({
      type: ADD_CANVAS,
      payload: canvas,
    });
  };

  const setActiveObject = (activeObject:any = {}) => {
    dispatch({
      type: SET_ACTIVE_OBJECT,
      payload: activeObject,
    });
  };

  const initCanvas:any = useCallback((el:any) => {
    const canvasOptions = {
        preserveObjectStacking: true,
        selection: false,
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
        initCanvas,
        setActiveObject
      }}
    >
      { children }
    </CanvasContext.Provider>
  );
}

export { CanvasContext };
export default CanvasProvider;

