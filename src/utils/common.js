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

// 將值為null的item改為空字串
export function filterNullToEmptyString(obj) {
  if (obj === null || obj === undefined) {
    return {};
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];

    acc[key] = value === null ? "" : value;
    return acc;
  }, {});
}

// 過濾obj，只保留原先obj有的key的值
export function assignFilteredKeys(target, source) {
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }

  return target;
}

