/**
 * @param  {Object|Object[]} obj
 */
export const castObjectToArray = obj => {
  if (Array.isArray(obj))
    return obj;
  if (typeof obj === "object")
    return [obj]
  return []
}