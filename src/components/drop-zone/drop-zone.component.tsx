import React from 'react';
import DropZoneAdapter from './drop-zone.adapter';
import './drop-zone.scss';

function DropZoneComponent() {

  const {
    onDragOver , 
    onDrop ,
    isDisplayed,
    isParsing,
    openFileSeletor
  } = DropZoneAdapter();

  return (
    <section className={"drop-zone " + (isDisplayed ? "" : "d-none")}>
      <div className="drop-zone__wrapper cursor-pointer"  onDrop={ onDrop } onDragOver={ onDragOver } onClick={ openFileSeletor }>
        {
          isParsing ? (
            <p>Parsing file PSD...</p>
          ) : (
            <p>Drop here or upload</p>
          )
        }
      </div>
    </section>

  );
}

export default DropZoneComponent;
