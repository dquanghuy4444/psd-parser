import React from 'react';
import "./view.scss";
import ViewAdapter from "./view.adapter";

function ViewComponent(props:any) {

  const {
    canvasRef,
    activeObject,
    toggleCanvas,
    exportToImage,
    backToDropZone,
    isLoading,
    exportToJson
  } = ViewAdapter();

  return (
    <div className="view flex-center" id="view">
      {
        <canvas 
          ref={canvasRef}
          id="fabric-canvas"
          width={0}
          height={0}
          style={{ border: "1px solid red" }}
        />
      }
      <div className="d-none" id="img-psd"></div>
      {
        activeObject && (
          <div className="options">
            <div className="btn flex-center" onClick={ toggleCanvas }>
              { activeObject.visible ? "Hidden" : "Visible" }
            </div>
          </div>
        )
      }

      <div className="export-image">
        <div className="btn flex-center" onClick={ () => { exportToImage("png") } }>
          Export PNG
        </div>
        <div className="btn flex-center" onClick={ () => { exportToImage("jpeg") } }>
          Export JPEG
        </div>
        <div className="btn flex-center" onClick={ exportToJson }>
          Export JSON
        </div>
      </div>

      <div className="btn flex-center back-dropzone" onClick={ backToDropZone }>
        Back
      </div>
      {
        isLoading && (
          <div className="overlay-background">
            <div className="loading-spinner big"></div>
          </div>
        )
      }
    </div>
    
  );
}

export default ViewComponent;
