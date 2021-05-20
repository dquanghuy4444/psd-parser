import React from 'react';
import LayerComponent from './components/group/components/layer.component';
import GroupComponent from './components/group/group.component';
import "./list-layers.scss";

function ListLayersComponent(props:any) {
  const { children } = props;

  const showListLayers = () =>{
    return children.map((child : any , item:number) =>{
      if(child._children.length > 0){
        return <GroupComponent child={ child } hasNodes={ false }></GroupComponent>
      }
      return <LayerComponent child={ child }></LayerComponent>
    })
  }

  return (
    <div className="list-layers">
      {
        (children.length > 0) && (
          <div className="wrapper">
            <ul>
              {
                showListLayers()
              }
            </ul>
          </div>
        )
      }
    </div>
  );
}

export default ListLayersComponent;
