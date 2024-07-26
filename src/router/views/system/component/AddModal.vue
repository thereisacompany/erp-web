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
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      class="mt-5 p-3"
    >
      <a-form-item label="角色名稱">
        <a-input v-model:value="formState.name" placeholder="請輸入角色名稱" />
      </a-form-item>

      <a-form-item label="數據類型">
        <a-select v-model:value="formState.type" placeholder="選擇數據類型">
          <a-select-option
            :value="option"
            v-for="option in options"
            :key="option"
            >{{ option }}</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item label="備註">
        <a-textarea v-model:value="formState.remark" placeholder="備註" />
      </a-form-item>

      <a-form-item label="狀態">
        <a-switch
          v-model:checked="formState.state"
          checked-children="啟用"
          un-checked-children="禁用"
        />
      </a-form-item>
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
  Switch,
  message,
} from "ant-design-vue";
export default defineComponent({
  components: {
    AModal: Modal,
    AForm: Form,
    AFormItem: FormItem,
    AInput: Input,
    ASelect: Select,
    ASelectOption: SelectOption,
    ATextarea: Textarea,
    ASwitch: Switch,
  },
  emits: ["openTips"],
  setup(_, { emit }) {
    const open = ref(false);
    const formState = reactive({
      name: "",
      remark: "",
      type: undefined,
      state: true,
    });
    const labelCol = { style: { width: "100px" } };
    const wrapperCol = { span: 14 };
    const options = reactive(["全部數據", "個人數據"]);
    function openModal() {
      console.log("modalRef");
      open.value = true;
    }

    function closeModal() {
      open.value = false;
    }

    // 點擊確認，回傳父層打開操作提示modal並帶入下一步名稱
    function handleOk() {
      console.log("handleOk");
      emit("openTips", "分配功能");
      message.success("新增角色成功！");
      open.value = false;
    }

    return {
      open,
      openModal,
      closeModal,
      handleOk,
      formState,
      labelCol,
      wrapperCol,
      options,
    };
  },
});
</script>



