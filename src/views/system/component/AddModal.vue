<template>
  <a-modal
    v-model:open="open"
    :title="title"
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
  emits: ["openTips", "submit"],
  setup(_, { emit }) {
    const title = ref("新增");
    const open = ref(false);
    const formData = reactive({
      name: null,
      description: null,
      type: null,
      id: null,
      // state: true,
    });
    const labelCol = { style: { width: "100px" } };
    const wrapperCol = { span: 14 };
    const options = reactive(["全部數據", "個人數據"]);
    const recodeData = ref();

    function openModal(titleValue, data) {
      open.value = true;
      title.value = titleValue;
      console.log("openModal", titleValue, data);
      if (data) {
        recodeData.value = data;
        formData.name = data.name;
        formData.description = data.description;
        formData.type = data.type;
        formData.id = data.id;
      }
    }

    function closeModal() {
      formData.name = null;
      formData.description = null;
      formData.type = null;
      formData.id = null;
      open.value = false;
    }

    // 確認角色是否已存在
    function checkExist(data) {
      let url = `/role/checkIsNameExist?name=${data.name}&id=${data.id}`;
      return server
        .get(url)
        .then((res) => {
          return res.data.data.status;
        })
        .catch((error) => {
          console.log("error from add role", error);
          throw error; // 将错误抛出，以便在调用者中捕获
        });
    }

    // 點擊確認，回傳父層打開操作提示modal並帶入下一步名稱
    function handleOk() {
      if (title.value == "新增角色") {
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
            message.success(`${title.value}成功！`);
            open.value = false;

            emit("openTips", "分配功能");
          })
          .catch((error) => {
            console.log("error from add role", error);
          });
      } else {
        if (checkExist(formData)) {
          let url = `/role/update`;
          const params = {
            name: formData.name ? formData.name : null,
            type: formData.type ? formData.type : null,
            description: formData.description ? formData.description : null,
            id: formData.id ? formData.id : null,
            deleteFlag: recodeData.value.deleteFlag,
            enabled: recodeData.value.enabled,
            tenantId: recodeData.value.tenantId,
          };
          filterNullValues(params);
          server
            .put(url, params)
            .then((res) => {
              console.log("res", res);
              message.success(`${title.value}成功！`);
              emit("submit");
              open.value = false;
            })
            .catch((error) => {
              console.log("error from add role", error);
            });
        }
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
      options,
      title,
    };
  },
});
</script>



