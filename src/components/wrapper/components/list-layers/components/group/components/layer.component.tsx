import React, { useContext } from 'react';
import "./layer.scss";
import { BiImage , BiText } from 'react-icons/bi'
import { CanvasContext } from 'contexts/canvas/provider';
import createIdByParentName from 'libraries/functions/create-id-by-parent-name';
import getVisibleStateByParent from 'libraries/functions/get-visible-state-by-parent';

function LayerComponent(props:any) {
  const { child , hasNode } = props;
  
  const { canvas , activeObject }:any = useContext(CanvasContext);

  const id = createIdByParentName(child);

  const showId = () =>{

    canvas.getObjects().forEach(function(o:any) {
      if(o.id === id) {
          canvas.setActiveObject(o);
          console.log(o.id)
      }   
    })
  }


  const isVisible = getVisibleStateByParent(child);

  const childExport = child.export();

  return (
    <li 
      className={"cursor-pointer hover flex-center " + ( hasNode ? "has-node " : "") + (activeObject?.id === id ? "has-actived" : "")} 
      onClick={ showId }
    >
      { childExport.text ? <BiText></BiText> : <BiImage></BiImage>}
      <span>        
        { child.name }
        { isVisible ? "" : "(hidden)" }
      </span>    
    </li>
  );
}

export default LayerComponent;
