import { useContext, useEffect, useState } from 'react';
import { PsdContext } from '../../contexts/psd/provider';
import isEmptyObject from '../../libraries/utils/is-empty-object';

const PSD = require('psd.js');

function DropZoneAdapter() {
  // context
  const { addPsd , psd }:any = useContext(PsdContext);
  
  // state
  const [isDisplayed , setIsDisplayed] = useState<boolean>(true);
  const [isParsing , setIsParsing] = useState<boolean>(false);

  const EXTENSION_PSD = 'psd';

  useEffect(() => {
    if(psd && !isEmptyObject(psd)){
      isDisplayed && setIsDisplayed(false);
    } else{
      !isDisplayed && setIsDisplayed(true);
    }
  } , [psd])

  function onDragOver(e:any) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  function onDrop(e:any) {
    e.stopPropagation();
    e.preventDefault();

    setIsParsing(true);


    try {
      if(e.dataTransfer.files.length !== 1){
        throw new Error("Quá 1 file");
      }

      const file = e.dataTransfer.files[0];
      if(file.name.split('.').pop() !== EXTENSION_PSD){
        throw new Error("K phải file PSD");
      }

      PSD.fromEvent(e).then(function (psd:any) {
        const data = JSON.stringify(psd.tree().export(), undefined, 2);
        addPsd(psd);
        setIsParsing(false)

        const dataEl = document.getElementById('data');
        if(dataEl){
          dataEl.innerHTML = data;
        }
        document.getElementById('image')?.appendChild(psd.image.toPng());
      });
    } catch (error) {
      console.log(error)
      setIsParsing(false)
      setIsDisplayed(true)
      addPsd({})
    }

  }

  return {
    onDragOver , 
    onDrop ,
    isDisplayed,
    isParsing
  }
}

export default DropZoneAdapter;
