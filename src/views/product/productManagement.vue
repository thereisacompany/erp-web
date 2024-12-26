<!-- 商品管理新版, 改寫完成 -->
<template>
  <div>
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
            @click="openProductModal('add', null)"
          >
            <i class="mdi mdi-plus fs-3"></i>
            <span class="">新增商品</span></a-button
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
                <!-- 全部類別 -->
                <a-tree-select
                  v-if="item.key == 'categoryId'"
                  v-model:value="filterValue[item.key]"
                  show-search
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="請選擇"
                  allow-clear
                  tree-default-expand-all
                  :tree-data="allCategoryOptions"
                  tree-node-filter-prop="title"
                  @change="fetchData"
                >
                </a-tree-select>
                <!-- 全部客戶 -->
                <a-select
                  v-else-if="item.key == 'organId'"
                  ref="select"
                  v-model:value="filterValue[item.key]"
                  style="width: 100%"
                  placeholder="請選擇"
                  :options="allCustomerOptions"
                  :fieldNames="{
                    label: 'supplier',
                    value: 'id',
                  }"
                  show-search
                  option-filter-prop="supplier"
                  @change="fetchData"
                ></a-select>
                <!-- 關鍵字 -->
                <a-input
                  v-else
                  v-model:value="filterValue[item.key]"
                  placeholder="關鍵字(名稱/規格/型號)"
                  @keyup.enter="fetchData"
                ></a-input>
              </a-form-item>
            </a-col> </a-row
        ></a-form>
      </template>
    </Filter>

    <!-- Product List -->
    <div class="product-management__wrapper p-3">
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
            :data="tableData"
            align="left"
            size="small"
            cell-class-name="table-cell"
          >
            <vxe-column type="seq" width="4%" title="#" tree-node>
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
                    @click="openProductModal('edit', row)"
                  >
                    編輯
                  </a-button>
                  <a-button
                    v-if="showDelete"
                    type="button"
                    class="btn btn-danger d-flex flex-row align-items-center"
                    value="small"
                    @click="handleDeleteProduct(row)"
                  >
                    刪除
                  </a-button>
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
    <ProductModal ref="modalRef" @reload="reload" />
  </div>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, createVNode } from "vue";
import PageHeader from "@/components/page-header.vue";
import "vxe-table/lib/style.css";
import ImportFile from "@/components/importFile.vue";
import { productsTableColumn } from "./component/data";
import { filterNullValues } from "@/utils/common";
// Modal
import { Modal, TreeSelect, Select, Tag, message } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import ProductModal from "./component/productModal.vue";
import { getProductsList, deleteProduct } from "@/api/productApi.js";
import { useProductStore } from "@/stores/useProductStore";
import { useCompanyInfoStore } from "@/stores/useCompanyInfoStore";

export default defineComponent({
  components: {
    PageHeader,
    ProductModal,
    ImportFile,
    ASelect: Select,
    ATreeSelect: TreeSelect,
    ATag: Tag,
  },
  setup() {
    // filter
    const filterValue = reactive({
      categoryId: null,
      organId: null,
      materialParam: null,
    });
    const formState = reactive([
      {
        label: "全部類別",
        key: "categoryId",
      },
      {
        label: "全部客戶",
        key: "organId",
      },
      {
        label: "關鍵字",
        key: "materialParam",
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
    const showDelete = ref(false);
    // Modal
    const modalRef = ref(null);
    // store
    const productStore = useProductStore();
    const companyInfoStore = useCompanyInfoStore();

    // table data
    async function fetchData() {
      // 全部類別 下拉選單
      allCategoryOptions.value = productStore.getProductCategoryList;
      // 全部客戶 下拉選單
      allCustomerOptions.value = companyInfoStore.getAllMemberList;
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
    function openProductModal(type, data) {
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
      const user = localStorage.getItem("user");
      const role = JSON.parse(user).roleName;
      showDelete.value = role == "超級管理者";
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
      openProductModal,
      loading,
      reload,
      handleDeleteProduct,
      filterValue,
      formState,
      allCategoryOptions,
      allCustomerOptions,
      fetchData,
      handleReset,
      showDelete,
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

:deep(.vxe-table--render-default .vxe-tree-cell) {
  padding: 0;
}

:deep(.table-cell) {
  padding: 8px 0;
}
</style>
