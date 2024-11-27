<!-- 客戶管理新版, 改寫中 -->
<template>
  <Layout>
    <PageHeader title="客戶管理">
      <template #actions>
        <!-- actions -->
        <div class="actions d-flex justify-content-end">
          <ImportFile
            :buttonName="'匯入客戶列表'"
            :apiLink="'/supplier/importCustomer'"
            @importSuccess="setData"
          />

          <a-button
            type="primary"
            class="custom-button-primary"
            @click="openCustomerModal('add', null)"
          >
            <i class="mdi mdi-plus fs-3"></i>
            <span class="">新增客戶</span></a-button
          >
        </div>
      </template>
    </PageHeader>

    <!-- Filter -->
    <Filter v-if="formState" @search="fetchData" @reset="handleReset">
      <template #form>
        <a-form
          ref="formRef"
          name="filter"
          class="filter-form"
          :model="formState"
          style="width: 70%"
        >
          <a-row style="gap: 20px">
            <a-col :span="7" v-for="item in formState" :key="item.key">
              <a-form-item :label="item.label" :name="item.key">
                <!-- 關鍵字 -->
                <a-input
                  v-model:value="filterValue[item.key]"
                  placeholder="請輸入"
                  @keyup.enter="fetchData"
                ></a-input>
              </a-form-item>
            </a-col> </a-row
        ></a-form>
      </template>
    </Filter>

    <!-- Customer List -->
    <div class="customer-management__wrapper px-1 py-3">
      <a-spin :indicator="indicator" tip="Loading..." v-if="loading" />
      <div class="wrapper" v-else>
        <!-- table -->
        <div class="category__table">
          <vxe-table
            border="full"
            ref="tableRef"
            :column-config="{ resizable: true }"
            :data="tableData"
            align="left"
          >
            <vxe-column type="seq" width="5%" title="#" tree-node>
              <template #default="{ rowIndex }">
                {{ (currentPage - 1) * pageSize + rowIndex + 1 }}
              </template>
            </vxe-column>
            <vxe-column
              v-for="column in tableColumn"
              :key="column"
              :field="column.field"
              :title="column.title"
              :width="column.width"
            >
              <template #default="{ column, row }">
                <div
                  v-if="column.field == 'enabled'"
                  class="table__action d-flex flex-column align-items-center gap-2"
                >
                  <a-tag v-if="row.enabled" color="green">啟用</a-tag>
                  <a-tag v-else color="red">停用</a-tag>
                </div>
                <div
                  v-else-if="column.field == 'action'"
                  class="table__action d-flex flex-row align-items-center gap-2"
                >
                  <a-button
                    type="button"
                    class="btn btn-success d-flex flex-row align-items-center"
                    value="small"
                    @click="openCustomerModal('edit', row)"
                  >
                    編輯
                  </a-button>
                  <!-- <a-button
                    type="button"
                    class="btn btn-danger d-flex flex-row align-items-center"
                    value="small"
                    @click="handleDeleteProduct(row)"
                  >
                    刪除
                  </a-button> -->
                </div>
                <span v-else>{{ row[column.field] }}</span>
              </template>
            </vxe-column>
          </vxe-table>
          <vxe-pager
            v-model:currentPage="currentPage"
            v-model:pageSize="pageSize"
            :total="total"
            @page-change="fetchData"
          >
          </vxe-pager>
        </div>
      </div>
    </div>
    <!-- Modals -->
    <CustomerModal ref="modalRef" @reload="reload" />
  </Layout>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, createVNode } from "vue";
import Layout from "@/router/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import "vxe-table/lib/style.css";
import ImportFile from "@/components/importFile.vue";
import { productsTableColumn } from "./component/data";
import { filterNullValues } from "@/utils/common";
// Modal
import { Modal, TreeSelect, Tag, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import CustomerModal from "./component/customerModal.vue";
import { getProductsList, deleteProduct } from "@/api/productApi.js";
import { useProductStore } from "@/stores/useProductStore";
import { useCompanyInfoStore } from "@/stores/useCompanyInfoStore";

export default defineComponent({
  components: {
    Layout,
    PageHeader,
    CustomerModal,
    ImportFile,
    ATreeSelect: TreeSelect,
    ATag: Tag,
  },
  setup() {
    // filter
    const filterValue = reactive({
      supplier: null,
      telephone: null,
      phoneNum: null,
    });
    const formState = reactive([
      {
        label: "客戶名稱",
        key: "supplier",
      },
      {
        label: "手機號碼",
        key: "telephone",
      },
      {
        label: "聯絡電話",
        key: "phoneNum",
      },
    ]);
    const allCategoryOptions = ref([]);
    const allCustomerOptions = ref([]);
    // table
    const tableRef = ref(null);
    const tableColumn = reactive(productsTableColumn);
    const tableData = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const loading = ref(false);
    // Modal
    const modalRef = ref(null);
    // store
    const productStore = useProductStore();
    const companyInfoStore = useCompanyInfoStore();

    // table data
    async function fetchData() {
      console.log("fetchData");
      // 全部類別 下拉選單
      allCategoryOptions.value = productStore.getProductCategoryList;
      // 全部客戶 下拉選單
      allCustomerOptions.value = companyInfoStore.getAllCustomerList;
      console.log("allCustomerOptions", allCustomerOptions.value);
      // 若有篩選值，將currentPage改為第一頁
      const filterParams = filterNullValues(filterValue);
      if (Object.keys(filterParams).length !== 0) {
        currentPage.value = 1;
      }

      // 商品列表
      await getProductsList(
        currentPage.value,
        pageSize.value,
        filterParams
      ).then((result) => {
        tableData.value = result.rows;
        total.value = result.total;
      });

      loading.value = false;
    }

    // 重置篩選欄位
    function handleReset() {
      filterValue.categoryId = null;
      filterValue.organId = null;
      filterValue.materialParam = null;
      fetchData();
    }

    // 刷新table資料
    function reload() {
      loading.value = true;
      fetchData();
    }

    // 開啟modal
    function openCustomerModal(type, data) {
      modalRef.value.openModal(type, data);
    }

    // 刪除類別
    function handleDeleteProduct(rowData) {
      Modal.confirm({
        title: "刪除商品",
        okText: "確認",
        cancelText: "取消",
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode(
          "div",
          { class: "reset-password d-flex flex-column" },
          `請確認是否要刪除商品：${rowData.name}`
        ),
        async onOk() {
          const result = await deleteProduct(rowData.id);
          if (result.data.code === 200 && result.data.data.message == "成功") {
            message.success(`刪除 ${rowData.name} 成功`);
            reload();
          }
        },
      });
    }

    onMounted(() => {
      loading.value = true;
      setTimeout(() => {
        fetchData();
      }, 500);
    });

    return {
      tableData,
      currentPage,
      pageSize,
      total,
      modalRef,
      tableRef,
      tableColumn,
      openCustomerModal,
      loading,
      reload,
      handleDeleteProduct,
      filterValue,
      formState,
      allCategoryOptions,
      allCustomerOptions,
      fetchData,
      handleReset,
    };
  },
});
</script>
<style lang="scss" scoped>
.actions {
  gap: 10px;
}

.customer-management__wrapper {
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

:deep(.vxe-table--render-default .vxe-tree-cell) {
  padding: 0;
}
</style>
