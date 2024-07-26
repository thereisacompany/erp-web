<template>
  <a-modal
    v-model:open="open"
    title="分配按鈕"
    centered
    @ok="handleOk"
    ok-text="保存"
    cancel-text="取消"
  >
    <p>分配按鈕</p>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { Modal } from "ant-design-vue";

export default defineComponent({
  components: {
    AModal: Modal,
  },
  emits: ["openNextStep"],
  setup(_, { emit }) {
    const open = ref(false);

    // 開啟
    function openModal() {
      console.log("modalRef");
      open.value = true;
    }

    // 關閉
    function closeModal() {
      open.value = false;
    }

    // 確認
    // 點擊確認後，完成所有步驟
    function handleOk() {
      console.log("handleOk");
      emit("openNextStep", "finished");
      open.value = false;
    }

    onMounted(() => {});

    return {
      open,
      openModal,
      closeModal,
      handleOk,
    };
  },
});
</script>
