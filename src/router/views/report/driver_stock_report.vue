<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import dayjs from 'dayjs'
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import { server } from "@/api";
import common from "@/api/common";

import appConfig from "@/app.config";

/**
 * Customers component
 */
export default {
    page: {
        title: "司機配送統計表",
        meta: [{ name: "description", content: appConfig.description }],
    },
    components: { Layout, PageHeader },
    data() {
        return {

            SubView: 0,
            materialParam: '',
            organId: '',
            depotId: '',
            monthTime: '',

            number: '',
            beginDate: '',
            endDate: '',
            beginTime: '',
            endTime: '',
            MaxFileSize: 0,
            userlist: [],
            accountlist: [],
            supplierlist: [],
            depotList: [],
            filelist: [],
            customersData: [],
            customersSubData: [],
            customersItem: [],
            customersItem_selectindex: -1,
            materialsList: [],
            title: "司機配送統計表",
            items: [
                {
                    text: "報表查詢",
                    href: "javascript:;",
                },
                {
                    text: "司機配送統計表",
                    active: true,
                },
            ],

            showModal: false,
            submitted: false,
            showImageModal: false,
            customers: {

                id: '',

                organId: '',//57
                operTime: '',//"2023-03-22 17:21:07"
                number: '',//"CGRK00000000846"
                discount: 0,//0
                discountMoney: 0,//0
                discountLastMoney: 0,//11
                otherMoney: 0,//0
                accountId: '',//17
                changeAmount: 0,//-11
                debt: 0,//0
                type: '入庫',//"入库"
                subType: '進貨單',//"采购"
                defaultNumber: '',//"CGRK00000000846"
                totalPrice: '',//-11
                accountIdList: '',//""
                accountMoneyList: '',//""
                fileName: '',//""
                status: 0,//"0"
                remark: '',

                date2: '',
                time2: '',
            },

            name: '',
            remark: '',
            totalin: 0,
            totalOut: 0,
            totalthis: 0,
            driverlist: [],
            VehicleList: [],
            driverId: '',
            driverName: '',
            licensePlateNumber: '',
            keyword: '',


            IsGetDataing: false,
            pageSize: 30,
            totalRows: 0,
            currentPage: 1,
            maxPage: 10,
        };
    },
    computed: {
        customersItemAllPrice: function () {
            if (this.customersItem.filter(x => x.allPrice != 0).length == 0) {
                return 0;
            }
            let itemallPrice = this.customersItem.filter(x => x.allPrice != 0).map(y => y.allPrice).reduce((a, b) => a + b);

            return itemallPrice;
        }
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
        //server.GetSupplierList((rows) => { this.supplierlist = rows })

        this.beginDate = dayjs().format("YYYY-MM-01");//預設起始日期
        this.$nextTick(() => {
            server.GetSupplier2List('家電-司機', (rows) => { this.driverlist = rows })
            server.GetVehiclelist({}, (rows) => { this.VehicleList = rows; })
            //this.GetDepotList();//倉庫別
            this.GetData();
        })
    },
    methods: {
        /**
         * Modal form submit
         */
        // eslint-disable-next-line no-unused-vars
        formatdStatus(dStatus) {
            switch (Number(dStatus)) {
                case 0: return "未派發";
                case 1: return "已派發";
                case 2: return "已接單";
                case 3: return "聯絡中";
                case 4: return "配送中";
                case 5: return "配送完成";
                case 6: return "配送異常";
                default: return dStatus
            }
        },
        formatdStatusCSS(dStatus) {
            switch (Number(dStatus)) {
                case 0: return "btn-warning";
                case 1: return "btn-warning";
                case 2: return "btn-primary";
                case 3: return "btn-secondary";
                case 4: return "btn-info";
                case 5: return "btn-success";
                case 6: return "btn-danger";
                default: return dStatus
            }
        },
        formatIDName(id, name) {
            if (id == null || name == null) return "";
            return common.PadLeftZero(id || '', 3) + ' ' + (name || '');
        },
        formatOrganName(SubItem) {
            if (SubItem == null) return "";
            return common.PadLeftZero(SubItem.organId || '', 3) + ' ' + (SubItem.organName || '');
        },
        GetDepotList() {
            ///jshERP-boot/depot/findDepotByCurrentUser  
            let APIUrl = `/depot/findDepotByCurrentUser`;
            server.get(APIUrl)
                .then((res) => {
                    if (res != null && res.data != null && res.status == 200) {
                        let jshdata = res.data.data;
                        this.depotList = jshdata;
                    }
                }).catch(function (error) {
                    console.log("error", error);
                });
        },
        GetSubData(SubItem, dStatus) {
            //console.log(SubItem, dStatus)

            if (SubItem == null) return;
            if (SubItem[`status${dStatus}Count`] == null || String(SubItem[`status${dStatus}Count`]) == "0") return;
            this.SubView = 1;
            if (this.IsGetDataing == true) return;
            this.IsGetDataing = true;
            let APIUrl = `/depotHead/list`;
            let APIParameter = `?currentPage=1&pageSize=1000`;


            let beginDateTime = '';
            let endDateTime = '';
            if (common.IsDate(this.beginDate)) {
                beginDateTime += dayjs(this.beginDate).format("YYYY-MM-DD");
                if (common.IsTime(this.beginTime + ':00')) {
                    //格式: 2023-12-08 22:07:00
                    beginDateTime += ` ${this.beginTime + ':00'}`;
                } else {
                    beginDateTime += ` 00:00:00`;
                }
            }
            if (common.IsDate(this.endDate)) {
                endDateTime += dayjs(this.endDate).format("YYYY-MM-DD");
                if (common.IsTime(this.endTime + ':59')) {
                    //格式: 2023-12-08 22:07:00
                    endDateTime += ` ${this.endTime + ':59'}`;
                } else {
                    endDateTime += ` 23:59:59`;
                }
            }

            let queryStr = `{"type":"","subType":"","number":"","MNumber":"","materialParam":"","organId":"","beginDateTime":"${beginDateTime}","endDateTime":"${endDateTime}","driverId":"${SubItem.driverId}","keyword":"${this.keyword}","dStatus":"${dStatus}"}`;

            APIParameter += `&search=${encodeURIComponent(queryStr)}`;
            server.get(APIUrl + APIParameter)
                .then((res) => {
                    if (res != null && res.data != null && res.data.code == 200 && res.data.data != null) {
                        let jshdata = res.data.data;
                        this.customersSubData = jshdata.rows;
                    }

                    this.IsGetDataing = false;

                }).catch(function (error) {
                    console.log("error", error);
                    this.IsGetDataing = false;
                    return;
                });
        },
        GetData() {

            // Get
            // /depotHead/driver/findByAll?driverName=AAA&licensePlateNumber=BBB123&currentPage=1&pageSize=10
            // @ApiParam(value = "司機名稱(帶入空或全部，查詢全部)", required = true)
            // @RequestParam("driverName") String driverName,
            // @ApiParam(value = "車牌號號(帶入空或全部，查詢全部)", required = true)
            // @RequestParam("licensePlateNumber") String licensePlateNumber,
            // @ApiParam(value = "關鍵字")
            // @RequestParam(required = false, value = "keyword") String keyword,
            // @RequestParam("currentPage") Integer currentPage,
            // @RequestParam("pageSize") Integer pageSize

            if (this.IsGetDataing == true) return;
            this.SubView = 0;
            this.IsGetDataing = true;
            let APIUrl = `/depotHead/driver/findByAll`;

            let APIParameter = `?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;
            APIParameter += `&driverName=${this.driverName}&licensePlateNumber=${this.licensePlateNumber}&keyword=${this.keyword}`;


            let beginDateTime = '';
            let endDateTime = '';
            if (common.IsDate(this.beginDate)) {
                beginDateTime += `&beginDateTime=${dayjs(this.beginDate).format("YYYY-MM-DD")}`;
                if (common.IsTime(this.beginTime + ':00')) {
                    //格式: 2023-12-08 22:07:00
                    beginDateTime += ` ${this.beginTime + ':00'}`;
                } else {
                    beginDateTime += ` 00:00:00`;
                }
            }
            if (common.IsDate(this.endDate)) {
                endDateTime += `&endDateTime=${dayjs(this.endDate).format("YYYY-MM-DD")}`;
                if (common.IsTime(this.endTime + ':59')) {
                    //格式: 2023-12-08 22:07:00
                    endDateTime += ` ${this.endTime + ':59'}`;
                } else {
                    endDateTime += ` 23:59:59`;
                }
            }
            APIParameter += beginDateTime + endDateTime;

            server.get(APIUrl + APIParameter)
                .then((res) => {
                    if (res != null && res.data != null && res.data.code == 200 && res.data.data != null) {
                        let jshdata = res.data.data;
                        this.customersData = jshdata.rows;
                        this.totalRows = jshdata.total;
                        this.maxPage = Math.ceil(this.totalRows / this.pageSize) == 0 ? 1 : Math.ceil(this.totalRows / this.pageSize);
                    }
                    this.IsGetDataing = false;
                    //console.log("datalist:", this.customersData)
                }).catch(function (error) {
                    console.log("error", error);
                    this.IsGetDataing = false;
                    return;
                });
        },



    },
};
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />

        <b-modal size="xl" v-model="showImageModal" title="顯示圖片" title-class="text-black font-18" body-class="p-3"
            hide-footer>
            <form>
                <div class="row text-center">
                    <div class="col-12">
                        <img :src="showImageURL" max-width="100%" max-height="100%">
                    </div>
                </div>

                <div class="text-end pt-5 mt-3">
                    <b-button variant="light" @click="showImageModal = false">關閉</b-button>
                </div>
            </form>
        </b-modal>
        <div class="row" v-show="SubView == 0">
            <div class="row mb-2">
                <div class="col-sm-12">

                    <div class="search-box me-2 mb-2 d-inline-block">
                        <label for="name">司機名稱</label>
                        <select class="form-select" v-model="driverName" @change="GetData()">
                            <option :value="u1.supplier" selected
                                v-for="u1 in [{ id: '', idname: '全部司機', supplier: '' }, ...driverlist]"
                                :key="'customers_driver' + u1.id">
                                {{ u1.idname }}</option>
                        </select>
                    </div>

                    <div class="search-box me-2 mb-2 d-inline-block">
                        <label for="name">車牌號碼</label>
                        <select class="form-select" v-model="licensePlateNumber" @change="GetData()">
                            <option
                                v-for="(lp1, lpidx) in [{ licensePlateNumber: '', driverName: '全部車牌' }, ...VehicleList]"
                                :value="lp1.licensePlateNumber" :key="'VehicleList' + lpidx">
                                {{ lp1.licensePlateNumber }}
                                {{ lp1.driverName }}
                            </option>
                        </select>
                    </div>
                    <div class="search-box me-2 mb-2 d-inline-block">
                        <div class="position-relative">
                            <label for="name">關鍵字查詢</label>
                            <input autocomplete="off" type="text" class="form-control" placeholder="關鍵字查詢"
                                @keyup.enter="GetData()" v-model="keyword" />
                        </div>
                    </div>
                    <div class="search-box me-2 mb-2 d-inline-block">
                        <label for="name">起始日期</label>
                        <input autocomplete="off" type="date" class="form-control" @change="GetData()"
                            v-model="beginDate" />
                    </div>
                    <div class="search-box me-2 mb-2 d-inline-block">
                        <label for="name">起始時間</label>
                        <input autocomplete="off" type="time" class="form-control" @change="GetData()"
                            v-model="beginTime" />
                    </div>
                    <div class="search-box me-2 mb-2 d-inline-block">
                        <label for="name">結束日期</label>
                        <input autocomplete="off" type="date" class="form-control" @change="GetData()"
                            v-model="endDate" />
                    </div>
                    <div class="search-box me-2 mb-2 d-inline-block">
                        <label for="name">結束時間</label>
                        <input autocomplete="off" type="time" class="form-control" @change="GetData()"
                            v-model="endTime" />
                    </div>
                    <div class="search-box me-2 mb-2 d-inline-block">
                        <div class="position-relative">
                            <b-button variant="primary" @click="GetData()">
                                <i :class="IsGetDataing ? 'bx bx-loader bx-spin font-size-16 align-middle me-2' : ''">
                                </i>
                                查詢
                            </b-button>
                        </div>
                    </div>
                </div>

                <!-- end col-->
            </div>




        </div>
        <div class="row" v-show="SubView == 0">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">

                        <div class="table-responsive">
                            <table class="table table-centered table-nowrap align-middle">
                                <thead>
                                    <tr>
                                        <th width="5px">#</th>
                                        <th width="20%">司機名稱</th>
                                        <th width="20%">車牌號碼</th>
                                        <th width="10%" class="text-center">派單數量</th>
                                        <th width="10%" class="text-center">接單中</th>
                                        <th width="10%" class="text-center">聯絡中</th>
                                        <th width="10%" class="text-center">配送中</th>
                                        <th width="10%" class="text-center">配送完成</th>
                                        <th width="10%" class="text-center">異常訂單</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(SubItem, cidx) in customersData" :key="SubItem.id">
                                        <td>{{ (currentPage - 1) * pageSize + cidx + 1 }}</td>
                                        <td style="white-space: break-spaces;word-break:break-all">
                                            {{ formatIDName(SubItem.driverId, SubItem.driverName) }}
                                        </td>
                                        <td style="white-space: break-spaces;word-break:break-all">
                                            {{ SubItem.licensePlateNumber }}
                                        </td>
                                        <td style="white-space: break-spaces;word-break:break-all" class="text-center">
                                            <a href="javascript:;" @click="GetSubData(SubItem, 1)">
                                                {{ SubItem.status1Count }}
                                            </a>
                                        </td>
                                        <td style="white-space: break-spaces;word-break:break-all" class="text-center">
                                            <a href="javascript:;" @click="GetSubData(SubItem, 2)">
                                                {{ SubItem.status2Count }}
                                            </a>
                                        </td>
                                        <td style="white-space: break-spaces;word-break:break-all" class="text-center">
                                            <a href="javascript:;" @click="GetSubData(SubItem, 3)">
                                                {{ SubItem.status3Count }}
                                            </a>
                                        </td>
                                        <td style="white-space: break-spaces;word-break:break-all" class="text-center">
                                            <a href="javascript:;" @click="GetSubData(SubItem, 4)">
                                                {{ SubItem.status4Count }}
                                            </a>
                                        </td>
                                        <td style="white-space: break-spaces;word-break:break-all" class="text-center">
                                            <a href="javascript:;" @click="GetSubData(SubItem, 5)">
                                                {{ SubItem.status5Count }}
                                            </a>
                                        </td>
                                        <td style="white-space: break-spaces;word-break:break-all" class="text-center">
                                            <a href="javascript:;" @click="GetSubData(SubItem, 6)">
                                                {{ SubItem.status6Count }}
                                            </a>
                                        </td>

                                    </tr>

                                </tbody>

                            </table>
                        </div>
                        <TablePager v-model:currentPage="currentPage" v-model:maxPage="maxPage"
                            :CallGetData="GetData" />
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-show="SubView == 1">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h4>明細</h4>
                        <div class="table-responsive">
                            <div class="table-responsive">
                                <table class="table table-centered table-nowrap align-middle">
                                    <thead>
                                        <tr>

                                            <th width="1%">#</th>
                                            <th width="5%">客戶</th>
                                            <th width="5%">單號</th>
                                            <th width="5%">客單編號</th>
                                            <th width="5%">原始客編</th>
                                            <th width="5%">品號</th>
                                            <th width="15%">商品資料</th>
                                            <th width="5%">倉庫別</th>
                                            <th width="5%">儲位</th>
                                            <th width="5%">數量</th>
                                            <th width="5%">狀態</th>
                                            <th width="5%">配送狀態</th>
                                            <th width="5%">配送類別</th>
                                            <th width="5%">建立時間</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(SubItem, cidx) in customersSubData"
                                            :key="'customersSubData' + cidx">

                                            <td>{{ (currentPage - 1) * pageSize + cidx + 1 }}
                                            </td>
                                            <td style="white-space: break-spaces;word-break:break-all">{{
            SubItem.organName }}
                                            </td>
                                            <td style="white-space: break-spaces;word-break:break-all">{{ SubItem.number
                                                }}</td>
                                            <td style="white-space: break-spaces;word-break:break-all">{{
            SubItem.customNumber
        }}
                                            </td>
                                            <td style="white-space: break-spaces;word-break:break-all">{{
                SubItem.sourceNumber
            }}
                                            </td>
                                            <td style="white-space: break-spaces;word-break:break-all">{{
                SubItem.mNumber }}
                                            </td>
                                            <td style="white-space: break-spaces;word-break:break-all">
                                                <div v-for="name1 in String(SubItem.materialsList).split(',')"
                                                    :key="'SubItem' + cidx + name1">{{ name1 }}</div>
                                            </td>
                                            <td style="white-space: break-spaces;word-break:break-all">{{
            SubItem.depotName }}
                                            </td>
                                            <td style="white-space: break-spaces;word-break:break-all">{{
            SubItem.counterName }}
                                            </td>

                                            <td>{{ SubItem.materialCount }}</td>

                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <span class="btn btn-success" v-if="SubItem.status == 1">已審核</span>
                                                    <span class="btn btn-danger" v-if="SubItem.status == 0">未審核</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <span class="btn" :class="formatdStatusCSS(SubItem.dStatus)">{{
                                                        formatdStatus(SubItem.dStatus) }}</span>

                                                </div>
                                            </td>
                                            <td style="white-space: break-spaces;word-break:break-all">{{
                                                SubItem.subType }}
                                            </td>
                                            <td style="white-space: break-spaces;word-break:break-all">{{
                                                SubItem.operTimeStr }}
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <a href="javascript:;" class="btn btn-secondary" @click="SubView = 0">返回</a>
                    </div>
                </div>
            </div>
        </div>
        <!-- end row -->
    </Layout>
</template>
