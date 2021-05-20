import React from 'react';
import DropZoneAdapter from './drop-zone.adapter';
import './drop-zone.scss';

function DropZoneComponent() {

  const {
    onDragOver , 
    onDrop ,
    isDisplayed,
    isParsing
  } = DropZoneAdapter();

  return (
    <section className={"drop-zone " + (isDisplayed ? "" : "d-none")}>
      <div className="drop-zone__wrapper"  onDrop={ onDrop } onDragOver={ onDragOver }>
        {
          isParsing ? (
            <p>Parsing file PSD...</p>
          ) : (
            <p>Drop here</p>
          )
        }
      </div>
    </section>

  );
}

export default DropZoneComponent;
