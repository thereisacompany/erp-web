import { server } from "@/api";
import { message } from "ant-design-vue";

// 客戶列表
export function getAllCustomerList(params) {
  let url = `/supplier/list?currentPage=${params.currentPage}&pageSize=${params.pageSize}&search=${encodeURIComponent(params.type)}`;

  return server.get(url).then((res) => {
    if (res.status === 200 && res.data.data.message == '成功') {
      return res.data.data.rows
    }
  })
}