import isEmptyObject from "libraries/utils/is-empty-object";

const getVisibleStateByParent = (layer: any) => {
    if (!layer || isEmptyObject(layer)) {
        return false;
    }

    let isVisible = layer.layer.visible;
    if (isVisible) {
        let parent = layer.parent;
        while (parent) {
            if (parent) {
                isVisible = parent.layer?.visible ?? isVisible;
                if (!isVisible) {
                    parent = null
                } else {
                    parent = parent.parent;
                }
            }
        }
    }
    return isVisible;
}

export default getVisibleStateByParent