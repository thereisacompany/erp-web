<template>
  <div class="clearfix">
    <a-upload
      v-model:file-list="fileList"
      :custom-request="uploadHandler"
      list-type="picture-card"
      @preview="handlePreview"
    >
      <div>
        <PlusOutlined />
        <div style="margin-top: 8px">上傳</div>
      </div>
    </a-upload>
    <a-modal
      :open="previewVisible"
      :title="previewTitle"
      :footer="null"
      @cancel="handleCancel"
    >
      <img alt="file preview" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { uploadFiles } from "@/api/commonApi";

const props = defineProps({
  uploadApiUrl: {
    type: String,
  },
  fileSource: {
    type: Array,
  },
});

const fileList = ref([]);
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const emit = defineEmits(["uploadSuccess"]);

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};

// 預覽
const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name;
};

// 上傳檔案
const uploadHandler = async ({ file, onProgress, onSuccess, onError }) => {
  try {
    let progress = 0;

    // 模擬進度條
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        return;
      }
      progress += 10;
      onProgress({ percent: progress });
    }, 200);

    // 調用後端上傳接口
    const result = await uploadFiles(file, "HR"); // 上傳接口
    console.log("result", result);
    if (result) {
      // 停止進度條並標記成功
      clearInterval(interval);
      onProgress({ percent: 100 });
      // 假設 result 返回的是圖片 URL，應更新為：
      const data = {
        uid: file.uid,
        name: file.name,
        status: "done", // 標記為已成功上傳
        url: result, // 從 result 中取出 URL（假設 result 是 { url: 'xxx' }）
      };

      // 調用成功回調並更新
      onSuccess(data, file); // 傳遞正確的參數格式
      emit("uploadSuccess", result);
    }
  } catch (error) {
    // 上傳失敗處理
    onError(new Error("Upload failed"));
    console.error("Upload failed:", error);
  }
};

onMounted(() => {
  if (props.fileSource) {
    // 附件連結處理
    const files = String(props.fileSource)
      .split(",")
      .filter((file) => file !== "");
    fileList.value = files.map((file) => {
      return {
        url: file,
      };
    });
  }
});
</script>
<style scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>