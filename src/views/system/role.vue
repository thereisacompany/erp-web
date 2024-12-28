<!-- 新版角色管理 -->
<template>
  <div>
    <PageHeader title="角色管理">
      <template #actions>
        <!-- actions -->
        <div class="actions d-flex justify-content-end mb-2">
          <a-button
            v-for="btn in buttonList"
            :key="btn"
            type="primary"
            class="custom-button-primary"
            @click="clickActions(btn.type, null)"
          >
            <i :class="btn.iconClass"></i>
            <span class="me-2">{{ btn.name }}</span></a-button
          >
        </div>
      </template>
    </PageHeader>

    <!-- Filter -->
    <Filter v-if="formState" @search="handleSearch" @reset="handleReset">
      <template #form>
        <a-form
          ref="formRef"
          name="filter"
          class="filter-form"
          :model="formState"
          style="width: 80%"
        >
          <a-row style="gap: 10px">
            <template v-for="item in formState" :key="item.key">
              <a-col :span="10">
                <a-form-item :name="item.name" :label="item.name">
                  <a-input
                    v-model:value="filterValue[item.key]"
                    placeholder="請輸入"
                    @keyup.enter="handleSearch"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template> </a-row
        ></a-form>
      </template>
    </Filter>

    <div class="role-management__wrapper main-wrapper">
      <a-spin :indicator="indicator" tip="Loading..." v-if="loading" />
      <div class="wrapper" v-else>
        <!-- table -->
        <div class="role__table">
          <vxe-table
            ref="vxeTableRef"
            border="inner"
            :row-config="{ isHover: true }"
            :data="tableData"
            :checkbox-config="{ highlight: true }"
            :scroll-x="{ enabled: false }"
            :loading="loading"
          >
            <!-- <vxe-column type="checkbox" width="40"></vxe-column> -->
            <vxe-column field="id" title="ID" width="50"></vxe-column>
            <vxe-column field="name" title="角色名稱" width="180"></vxe-column>
            <vxe-column field="enabled" title="狀態" width="120">
              <template #default="{ row }">
                <div :class="row.enabled ? 'tag-enabled' : 'tag-disable'">
                  {{ row.enabled ? "啟用" : "禁用" }}
                </div>
              </template>
            </vxe-column>
            <vxe-column
              field="type"
              title="數據類型"
              minWidth="100"
            ></vxe-column>
            <vxe-column
              field="description"
              title="備註"
              minWidth="200"
            ></vxe-column>
            <vxe-column field="action" title="操作" width="160">
              <!--  <template #default="{ row }"> -->
              <template #default="{ row }">
                <div class="table__action d-flex align-items-center">
                  <button
                    type="button"
                    class="btn btn-link p-0"
                    @click="openModal('allocationFunction', row)"
                  >
                    <span class="mx-1">分配功能</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-link p-0"
                    @click="openModal('allocationBtn', row)"
                    v-if="false"
                  >
                    <span class="mx-1">分配按鈕</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-link p-0"
                    @click="openModal('edit', row)"
                  >
                    <span class="mx-1">編輯</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-link p-0"
                    @click="deleteRole(row)"
                    v-if="false"
                  >
                    <span class="mx-1">刪除</span>
                  </button>
                </div>
              </template>
            </vxe-column>
          </vxe-table>
          <vxe-pager
            v-model:currentPage="currentPage"
            v-model:pageSize="pageSize"
            :total="total"
            :i18n="i18nHandler"
            @page-change="fetchData()"
          >
          </vxe-pager>
        </div>

        <!-- Modals -->
        <AddModal ref="addModalRef" @openTips="openTips" @submit="reload" />
        <AllocationFunctionModal
          ref="allocationFunctionRef"
          @openModal="openModal"
          @openTips="openTips"
          :type="lastActionType"
        />

        <!-- 分配按鈕暫時不用 -->
        <!-- <AllocationBtnModal
        ref="allocationBtnRef"
        @openModal="openModal"
        :type="lastActionType"
      /> -->
        <TipsModal
          ref="tipsRef"
          @openModal="openModal"
          :type="lastActionType"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, createVNode, h } from "vue";
import PageHeader from "@/components/page-header.vue";
import "vxe-table/lib/style.css";
import {
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";
import Filter from "@/components/filter.vue";

// Modal
import AddModal from "./component/AddModal.vue";
import TipsModal from "./component/TipsModal.vue";
import AllocationFunctionModal from "./component/AllocationFunctionModal.vue";
// import AllocationBtnModal from "./component/AllocationBtnModal.vue";
import { message, Modal, Form, Row, Col } from "ant-design-vue";
import { server } from "@/api";
import { filterNullValues } from "@/utils/common";
export default defineComponent({
  components: {
    PageHeader,
    AddModal,
    TipsModal,
    AllocationFunctionModal,
    AForm: Form,
    ARow: Row,
    ACol: Col,
    Filter,
  },
  setup() {
    const filterValue = reactive({ name: undefined, description: undefined });
    const formState = reactive([
      {
        name: "角色名稱",
        key: "name",
      },
      {
        name: "備註",
        key: "description",
      },
    ]);
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "42px",
      },
      spin: true,
    });
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

    const buttonList = reactive([
      {
        type: "add",
        name: "新增角色",
        iconClass: "mdi mdi-plus fs-3 me-2",
      },
      // {
      //   type: "delete",
      //   name: "刪除",
      //   iconClass: "mdi mdi-delete-outline fs-3 me-2",
      // },
      // {
      //   type: "enabled",
      //   name: "啟用",
      //   iconClass: "mdi mdi-lock-open-variant-outline fs-3 me-2",
      // },
      // {
      //   type: "disable",
      //   name: "禁用",
      //   iconClass: "mdi mdi-lock-outline fs-3 me-2",
      // },
    ]);
    const tableData = ref();
    const vxeTableRef = ref(null);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const searchParams = ref();
    const loading = ref(true);
    const i18nHandler = (key) => {
      const translations = {
        "vxe.pager.total.label": "總共 {total} 條記錄",
        "vxe.pager.pagesize.label": "每頁 {size} 條",
        "vxe.pager.prev.page": "上一頁",
        "vxe.pager.next.page": "下一頁",
        "vxe.pager.page.number": "{number}",
      };
      return translations[key] || key;
    };
    // Modal
    const addModalRef = ref(null);
    const tipsRef = ref(null);
    const allocationFunctionRef = ref(null);
    // const allocationBtnRef = ref(null);
    const lastActionType = ref(""); // 前一步驟種類
    // 新增角色後新的角色資料
    const newRoleData = ref();

    // fetch api
    function fetchData(type) {
      let url = `/role/list?currentPage=${currentPage.value}&pageSize=${pageSize.value}`;
      if (searchParams.value !== null && searchParams.value !== undefined) {
        url = url + `&search=${encodeURIComponent(searchParams.value)}`;
      }
      server
        .get(url)
        .then((res) => {
          console.log("回傳資料成功 res=", res.data.data.rows);
          const dataSource = res.data.data.rows;
          tableData.value = dataSource;
          total.value = res.data.data.total;
          loading.value = false;
          if (type == "openTips") {
            newRoleData.value = tableData.value.reduce(
              (max, item) => (item.id > max.id ? item : max),
              tableData.value[0]
            );
            console.log("newRoleData0", newRoleData.value);
          } else {
            newRoleData.value = null;
          }
        })
        .catch((error) => {
          console.log("error from fetch role list", error);
        });
    }

    // 篩選器
    function handleSearch() {
      loading.value = true;
      const params = {
        name:
          filterValue.name && filterValue.name !== undefined
            ? filterValue.name
            : null,
        description:
          filterValue.description && filterValue.description !== undefined
            ? filterValue.description
            : null,
      };
      console.log("params", params);

      const filterParams = filterNullValues(params);
      if (Object.keys(filterParams).length !== 0) {
        searchParams.value = JSON.stringify(filterParams);
      } else {
        searchParams.value = null;
      }

      fetchData();
    }

    // 清除篩選器
    function handleReset() {
      filterValue.name = "";
      filterValue.description = "";
      handleSearch();
    }

    // 按鈕動作
    function clickActions(type, data) {
      // 已勾選的table data
      // const records = vxeTableRef.value.getCheckboxRecords(true);
      if (type == "add") {
        addModalRef.value.openModal("新增角色", null);
        lastActionType.value = type;
      } else if (type == "delete") {
        console.log("clickActions delete");
      } else if (type == "enabled") {
        console.log("clickActions enabled");
      } else if (type == "disable") {
        console.log("clickActions enabled");
      } else if (type == "edit") {
        addModalRef.value.openModal("編輯角色", data);
      }

      // if (type !== "add") {
      //   if (records.length == 0) {
      //     message.warning("請勾選角色");
      //   }
      // }
    }

    // emit
    // 開啟操作提示modal
    function openTips(nextType) {
      fetchData("openTips");
      tipsRef.value.openModal(nextType);
    }

    // 開啟指定modal
    function openModal(type, data) {
      if (type == "allocationFunction") {
        // 若data為null表示為新增後連續設定
        if (data == null && newRoleData.value !== null)
          data = newRoleData.value;
        allocationFunctionRef.value.openModal(data);
      } else if (type == "allocationBtn") {
        // allocationBtnRef.value.openModal(data);
      } else if (type === "edit") {
        clickActions("edit", data);
      } else {
        console.log("全部結束");
      }
    }

    // 刪除角色
    function deleteRole(row) {
      Modal.confirm({
        title: "請確認",
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode(
          "span",
          { style: "" },
          `是否要刪除名稱為： ${row.name} 的角色`
        ),
        okText: "確認",
        cancelText: "取消",
        onOk() {
          server.delete(`role/delete?id=${row.id}`).then(() => {
            fetchData();
            message.warning("已成功刪除角色！");
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }

    // 刷新table資料
    function reload() {
      fetchData();
    }

    onMounted(() => {
      fetchData();
    });

    return {
      items,
      formState,
      filterValue,
      handleSearch,
      handleReset,
      clickActions,
      tableData,
      buttonList,
      addModalRef,
      openModal,
      tipsRef,
      lastActionType,
      allocationFunctionRef,
      // allocationBtnRef,
      openTips,
      vxeTableRef,
      currentPage,
      pageSize,
      total,
      loading,
      deleteRole,
      i18nHandler,
      reload,
      fetchData,
      indicator,
      // formValues,
    };
  },
});
</script>
<style lang="scss" scoped>
.actions {
  &__add {
    background-color: #556ee6;
    border: transparent;
    color: #fff;
  }

  &__delete {
    background-color: #f46a6a;
    border: #f46a6a;
    color: #fff;
  }

  &__enabled {
    background-color: #35c38f;
    border: transparent;
    color: #fff;
  }

  &__disable {
    background-color: #f46a6a;
    border: transparent;
    color: #fff;
  }
}
.role-management__wrapper {
  border-radius: 8px;
  background-color: #fff;

  :deep(.ant-spin) {
    width: 100%;
  }

  .filter__item {
    // width: 40%;

    .form-label {
      margin: 0;
    }

    .form-control {
      width: 80%;
    }
  }

  .tag-enabled {
    width: 80%;
    padding: 4px;
    border-radius: 8px;
    background-color: #35c38f;
    text-align: center;
    color: #fff;
  }

  .tag-disable {
    width: 80%;
    padding: 4px;
    border-radius: 8px;
    background-color: #e6e6e6;
    text-align: center;
    color: #fff;
  }
}
</style>
