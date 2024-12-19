// 常見共用api
import { server } from "@/api";
import { message } from "ant-design-vue";
// 上傳檔案大小限制
export function getUploadFileSizeLimit() {
  let url = `/systemConfig/fileSizeLimit`;

  return server.get(url).then((res) => {
    if (res.status === 200) {
      return res.data.data
    }
  })
}

// 上傳附件
export async function uploadFiles(fileList, name) {
  let url = `/systemConfig/upload`
  const formData = new FormData();
  formData.append("file", fileList);
  formData.append("biz", name);
  return server
    .post(url, formData)
    .then((res) => {
      if (res.status === 200 && res.data.data !== null) {
        return res.data.data
      }
    })
    .catch(function (error) {
      console.log("上傳失敗", error);
      message.error('上傳失敗，請重試:', error)
    });
}