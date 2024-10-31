<!-- 新版共用組件 篩選器 -->
<template>
  <div class="filter">
    <a-collapse
      v-model:activeKey="activeKey"
      :bordered="false"
      expandIconPosition="end"
      style="background: rgb(255, 255, 255)"
    >
      <template #expandIcon="{ isActive }">
        <UpOutlined :rotate="isActive ? 180 : 0" style="font-size: 18px" />
      </template>
      <a-collapse-panel :key="0" style="overflow: hidden; margin-bottom: 24px">
        <template #header>
          <div class="d-flex align-items-center gap-2">
            <SearchOutlined style="font-size: 18px" />
            <span>篩選器</span>
          </div>
        </template>
        <a-form
          ref="formRef"
          name="filter"
          class="filter-form"
          :model="formState"
        >
          <a-row :gutter="{ xs: 8, sm: 16, md: 24 }">
            <template v-for="item in formState" :key="item.key">
              <a-col :span="8">
                <a-form-item :name="item.name" :label="item.name">
                  <a-input
                    v-model:value="formValues[item.key]"
                    placeholder="請輸入"
                    @keyup.enter="handleSearch"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <a-col :span="8">
              <button
                type="button"
                class="btn btn-primary me-2"
                @click="handleSearch"
              >
                查詢
              </button>
              <button type="button" class="btn btn-light" @click="handleReset">
                重置
              </button>
            </a-col>
          </a-row></a-form
        >
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, watch } from "vue";
import "vxe-table/lib/style.css";
import { UpOutlined, SearchOutlined } from "@ant-design/icons-vue";
// Modal
import { Form, Row, Col, Collapse } from "ant-design-vue";
export default defineComponent({
  components: {
    AForm: Form,
    ARow: Row,
    ACol: Col,
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
      emit("search", formValues);
    }

    // 重置
    function handleReset() {
      Object.keys(formValues).forEach((key) => {
        formValues[key] = ""; // 清空輸入框
      });
      emit("reset");
    }

    // 當父層傳入的 filterValue 改變時，更新 formValues
    watch(
      () => props.filterValue,
      (newVal) => {
        Object.assign(formValues, newVal);
      }
    );

    return {
      activeKey,
      handleSearch,
      handleReset,
      formValues,
    };
  },
});
</script>
