import React from 'react';
import ListLayersComponent from './components/list-layers/list-layers.component';
import ViewComponent from './components/view/view.component';
import WrapperAdapter from './wrapper.adapter';
import "./wrapper.scss";

function WrapperComponent() {

  const {
    isDisplayed,
    children  
  } = WrapperAdapter();

  return (
    <section className={"wrapper " + (isDisplayed ? "" : "d-none")}>
      <ListLayersComponent 
        children={ children }
      ></ListLayersComponent>

      <ViewComponent></ViewComponent>

      
    </section>

  );
}

export default WrapperComponent;
