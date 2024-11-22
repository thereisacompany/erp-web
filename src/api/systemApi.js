
import { server } from "@/api";

// 用戶列表
export function getUserList(currentPage, pageSize, params) {
  let url = `/user/list?currentPage=${currentPage}&pageSize=${pageSize}`;

  if (params !== null && params !== undefined) {
    url = url + `&search=${encodeURIComponent(params)}`;
  }

  return server
    .get(url)
    .then((res) => {
      if (res.data.code === 200) {
        return res.data.data
      } else {
        console.log("error from fetch data != 200");
      }
    })
    .catch(function (error) {
      console.log("error from fetch data", error);
      return;
    });
}

// 新增用戶
export function addUser(data) {
  const url = "/user/addUser";
  return server
    .post(url, data)
    .then((res) => {
      if (res.data.code === 200 && res.data.msg === '操作成功') {
        return true
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
}


// 編輯用戶
export function editUser(data) {
  const url = "/user/updateUser";
  return server
    .put(url, data)
    .then((res) => {
      if (res.data.code === 200 && res.data.msg === '操作成功') {
        return true
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
}

// 重置密碼
export function resetUserPassword(data) {
  const url = `/user/resetPwd`;
  return server
    .post(url, data)
    .then((res) => {
      if (res.data.code === 200 && res.data.message === '操作成功') {
        return true
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
}

// 登出
export function fetchLoginOut() {
  let url = `/user/logout`;
  console.log('登出')
  return server
    .get(url)
    .then((res) => {
      if (res.status === 200) {
        alert('登出成功')
        localStorage.removeItem("user");
        localStorage.removeItem("user_authList");
        window.location = '/login'
        return
      } else {
        console.log("error from fetch data != 200");
      }
    })
    .catch(function (error) {
      console.log("error from fetch data", error);
      return;
    });
}