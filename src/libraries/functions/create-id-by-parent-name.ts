import isEmptyObject from "libraries/utils/is-empty-object";

const createIdByParentName = (layer: any) => {
  if (!layer || isEmptyObject(layer)) {
    return "";
  }

  let parent = layer.parent;
  let id = layer.name;

  while (parent) {
    if (parent) {
      id += parent.name ? ("-" + parent.name) : "";
      parent = parent.parent;
    }
  }

  return id;
};

export default createIdByParentName;
