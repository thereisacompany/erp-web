<!-- 用戶管理新版 新增與編輯 modal, 改寫完成 -->
<template>
  <a-modal
    v-model:open="open"
    :title="title"
    centered
    @ok="handleClickSave"
    @cancel="closeModal"
    ok-text="保存"
    cancel-text="取消"
  >
    <a-form
      ref="formRef"
      name="addUser"
      class="add-user-form"
      :model="formData"
      layout="vertical"
    >
      <a-row :gutter="12">
        <template v-for="item in formState" :key="item.key">
          <a-col :span="item.key === 'description' ? 24 : 12">
            <a-form-item
              :name="item.key"
              :label="item.name"
              :help="item.key === 'loginName' ? '* 預設密碼為 123456 ' : ''"
              :rules="[{ required: item.required, message: '請填寫完整' }]"
            >
              <a-input
                v-if="item.key !== 'roleId'"
                v-model:value="formData[item.key]"
                placeholder="請輸入"
              ></a-input>

              <a-select
                v-else
                v-model:value="formData[item.key]"
                placeholder="請選擇"
              >
                <a-select-option
                  v-for="option in roleOptionList"
                  :key="option.id"
                  :value="option.id"
                  >{{ option.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </template>
      </a-row></a-form
    >
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import {
  Modal,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Row,
  Col,
  message,
} from "ant-design-vue";
import { server } from "@/api";
import { addUser, editUser } from "@/api/systemApi.js";

export default defineComponent({
  components: {
    AModal: Modal,
    AForm: Form,
    AFormItem: FormItem,
    AInput: Input,
    ASelect: Select,
    ASelectOption: SelectOption,
    ARow: Row,
    ACol: Col,
  },
  props: {},
  emits: ["openTips", "submit"],
  setup(_, { emit }) {
    const open = ref(false);
    const title = ref("");
    const action = ref("");
    const formRef = ref(null);
    const formData = reactive({
      loginName: null,
      username: null,
      roleId: null,
      position: null,
      description: null,
      phonenum: null,
    });
    const formState = reactive([
      {
        name: "登入帳號",
        key: "loginName",
        required: true,
      },
      {
        name: "用戶姓名",
        key: "username",
        required: true,
      },
      {
        name: "角色",
        key: "roleId",
      },
      {
        name: "職稱",
        key: "position",
      },
      {
        name: "電話",
        key: "phonenum",
      },
      {
        name: "說明",
        key: "description",
      },
    ]);
    const labelCol = { style: { width: "100px" } };
    const wrapperCol = { span: 14 };
    const roleOptionList = ref([]);

    function openModal(type, data) {
      open.value = true;
      action.value = type;
      title.value = type === "add" ? "新增用戶" : "編輯用戶";
      if (data) {
        // 將data賦值給formData
        Object.assign(formData, data);
        formData["id"] = data.id;
      }
    }

    function closeModal() {
      resetForm();
      open.value = false;
    }

    function resetForm() {
      formData.loginName = null;
      formData.username = null;
      formData.roleId = null;
      formData.position = null;
      formData.description = null;
      formData.phonenum = null;
    }

    // 保存
    function handleClickSave() {
      formRef.value.validate().then(() => {
        if (action.value == "add") {
          addUser(formData)
            .then((apiResult) => {
              if (apiResult) {
                message.success("新增成功");
                emit("submit");
                closeModal();
              }
            })
            .catch((e) => {
              console.log("handleClickSave add user error", e);
              message.error("新增失敗，請重試");
            });
        } else {
          editUser(formData)
            .then((apiResult) => {
              if (apiResult) {
                message.success("編輯成功");
                emit("submit");
                closeModal();
              }
            })
            .catch((e) => {
              console.log("handleClickSave edit user error", e);
              message.error("編輯失敗，請重試");
            });
        }
      });
    }

    // 角色列表
    function fetchRoleData() {
      const url = "/role/list?currentPage=1&pageSize=1000";
      server
        .get(url)
        .then((res) => {
          if (res.data.code == 200) {
            roleOptionList.value = res.data.data.rows;
          }
        })
        .catch((error) => {
          console.log("error from fetchRoleData", error);
          return;
        });
    }

    onMounted(() => {
      fetchRoleData();
    });

    return {
      open,
      openModal,
      closeModal,
      handleClickSave,
      formData,
      formState,
      labelCol,
      wrapperCol,
      roleOptionList,
      formRef,
      title,
    };
  },
});
</script>

<style lang="scss" scoped>
.add-user-form {
  padding: 20px 0;
}
</style>

