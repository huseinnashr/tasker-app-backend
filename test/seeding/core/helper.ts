/** Copy given array and return new array */
const deepCopy = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

export { deepCopy };
