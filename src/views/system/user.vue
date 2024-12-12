<!-- 用戶管理新版, 改寫完成 -->
<template>
  <Layout>
    <PageHeader title="用戶管理">
      <template #actions>
        <!-- actions -->
        <div class="actions d-flex justify-content-end mb-2">
          <a-button
            type="primary"
            class="custom-button-primary"
            @click="handleClickAddUser"
          >
            <i class="mdi mdi-plus fs-3"></i>
            <span class="">新增用戶</span></a-button
          >
        </div>
      </template>
    </PageHeader>
    <!-- Filter -->
    <Filter @search="handleSearch" @reset="handleReset" v-if="formState">
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
        ></a-form> </template
    ></Filter>
    <!-- User Data List -->
    <div class="user py-4 px-5">
      <a-spin :indicator="indicator" tip="Loading..." v-if="loading" />
      <div class="wrapper" v-else>
        <!-- table -->
        <div class="user__table">
          <vxe-table
            ref="vxeTableRef"
            border="inner"
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
            @page-change="fetchData()"
          >
          </vxe-pager>
        </div>

        <!-- Modals -->
        <UserModal ref="modalRef" @openTips="openTips" @submit="reload" />
      </div>
    </div>
  </Layout>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, createVNode } from "vue";
import Layout from "@/router/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import "vxe-table/lib/style.css";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import Filter from "@/components/filter.vue";
// Modal
import UserModal from "./component/UserModal.vue";
import { Modal, message } from "ant-design-vue";
import { getUserList, resetUserPassword } from "@/api/systemApi.js";
import { filterNullValues } from "@/utils/common";
export default defineComponent({
  components: {
    Layout,
    PageHeader,
    Filter,
    UserModal,
  },
  setup() {
    // table
    const tableColumn = reactive([
      { field: "loginName", title: "登入帳號", width: "10%" },
      { field: "username", title: "用戶姓名", width: "10%" },
      { field: "roleName", title: "角色", width: "10%" },
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
    const tableData = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    // Modal
    const modalRef = ref(null);
    // filter
    const searchParams = ref();
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
    const activeKey = ref(0);

    // 取得data
    function fetchData() {
      // 串接api
      getUserList(currentPage.value, pageSize.value, searchParams.value).then(
        (apiResult) => {
          total.value = apiResult.total;
          tableData.value = apiResult.rows;
        }
      );
    }

    // 篩選器查詢
    function handleSearch() {
      const params = {
        loginName:
          filterValue.loginName && filterValue.loginName !== undefined
            ? filterValue.loginName
            : null,
        userName:
          filterValue.userName && filterValue.userName !== undefined
            ? filterValue.userName
            : null,
      };
      const filterParams = filterNullValues(params);
      if (Object.keys(filterParams).length !== 0) {
        searchParams.value = JSON.stringify(filterParams);
      } else {
        searchParams.value = null;
      }
      fetchData();
    }

    // 篩選器重置
    function handleReset() {
      filterValue.loginName = "";
      filterValue.userName = "";
      handleSearch();
    }

    // 新增用戶
    function handleClickAddUser() {
      modalRef.value.openModal("add", undefined);
    }

    // 刷新資料
    function reload() {
      fetchData();
    }

    // 編輯用戶
    function handleClickEdit(row) {
      modalRef.value.openModal("edit", row);
    }

    // 重設密碼
    function handleClickResetPassword(row) {
      Modal.confirm({
        title: "重置密碼",
        okText: "確認",
        cancelText: "取消",
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode(
          "div",
          { class: "reset-password d-flex flex-column" },
          [
            createVNode(
              "span",
              {
                style: "color:block;",
              },
              `是否要將用戶 ${row.username} 密碼重置?`
            ),
            createVNode(
              "span",
              {
                style: "color:red;",
              },
              "密碼預設為: 123456"
            ),
          ]
        ),
        onOk() {
          const data = { id: row.id };
          resetUserPassword(data)
            .then(() => {
              message.success(`用戶${row.username},重置密碼成功`);
              reload();
            })
            .catch((error) => {
              console.log("error from resetPassword", error);
              return;
            });
        },
      });
    }

    onMounted(() => {
      fetchData();
    });

    return {
      tableColumn,
      tableData,
      filterValue,
      formState,
      activeKey,
      fetchData,
      handleClickAddUser,
      handleSearch,
      handleReset,
      handleClickEdit,
      handleClickResetPassword,
      currentPage,
      pageSize,
      total,
      modalRef,
      reload,
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

:deep(.vxe-pager .vxe-pager--wrapper) {
  text-align: center;
  margin-top: 18px;
}
</style>
