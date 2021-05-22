import { PsdContext } from 'contexts/psd/provider';
import fabric from 'libraries/functions/create-new-fabric';
import dataUrlToFile from 'libraries/utils/data-url-to-file';
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CanvasContext } from '../../../../contexts/canvas/provider';
import isEmptyObject from 'libraries/utils/is-empty-object';
import createIdByParentName from 'libraries/functions/create-id-by-parent-name';
import getVisibleStateByParent from 'libraries/functions/get-visible-state-by-parent';

function ViewAdapter() {
  const NAME_BACKGROUND = 'Background';
  const NUM_EXTEND_RATIO = 1.2;
  const NUM_DEFAULT_SCALE = 1;

  // ref
  const canvasRef = useRef(null)
  const numScaleRef = useRef<number>(NUM_DEFAULT_SCALE);

  // context
  const { canvas, initCanvas, activeObject, setActiveObject }: any = useContext(CanvasContext);
  const { setPsd, psd }: any = useContext(PsdContext);

  // state
  const [bgHasDone, setBgHasDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getBackground = async () => {
      if (!psd || isEmptyObject(psd)) {
        return;
      }

      if (!canvas || isEmptyObject(canvas)) {
        return;
      }

      const descendants = await psd.tree().descendants();
      if (descendants.length <= 0) {
        return;
      }

      const layerBackground = descendants.find((desc: any) => desc.name === NAME_BACKGROUND);
      if (!layerBackground || isEmptyObject(layerBackground)) {
        alert(`K tìm thấy layer có tên ${NAME_BACKGROUND}`)
        return backToDropZone();
      }

      setIsLoading(true);
      let base64 = await layerBackground.layer.image.toBase64();
      let file = await dataUrlToFile(base64, "abc.png");

      let reader = new FileReader();

      reader.addEventListener("load", async function () {
        await fabric.Image.fromURL(reader.result, async function (img: any) {
          const viewEl = document.getElementById("view");
          const viewWidth = viewEl?.offsetWidth ?? 1;
          const viewHeight = viewEl?.offsetHeight ?? 1;

          const imgWidth = img.width;
          const imgHeight = img.height;

          const ratioWidth = imgWidth / viewWidth;
          const ratioHeight = imgHeight / viewHeight;

          if (ratioWidth > NUM_DEFAULT_SCALE && ratioHeight > NUM_DEFAULT_SCALE) {
            numScaleRef.current = Math.max(ratioWidth, ratioHeight) * NUM_EXTEND_RATIO;
          }

          setBgHasDone(true)

          canvas.setDimensions({ width: imgWidth / numScaleRef.current, height: imgHeight / numScaleRef.current });
          await canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / imgWidth,
            scaleY: canvas.height / imgHeight
          });
        });

      }, false);

      if (file) {
        await reader.readAsDataURL(file);
      }
    }

    getBackground();
  }, [psd, canvas])

  useEffect(() => {
    const getLayers = async () => {
      if (!bgHasDone) {
        return;
      }

      const descendants = await psd.tree().descendants().reverse();

      const numScale = numScaleRef.current;

      console.time("abbbbb")
      await descendants.forEach(async (desc: any) => {

        if (isEmptyObject(desc)) {
          return;
        }

        if (desc.hasChildren() || desc.name === NAME_BACKGROUND) {
          return;
        }

        const id = createIdByParentName(desc);
        const isVisible = getVisibleStateByParent(desc);

        const { coords } = desc;
        const textObj = await desc.export().text;
        if (textObj) {
          var text = await new fabric.Text(textObj.value, {
            top: coords.top / numScale,
            left: coords.left / numScale,
            bottom: coords.bottom / numScale,
            right: coords.right / numScale,
            fontSize: textObj.font.sizes[0] / numScale,
            fontFamily: 'Verdana',
            fill: 'black'
          });
          text.id = id;
          text.visible = isVisible;

          canvas.add(text);

        } else {
          console.log(desc.layer.image);
          let base64 = await desc.layer.image.toBase64();
          await fabric.Image.fromURL(base64, function (img: any) {
            img.scaleToWidth(img.width / numScale);
            img.scaleToHeight(img.height / numScale);

            img.top = coords.top / numScale;
            img.left = coords.left / numScale;
            img.bottom = coords.bottom / numScale;
            img.right = coords.right / numScale;

            img.id = id;
            img.visible = isVisible;

            canvas.add(img);

          });
        }
      })

      console.timeEnd("abbbbb")

      await canvas.renderAll();

      setBgHasDone(false);
      setIsLoading(false);
    }

    getLayers();

  }, [bgHasDone])


  useLayoutEffect(() => {
    initCanvas(canvasRef.current, {
      width: 0,
      height: 0,
    })
  }, [canvasRef, initCanvas])

  const updateActiveObject = useCallback((e: any) => {
    if (!e) {
      return
    }
    setActiveObject(canvas.getActiveObject())
    canvas.renderAll()
  }, [canvas])


  function preventCanvas(e: any) {
    var obj = e.target;
    // if object is too big ignore
    if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
      return;
    }
    obj.setCoords();
    // top-left  corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
      obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
      obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
    }
    // bot-right corner
    if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
      obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
      obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
    }
  }

  useEffect(() => {
    if (!canvas || isEmptyObject(canvas)) {
      return
    }
    canvas.on("selection:created", updateActiveObject)
    canvas.on("selection:updated", updateActiveObject)
    canvas.on("selection:cleared", updateActiveObject)
    canvas.on("object:moving", preventCanvas)

    return () => {
      canvas.off("selection:created")
      canvas.off("selection:cleared")
      canvas.off("selection:updated")
      canvas.off("object:moving")
    }
  }, [canvas, updateActiveObject]);

  const toggleCanvas = () => {
    setActiveObject({
      ...activeObject,
      visible: !activeObject.visible
    })

    canvas.getObjects().forEach(function (o: any) {
      if (o.id === activeObject.id) {
        o.visible = !o.visible;
      }
    })

    canvas.renderAll();
  }

  async function exportToImage(ext: string = "png") {
    const image = await canvas.toDataURL(`image/${ext}`, 1.0).replace(`image/${ext}`, "image/octet-stream");

    const link = document.createElement('a');
    link.download = `image.${ext}`;
    link.href = image;
    link.click();
    link.remove();
  }

  const backToDropZone = () => {
    setPsd(null)
    setActiveObject(null)

    canvas?.clear();
  }

  return {
    canvasRef,
    activeObject,
    toggleCanvas,
    exportToImage,
    backToDropZone,
    isLoading
  }
}

export default ViewAdapter;
