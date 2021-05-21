import { PsdContext } from 'contexts/psd/provider';
import fabric from 'libraries/functions/create-new-fabric';
import dataUrlToFile from 'libraries/utils/data-url-to-file';
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CanvasContext } from '../../../../contexts/canvas/provider';
import isEmptyObject from 'libraries/utils/is-empty-object';
import createIdByParentName from 'libraries/functions/create-id-by-parent-name';

function ViewAdapter() {

  const NAME_BACKGROUND = 'Background';
  const NUM_RATIO:number = 3;

  // ref
  const canvasRef = useRef(null)

  // context
  const { canvas , initCanvas , activeObject , setActiveObject }:any = useContext(CanvasContext);
  const { psd ,  width , height }:any = useContext(PsdContext);

  useEffect(() => {
    const getBackground = async () =>{
      if(!psd  || isEmptyObject(psd)){
        return false;
      }
  
      if(!canvas  || isEmptyObject(canvas)){
        return false;
      }
  
      const descendants = psd.tree().descendants();
      if(descendants.length <= 0){
        return false;
      }

      const layerBackground = descendants.find((desc:any) => desc.name === NAME_BACKGROUND);
      if(isEmptyObject(layerBackground)){
        return;
      }

      let base64 = layerBackground.layer.image.toBase64();
      let file = await dataUrlToFile(base64 , "abc.png");
      
      let reader = new FileReader();

      reader.addEventListener("load", function () {
        fabric.Image.fromURL(reader.result, function(img:any) {
          canvas.setDimensions({width:img.width / NUM_RATIO, height:img.height / NUM_RATIO});
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height
          });
      });

      }, false);

      if (file) {
        reader.readAsDataURL(file)
      }
    }

    getBackground();
  } , [psd , canvas])

  useEffect(() => {
    const getLayers = () =>{
      if(!psd  || isEmptyObject(psd)){
        return;
      }

      if(!canvas  || isEmptyObject(canvas)){
        return;
      }

      const descendants = psd.tree().descendants();
      console.log(descendants);
      if(descendants.length <= 0){
        return ;
      }

      descendants.forEach((desc:any) =>{
        if(isEmptyObject(desc)){
          return;
        }

        if(desc.hasChildren() || desc.name === NAME_BACKGROUND){
          return;
        }

        const id = createIdByParentName(desc);

        // if(!desc.layer.visible){
        //   return;
        // }

        const { coords } = desc;
        const textObj = desc.export().text;
        if(textObj){
          var text = new fabric.Text(textObj.value, {
            top : coords.top / NUM_RATIO,
            left : coords.left / NUM_RATIO,
            bottom : coords.bottom / NUM_RATIO,
            right : coords.right / NUM_RATIO,
            fontSize: textObj.font.sizes[0] / NUM_RATIO,
            fontFamily: 'Verdana',
            fill: 'black'
          });
          text.id = id;
          text.visible = desc.layer.visible;
          canvas.add(text);


        } else{
          let base64 = desc.layer.image.toBase64();
          fabric.Image.fromURL(base64, function(img:any) {
            img.scaleToWidth(img.width / NUM_RATIO);
            img.scaleToHeight(img.height / NUM_RATIO);
  
            img.top = coords.top / NUM_RATIO;
            img.left = coords.left / NUM_RATIO;
            img.bottom = coords.bottom / NUM_RATIO;
            img.right = coords.right / NUM_RATIO;

            img.id = id;
            img.visible = desc.layer.visible;

            canvas.add(img);
            canvas.renderAll();
          });
        }
      })
    }

    getLayers();
  } ,[psd , canvas])


  useLayoutEffect(() => {
    initCanvas(canvasRef.current, {
      width,
      height,
    })
  }, [canvasRef, initCanvas])

  const updateActiveObject = useCallback((e:any) => {
      if (!e) {
          return
      }
      setActiveObject(canvas.getActiveObject())
      canvas.renderAll()
  }, [canvas])

  useEffect(() => {
      if (!canvas || isEmptyObject(canvas)) {
        return
      }
      canvas.on("selection:created", updateActiveObject)
      canvas.on("selection:updated", updateActiveObject)
      canvas.on("selection:cleared", updateActiveObject)

      return () => {
          canvas.off("selection:created")
          canvas.off("selection:cleared")
          canvas.off("selection:updated")
      }
  }, [canvas, updateActiveObject]);

  const toggleCanvas = () =>{
    setActiveObject({
      ...activeObject,
      visible:!activeObject.visible
    })

    canvas.getObjects().forEach(function(o:any) {
      if(o.id === activeObject.id) {
        o.visible = !o.visible;
      }   
    })

    canvas.renderAll();
  }

  function exportToImage (ext:string = "png"){
    const image = canvas.toDataURL(`image/${ext}`, 1.0).replace(`image/${ext}`, "image/octet-stream");
    const link = document.createElement('a');
    link.download = `image.${ext}`;
    link.href = image;
    link.click();

    link.remove();
  }

  return {
    canvasRef,
    activeObject,
    toggleCanvas,
    exportToImage
  }
}

export default ViewAdapter;
