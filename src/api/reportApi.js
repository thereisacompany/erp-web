import { server } from "@/api";

// 進銷存統計
export function getOutStockList(params) {
  let url = `/depotItem/findByAll?currentPage=${params.currentPage}&pageSize=${params.pageSize}&mpList=&order=${params.order}&findOrganId=&materialParam=&depotIds=&endDateTime=${params.endDateTime}`;

  return server.get(url).then((res) => {
    if (res.status === 200 && res.data.code == 200) {
      return res.data.data
    }
  }).catch((e) => {
    console.log('error from getAllMemberList', e)
    return
  })
}

