<template>
  <div style="width: auto">
    <button
      type="button"
      class="btn btn-primary btn-rounded mb-2 me-2 upload-button d-flex align-items-center gap-1"
      @click="handleOpenFile"
    >
      <upload-outlined></upload-outlined>
      {{ name }}
    </button>
    <input
      ref="importFile"
      type="file"
      class="d-none"
      accept=".xls,.xlsx"
      @change="handleUpload"
    />
  </div>
</template>
<script>
import { ref } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { server } from "@/api";
import common from "@/api/common";

export default {
  name: "匯入",
  components: {
    UploadOutlined,
  },
  props: {
    buttonName: String,
    apiLink: String,
  },
  emits: ["importSuccess"],
  setup(props, { emit }) {
    const importFile = ref(null);
    // 按鈕名稱
    const name = ref(props.buttonName);

    function handleOpenFile() {
      importFile.value.click();
      console.log("handleOpenFile");
    }

    // 上傳檔案
    async function handleUpload(event) {
      let fileList = importFile.value.files[0];
      const formData = new FormData();
      formData.append("file", fileList);
      // console.log("handleUpload formData", formData);
      // console.log("props.apiLink", props.apiLink);
      try {
        // 自定義API請求邏輯
        server
          .post(props.apiLink, formData)
          .then((res) => {
            console.log("res", res);
            if (res != null && res.data != null && res.data.code == 200) {
              let dataMsg = res.data.data;
              console.log("dataMsg", dataMsg);

              alert(common.replaceAll(dataMsg, "'", ""));

              emit("importSuccess");
              event.target.value = "";
            } else if (
              res != null &&
              res.data != null &&
              res.data.code != 200
            ) {
              console.log("匯入失敗", res.data.data);
              alert(common.replaceAll(res.data.data, "'", ""));
              event.target.value = "";
            }
          })
          .catch(function (error) {
            console.log("匯入失敗 error", error);
            alert(error);
            //callback(null)
            return;
          });
      } catch (error) {
        console.log("error", error);
      }
    }

    return {
      name,
      handleUpload,
      importFile,
      handleOpenFile,
    };
  },
};
</script>
<style>
.ant-upload-wrapper {
  display: block;
}

/* 匯入配送單 */
.import-delivery .upload-button {
  background-color: #2a6189 !important;
  border: 1px solid #2a6189 !important;
  color: #fff !important;
}

/* 匯入門市取貨派送 */
.import-pickup button {
  background-color: #559ee6 !important;
  border: 1px solid #559ee6 !important;
  color: #fff !important;
}
</style>
