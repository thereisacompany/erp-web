import { server } from "@/api";

// 客戶列表 and 人事列表
export function getAllMemberList(params) {
  let url = `/supplier/list?currentPage=${params.currentPage}&pageSize=${params.pageSize}&search=${encodeURIComponent(params.filter)}`;

  return server.get(url).then((res) => {
    if (res.status === 200 && res.data.data.message == '成功') {
      return res.data.data
    }
  })
}

// 新增客戶 or 人事
export function addMember(data) {
  let url = `/supplier/add`;
  return server.post(url, data).then((res) => {
    return res
  })
}

// 編輯客戶 or 人事
export function editMember(data) {
  let url = `/supplier/update`;
  return server.put(url, data).then((res) => {
    return res
  })
}

// 車輛列表
export function getAllCarList(params) {
  let url = `/vehicle/list?currentPage=${params.currentPage}&pageSize=${params.pageSize}&search=${encodeURIComponent(params.filter)}`;
  return server.get(url).then((res) => {
    if (res.status === 200 && res.data.data.message == '成功') {
      return res.data.data
    }
  })
}

