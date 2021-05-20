import React from 'react';
import "./layer.scss";
import { BiImage , BiText } from 'react-icons/bi'

function LayerComponent(props:any) {
  const { child , hasNode } = props;

  const childExport = child.export();

  return (
    <li className={ hasNode ? "has-node" : ""}>
      <span>
        { childExport.text ? <BiText></BiText> : <BiImage></BiImage>}
        
        { child.name }
      </span>    
    </li>
  );
}

export default LayerComponent;
