<!-- 商品管理新版, 改寫中 -->
<template>
  <Layout>
    <PageHeader title="商品管理">
      <template #actions>
        <!-- actions -->
        <div class="actions d-flex justify-content-end">
          <ImportFile
            :buttonName="'匯入商品列表'"
            :apiLink="'/material/importExcel'"
            @importSuccess="setData"
          />

          <a-button
            type="primary"
            class="custom-button-primary"
            @click="openCategoryModal('add', null)"
          >
            <i class="mdi mdi-plus fs-3"></i>
            <span class="">新增商品</span></a-button
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
            <a-col :span="10">
              <a-form-item label="全部類別" name="allCategory">
                <a-select
                  ref="select"
                  v-model:value="value"
                  style="width: 120px"
                  :options="options"
                  :field-names="{
                    label: 'name',
                    value: 'id',
                    options: 'children',
                  }"
                  @change="handleChange"
                ></a-select>
              </a-form-item>
            </a-col> </a-row
        ></a-form>
      </template>
    </Filter>

    <!-- Product List -->
    <div class="product-management__wrapper py-5 px-5">
      <a-spin :indicator="indicator" tip="Loading..." v-if="loading" />
      <div class="wrapper" v-else>
        <!-- table -->
        <div class="category__table">
          <!-- <p>
            <vxe-button @click="expandAllEvent">展开所有</vxe-button>
            <vxe-button @click="claseExpandEvent">关闭所有</vxe-button>
          </p> -->

          <vxe-table
            border="inner"
            ref="tableRef"
            :column-config="{ resizable: true }"
            :tree-config="{
              transform: true,
              rowField: 'id',
              parentField: 'parentId',
            }"
            :data="tableData"
          >
            <vxe-column
              type="seq"
              width="15%"
              title="#"
              align="center"
              tree-node
            ></vxe-column>
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
                    @click="openCategoryModal('edit', row.id)"
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="handleDeleteCategory(row)"
                  >
                    刪除
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
        <CategoryModal ref="modalRef" @reload="reload" />
      </div>
    </div>
  </Layout>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, createVNode } from "vue";
import Layout from "@/router/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import "vxe-table/lib/style.css";
import ImportFile from "@/components/importFile.vue";

// Modal
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import CategoryModal from "./component/categoryModal.vue";
import {
  getCategoryList,
  flattenData,
  deleteCategory,
} from "@/api/productApi.js";
export default defineComponent({
  components: {
    Layout,
    PageHeader,
    CategoryModal,
    ImportFile,
  },
  setup() {
    // filter
    const filterValue = reactive({ loginName: undefined, userName: undefined });
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
    // table
    const tableRef = ref(null);
    const tableColumn = reactive([
      { field: "title", title: "類別名稱", width: "60%" },
      {
        field: "action",
        title: "操作",
        width: "25%",
      },
    ]);
    const tableData = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const loading = ref(false);
    // Modal
    const modalRef = ref(null);

    // table data
    function fetchData() {
      getCategoryList().then((result) => {
        console.log("fetchData", result);
        total.value = result.length;
        tableData.value = flattenData(result);
        loading.value = false;
      });
    }

    // 刷新table資料
    function reload() {
      fetchData();
    }

    // 開啟modal
    function openCategoryModal(type, id) {
      modalRef.value.openModal(type, id);
    }

    // 刪除類別
    function handleDeleteCategory(rowData) {
      Modal.confirm({
        title: "刪除類別",
        okText: "確認",
        cancelText: "取消",
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode(
          "div",
          { class: "reset-password d-flex flex-column" },
          `請確認是否要刪除類別：${rowData.title}`
        ),
        async onOk() {
          await deleteCategory(rowData.id).then(() => {
            fetchData();
          });
        },
      });
    }

    onMounted(() => {
      loading.value = true;
      fetchData();
    });

    return {
      tableData,
      currentPage,
      pageSize,
      total,
      modalRef,
      tableRef,
      tableColumn,
      openCategoryModal,
      loading,
      reload,
      handleDeleteCategory,
      filterValue,
      formState,
    };
  },
});
</script>
<style lang="scss" scoped>
.actions {
  gap: 10px;
}

.product-management__wrapper {
  border-radius: 8px;
  background-color: #fff;

  :deep(.ant-spin) {
    width: 100%;
  }
}

:deep(.vxe-table) {
  display: flex;
  justify-content: center;
}

:deep(.vxe-table--render-wrapper) {
  width: 100%;
}

:deep(.vxe-pager .vxe-pager--wrapper) {
  text-align: center;
  margin-top: 18px;
}
</style>
