import { server } from "@/api";
import { message } from "ant-design-vue";

// 產品類別
export function getCategoryList() {
  let url = `/materialCategory/getMaterialCategoryTree?id=`;
  return server.get(url).then((res) => {
    if (res.status === 200) {
      return res.data
    }
  })
}

// 處理api回傳資料，轉為樹狀
export function flattenData(data, parentId = null) {
  let result = [];
  data.forEach(item => {
    const { id, title } = item;
    // 將當前節點轉換為扁平結構並添加到結果中
    result.push({ id, parentId, title });
    // 如果當前節點有子節點，遞迴處理子節點
    if (item.children && item.children.length > 0) {
      result = result.concat(flattenData(item.children, id));
    }
  });
  return result;
}

// 新增類別
export function addCategory(params) {
  let url = `/materialCategory/add`;
  return server.post(url, params).then((res) => {
    if (res.status === 200) {
      return res
    }
  })
}

// 取得類別細節
export function getCategoryInfo(id) {
  let url = `/materialCategory/findById?id=${id}`;
  return server.get(url).then((res) => {
    if (res.status === 200) {
      return res
    }
  })
}

// 編輯類別
export function editCategory(params) {
  let url = `/materialCategory/update`;
  return server.put(url, params).then((res) => {
    if (res.status === 200) {
      return res
    }
  })
}

// 刪除類別
export function deleteCategory(id) {
  let url = `/materialCategory/deleteBatch?ids=${id}`;
  return server.delete(url).then((res) => {
    if (res.status === 200 && res.data.data.message === '成功') {
      return res
    } else {
      message.warning('請先將子類別刪除')
    }
  })
}