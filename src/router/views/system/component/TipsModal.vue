<template>
  <a-modal
    v-model:open="open"
    title="操作提示"
    centered
    @ok="handleOk"
    ok-text="確認"
    cancel-text="取消"
  >
    <div class="p-2">
      <p>{{ content }}</p>
    </div>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { Modal } from "ant-design-vue";

export default defineComponent({
  components: {
    AModal: Modal,
  },
  props: {
    type: String,
  },
  emits: ["openNextStep"],
  setup(props, { emit }) {
    const open = ref(false);
    const nextStepName = ref("");
    const content = ref("");

    // 開啟
    function openModal(nextStep) {
      console.log("openModal", nextStep);
      nextStepName.value = nextStep;
      if (nextStep == "分配功能") {
        content.value = "已保存角色，請問是否要繼續分配功能？";
      } else {
        content.value = "已完成分配功能，請問是否要繼續分配按鈕？";
      }
      open.value = true;
      console.log("props", props.type);
    }

    // 關閉
    function closeModal() {
      open.value = false;
    }

    // 確認
    // 若點擊確認，回傳至父層打開modal
    function handleOk() {
      if (nextStepName.value == "分配功能") {
        emit("openNextStep", "allocationFunction");
      } else if (nextStepName.value == "分配按鈕") {
        emit("openNextStep", "allocationBtn");
      }
      open.value = false;
    }

    onMounted(() => {});

    return {
      open,
      openModal,
      closeModal,
      handleOk,
      nextStepName,
      content,
    };
  },
});
</script>
