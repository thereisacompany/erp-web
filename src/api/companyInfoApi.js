import { server } from "@/api";

// 客戶列表 and 人事列表
export function getAllMemberList(params) {
  let url = `/supplier/list?currentPage=${params.currentPage}&pageSize=${params.pageSize}&search=${encodeURIComponent(params.filter)}`;

  return server.get(url).then((res) => {
    if (res.status === 200 && res.data.data.message == '成功') {
      return res.data.data
    }
  }).catch((e) => {
    console.log('error from getAllMemberList', e)
    return
  })
}

// 新增客戶 or 人事
export function addMember(data) {
  let url = `/supplier/add`;
  return server.post(url, data).then((res) => {
    return res
  }).catch((e) => {
    console.log('error from addMember', e)
    return
  })
}

// 編輯客戶 or 人事
export function editMember(data) {
  let url = `/supplier/update`;
  return server.put(url, data).then((res) => {
    return res
  }).catch((e) => {
    console.log('error from editMember', e)
    return
  })
}

// 車輛列表
export function getAllCarList(params) {
  let url = `/vehicle/list?currentPage=${params.currentPage}&pageSize=${params.pageSize}&search=${encodeURIComponent(params.filter)}`;
  return server.get(url).then((res) => {
    if (res.status === 200 && res.data.data.message == '成功') {
      return res.data.data
    }
  }).catch((e) => {
    console.log('error from getAllCarList', e)
    return
  })
}

// 新增車輛
export function addNewCar(data) {
  let url = '/vehicle/add'
  return server.post(url, data).then((res) => {
    if (res.data.code == 200) {
      return res
    }
  }).catch((e) => {
    console.log('error from addNewCar', e)
    return
  })
}

// 編輯車輛
export function updateCarInfo(data) {
  let url = '/vehicle/update'
  return server.put(url, data).then((res) => {
    if (res.data.code == 200) {
      return res
    }
  }).catch((e) => {
    console.log('error from addNewCar', e)
    return
  })
}
