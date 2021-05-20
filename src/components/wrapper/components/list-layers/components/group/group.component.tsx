import React from 'react';
import LayerComponent from './components/layer.component';
import "./group.scss";
import { BiFileBlank } from "react-icons/bi";

function GroupComponent(props:any) {
  const { child } = props;

  const showListLayers = () =>{
    return child._children.map((child : any , item:number) =>{
      if(child._children.length > 0){
        return <GroupComponent child={ child }></GroupComponent>
      }
      return <LayerComponent child={ child }></LayerComponent>
    })
  }

  return (
    <li className="">
      <span>
        <BiFileBlank></BiFileBlank>
        { child.name }
      </span>

      <ul> 
        {
          showListLayers()
        }
      </ul>
    </li>  );
}

export default GroupComponent;
