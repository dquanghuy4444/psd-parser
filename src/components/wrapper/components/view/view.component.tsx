import React from 'react';
import "./view.scss";
import ViewAdapter from "./view.adapter";

function ViewComponent(props:any) {

  const {
    canvasRef
  } = ViewAdapter();

  return (
    <div className="view">
      <canvas 
        ref={canvasRef}
        id="fabric-canvas"
        width={1600}
        height={900}
        style={{ border: "1px solid red" }}
      />
    </div>
  );
}

export default ViewComponent;
