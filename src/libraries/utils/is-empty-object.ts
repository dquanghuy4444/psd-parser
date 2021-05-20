const isEmptyObject = (value:any) => {
    return !!value && value.constructor === Object && Object.keys(value).length === 0;
};

export default isEmptyObject;