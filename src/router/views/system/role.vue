<template>
  <Layout>
    <PageHeader title="角色管理-new" :items="items" />
    <div class="role p-3">
      <div class="role__filter p-3">
        <!-- filter -->
        <form class="d-flex justify-content-between align-items-center w-75">
          <div
            class="d-flex justify-content-between align-items-center filter__item"
          >
            <label for="role-name" class="form-label">角色名稱:</label>
            <input
              v-model="filterValue.name"
              type="text"
              class="form-control"
              id="role-name"
            />
          </div>
          <div
            class="d-flex justify-content-between align-items-center filter__item"
          >
            <label for="remark" class="form-label">備註:</label>
            <input
              v-model="filterValue.remark"
              type="text"
              class="form-control"
              id="remark"
            />
          </div>
          <button type="button" class="btn btn-primary" @click="handleSearch">
            查詢
          </button>
          <button type="button" class="btn btn-light" @click="handleReset">
            重置
          </button>
        </form>
      </div>
      <!-- actions -->
      <div class="role__actions d-flex gap-3 mt-3">
        <b-button
          v-for="btn in buttonList"
          :key="btn"
          class="px-2 py-0 d-flex align-items-center"
          :class="`actions__${btn.type}`"
          @click="clickActions(btn.type)"
        >
          <i :class="btn.iconClass"></i>
          <span class="me-2">{{ btn.name }}</span></b-button
        >
      </div>

      <!-- table -->
      <div class="role__table mt-3">
        <vxe-table
          ref="vxeTableRef"
          border
          height="500"
          :row-config="{ isHover: true }"
          :data="tableData"
          :checkbox-config="{ highlight: true }"
          :scroll-x="{ enable: true }"
        >
          <vxe-column type="checkbox" width="40"></vxe-column>
          <vxe-column field="id" title="ID" width="40"></vxe-column>
          <vxe-column field="name" title="角色名稱" width="180"></vxe-column>
          <vxe-column field="state" title="狀態" width="100">
            <template #default="{ row }">
              <div :class="row.state ? 'tag-enable' : 'tag-disable'">
                {{ row.state ? "啟用" : "禁用" }}
              </div>
            </template>
          </vxe-column>
          <vxe-column field="type" title="數據類型" minWidth="220"></vxe-column>
          <vxe-column field="remark" title="備註" minWidth="200"></vxe-column>
          <vxe-column field="action" title="操作" width="220">
            <!--  <template #default="{ row }"> -->
            <template #default>
              <div class="table__action d-flex align-items-center">
                <button
                  type="button"
                  class="btn btn-link p-0"
                  @click="handleClick('add')"
                >
                  <span class="mx-1">分配功能</span>
                </button>
                <button
                  type="button"
                  class="btn btn-link p-0"
                  @click="handleClick('add')"
                >
                  <span class="mx-1">分配按鈕</span>
                </button>
                <button
                  type="button"
                  class="btn btn-link p-0"
                  @click="handleClick('add')"
                >
                  <span class="mx-1">編輯</span>
                </button>
                <button
                  type="button"
                  class="btn btn-link p-0"
                  @click="handleClick('add')"
                >
                  <span class="mx-1">刪除</span>
                </button>
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </div>

      <!-- Modals -->
      <AddModal ref="addModalRef" @openTips="openTips" />
      <AllocationFunctionModal
        ref="allocationFunctionRef"
        @openNextStep="openNextStep"
        @openTips="openTips"
        :type="lastActionType"
      />

      <!-- 分配按鈕暫時不用 -->
      <!-- <AllocationBtnModal
        ref="allocationBtnRef"
        @openNextStep="openNextStep"
        :type="lastActionType"
      /> -->
      <TipsModal
        ref="tipsRef"
        @openNextStep="openNextStep"
        :type="lastActionType"
      />
    </div>
  </Layout>
</template>
<script>
import { defineComponent, reactive, ref } from "vue";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import "vxe-table/lib/style.css";
// Modal
import AddModal from "./component/AddModal.vue";
import TipsModal from "./component/TipsModal.vue";
import AllocationFunctionModal from "./component/AllocationFunctionModal.vue";
// import AllocationBtnModal from "./component/AllocationBtnModal.vue";
import { message } from "ant-design-vue";

export default defineComponent({
  components: {
    Layout,
    PageHeader,
    AddModal,
    TipsModal,
    AllocationFunctionModal,
    // AllocationBtnModal,
  },
  setup() {
    const items = [
      {
        text: "系統管理",
        href: "#",
      },
      {
        text: "角色管理",
        href: "#",
        active: true,
      },
    ];
    const filterValue = reactive({ name: "", remark: "" });
    const buttonList = reactive([
      {
        type: "add",
        name: "新增",
        iconClass: "mdi mdi-plus fs-3 me-2",
      },
      {
        type: "delete",
        name: "刪除",
        iconClass: "mdi mdi-delete-outline fs-3 me-2",
      },
      {
        type: "enable",
        name: "啟用",
        iconClass: "mdi mdi-lock-open-variant-outline fs-3 me-2",
      },
      {
        type: "disable",
        name: "禁用",
        iconClass: "mdi mdi-lock-outline fs-3 me-2",
      },
    ]);
    const tableData = ref([
      {
        id: 1,
        name: "Test1",
        state: true,
        type: "Develop",
        remark: "1",
      },
      {
        id: 2,
        name: "Test2",
        state: false,
        type: "Develop 2",
        remark: "2",
      },
    ]);
    const vxeTableRef = ref(null);
    // Modal
    const addModalRef = ref(null);
    const tipsRef = ref(null);
    const allocationFunctionRef = ref(null);
    // const allocationBtnRef = ref(null);
    const lastActionType = ref(""); // 前一步驟種類
    // function
    // 篩選器
    function handleSearch() {
      console.log("search", filterValue);
    }

    function handleReset() {
      console.log("handleReset", filterValue);
      filterValue.name = "";
      filterValue.remark = "";
    }

    // 按鈕動作
    function clickActions(type) {
      // 已勾選的table data
      const records = vxeTableRef.value.getCheckboxRecords(true);

      if (type == "add") {
        addModalRef.value.openModal();
        lastActionType.value = type;
      } else if (type == "delete") {
        console.log("clickActions delete");
      } else if (type == "enable") {
        console.log("clickActions enable");
      } else if (type == "disable") {
        console.log("clickActions enable");
      }

      if (type !== "add") {
        if (records.length == 0) {
          message.warning("請勾選角色");
        }
      }
    }

    // emit
    // 開啟操作提示modal
    function openTips(nextType) {
      console.log("openTips", nextType);
      tipsRef.value.openModal(nextType);
    }

    // 開啟指定modal
    function openNextStep(type) {
      if (type == "allocationFunction") {
        allocationFunctionRef.value.openModal();
      } else if (type == "allocationBtn") {
        // allocationBtnRef.value.openModal();
      } else {
        console.log("全部結束");
      }
    }

    return {
      items,
      filterValue,
      handleSearch,
      handleReset,
      clickActions,
      tableData,
      buttonList,
      addModalRef,
      openNextStep,
      tipsRef,
      lastActionType,
      allocationFunctionRef,
      // allocationBtnRef,
      openTips,
      vxeTableRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.role {
  border-radius: 8px;
  background-color: #fff;

  .filter__item {
    width: 40%;

    .form-label {
      margin: 0;
    }

    .form-control {
      width: 80%;
    }
  }

  &__actions {
    .actions {
      &__add {
        background-color: #556ee6;
        border: transparent;
      }

      &__delete {
        background-color: #f46a6a;
        border: transparent;
      }

      &__enable {
        background-color: #35c38f;
        border: transparent;
      }

      &__disable {
        background-color: #74788d;
        border: transparent;
      }
    }
  }

  .tag-enable {
    padding: 4px;
    border-radius: 8px;
    background-color: #35c38f;
    text-align: center;
    color: #fff;
  }

  .tag-disable {
    padding: 4px;
    border-radius: 8px;
    background-color: #e6e6e6;
    text-align: center;
    color: #fff;
  }
}
</style>
