<template>
  <a-modal
    v-model:open="open"
    title="新增"
    centered
    @ok="handleOk"
    ok-text="保存"
    cancel-text="取消"
  >
    <a-form
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      class="mt-5 p-3"
    >
      <a-form-item
        label="角色名稱"
        :rules="[{ required: true, message: '請輸入角色名稱' }]"
      >
        <a-input v-model:value="formData.name" placeholder="請輸入角色名稱" />
      </a-form-item>

      <a-form-item
        label="數據類型"
        :rules="[{ required: true, message: '請選擇數據類型' }]"
      >
        <a-select v-model:value="formData.type" placeholder="請選擇數據類型">
          <a-select-option
            :value="option"
            v-for="option in options"
            :key="option"
            >{{ option }}</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item label="備註">
        <a-textarea v-model:value="formData.description" placeholder="備註" />
      </a-form-item>

      <!-- <a-form-item label="狀態">
        <a-switch
          v-model:checked="formData.state"
          checked-children="啟用"
          un-checked-children="禁用"
        />
      </a-form-item> -->
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
  Select,
  SelectOption,
  Textarea,
  // Switch,
  message,
} from "ant-design-vue";
import { server } from "@/api";
import { filterNullValues } from "./data";

export default defineComponent({
  components: {
    AModal: Modal,
    AForm: Form,
    AFormItem: FormItem,
    AInput: Input,
    ASelect: Select,
    ASelectOption: SelectOption,
    ATextarea: Textarea,
    // ASwitch: Switch,
  },
  emits: ["openTips"],
  setup(_, { emit }) {
    const open = ref(false);
    const formData = reactive({
      name: null,
      description: null,
      type: null,
      // state: true,
    });
    const labelCol = { style: { width: "100px" } };
    const wrapperCol = { span: 14 };
    const options = reactive(["全部數據", "個人數據"]);

    function openModal() {
      open.value = true;
    }

    function closeModal() {
      formData.name = null;
      formData.description = null;
      formData.type = null;
      open.value = false;
    }

    // 點擊確認，回傳父層打開操作提示modal並帶入下一步名稱
    function handleOk() {
      // 串接新增api
      let url = `/role/add`;
      const params = {
        name: formData.name ? formData.name : null,
        type: formData.type ? formData.type : null,
        description: formData.description ? formData.description : null,
      };
      filterNullValues(params);
      server
        .post(url, params)
        .then((res) => {
          console.log("res", res);
          message.success("新增角色成功！");
          open.value = false;
          emit("openTips", "分配功能");
        })
        .catch((error) => {
          console.log("error from add role", error);
        });
    }

    return {
      open,
      openModal,
      closeModal,
      handleOk,
      formData,
      labelCol,
      wrapperCol,
      options,
    };
  },
});
</script>



