import { useContext, useEffect , useState } from 'react';
import { PsdContext } from '../../contexts/psd/provider';
import isEmptyObject from '../../libraries/utils/is-empty-object';


function WrapperAdapter() {

  // context
  const { psd , descendants }:any = useContext(PsdContext);

  // state
  const [isDisplayed , setIsDisplayed] = useState<boolean>(true);
  const [children , setChildren] = useState<any>([]);

  useEffect(() => {
    if(descendants && descendants.length > 0){
      !isDisplayed && setIsDisplayed(true);
    } else{
      isDisplayed && setIsDisplayed(false);
    }
  } , [descendants])

  useEffect(() => {
    if(descendants && descendants.length > 0){
      setChildren(descendants);
    } else{
      setChildren([])
    }
  } , [descendants])
  
  return {
    isDisplayed,
    children,
  }
}

export default WrapperAdapter;
