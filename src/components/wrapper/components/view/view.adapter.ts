import { PsdContext } from 'contexts/psd/provider';
import fabric from 'libraries/utils/create-new-fabric';
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CanvasContext } from '../../../../contexts/canvas/provider';
import isEmptyObject from '../../../../libraries/utils/is-empty-object';


function ViewAdapter() {

  const canvasRef = useRef(null)

  // context
  const { canvas, initCanvas }:any = useContext(CanvasContext);
  const { psd }:any = useContext(PsdContext);

  useEffect(() => {
    const getImage = async () =>{
      if(psd && !isEmptyObject(psd)){
        const base64 = psd.image.toBase64();
        const file = await dataUrlToFile(base64 , "abc.png");
        const reader = new FileReader();
  
        reader.addEventListener("load", function () {
          fabric.Image.fromURL(reader.result, function(img:any) {
            img.scaleToWidth(100);
            canvas.add(img);
        });
  
        }, false);
  
        if (file) {
          reader.readAsDataURL(file)
        }
      }
    }

    getImage();

  } , [psd])

  async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {

    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: 'image/png' });
  }


  useLayoutEffect(() => {
    initCanvas(canvasRef.current, {
      width: 1500,
      height: 800,
    })
  }, [canvasRef, initCanvas])

  const updateActiveObject = useCallback((e:any) => {
      if (!e) {
          return
      }
      // setActiveObject(canvas.getActiveObject())
      canvas.renderAll()
  }, [canvas])

  useEffect(() => {
      if (!canvas && isEmptyObject(canvas)) {
        return
      }
      // canvas.on("selection:created", updateActiveObject)
      // canvas.on("selection:updated", updateActiveObject)
      // canvas.on("selection:cleared", updateActiveObject)

      // return () => {
      //     canvas.off("selection:created")
      //     canvas.off("selection:cleared")
      //     canvas.off("selection:updated")
      // }
  }, [canvas, updateActiveObject])

  return {
    canvasRef
  }
}

export default ViewAdapter;
