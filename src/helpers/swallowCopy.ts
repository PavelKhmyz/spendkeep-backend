// This method works fast than spread operator or Object.assign(...)
const swallowCopy = <ObjectType extends Record<string, unknown>>(object: ObjectType): ObjectType => {
  return Object.keys(object).reduce((newObject, key) => {
    newObject[key] = object[key];

    return newObject;
  }, {} as Record<string, unknown>) as ObjectType;
};

export default swallowCopy;
