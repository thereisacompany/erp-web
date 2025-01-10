<!-- 進銷存統計新版, 改寫中 -->
<template>
  <div class="in-out-stock">
    <a-tabs v-model:activeKey="activeKey" type="card" @change="changeTab">
      <a-tab-pane :key="0" tab="進銷存統計"></a-tab-pane>
      <a-tab-pane :key="1" tab="歷史統計查詢"></a-tab-pane>
    </a-tabs>

    <div class="in-out-stock__wrapper">
      <PageHeader :title="activeKey == 0 ? `進銷存統計` : `歷史統計查詢`" />
      <!-- Filter -->
      <Filter v-if="formState" @search="handleSearch" @reset="handleReset">
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
                :span="item.key == 'dateTime' ? 12 : 6"
                v-for="item in formState"
                :key="item.key"
              >
                <a-form-item
                  v-if="item.key != 'dateTime'"
                  :label="item.label"
                  :name="item.key"
                >
                  <a-select
                    v-if="item.key == 'depotIds' || item.key == 'findOrganId'"
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
                    @change="handleSearch"
                  ></a-select>
                  <a-range-picker
                    v-else-if="item.key == 'dateTime' && activeKey == 1"
                    v-model:value="filterValue.dateTime"
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    :placeholder="['起始時間', '結束時間']"
                    @change="onRangeChange"
                    @ok="onRangeOk"
                  />
                  <a-input
                    v-else
                    v-model:value="filterValue[item.key]"
                    placeholder="請輸入"
                    @keyup.enter="handleSearch"
                  ></a-input>
                </a-form-item>
                <a-form-item
                  v-else-if="item.key == 'dateTime' && activeKey == 1"
                  :label="item.label"
                  :name="item.key"
                >
                  <a-range-picker
                    v-model:value="filterValue.dateTime"
                    :show-time="{ format: 'HH:mm' }"
                    :placeholder="['起始時間', '結束時間']"
                    @change="onRangeChange"
                    @ok="onRangeOk"
                  />
                </a-form-item>
              </a-col> </a-row
          ></a-form>
        </template>
      </Filter>
      <!-- 進銷存統計 -->
      <div v-if="activeKey == 0" class="main-wrapper">
        <Loading v-if="loading" />
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
              @page-change="handleSearch"
            >
            </vxe-pager>
          </div>
        </div>
      </div>
      <!-- 歷史統計列表 -->
      <div v-else class="main-wrapper">
        <Loading v-if="loading" />
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
              @page-change="handleSearch"
            >
            </vxe-pager>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, onMounted } from "vue";
import PageHeader from "@/components/page-header.vue";
import "vxe-table/lib/style.css";
import { HRTableColumn, typeOptions } from "./component/data";
import { filterNullValues, containsOnlySpecificItems } from "@/utils/common";
import Filter from "@/components/Filter.vue";
import Loading from "@/components/Loading.vue";
// Modal
import { Select, Tag, Tabs, TabPane, RangePicker } from "ant-design-vue";
import { useCompanyInfoStore } from "@/stores/useCompanyInfoStore";
import dayjs from "dayjs";
export default defineComponent({
  components: {
    PageHeader,
    ATag: Tag,
    ASelect: Select,
    Filter,
    Loading,
    ATabs: Tabs,
    ATabPane: TabPane,
    ARangePicker: RangePicker,
  },
  setup() {
    const activeKey = ref(1);
    // filter
    const filterValue = reactive({
      depotIds: null,
      findOrganId: null,
      materialParam: null,
      dateTime: [dayjs().startOf("month"), dayjs().endOf("day")],
      beginDateTime: dayjs().startOf("month").format("YYYY-MM-DD 00:00:00"),
      endDateTime: dayjs().format("YYYY-MM-DD 23:59:59"),
      order: "desc",
    });
    const formState = reactive([
      {
        label: "倉庫別",
        key: "depotIds",
      },
      {
        label: "客戶",
        key: "findOrganId",
      },
      {
        label: "商品資料",
        key: "materialParam",
      },
      {
        label: "日期時間",
        key: "dateTime",
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

    // 切換tab
    function changeTab() {
      console.log("changeTab", activeKey.value);
      if (activeKey.value == 1) {
        filterValue.dateTime = [dayjs().startOf("month"), dayjs().endOf("day")];
      }
      fetchData();
    }

    // table data
    async function fetchData() {
      console.log("fetchData");
      loading.value = true;
      currentPage.value = 1;
      pageSize.value = 10;
      filterValue.order = "desc";
      filterValue.endDateTime = filterValue.dateTime[1].format(
        "YYYY-MM-DD 23:59:59"
      );
      if (activeKey.value == 0) {
        filterValue.beginDateTime = null;
      } else {
        filterValue.beginDateTime = filterValue.dateTime[0].format(
          "YYYY-MM-DD 00:00:00"
        );
      }

      handleSearch();
    }

    // 呼叫api
    function setData(params) {
      console.log("setData", params);
    }

    // 搜尋
    function handleSearch() {
      console.log("handleSearch");
      const data = {
        ...filterValue,
        page: currentPage.value,
        size: pageSize.value,
      };
      delete data.dateTime;
      const params = filterNullValues(data);
      setData(params);
    }

    // 重置篩選欄位
    function handleReset() {
      Object.keys(filterValue).forEach((key) => {
        filterValue[key] = null;
      });
      filterValue.dateTime = [dayjs().startOf("month"), dayjs().endOf("day")];
      fetchData();
    }

    // 刷新table資料
    function reload() {
      loading.value = true;
      handleReset();
    }

    // 開啟modal
    function openHRModal(type, data) {
      modalRef.value.openModal(type, data);
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
      openHRModal,
      loading,
      reload,
      filterValue,
      formState,
      typeOptions,
      fetchData,
      handleReset,
      activeKey,
      changeTab,
      handleSearch,
    };
  },
});
</script>
<style lang="scss" scoped>
.actions {
  gap: 10px;
}

.in-out-stock {
  background: #f5f5f5;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

.in-out-stock__wrapper {
  border-radius: 0 8px 8px 8px;
  background-color: #fff;
  padding: 15px 10px;

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
