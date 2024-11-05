import { server } from "@/api";

export const getMenuItem = () => {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const userId = user.UserID;
    const url = `/function/findMenuByPNumber`;
    const params = {
      pNumber: 0,
      userId: userId,
    };
    return server
      .post(url, params)
      .then((res) => {
        return replaceIdWithKey(res.data)
      })
      .catch((error) => {
        console.log("error from findMenuByPNumber", error);
        window.location = "/logout";
      });
  }
}

// 遞迴替換 id 為 key 的函式
function replaceIdWithKey(items) {
  return items.map(item => {
    // 新的物件，將 id 替換為 key
    const newItem = { ...item, key: item.id };
    delete newItem.id;

    // 如果有子元素，遞迴處理 children
    if (newItem.children && newItem.children.length > 0) {
      newItem.children = replaceIdWithKey(newItem.children);
    }

    return newItem;
  });
}

// 過濾obj值為null的item
export function filterNullValues(obj) {
  if (obj === null || obj === undefined) {
    return {};
  }

  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== null) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
