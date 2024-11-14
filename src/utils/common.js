// 過濾obj值為null的item
export function filterNullValues(obj) {
  if (obj === null || obj === undefined) {
    return {};
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
}