<template>
  <a-modal
    v-model:open="open"
    title="分配功能"
    centered
    destroyOnClose
    @ok="handleOk"
    ok-text="保存"
    cancel-text="取消"
  >
    <div class="mt-4 mx-3">
      checkedKeys/{{ checkedKeys }}
      <a-tree
        v-model:checkedKeys="checkedKeys"
        :defaultExpandAll="true"
        :tree-data="menuItems"
        checkable
      >
        <template #title="{ title }">
          <span>{{ title }}</span>
        </template>
      </a-tree>
    </div>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { Modal, Tree } from "ant-design-vue";
import { menuItems } from "./data";
import { message } from "ant-design-vue";
import { server } from "@/api";
import { filterNullValues } from "./data";
export default defineComponent({
  components: {
    AModal: Modal,
    ATree: Tree,
  },
  // emits: ["openTips"],
  // _, { emit }
  setup() {
    const open = ref(false);
    const checkedKeys = ref([]); // 選中的item
    const checkedAll = ref(false);
    const rowData = ref();

    // 開啟
    function openModal(data) {
      checkedKeys.value = [];

      if (data !== null) {
        rowData.value = data;
        console.log("rowData", rowData.value);
        const url = `/function/findMenuByPNumber`;
        const params = {
          pNumber: 0,
          userId: 63,
        };
        server.post(url, params).then((res) => {
          const data = res.data[0].children;
          console.log("data", data);
        });
      }

      open.value = true;
    }

    // 關閉
    function closeModal() {
      open.value = false;
      checkedKeys.value = [];
    }

    // 確認
    // 點擊確認，回傳父層打開操作提示modal並帶入下一步名稱
    function handleOk() {
      // 暫時先不用分配按鈕
      // emit("openTips", "分配按鈕");
      // 串接新增api
      let url = `/userBusiness/add`;
      const params = {
        // name: rowData.value.name,
        type: "RoleFunctions",
        keyId: rowData.value.id,
        value: checkedKeys.value,
      };
      filterNullValues(params);
      server
        .post(url, params)
        .then((res) => {
          console.log("分配功能成功 res=", res.data.data.rows);
          message.success("分配功能成功！");
          open.value = false;
        })
        .catch((error) => {
          console.log("error from add role", error);
        });
    }

    onMounted(() => {
      checkedKeys.value = [];
      console.log("onMounted", checkedKeys.value);

      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const userId = user.UserID;
        console.log("userId", userId);
      }
    });

    return {
      open,
      openModal,
      closeModal,
      handleOk,
      menuItems,
      checkedKeys,
      checkedAll,
    };
  },
});
</script>
