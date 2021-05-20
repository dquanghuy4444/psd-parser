import { useContext, useEffect , useState } from 'react';
import { PsdContext } from '../../contexts/psd/provider';
import isEmptyObject from '../../libraries/utils/is-empty-object';


function WrapperAdapter() {

  // context
  const { addPsd , psd }:any = useContext(PsdContext);

  // state
  const [isDisplayed , setIsDisplayed] = useState<boolean>(true);
  const [children , setChildren] = useState<any>([]);

  useEffect(() => {
    if(psd && !isEmptyObject(psd)){

      !isDisplayed && setIsDisplayed(true);
    } else{
      isDisplayed && setIsDisplayed(false);
    }
  } , [psd])

  useEffect(() => {
    if(psd && !isEmptyObject(psd)){
      setChildren(psd.tree()._children);
    } else{
      setChildren([])
    }
  } , [psd])

  const removePsd = () =>{
    addPsd();
  }
  
  return {
    isDisplayed,
    removePsd,
    children,
  }
}

export default WrapperAdapter;