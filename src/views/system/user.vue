<template>
  <Layout>
    <PageHeader title="用戶管理">
      <template #actions>
        <!-- actions -->
        <div class="actions d-flex justify-content-end mb-2">
          <b-button
            class="px-2 py-0 d-flex align-items-center"
            :class="`actions__add`"
            @click="handleClickAddUser"
          >
            <i class="mdi mdi-plus fs-3 me-2"></i>
            <span class="me-2">新增用戶</span></b-button
          >
        </div>
      </template>
    </PageHeader>
    <!-- filter -->
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
        <a-collapse-panel key="1" style="overflow: hidden; margin-bottom: 24px">
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
            @finish="onFinish"
          >
            <a-row :gutter="{ xs: 8, sm: 16, md: 24 }">
              <template v-for="item in formState" :key="item.key">
                <a-col :span="8">
                  <a-form-item :name="item.name" :label="item.name">
                    <a-input
                      v-model:value="filterValue[item.key]"
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
                <button
                  type="button"
                  class="btn btn-light"
                  @click="handleReset"
                >
                  重置
                </button>
              </a-col>
            </a-row></a-form
          >
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="user py-4 px-5">
      <a-spin :indicator="indicator" tip="Loading..." v-if="loading" />
      <div class="wrapper" v-else>
        <!-- table -->
        <div class="user__table">
          <vxe-table
            ref="vxeTableRef"
            border
            :row-config="{ isHover: true }"
            :data="tableData"
            :checkbox-config="{ highlight: true }"
            :scroll-x="{ enabled: false }"
            :loading="loading"
          >
            <vxe-column type="seq" width="5%" title="#"></vxe-column>
            <vxe-column
              v-for="column in tableColumn"
              :key="column"
              :field="column.field"
              :title="column.title"
              :width="column.width"
            >
              <template #default="{ row }" v-if="column.field == 'action'">
                <div class="table__action d-flex align-items-center gap-2">
                  <button
                    type="button"
                    class="btn btn-success"
                    @click="handleClickEdit(row)"
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="handleClickResetPassword(row)"
                  >
                    重置密碼
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
      </div>
    </div>
  </Layout>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, createVNode, h } from "vue";
import Layout from "@/router/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import "vxe-table/lib/style.css";
import {
  ExclamationCircleOutlined,
  LoadingOutlined,
  DownOutlined,
  UpOutlined,
  CaretRightOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
// Modal
import AddModal from "./component/AddModal.vue";
import TipsModal from "./component/TipsModal.vue";
import AllocationFunctionModal from "./component/AllocationFunctionModal.vue";
// import AllocationBtnModal from "./component/AllocationBtnModal.vue";
import { message, Modal, Form, Row, Col, Collapse } from "ant-design-vue";
import { server } from "@/api";
import { filterNullValues } from "./component/data";
export default defineComponent({
  components: {
    Layout,
    PageHeader,
    AddModal,
    AForm: Form,
    ARow: Row,
    ACol: Col,
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    UpOutlined,
    SearchOutlined,
  },
  setup() {
    // table
    const tableColumn = reactive([
      { field: "loginName", title: "登入帳號", width: "10%" },
      { field: "userName", title: "用戶姓名", width: "10%" },
      { field: "roleName", title: "角色資料", width: "10%" },
      { field: "position", title: "職稱", width: "10%" },
      {
        field: "phonenum",
        title: "電話",
        width: "15%",
      },
      {
        field: "description",
        title: "說明",
        width: "20%",
      },
      {
        field: "action",
        title: "操作",
        width: "20%",
      },
    ]);
    const tableData = reactive([
      {
        loginName: "1",
        userName: "2",
        roleName: "3",
        position: "4",
        phonenum: "5",
        description: "6",
      },
    ]);
    // filter
    const filterValue = reactive({ loginName: undefined, userName: undefined });
    const formState = reactive([
      {
        name: "登入帳號",
        key: "loginName",
      },
      {
        name: "用戶姓名",
        key: "userName",
      },
    ]);
    const activeKey = ref(["1"]);
    const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;
    const customStyle =
      "border-radius: 4px;margin-bottom: 24px;overflow: hidden";
    // 取得data
    function fetchData() {
      // 串接api
      console.log("fetch data");
    }

    // 篩選器查詢
    function handleSearch() {
      console.log("查詢");
    }

    // 篩選器重置
    function handleReset() {
      console.log("重置");
    }

    // 新增用戶
    function handleClickAddUser() {
      console.log("新增用戶");
    }

    // 編輯用戶
    function handleClickEdit(row) {
      console.log("編輯", row);
    }

    // 重設密碼
    function handleClickResetPassword(row) {
      console.log("重設密碼", row);
    }

    onMounted(() => {});

    return {
      tableColumn,
      tableData,
      filterValue,
      formState,
      activeKey,
      text,
      customStyle,
      fetchData,
      handleClickAddUser,
      handleSearch,
      handleReset,
      handleClickEdit,
      handleClickResetPassword,
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
}

.filter {
  :deep(.ant-form-item) {
    margin: 0;
  }

  :deep(.ant-collapse-content) {
    border: none;
  }
}

.user {
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
