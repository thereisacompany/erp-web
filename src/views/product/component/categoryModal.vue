<template>
  <a-modal
    v-model:open="open"
    :title="type == 'add' ? '新增類別' : '編輯類別'"
    centered
    @ok="handleOk"
    @cancel="closeModal"
    ok-text="保存"
    cancel-text="取消"
  >
    <a-form
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      class="mt-3 p-3"
    >
      <a-form-item
        label="類別名稱"
        :rules="[{ required: true, message: '請輸入類別名稱' }]"
      >
        <a-input v-model:value="formData.name" placeholder="請輸入" />
      </a-form-item>
      <a-form-item
        label="排序"
        :rules="[{ required: true, message: '請選擇數排序' }]"
      >
        <a-input-number
          id="inputNumber"
          v-model:value="formData.sort"
          placeholder="請選擇"
          :min="1"
        />
      </a-form-item>
      <a-form-item label="上層類別">
        <a-select
          v-model:value="formData.parentId"
          placeholder="請選擇"
          :options="parentList"
          :field-names="{ label: 'title', value: 'id', options: 'parentList' }"
        >
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import {
  Modal,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  message,
} from "ant-design-vue";
import { filterNullValues } from "@/utils/common";
import {
  getCategoryList,
  addCategory,
  getCategoryInfo,
  editCategory,
} from "@/api/productApi.js";

export default defineComponent({
  components: {
    AModal: Modal,
    AForm: Form,
    AFormItem: FormItem,
    AInput: Input,
    AInputNumber: InputNumber,
    ASelect: Select,
  },
  emits: ["reload"],
  setup(_, { emit }) {
    const type = ref();
    const open = ref(false);
    const formData = reactive({
      name: null,
      sort: null,
      parentId: null,
      id: null,
    });
    const labelCol = { style: { width: "100px" } };
    const wrapperCol = { span: 14 };
    const options = reactive(["全部數據", "個人數據"]);
    const parentList = ref();

    // 開啟modal
    async function openModal(modalType, id) {
      open.value = true;
      type.value = modalType;

      if (id) {
        const result = await getCategoryInfo(id);
        const res = result.data.data;
        if (result.data.code == 200 && res) {
          formData.id = res.id;
          formData.name = res.name;
          formData.sort = res.sort;
          formData.parentId = res.parentId;
        }
      }
    }

    // 關閉modal
    function closeModal() {
      resetForm();
      open.value = false;
    }

    // 重置欄位
    function resetForm() {
      formData.name = null;
      formData.sort = null;
      formData.parentId = null;
    }

    // 確認
    async function handleOk() {
      let result = {};
      const params = filterNullValues(formData);
      // 新增類別
      if (type.value == "add") {
        result = await addCategory(params);
      } else {
        result = await editCategory(params);
      }
      if (result.data.code == 200 && result.data.data.message == "成功") {
        message.success(`成功${type.value == "add" ? "新增" : "編輯"}類別`);
        emit("reload");
        closeModal();
      }
    }

    onMounted(() => {
      // 取得上層類別data
      getCategoryList().then((result) => {
        parentList.value = result;
      });
    });

    return {
      open,
      openModal,
      closeModal,
      handleOk,
      formData,
      labelCol,
      wrapperCol,
      options,
      type,
      parentList,
    };
  },
});
</script>



