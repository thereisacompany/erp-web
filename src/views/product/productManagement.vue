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
    filterValue/{{ filterValue }}
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
            <a-col :span="7" v-for="item in formState" :key="item.key">
              <a-form-item :label="item.label" :name="item.key">
                <!-- 全部類別 -->
                <a-tree-select
                  v-if="item.key == 'allCategory'"
                  v-model:value="filterValue[item.key]"
                  show-search
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="請選擇"
                  allow-clear
                  tree-default-expand-all
                  :tree-data="allCategoryOptions"
                  tree-node-filter-prop="title"
                  @change="handleSearch"
                >
                </a-tree-select>
                <!-- 全部客戶 -->
                <a-select
                  v-else-if="item.key == 'allCustomer'"
                  ref="select"
                  v-model:value="filterValue[item.key]"
                  style="width: 100%"
                  placeholder="請選擇"
                  :options="allCustomerOptions"
                  :fieldNames="{
                    label: 'supplier',
                    value: 'id',
                  }"
                  @change="handleSearch"
                ></a-select>
                <!-- 關鍵字 -->
                <a-input
                  v-else
                  v-model:value="filterValue[item.key]"
                  placeholder="請輸入關鍵字(名稱/規格/型號)"
                  @keyup.enter="handleSearch"
                ></a-input>
              </a-form-item>
            </a-col> </a-row
        ></a-form>
      </template>
    </Filter>

    <!-- Product List -->
    <div class="product-management__wrapper px-1 py-3">
      <a-spin :indicator="indicator" tip="Loading..." v-if="loading" />
      <div class="wrapper" v-else>
        <!-- table -->
        <div class="category__table">
          <!-- <p>
            <vxe-button @click="expandAllEvent">展开所有</vxe-button>
            <vxe-button @click="claseExpandEvent">关闭所有</vxe-button>
          </p> -->

          <vxe-table
            border="full"
            ref="tableRef"
            :column-config="{ resizable: true }"
            :data="tableData"
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
                  class="table__action d-flex flex-column align-items-center gap-2"
                >
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
import { productsTableColumn } from "./component/data";
// Modal
import { Modal, TreeSelect, Tag } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import CategoryModal from "./component/categoryModal.vue";
import { getCategoryList, getProductsList } from "@/api/productApi.js";
import { getAllCustomerList } from "@/api/companyInfoApi.js";

export default defineComponent({
  components: {
    Layout,
    PageHeader,
    CategoryModal,
    ImportFile,
    ATreeSelect: TreeSelect,
    ATag: Tag,
  },
  setup() {
    // filter
    const filterValue = reactive({
      allCategory: null,
      allCustomer: null,
      keyword: null,
    });
    const formState = reactive([
      {
        label: "全部類別",
        key: "allCategory",
      },
      {
        label: "全部客戶",
        key: "allCustomer",
      },
      {
        label: "關鍵字",
        key: "keyword",
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

    // table data
    async function fetchData() {
      // 全部類別 下拉選單
      await getCategoryList().then((result) => {
        allCategoryOptions.value = result;
      });

      // 全部客戶 下拉選單
      const customerParams = {
        currentPage: 1,
        pageSize: 1000,
        type: '{"type":"客戶"}',
      };
      await getAllCustomerList(customerParams).then((result) => {
        allCustomerOptions.value = result;
      });
      console.log("currentPage", currentPage.value);
      console.log("pageSize", pageSize.value);
      // 商品列表
      await getProductsList(
        currentPage.value,
        pageSize.value,
        filterValue
      ).then((result) => {
        console.log("result", result);
        tableData.value = result.rows;
        total.value = result.total;
      });
      loading.value = false;
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
        async onOk() {},
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
      allCategoryOptions,
      allCustomerOptions,
      fetchData,
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
</style>
