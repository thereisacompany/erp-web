<!-- 新版商品管理 modal-->
<template>
  <a-modal
    v-model:open="open"
    :title="type == 'add' ? '新增客戶' : '編輯客戶'"
    centered
    @ok="handleOk"
    @cancel="closeModal"
    ok-text="保存"
    cancel-text="取消"
    :width="680"
  >
    <a-form
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      layout="vertical"
      class="mt-3 p-3"
    >
      <a-row style="gap: 15px">
        <a-col :span="11" v-for="item in formItemStatus" :key="item.key">
          <a-form-item
            :label="item.label"
            :rules="[
              {
                required: item.required,
                message: `請輸入${item.label}`,
              },
            ]"
          >
            <a-switch
              v-if="item.field == 'enabled'"
              v-model:checked="formData[item.field]"
              checked-children="啟用"
              un-checked-children="停用"
            />
            <a-input
              v-else
              v-model:value="formData[item.field]"
              :placeholder="`請輸入${item.label}`"
              @change="handleChange(item.key)"
            /> </a-form-item
        ></a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import {
  Modal,
  Form,
  FormItem,
  Input,
  Switch,
  Row,
  Col,
  message,
} from "ant-design-vue";
import { filterNullToEmptyString, assignFilteredKeys } from "@/utils/common";
import { productFormItem } from "./data";
import { useCompanyInfoStore } from "@/stores/useCompanyInfoStore";

export default defineComponent({
  components: {
    ARow: Row,
    ACol: Col,
    AModal: Modal,
    AForm: Form,
    AFormItem: FormItem,
    AInput: Input,
    ASwitch: Switch,
  },
  emits: ["reload"],
  setup(_, { emit }) {
    const type = ref();
    const open = ref(false);
    const formItemStatus = reactive(productFormItem);
    const labelCol = { style: { width: "100px" } };
    const wrapperCol = { span: 24 };
    const formData = reactive({
      id: null,
      supplier: null, // 客戶名稱
      supplierall: null, // 客戶全名
      taxid: null, // 統一編號
      contacts: null, // 聯絡人
      telephone: null, // 手機號碼
      phoneNum: null, // 聯絡電話
      email: null, // 電子信箱
      address: null, // 地址
      enabled: true, // 狀態
      type: "客戶",
    });

    const enabledOptions = reactive([
      {
        value: "啟用",
        label: "enabled",
      },
      {
        value: "停用",
        label: "disabled",
      },
    ]);
    // store
    const companyInfoStore = useCompanyInfoStore();

    // 開啟modal
    async function openModal(modalType, rowData) {
      open.value = true;
      type.value = modalType;

      if (rowData) {
        // 只留下formData中有的值
        assignFilteredKeys(formData, rowData);
      }
    }

    // 關閉modal
    function closeModal() {
      resetForm();
      open.value = false;
    }

    // 重置欄位
    function resetForm() {
      Object.keys(formData).forEach((key) => {
        formData[key] = null;
      });
    }

    // 確認
    async function handleOk() {
      let result = {};
      const data = filterNullToEmptyString(formData);
      // 新增類別
      if (type.value == "add") {
        data.id = null;
        result = await companyInfoStore.addMember(data);
      } else {
        result = await companyInfoStore.editMember(data);
      }
      if (result.data.code == 200 && result.data.data.message == "成功") {
        message.success(
          `成功${type.value == "add" ? "新增" : "編輯"}客戶成功： ${
            data.supplier
          }`
        );
        emit("reload");
        closeModal();
      }
    }

    return {
      open,
      openModal,
      closeModal,
      handleOk,
      formData,
      labelCol,
      wrapperCol,
      enabledOptions,
      type,
      formItemStatus,
    };
  },
});
</script>
<style lang="scss" scoped>
.note {
  margin-left: 8px;
  font-size: 12px;
  color: #74788d;
}
</style>



