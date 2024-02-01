export const objectToBase64Json = <Data>(objectToEncode: Data): string => {
  return btoa(JSON.stringify(objectToEncode));
};
