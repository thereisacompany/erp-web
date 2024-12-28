<!-- 人事管理新版, 改寫完成 -->
<template>
  <div>
    <PageHeader title="人事管理">
      <template #actions>
        <!-- actions -->
        <div class="actions d-flex justify-content-end">
          <ImportFile
            :buttonName="'匯入人事列表'"
            :apiLink="'/supplier/importMember'"
            @importSuccess="reload"
          />

          <a-button
            type="primary"
            class="custom-button-primary"
            @click="openHRModal('add', null)"
          >
            <i class="mdi mdi-plus fs-3"></i>
            <span class="">新增人事</span></a-button
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
          style="width: 100%"
        >
          <a-row style="gap: 20px">
            <a-col
              :span="item.key == 'type' ? 4 : 6"
              v-for="item in formState"
              :key="item.key"
            >
              <a-form-item :label="item.label" :name="item.key">
                <a-select
                  v-if="item.key == 'type'"
                  ref="select"
                  v-model:value="filterValue[item.key]"
                  style="width: 100%"
                  placeholder="請選擇"
                  show-search
                  option-filter-prop="type"
                  :options="typeOptions(true)"
                  :fieldNames="{
                    label: 'type',
                    value: 'value',
                  }"
                  @change="fetchData"
                ></a-select>
                <a-input
                  v-else
                  v-model:value="filterValue[item.key]"
                  placeholder="請輸入"
                  @keyup.enter="fetchData"
                ></a-input>
              </a-form-item>
            </a-col> </a-row
        ></a-form>
      </template>
    </Filter>

    <!--  人事列表 -->
    <div class="HR-management__wrapper main-wrapper">
      <a-spin :indicator="indicator" tip="Loading..." v-if="loading" />
      <div class="wrapper" v-else>
        <!-- table -->
        <div class="HR__table">
          <vxe-table
            border="inner"
            ref="tableRef"
            :column-config="{ resizable: true }"
            :data="tableData"
            align="left"
            size="small"
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
                  class="table__action d-flex flex-column align-items-start gap-2"
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
                    @click="openHRModal('edit', row)"
                  >
                    編輯
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
    <MemberModal ref="modalRef" @reload="reload" />
  </div>
</template>
<script>
import { defineComponent, reactive, ref, onMounted } from "vue";
import PageHeader from "@/components/page-header.vue";
import "vxe-table/lib/style.css";
import ImportFile from "@/components/importFile.vue";
import { HRTableColumn, typeOptions } from "./component/data";
import { filterNullValues, containsOnlySpecificItems } from "@/utils/common";
// Modal
import { Select, Tag } from "ant-design-vue";
import MemberModal from "./component/MemberModal.vue";
import { useCompanyInfoStore } from "@/stores/useCompanyInfoStore";

export default defineComponent({
  components: {
    PageHeader,
    MemberModal,
    ImportFile,
    ATag: Tag,
    ASelect: Select,
  },
  setup() {
    // filter
    const filterValue = reactive({
      type: "1",
      supplier: null,
      telephone: null,
      phonenum: null,
    });
    const formState = reactive([
      {
        label: "類別",
        key: "type",
      },
      {
        label: "搜尋姓名",
        key: "supplier",
      },
      {
        label: "手機號碼",
        key: "telephone",
      },

      {
        label: "聯絡電話",
        key: "phonenum",
      },
    ]);

    // table
    const tableRef = ref(null);
    const tableColumn = reactive(HRTableColumn);
    const tableData = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const loading = ref(false);
    // Modal
    const modalRef = ref(null);
    // store
    const companyInfoStore = useCompanyInfoStore();

    // table data
    async function fetchData() {
      // 若有篩選值，將currentPage改為第一頁
      const filterParams = filterNullValues(filterValue);
      if (filterParams.type == "1") {
        delete filterParams.type;
        filterParams["filter"] = "1";
      }
      // 檢查是否還有其他的篩選條件
      if (!containsOnlySpecificItems(filterParams, ["filter"])) {
        currentPage.value = 1;
      }

      // 人事列表
      const params = {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        filter: JSON.stringify(filterParams),
      };
      await companyInfoStore.fetchAllMember(params);
      tableData.value = companyInfoStore.getAllMemberList;
      total.value = companyInfoStore.getListTotal;
      loading.value = false;
    }

    // 重置篩選欄位
    function handleReset() {
      filterValue.type = "1";
      filterValue.supplier = null;
      filterValue.telephone = null;
      filterValue.phonenum = null;
      fetchData();
    }

    // 刷新table資料
    function reload() {
      loading.value = true;
      fetchData();
    }

    // 開啟modal
    function openHRModal(type, data) {
      modalRef.value.openModal(type, data);
    }

    onMounted(() => {
      loading.value = true;
      console.log("人事管理");
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
      openHRModal,
      loading,
      reload,
      filterValue,
      formState,
      typeOptions,
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

.HR-management__wrapper {
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
