import { PsdContext } from 'contexts/psd/provider';
import fabric from 'libraries/functions/create-new-fabric';
import dataUrlToFile from 'libraries/utils/data-url-to-file';
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CanvasContext } from '../../../../contexts/canvas/provider';
import isEmptyObject from 'libraries/utils/is-empty-object';
import getVisibleStateByParent from 'libraries/functions/get-visible-state-by-parent';

function ViewAdapter() {
  const NAME_BACKGROUND = 'Background';
  const NUM_EXTEND_RATIO = 1.2;
  const NUM_DEFAULT_SCALE = 1;

  // ref
  const canvasRef = useRef(null)
  const numScaleRef = useRef<number>(NUM_DEFAULT_SCALE);

  // context
  const { canvas , initCanvas, activeObject, setActiveObject }: any = useContext(CanvasContext);
  const { setPsd , descendants , setDescendants }: any = useContext(PsdContext);

  // state
  const [bgHasDone, setBgHasDone] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getBackground = async () => {
      if (!descendants) {
        return;
      }

      if (!canvas || isEmptyObject(canvas)) {
        return;
      }

      if (descendants.length <= 0) {
        return;
      }

      console.log(descendants)

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
  }, [descendants , canvas])

  useEffect(() => {
    const getLayers = async () => {
      if (!bgHasDone) {
        return;
      }

      const numScale = numScaleRef.current;

      console.time("abbbbb")

      await descendants.forEach(async (desc: any) => {
        if (isEmptyObject(desc)) {
          return;
        }

        if (desc.hasChildren() || desc.name === NAME_BACKGROUND) {
          return;
        }

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
          text.id = desc.id;
          text.visible = isVisible;

          canvas.add(text);

        } else {
          let base64 = await desc.layer.image.toBase64();
          await fabric.Image.fromURL(base64, function (img: any) {
            img.scaleToWidth(img.width / numScale);
            img.scaleToHeight(img.height / numScale);

            img.top = coords.top / numScale;
            img.left = coords.left / numScale;
            img.bottom = coords.bottom / numScale;
            img.right = coords.right / numScale;

            img.id = desc.id;
            img.visible = isVisible;

            canvas.add(img);
          });
        }
      })
      canvas.renderAll();

      console.timeEnd("abbbbb")


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
    setActiveObject(canvas.getActiveObject());

    console.log(canvas.getActiveObject())
    canvas.renderAll()
  }, [canvas ,  setActiveObject])


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

  function scaleCanvas(factor: any) {
    canvas.setHeight(canvas.getHeight() * factor);
    canvas.setWidth(canvas.getWidth() * factor);

    if (canvas.backgroundImage) {
      canvas.backgroundImage.scaleToWidth(canvas.backgroundImage.width * factor);
      canvas.backgroundImage.scaleToHeight(canvas.backgroundImage.height * factor);
    }

    var objects = canvas.getObjects();
    for (var i in objects) {
      var scaleX = objects[i].scaleX;
      var scaleY = objects[i].scaleY;
      var left = objects[i].left;
      var top = objects[i].top;

      var tempScaleX = scaleX * factor;
      var tempScaleY = scaleY * factor;
      var tempLeft = left * factor;
      var tempTop = top * factor;

      objects[i].scaleX = tempScaleX;
      objects[i].scaleY = tempScaleY;
      objects[i].left = tempLeft;
      objects[i].top = tempTop;

      objects[i].setCoords();
    }
    canvas.renderAll();
    canvas.calcOffset();
  }

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
    scaleCanvas(numScaleRef.current);

    const image = await canvas.toDataURL(`image/${ext}`, 1.0).replace(`image/${ext}`, "image/octet-stream");

    const link = document.createElement('a');
    link.download = `image.${ext}`;
    link.href = image;
    link.click();
    link.remove();

    scaleCanvas(1 / numScaleRef.current);

  }

  const backToDropZone = () => {
    setPsd(null)
    setActiveObject(null)
    setDescendants([])
    canvas?.clear();
  }

  const exportToJson = () => {
    console.log(descendants)
  }

  return {
    canvasRef,
    activeObject,
    toggleCanvas,
    exportToImage,
    backToDropZone,
    isLoading,
    exportToJson
  }
}

export default ViewAdapter;
