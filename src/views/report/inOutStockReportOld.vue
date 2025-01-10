<script>
import Layout from "@/layouts/index.vue";
import PageHeader from "@/components/page-header.vue";
import dayjs from "dayjs";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import { server } from "@/api";
import common from "@/api/common";

import appConfig from "@/app.config";
import { Tabs, TabPane } from "ant-design-vue";
/**
 * Customers component
 */
export default {
  page: {
    title: "進銷存統計",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader, ATabs: Tabs, ATabPane: TabPane },
  data() {
    return {
      SubView: 0,
      materialParam: "",
      organId: "",
      depotId: "",
      monthTime: "",

      number: "",
      beginDate: "",
      endDate: "",
      beginTime: "",
      endTime: "",
      MaxFileSize: 0,
      userlist: [],
      accountlist: [],
      supplierlist: [],
      depotList: [],
      filelist: [],
      customersData: [],
      customersItem: [],
      customersItem_selectindex: -1,
      materialsList: [],
      title: "進銷存統計",
      items: [
        {
          text: "報表查詢",
          href: "javascript:;",
        },
        {
          text: "進銷存統計",
          active: true,
        },
      ],

      showModal: false,
      submitted: false,
      showImageModal: false,
      customers: {
        id: "",

        organId: "", //57
        operTime: "", //"2023-03-22 17:21:07"
        number: "", //"CGRK00000000846"
        discount: 0, //0
        discountMoney: 0, //0
        discountLastMoney: 0, //11
        otherMoney: 0, //0
        accountId: "", //17
        changeAmount: 0, //-11
        debt: 0, //0
        type: "入庫", //"入库"
        subType: "進貨單", //"采购"
        defaultNumber: "", //"CGRK00000000846"
        totalPrice: "", //-11
        accountIdList: "", //""
        accountMoneyList: "", //""
        fileName: "", //""
        status: 0, //"0"
        remark: "",

        date2: "",
        time2: "",
      },

      name: "",
      remark: "",
      totalin: 0,
      totalOut: 0,
      totalthis: 0,

      IsGetDataing: false,
      pageSize: 30,
      totalRows: 0,
      currentPage: 1,
      maxPage: 10,
      activeKey: 0,
    };
  },
  computed: {
    customersItemAllPrice: function () {
      if (this.customersItem.filter((x) => x.allPrice != 0).length == 0) {
        return 0;
      }
      let itemallPrice = this.customersItem
        .filter((x) => x.allPrice != 0)
        .map((y) => y.allPrice)
        .reduce((a, b) => a + b);

      return itemallPrice;
    },
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations: {
    customers: {
      organId: {
        required: helpers.withMessage("請選擇供應商", required),
      },
      accountId: {
        required: helpers.withMessage("請選擇結算帳號", required),
      },
    },
  },
  mounted() {
    server.GetSupplierList((rows) => {
      this.supplierlist = rows;
    });

    this.beginDate = dayjs().format("YYYY-MM-DD"); //預設起始日期
    this.endDate = dayjs().format("YYYY-MM-DD"); //預設起始日期

    this.$nextTick(() => {
      this.GetDepotList(); //倉庫別
      this.GetData();
    });
  },
  methods: {
    /**
     * Modal form submit
     */
    // eslint-disable-next-line no-unused-vars

    // formatOrganName(SubItem) {
    //   if (SubItem == null) return "";
    //   return (
    //     common.PadLeftZero(SubItem.organId || "", 3) +
    //     " " +
    //     (SubItem.organName || "")
    //   );
    // },
    GetDepotList() {
      ///jshERP-boot/depot/findDepotByCurrentUser
      let APIUrl = `/depot/findDepotByCurrentUser`;
      server
        .get(APIUrl)
        .then((res) => {
          if (res != null && res.data != null && res.status == 200) {
            let jshdata = res.data.data;
            this.depotList = jshdata;
          }
        })
        .catch(function (error) {
          console.log("error", error);
        });
    },

    GetSubStock(SubItem) {
      if (SubItem.IsSubStock == 1) {
        SubItem.IsSubStock = 0;
        return;
      }
      let APIUrl = `/depotItem/getAllDepotStock`;

      //organId=6&MNumber=0000013&beginDateTime&endDateTime=2024-04-04 23:59:59
      let APIParameter = `?organId=${this.organId}&MNumber=${SubItem.materialNumber}&depotId=${this.depotId}`;

      // let beginDateTime = "";
      let endDateTime = "";

      // if (common.IsDate(this.beginDate)) {
      //   beginDateTime += `&beginDateTime=${dayjs(this.beginDate).format(
      //     "YYYY-MM-DD"
      //   )}`;
      //   if (common.IsTime(this.beginTime + ":00")) {
      //     beginDateTime += ` ${this.beginTime + ":00"}`;
      //   } else {
      //     beginDateTime += ` 00:00:00`;
      //   }
      // }
      if (common.IsDate(this.endDate)) {
        endDateTime += `&endDateTime=${dayjs(this.endDate).format(
          "YYYY-MM-DD"
        )}`;
        if (common.IsTime(this.endTime + ":59")) {
          endDateTime += ` ${this.endTime + ":59"}`;
        } else {
          endDateTime += ` 23:59:59`;
        }
      }
      APIParameter += endDateTime;
      server
        .get(APIUrl + APIParameter)
        .then((res) => {
          if (
            res != null &&
            res.data != null &&
            res.data.code == 200 &&
            res.data.data != null
          ) {
            let jshdata = res.data.data;

            SubItem.IsSubStock = 1;
            SubItem.SubStockList = jshdata.rows;
          }
        })
        .catch(function (error) {
          console.log("error", error);

          return;
        });

      // GET /jshERP-boot/depotItem/getAllDepotStock?organId=6&MNumber=0000013&beginDateTime&endDateTime=2024-04-04 23:59:59

      // {
      //     "code": 200,
      //     "data": {
      //         "rows": [
      //             {
      //                 "depotName": "高雄倉",
      //                 "counterName": "A01",
      //                 "stock": 30.000000
      //             },
      //             {
      //                 "depotName": "台北倉",
      //                 "counterName": "A01",
      //                 "stock": 1.000000
      //             }
      //         ]
      //     }
      // }
    },

    GetData() {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      let APIUrl = `/depotItem/findByAll`;

      ///depotItem/findByAll?depotId=&monthTime=2023-07&materialParam=&mpList=&column=createTime&order=desc&depotIds=4&field=id,,rowIndex,barCode,materialName,materialStandard,materialModel,materialOther,unitName,unitPrice,prevSum,inSum,outSum,thisSum,thisAllPrice&currentPage=1&pageSize=10

      let APIParameter = `?currentPage=${this.currentPage}&pageSize=${this.pageSize}&mpList=&order=desc`;
      APIParameter += `&findOrganId=${this.organId}&materialParam=${this.materialParam}&depotIds=${this.depotId}`;
      let beginDateTime = "";
      let endDateTime = "";

      if (common.IsDate(this.beginDate)) {
        beginDateTime += `&beginDateTime=${dayjs(this.beginDate).format(
          "YYYY-MM-DD"
        )}`;
        if (common.IsTime(this.beginTime + ":00")) {
          //格式: 2023-12-08 22:07:00
          beginDateTime += ` ${this.beginTime + ":00"}`;
        } else {
          beginDateTime += ` 00:00:00`;
        }
      }
      if (common.IsDate(this.endDate)) {
        endDateTime += `&endDateTime=${dayjs(this.endDate).format(
          "YYYY-MM-DD"
        )}`;
        if (common.IsTime(this.endTime + ":59")) {
          //格式: 2023-12-08 22:07:00
          endDateTime += ` ${this.endTime + ":59"}`;
        } else {
          endDateTime += ` 23:59:59`;
        }
      }

      if (this.activeKey == 0) {
        APIParameter += endDateTime;
      } else {
        APIParameter += beginDateTime + endDateTime;
      }
      console.log("activeKey", this.activeKey);
      console.log("APIParameter", APIParameter);
      server
        .get(APIUrl + APIParameter)
        .then((res) => {
          if (
            res != null &&
            res.data != null &&
            res.data.code == 200 &&
            res.data.data != null
          ) {
            let jshdata = res.data.data;
            this.customersData = jshdata.rows;
            this.totalRows = jshdata.total;
            this.totalIn = jshdata.totalIn;
            this.totalThis = jshdata.totalThis;
            this.totalOut = jshdata.totalOut;
            this.maxPage =
              Math.ceil(this.totalRows / this.pageSize) == 0
                ? 1
                : Math.ceil(this.totalRows / this.pageSize);
          }
          this.IsGetDataing = false;
          //console.log("datalist:", this.customersData)
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    // 切換tab後重新預設查詢日期
    changeTab() {
      console.log("activeKey", this.activeKey);
      if (this.activeKey == 0) {
        this.beginDate = dayjs().format("YYYY-MM-DD"); //預設起始日期為當日
      } else {
        this.beginDate = dayjs().format("YYYY-MM-01"); //預設起始日期為第一日
      }
      this.currentPage = 1;
      this.GetData();
    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <a-tabs v-model:activeKey="activeKey" type="card" @change="changeTab">
      <a-tab-pane :key="0" tab="當日統計"></a-tab-pane>
      <a-tab-pane :key="1" tab="歷史統計查詢"></a-tab-pane>
    </a-tabs>
    <b-modal
      size="xl"
      v-model="showImageModal"
      title="顯示圖片"
      title-class="text-black font-18"
      body-class="p-3"
      hide-footer
    >
      <form>
        <div class="row text-center">
          <div class="col-12">
            <img :src="showImageURL" max-width="100%" max-height="100%" />
          </div>
        </div>

        <div class="text-end pt-5 mt-3">
          <b-button variant="light" @click="showImageModal = false"
            >關閉</b-button
          >
        </div>
      </form>
    </b-modal>
    <div class="row" v-show="SubView == 0">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-12">
                <div class="search-box me-2 mb-2 d-inline-block">
                  <label for="name">倉庫別</label>
                  <select
                    class="form-select"
                    v-model="depotId"
                    @change="
                      this.currentPage = 1;
                      GetData();
                    "
                  >
                    <option
                      :value="u1.id"
                      selected
                      v-for="u1 in [
                        { id: '', depotName: '全部' },
                        ...depotList,
                      ]"
                      :key="'query_depot_id' + u1.id"
                    >
                      {{ u1.depotName }}
                    </option>
                  </select>
                </div>

                <div class="search-box me-2 mb-2 d-inline-block">
                  <label for="name">客戶</label>
                  <select
                    class="form-select"
                    v-model="organId"
                    @change="
                      this.currentPage = 1;
                      GetData();
                    "
                  >
                    <option
                      :value="u1.id"
                      selected
                      v-for="u1 in [
                        { id: '', idname: '全部客戶' },
                        ...supplierlist,
                      ]"
                      :key="'organId' + u1.id"
                    >
                      {{ u1.idname }}
                    </option>
                  </select>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <label for="name">商品資料</label>
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      placeholder="商品資料"
                      @keyup.enter="
                        this.currentPage = 1;
                        GetData();
                      "
                      v-model="materialParam"
                    />
                  </div>
                </div>
                <div
                  class="search-box me-2 mb-2 d-inline-block"
                  v-if="activeKey == 1"
                >
                  <label for="name">起始日期</label>
                  <input
                    autocomplete="off"
                    type="date"
                    class="form-control"
                    @change="
                      this.currentPage = 1;
                      GetData();
                    "
                    v-model="beginDate"
                  />
                </div>
                <div
                  class="search-box me-2 mb-2 d-inline-block"
                  v-if="activeKey == 1"
                >
                  <label for="name">起始時間</label>
                  <input
                    autocomplete="off"
                    type="time"
                    class="form-control"
                    @change="
                      this.currentPage = 1;
                      GetData();
                    "
                    v-model="beginTime"
                  />
                </div>
                <div
                  class="search-box me-2 mb-2 d-inline-block"
                  v-if="activeKey == 1"
                >
                  <label for="name">結束日期</label>
                  <input
                    autocomplete="off"
                    type="date"
                    class="form-control"
                    @change="
                      this.currentPage = 1;
                      GetData();
                    "
                    v-model="endDate"
                  />
                </div>
                <div
                  class="search-box me-2 mb-2 d-inline-block"
                  v-if="activeKey == 1"
                >
                  <label for="name">結束時間</label>
                  <input
                    autocomplete="off"
                    type="time"
                    class="form-control"
                    @change="
                      this.currentPage = 1;
                      GetData();
                    "
                    v-model="endTime"
                  />
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <b-button
                      variant="primary"
                      @click="
                        this.currentPage = 1;
                        GetData();
                      "
                    >
                      <i
                        :class="
                          IsGetDataing
                            ? 'bx bx-loader bx-spin font-size-16 align-middle me-2'
                            : ''
                        "
                      >
                      </i>
                      查詢
                    </b-button>
                  </div>
                </div>
              </div>

              <!-- end col-->
            </div>
            <div class="table-responsive">
              <table class="table table-centered table-nowrap align-middle">
                <thead>
                  <tr>
                    <th width="5px">#</th>
                    <th>客戶</th>
                    <th>品號</th>
                    <th>名稱</th>
                    <th>規格</th>
                    <th>型號</th>
                    <th class="text-center" v-if="activeKey == 1">在途中</th>
                    <th class="text-center" v-if="activeKey == 1">入庫數量</th>
                    <th class="text-center" v-if="activeKey == 1">出庫數量</th>
                    <th class="text-center">結存數量</th>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-for="(SubItem, cidx) in customersData"
                    :key="SubItem.id"
                  >
                    <tr>
                      <td>{{ (currentPage - 1) * pageSize + cidx + 1 }}</td>
                      <td
                        style="white-space: break-spaces; word-break: break-all"
                      >
                        {{ SubItem.organName }}
                      </td>
                      <td
                        style="white-space: break-spaces; word-break: break-all"
                      >
                        {{ SubItem.materialNumber }}
                      </td>
                      <td
                        style="white-space: break-spaces; word-break: break-all"
                      >
                        {{ SubItem.materialName }}
                      </td>
                      <td
                        style="white-space: break-spaces; word-break: break-all"
                      >
                        {{ SubItem.materialStandard }}
                      </td>
                      <td
                        style="white-space: break-spaces; word-break: break-all"
                      >
                        {{ SubItem.materialModel }}
                      </td>

                      <td class="text-center" v-if="activeKey == 1">
                        {{ SubItem.defectiveSum }}
                      </td>
                      <td class="text-center" v-if="activeKey == 1">
                        {{ SubItem.inSum }}
                      </td>
                      <td class="text-center" v-if="activeKey == 1">
                        {{ SubItem.outSum }}
                      </td>
                      <td class="text-center">
                        <a href="javascript:;" @click="GetSubStock(SubItem)">
                          {{ SubItem.thisSum }}</a
                        >
                      </td>
                    </tr>
                    <tr class="subtr" v-if="SubItem.IsSubStock == 1">
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td class="text-right">&nbsp;</td>
                      <td class="text-center" colspan="4">
                        <table
                          class="table table-centered table-nowrap align-middle subtable"
                        >
                          <tbody>
                            <tr>
                              <th class="text-center" width="40%">倉庫</th>
                              <th class="text-center" width="30%">儲位</th>
                              <th class="text-center" width="30%">
                                數量
                                <i
                                  class="bx bxs-hide"
                                  @click="SubItem.IsSubStock = 0"
                                ></i>
                              </th>
                            </tr>
                            <tr
                              v-for="(ss1, ssidx) in SubItem.SubStockList"
                              :key="'SubStockList' + ssidx"
                            >
                              <td class="text-center">{{ ss1.depotName }}</td>
                              <td class="text-center">{{ ss1.counterName }}</td>
                              <td class="text-center">{{ ss1.stock }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      &nbsp;
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      &nbsp;
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      &nbsp;
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      &nbsp;
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                      v-if="activeKey == 1"
                    >
                      &nbsp;
                    </td>

                    <td class="text-center">總計:</td>
                    <td class="text-center" v-if="activeKey == 1">
                      {{ totalIn }}
                    </td>
                    <td class="text-center" v-if="activeKey == 1">
                      {{ totalOut }}
                    </td>
                    <td class="text-center">{{ totalThis }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <TablePager
              v-model:currentPage="currentPage"
              v-model:maxPage="maxPage"
              :CallGetData="GetData"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>
