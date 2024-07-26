<template>
  <a-modal
    v-model:open="open"
    title="分配功能"
    centered
    @ok="handleOk"
    ok-text="保存"
    cancel-text="取消"
  >
    <div class="mt-4 mx-3">
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
import { defineComponent, ref, watch } from "vue";
import { Modal, Tree } from "ant-design-vue";
import { menuItems } from "./data";
import { message } from "ant-design-vue";

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
    watch(checkedKeys, () => {
      console.log("checkedKeys", checkedKeys);
    });

    // 開啟
    function openModal() {
      console.log("modalRef");
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
      console.log("handleOk");
      // 暫時先不用分配按鈕
      // emit("openTips", "分配按鈕");
      message.success("分配功能成功！");
      open.value = false;
    }

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
