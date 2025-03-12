import { server } from "@/api";

// 倉庫列表
export function getDepotList() {
  let url = `/depot/findDepotByCurrentUser`;

  return server.get(url).then((res) => {
    console.log('倉庫列表 res', res)
    if (res.status === 200 && res.data.code == 200) {
      return res.data.data
    }
  }).catch((e) => {
    console.log('error from getAllMemberList', e)
    return
  })
}

