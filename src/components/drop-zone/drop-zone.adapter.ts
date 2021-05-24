import buildFileSelector from 'libraries/utils/build-file-selector';
import { useContext, useEffect, useState } from 'react';
import { PsdContext } from '../../contexts/psd/provider';
import isEmptyObject from '../../libraries/utils/is-empty-object';

const PSD = require('psd.js');

function DropZoneAdapter() {
  // context
  const { setPsd , psd , setDescendants }:any = useContext(PsdContext);
  
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

  async function onDrop(e:any) {
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

      await PSD.fromEvent(e).then(function (psd:any) {
        // const data = JSON.stringify(psd.tree().export(), undefined, 2);
        setPsd(psd);
      });

    } catch (error) {
      alert(error)
      setIsDisplayed(true)
      setPsd({})
      
    } finally{
      setIsParsing(false)
    }
  }

  const handleSetPsd = async (fileList:File[]) =>{
    setIsParsing(true);

    try {
      if(fileList.length !== 1){
        throw new Error("Quá 1 file");
      }

      const file = fileList[0];
      if(file.name.split('.').pop() !== EXTENSION_PSD){
        throw new Error("K phải file PSD");
      }

      const pathFile = await URL.createObjectURL(file); 

      await PSD.fromURL(pathFile).then(function (psd:any) {
        setPsd(psd);
        setDescendants(psd.tree().descendants());
      });

    } catch (error) {
      alert(error)
      setIsDisplayed(true)
      setPsd({})

    } finally{
      setIsParsing(false)
    }
  }

  const fileSelector = buildFileSelector(false , `.${EXTENSION_PSD}`, handleSetPsd);
  
  const openFileSeletor = (e: any) => {
    e.preventDefault();
    fileSelector.click();
  }

  return {
    onDragOver , 
    onDrop ,
    isDisplayed,
    isParsing,
    openFileSeletor
  }
}

export default DropZoneAdapter;
