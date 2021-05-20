import React from 'react';
import "./view.scss";
import ViewAdapter from "./view.adapter";

function ViewComponent(props:any) {

  const {
    canvasRef,
    width , height
  } = ViewAdapter();

  return (
    <div className="view flex-center">
      {
          <canvas 
            ref={canvasRef}
            id="fabric-canvas"
            width={1000}
            height={600}
            style={{ border: "1px solid red" }}
          />
      }
    </div>
  );
}

export default ViewComponent;
