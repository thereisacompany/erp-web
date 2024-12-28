<!-- 新版共用組件 篩選器 -->
<template>
  <div class="filter">
    <a-collapse
      v-model:activeKey="activeKey"
      :bordered="false"
      expandIconPosition="end"
    >
      <template #expandIcon="{ isActive }">
        <UpOutlined :rotate="isActive ? 180 : 0" style="font-size: 18px" />
      </template>
      <a-collapse-panel :key="0" style="overflow: hidden">
        <template #header>
          <div class="d-flex align-items-center gap-2">
            <SearchOutlined style="font-size: 18px" />
            <span style="font-size: 15px; font-weight: 500">篩選器</span>
          </div>
        </template>
        <slot name="form" />
        <div class="filter-buttons">
          <a-button class="custom-button-primary" @click="handleSearch">
            查詢
          </a-button>

          <a-button class="custom-button-gray" @click="handleReset">
            重置
          </a-button>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import { defineComponent, reactive, ref } from "vue";
import "vxe-table/lib/style.css";
import { UpOutlined, SearchOutlined } from "@ant-design/icons-vue";
// Modal
import { Collapse } from "ant-design-vue";
export default defineComponent({
  components: {
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    UpOutlined,
    SearchOutlined,
  },
  props: {
    formState: Array,
    filterValue: Object,
  },
  emits: ["search", "reset"],
  setup(props, { emit }) {
    // filter
    const formValues = reactive({ ...props.filterValue });
    const activeKey = ref(0);

    // 查詢
    function handleSearch() {
      emit("search");
    }

    // 重置
    function handleReset() {
      emit("reset");
    }

    return {
      activeKey,
      handleSearch,
      handleReset,
      formValues,
    };
  },
});
</script>

<style scoped>
:deep(.ant-collapse-content-box) {
  display: flex;
}

.filter {
  margin: 8px 12px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.custom-button-primary {
  margin: 0;
}
</style>
