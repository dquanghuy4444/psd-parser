import React from 'react';
import './app.scss';
import DropZoneComponent from './components/drop-zone/drop-zone.component';
import WrapperComponent from './components/wrapper/wrapper.component';
import CanvasProvider from './contexts/canvas/provider';
import LayerProvider from './contexts/psd/provider';

function App() {

  return (
    <LayerProvider>
      <CanvasProvider>
        <main className="app">
          <DropZoneComponent></DropZoneComponent>
          <WrapperComponent></WrapperComponent>
        </main>
      </CanvasProvider>
    </LayerProvider>

  );
}

export default App;
