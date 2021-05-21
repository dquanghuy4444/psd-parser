import React from 'react';
import LayerComponent from './components/layer.component';
import "./group.scss";
import { BiFileBlank } from "react-icons/bi";

function GroupComponent(props:any) {
  let { child , hasNode } = props;

  const showListLayers = () =>{
    return child._children.map((item : any , index:number) =>{
      if(item._children.length > 0){
        return <GroupComponent child={ item } hasNode></GroupComponent>
      }
      return <LayerComponent child={ item }  hasNode></LayerComponent>
    })
  }

  return (
    <li className={ hasNode ? "has-node" : ""}>
      <BiFileBlank></BiFileBlank>
      <span>
        { child.name }
      </span>

      <ul> 
        {
          showListLayers()
        }
      </ul>
    </li>  
  );
}

export default GroupComponent;
