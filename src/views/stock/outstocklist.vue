<script>
import Layout from "@/router/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import dayjs from "dayjs";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import { server } from "@/api";
import common from "@/api/common";

import appConfig from "@/app.config";
import {
  Modal,
  Tag,
  Tooltip,
  Button,
  Select,
  SelectOption,
} from "ant-design-vue";
import ImportFile from "@/components/importFile.vue";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
// import "./style.css";
import { Navigation } from "swiper/modules";

/**
 * Customers component
 */
export default {
  page: {
    title: "配送單",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    AModal: Modal,
    ImportFile,
    ATag: Tag,
    InfoCircleOutlined,
    ATooltip: Tooltip,
    AButton: Button,
    ASelect: Select,
    ASelectOption: SelectOption,
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      modules: [Navigation],
      selectedTab: 0,
      chkAll: false,
      SubView: 0,
      dStatus: "",
      materialParam: "",
      queryKeyword: "",
      depotId: "",
      number: "",
      mNumber: "",
      subType: "",
      beginTime: "",
      endTime: "",
      MaxFileSize: 0,
      userlist: [],
      accountlist: [],
      organId: "",
      supplierlist: [],
      driverlist: [],

      depotList: [],
      // counterList: [],
      filelist: [],
      customersData: [],
      customersItem: [],
      customersItem_selectindex: -1,
      materialsList: [],
      title: "配送單",
      items: [
        {
          text: "倉庫管理",
          href: "javascript:;",
        },
        {
          text: "倉庫別管理",
          href: "javascript:;",
        },
        {
          text: "配送單",
          active: true,
        },
      ],

      showModal: false,
      submitted: false,
      showImageModal: false,
      showImageURL: "",
      showVideoURL: "",
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
        type: "出庫", //"入库"
        subType: "配送單", //"采购"
        defaultNumber: "", //"CGRK00000000846"
        totalPrice: "", //-11
        accountIdList: "", //""
        accountMoneyList: "", //""
        fileName: "", //""
        status: 0, //"0"
        dStatus: "",
        remark: "",
        mainArrival: "",
        extrasArrival: "",
        agreedDelivery: "",
        delivered: "",

        receiveName: "",
        cellphone: "",
        address: "",
        counterId: "",
        counterName: "",
        date2: "",
        time2: "",
        customNumber: "",
        sourceNumber: "",
        isPickup: 1,
        install: "",
        recycle: "",
        storeMan: "",
        storeName: "",
        storeAddress: "",
        storePhone: "",
      },
      driver: {
        driverId: "",
        assignDate: "",
        carNumber: "",
        assignUser: "",

        filePath: "",
        filelist: [],
        status: 0,
        deliveryStatusList: [],
        reportList: [],
      },
      name: "",
      remark: "",

      LogList: [],

      IsGetDataing: false,
      pageSize: 50,
      totalRows: 0,
      currentPage: 1,
      maxPage: 10,
      openRecodeModel: false,
      searchRecode: [],
      recodeColumns: [
        {
          name: "#",
          key: "index",
          render: (text, record, index) => index + 1,
        },
        {
          title: "日期",
          key: "datetime",
          dataIndex: "datetime",
        },
        {
          title: "修改者",
          key: "name",
          dataIndex: "name",
        },
      ],
      checkNumberList: [],
      checkSubIdList: [],
      dStatusOption: [
        { value: 0, name: "未派發" },
        { value: 1, name: "已派發" },
        { value: 2, name: "已接單" },
        { value: 3, name: "聯絡中" },
        { value: 4, name: "配送中" },
        { value: 5, name: "配送完成" },
        { value: 6, name: "配送異常" },
        { value: 7, name: "作廢" },
      ],
    };
  },
  computed: {
    IsPickup1() {
      if (this.customers.subType == "配送單") return true;
      return false;
    },
    EditOneTitle() {
      let SubTitle =
        this.SubView == 1 ? "新增" : this.SubView == 2 ? "修改" : "查看";
      SubTitle = SubTitle + this.customers.subType;
      return SubTitle;
    },
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
    UserID() {
      let user = localStorage.getItem("user");
      //console.log("user", user)
      if (user) {
        let UserID = JSON.parse(user).UserID;
        if (UserID) {
          return UserID;
        }
      }
      return "";
    },
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations: {
    customers: {
      cellphone: { required: helpers.withMessage("請填寫手機", required) },
      address: { required: helpers.withMessage("請填寫地址", required) },
      receiveName: {
        required: helpers.withMessage("請填寫收件人名稱", required),
      },
      recycle: {
        required: helpers.withMessage("請選擇是否舊機回收", required),
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setData();
    });
  },
  watch: {
    chkAll: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          for (let i = 0; i < this.customersData.length; i++) {
            this.customersData[i].chk = newVal;
            this.clickCheckbox(this.customersData[i]);
          }
        }
      },
    },
    beginTime: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.currentPage = 1;
          this.GetData();
        }
      },
    },
    endTime: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.currentPage = 1;
          this.GetData();
        }
      },
    },
  },
  methods: {
    setData() {
      this.GetUserList(); //負責人列表
      //this.GetAccountList();//結算人帳號列表
      //this.GetSupplierList();
      server.GetSupplierList((rows) => {
        this.supplierlist = rows;
      });
      server.GetSupplier2List("家電-司機", (rows) => {
        this.driverlist = rows.filter((x) => x.enabled == true);
      });

      this.GetDepotList(); //倉庫別
      // this.GetCounterList();//儲位別
      this.GetMaxFileSize();
      this.GetData();
    },
    GetDriverDay(iStatus) {
      if (this.driver == null || this.driver.deliveryStatusList == null)
        return "";
      let F1List = this.driver.deliveryStatusList.filter(
        (x) => String(x.status) == String(iStatus)
      );
      if (F1List.length != 0) {
        return this.formatDateTime(F1List[0].date);
      }
      return "";
    },
    GetDriverCarNumber() {
      if (this.driver.driverId == null || this.driver.driverId == "") return;
      let F1List = this.driverlist.filter(
        (x) => String(x.id) == String(this.driver.driverId)
      );
      if (F1List.length != 0) this.driver.carNumber = F1List[0].licensePlate;
      //server.GetSupplierByID(this.driver.driverId, (aaa) => { console.log(aaa) });
    },
    formatDateTime(value) {
      if (common.IsDate(value))
        return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
      return value;
    },
    formatDate(value) {
      if (common.IsDate(value)) return dayjs(value).format("YYYY-MM-DD");
      return value;
    },
    formatTime(value) {
      if (common.IsDate(value)) return dayjs(value).format("HH:mm:ss");
      return value;
    },
    formatdStatus(dStatus) {
      switch (Number(dStatus)) {
        case 0:
          return "未派發";
        case 1:
          return "已派發";
        case 2:
          return "已接單";
        case 3:
          return "聯絡中";
        case 4:
          return "配送中";
        case 5:
          return "配送完成";
        case 6:
          return "配送異常";
        case 7:
          return "作廢";
        default:
          return dStatus;
      }
    },
    formatdStatusCSS(dStatus) {
      switch (Number(dStatus)) {
        case 0:
          return "btn-warning";
        case 1:
          return "btn-warning";
        case 2:
          return "btn-primary";
        case 3:
          return "btn-secondary";
        case 4:
          return "btn-info";
        case 5:
          return "btn-success";
        case 6:
          return "btn-danger";
        case 7:
          return "btn-dark";
        default:
          return dStatus;
      }
    },
    formatPadLeftZero(str, len) {
      return common.PadLeftZero(str, len);
    },
    /**
     * Modal form submit
     */
    // eslint-disable-next-line no-unused-vars
    handleSubmit(e) {
      this.submitted = true;
      // stop here if form is invalid
      console.log("this.SubView", this.SubView);
      this.v$.$touch();
      if (this.v$.$invalid) {
        return;
      } else {
        console.log("this.driver.status", this.driver.status);
        // this.checkCount(this.customersItem);
        // 判斷快速派發是否有值
        if (this.SubView == 2) {
          if (
            this.driver.driverId !== null &&
            this.driver.assignDate !== "Invalid Date" &&
            this.driver.assignUser !== null &&
            this.driver.status == 0
          ) {
            this.AssignDriver();
            return;
          }
          // else if (
          //   (this.driver.driverId !== null && this.driver.driverId !== "") ||
          //   this.driver.assignDate !== "Invalid Date" ||
          //   this.driver.assignUser !== null
          // ) {
          //   alert("請填寫完成並指派司機");
          //   return;
          // }
        }

        //console.log ("this.customers.extrasArrival",this.customers.extrasArrival)
        this.customers.extrasArrival = dayjs(
          this.customers.extrasArrival
        ).isValid()
          ? dayjs(this.customers.extrasArrival).format("YYYY-MM-DD")
          : null;
        if (
          this.customers.id == null ||
          this.customers.id == 0 ||
          this.customers.id == 0
        ) {
          let aObj = JSON.parse(JSON.stringify(this.customers));
          let bObj = JSON.parse(JSON.stringify(this.customersItem));

          aObj.number = aObj.defaultNumber;
          aObj.fileName = this.filelist.join(",");
          aObj.operTime = `${aObj.date2} ${aObj.time2}`;
          aObj.totalPrice = this.customersItemAllPrice;
          aObj.type = "出庫";
          //aObj.subType = '配送單';
          delete aObj.id;
          delete aObj.date2;
          delete aObj.time2;

          let errMsg = "";
          if (bObj.length == 0) {
            errMsg += "請至少新增一筆商品\n";
          }
          if (errMsg == "") {
            if (this.IsPickup1 == true) {
              for (let i = 0; i < bObj.length; i++) {
                let b1 = bObj[i];
                if (b1.depotId == null || b1.depotId == "") {
                  errMsg += `#${i + 1} 請選擇倉庫別\n`;
                }
                if (b1.barCode == null || b1.barCode == "") {
                  errMsg += `#${i + 1} 請選擇商品\n`;
                }

                console.log("b1", b1);
              }
            } else {
              for (let i = 0; i < bObj.length; i++) {
                let b1 = bObj[i];
                if (b1.materialName == null || b1.materialName == "") {
                  errMsg += `#${i + 1} 輸入商品名稱\n`;
                }
                b1.operNumber = b1.operNumber || 1;
              }
            }
          }
          if (errMsg != "") {
            alert(errMsg);
            return;
          }

          this.AddData({
            info: JSON.stringify(aObj),
            rows: JSON.stringify(bObj),
          });
        } else if (this.customers.id > 0) {
          let aObj = JSON.parse(JSON.stringify(this.customers));
          let bObj = JSON.parse(JSON.stringify(this.customersItem));

          aObj.number = aObj.defaultNumber;
          aObj.fileName = this.filelist.join(",");
          aObj.operTime = `${aObj.date2} ${aObj.time2}`;
          aObj.totalPrice = this.customersItemAllPrice;

          //delete aObj.id;
          delete aObj.date2;
          delete aObj.time2;

          let errMsg = "";

          if (bObj.length == 0) {
            errMsg += "請至少新增一筆商品\n";
          }

          if (errMsg == "") {
            if (this.IsPickup1 == true) {
              for (let i = 0; i < bObj.length; i++) {
                let b1 = bObj[i];
                if (b1.depotId == null || b1.depotId == "") {
                  errMsg += `#${i + 1} 請選擇倉庫別\n`;
                }
                if (b1.barCode == null || b1.barCode == "") {
                  errMsg += `#${i + 1} 請選擇商品\n`;
                }
              }
            } else {
              for (let i = 0; i < bObj.length; i++) {
                let b1 = bObj[i];
                if (b1.materialName == null || b1.materialName == "") {
                  errMsg += `#${i + 1} 輸入商品名稱\n`;
                }
                b1.operNumber = b1.operNumber || 1;
              }
            }
          }
          if (errMsg != "") {
            alert(errMsg);
            this.UpdData({
              info: JSON.stringify(aObj),
              rows: JSON.stringify(bObj),
            });
            return;
          }
          this.UpdData({
            info: JSON.stringify(aObj),
            rows: JSON.stringify(bObj),
          });
        }

        this.submitted = false;
      }
    },
    AssignDriver() {
      console.log("AssignDriver", this.customers.dStatus, this.driver.status);
      // 新增api -> 司機派發功能 put
      // /jshERP-boot/depotHead/delivery/assign?headerId=61&driverId=33&assignDate=2024-01-21 14:10:00&assignUser=測試用戶
      // headerId : 配送單id
      // driverId: 司機id
      // assignDate: 派發時間
      // assignUser: 派發人員

      // 1. 會檢查是否為配送單
      // 2. 是否已有指派過司機
      // 3. 檢查司機是否已有綁定車輛
      if (
        this.customers == null ||
        this.customers.id == null ||
        this.customers.id == 0
      )
        return;

      let data2 = {};

      data2.headerId = this.customers.id; // : 配送單id
      data2.driverId = this.driver.driverId; //: 司機id
      data2.assignDate = this.driver.assignDate; //: 派發時間
      data2.assignUser = this.driver.assignUser; //: 派發人員

      let errMsg = "";

      if (data2.driverId == null || data2.driverId == "")
        errMsg += "請選擇指派司機\n";
      if (
        data2.assignDate == null ||
        data2.assignDate == "" ||
        data2.assignDate == ""
      )
        errMsg += "請選擇指派日期\n";
      if (data2.assignUser == null || data2.assignUser == "")
        errMsg += "請選擇派發人員\n";

      if (errMsg != "") {
        alert(errMsg);
        return;
      }

      data2.assignDate = dayjs(data2.assignDate).format("YYYY-MM-DD");
      this.IsGetDataing = true;
      let APIUrl = `/depotHead/delivery/assign`;
      server
        .put(APIUrl, data2)
        .then((res) => {
          if (res != null && res.data != null) {
            if (res.data.code == 200) {
              alert("已指派成功!");

              this.GetDriverInfo(this.customers.number);
              this.showModal = false;
            } else {
              alert(res.data.data.message);
              //{"code":8000021,"data":{"message":"客單編號/原始客編重覆建立"}}
            }
          }
          this.IsGetDataing = false;
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    ReAssignDriver() {
      // 新增api -> 重新指派功能 put
      // jshERP-boot/depotHead/delivery/unAssign?headerId=61
      // headerId : 配送單id
      // 1. 會檢查是否為配送單
      // 2. 是否已有指派過司機
      if (
        this.customers == null ||
        this.customers.id == null ||
        this.customers.id == 0 ||
        this.driver.driverId == 0 ||
        this.driver.driverId == ""
      )
        return;

      if (confirm(`確認重新指派配送單?`) != true) {
        return;
      }

      let data2 = {};

      //            data2.headerId = this.customers.id;// : 配送單id

      let errMsg = "";

      if (errMsg != "") {
        alert(errMsg);
        return;
      }
      this.IsGetDataing = true;

      let APIUrl = `/depotHead/delivery/unAssign/${this.customers.id}`;
      server
        .put(APIUrl, data2)
        .then((res) => {
          if (res != null && res.data != null) {
            if (res.data.code == 200) {
              alert("已重新指派!");
              this.GetDriverInfo(this.customers.number);
              this.showModal = false;
            } else {
              alert(res.data.data.message);
            }
          }
          this.IsGetDataing = false;
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    SendFeedback(SubItem) {
      if (SubItem == null || SubItem.id == null || SubItem.id == 0) return;

      let errMsg = "";

      if (errMsg != "") {
        alert(errMsg);
        return;
      }
      this.IsGetDataing = true;
      let data2 = { feedback: SubItem.feedback };
      let APIUrl = `/depotHead/feedBackReport/${SubItem.id}`;
      server
        .put(APIUrl, data2)
        .then((res) => {
          if (res != null && res.data != null) {
            if (res.data.code == 200) {
              alert("客服己回覆!");
              this.showModal = false;
            } else {
              alert(res.data.data.message);
            }
          }
          this.IsGetDataing = false;
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    NewRow1() {
      // let obj1 = this.GetNewCustomerItemObj1();
      // obj1.id = new Date().getTime() + Math.random().toString().substr(2, 7);
      // obj1.orderNum = this.customersItem.length + 1;
      // this.GetMaterialListByRow(this.customers.organId, obj1.depotId, obj1.counterId, obj1.name, (rows) => { obj1.queryMaterialList = rows; this.customersItem.push(obj1); })
      let obj1 = this.GetNewCustomerItemObj1();
      obj1.id = new Date().getTime() + Math.random().toString().substr(2, 7);
      obj1.orderNum = this.customersItem.length + 1;
      //this.GetMaterialListByRow(this.customers.organId, obj1.depotId, obj1.counterId, obj1.name, (rows) => { obj1.queryMaterialList = rows; this.customersItem.push(obj1); })
      let wObj = {
        organId: this.customers.organId,
        depotId: obj1.depotId,
        number: obj1.number,
      };
      server.GetMaterialListByRow(wObj, (rows) => {
        obj1.queryMaterialList = rows;
        this.customersItem.push(obj1);
      });
    },
    InitEveryRowsProduct() {
      console.log("InitEveryRowsProduct");
      for (let i = 0; i < this.customersItem.length; i++) {
        let obj1 = this.customersItem[i];
        this.customersItem[i].depotId = "";
        this.customersItem[i].number = "";
        this.customersItem[i].name = "";
        //this.GetMaterialListByRow(this.customers.organId, obj1.depotId, obj1.counterId, obj1.name, (rows) => { obj1.queryMaterialList = rows })
        let wObj = {
          organId: this.customers.organId,
          depotId: obj1.depotId,
          number: obj1.number,
        };
        server.GetMaterialListByRow(wObj, (rows) => {
          obj1.queryMaterialList = rows;
        });
        this.MaterialSelectOneByRow(null, i);
      }
    },
    DeleteRow1(SubItem) {
      const filteredArray = this.customersItem.filter(
        (obj) => !(obj.id === SubItem.id)
      );
      for (let i = 0; i < filteredArray.length; i++) {
        filteredArray[i].orderNum = i + 1;
      }
      this.customersItem = filteredArray;
    },
    GetNewCustomerItemObj1() {
      //customersItem
      let NewObj1 = {};
      NewObj1.id = ""; //"16794997361110338834",
      NewObj1.name = ""; //"123",
      NewObj1.standard = ""; //null,
      NewObj1.model = ""; //null,
      NewObj1.color = ""; //null,
      NewObj1.materialOther = ""; //"",
      NewObj1.stock = ""; //2,
      NewObj1.unit = ""; //"123",
      NewObj1.snList = ""; //"",
      NewObj1.batchNumber = ""; //"",
      NewObj1.expirationDate = ""; //"",
      NewObj1.sku = ""; //"",
      NewObj1.preNumber = ""; //"",
      NewObj1.finishNumber = ""; //"",
      NewObj1.operNumber = ""; //1,數量
      NewObj1.unitPrice = ""; //"100",單價
      NewObj1.allPrice = ""; //100,總價
      NewObj1.taxRate = ""; //0,稅率
      NewObj1.taxMoney = ""; //0,稅價
      NewObj1.taxLastMoney = ""; //100,含稅價
      NewObj1.remark = ""; //"",
      NewObj1.linkId = ""; //"",
      NewObj1.orderNum = ""; //1,
      NewObj1.depotId = ""; //"19", //倉庫ID
      NewObj1.counterId = ""; //"100123445",
      NewObj1.counterName = ""; //"100123445",
      NewObj1.barCode = ""; //"100123445",
      NewObj1.queryMaterialList = [];
      NewObj1.materialName = ""; // 門市取貨要輸入的商品名稱
      return NewObj1;
    },
    EditDriver(RowItem) {
      if (RowItem.id != 0) {
        this.SubView = 2;
        this.selectedTab = 1;
        this.GetDetailByNumber(RowItem.number);
        this.GetDetailList(RowItem.id);
        this.GetDriverInfo(RowItem.number);
        this.GetDriverReport(RowItem.id);
        server.GetLog({ content: RowItem.number }, (rows) => {
          this.LogList = rows;
        });
        return;
      }
    },
    EditOne(RowItem) {
      console.log("點擊編輯");
      this.selectedTab = 0;
      if (RowItem.id == 0) {
        this.SubView = 1;
        this.submitted = false;
        for (let key in this.customers) {
          this.customers[key] = "";
        }
        if (RowItem.isPickup == 2) {
          this.customers.isPickup = 2;
          this.customers.subType = "門市取貨";
        } else if (RowItem.isPickup == 3) {
          this.customers.isPickup = 3;
          this.customers.subType = "門市取貨派送";
        } else {
          this.customers.isPickup = 1;
          this.customers.subType = "配送單";
        }
        this.GetBuilderNumber();
        this.filelist = [];
        this.customers.id = 0;
        this.customersItem = [];
        this.customers.date2 = dayjs().format("YYYY-MM-DD");
        this.customers.time2 = dayjs().format("HH:mm:ss");

        this.driver.driverId = "";
        this.driver.carNumber = "";
        this.driver.assignDate = "";
        this.driver.assignUser = this.UserID;

        this.driver.filePath = "";
        this.driver.status = 0;
        this.driver.deliveryStatusList = [];
        this.driver.reportList = [];
        this.NewRow1();
        this.LogList = [];
        return;
      }
      if (RowItem.id != 0) {
        this.SubView = 2;

        this.GetDetailByNumber(RowItem.number);
        this.GetDetailList(RowItem.id);
        this.GetDriverInfo(RowItem.number);
        this.GetDriverReport(RowItem.id);
        server.GetLog({ content: RowItem.number }, (rows) => {
          this.LogList = rows;
        });
        return;
      }
    },
    EditShow(RowItem) {
      this.SubView = 3;
      console.log("EditShow", RowItem);
      //   狀態1已審2未/ {{ SubItem.status }} 配送狀態/{{
      //   formatdStatus(SubItem.dStatus)
      // }}
      // - {{ SubItem.dStatus }}

      this.GetDetailByNumber(RowItem.number);
      this.GetDetailList(RowItem.id);
      this.GetDriverInfo(RowItem.number);
      this.GetDriverReport(RowItem.id);
      server.GetLog({ content: RowItem.number }, (rows) => {
        this.LogList = rows;
      });
    },

    queryMaterialByRow(SubItem, cidx) {
      let wObj = {
        organId: this.customers.organId,
        depotId: SubItem.depotId,
        number: SubItem.number,
      };
      server.GetMaterialListByRow(wObj, (rows) => {
        //SubItem.queryMaterialList = rows;
        SubItem.queryMaterialList = rows.filter((x) => x.stock > 0);
        let F1List = rows.filter(
          (x) => String(x.number) == String(SubItem.number)
        );
        if (F1List.length != 0) {
          if (
            this.customers.organId != null &&
            this.customers.organId != "" &&
            SubItem.depotId != null &&
            SubItem.depotId != ""
          ) {
            this.MaterialSelectOneByRow(F1List[0], cidx);
          } else {
            alert("請先選擇 客戶/倉庫別");
            SubItem.name = "";
            this.MaterialSelectOneByRow(null, cidx);
          }
        } else {
          this.MaterialSelectOneByRow(null, cidx);
        }
      });
    },
    MaterialSelectOneByRow(MaterialSubItem, cidx) {
      //console.log("MaterialSelectOneByRow", cidx)
      if (MaterialSubItem != null) {
        this.customersItem[cidx].name = MaterialSubItem.name;
        this.customersItem[cidx].standard = MaterialSubItem.standard;
        this.customersItem[cidx].model = MaterialSubItem.model;
        this.customersItem[cidx].categoryName = MaterialSubItem.categoryName;
        this.customersItem[cidx].unit = MaterialSubItem.unit;
        this.customersItem[cidx].barCode = MaterialSubItem.mBarCode;
        this.customersItem[cidx].stock = MaterialSubItem.stock;
        this.customersItem[cidx].number = MaterialSubItem.number;
        this.customersItem[cidx].counterName = MaterialSubItem.counter;
        this.customersItem[cidx].operNumber =
          this.customersItem[cidx].operNumber || 1; //1,數量
        // this.SetMaterialModel(this.customersItem[cidx])
        // this.SetDepotStock(this.customersItem[cidx]);
      } else {
        //this.customersItem[cidx].name = MaterialSubItem.name;
        this.customersItem[cidx].standard = "";
        this.customersItem[cidx].model = "";
        this.customersItem[cidx].categoryName = "";
        this.customersItem[cidx].unit = "";
        this.customersItem[cidx].barCode = "";
        this.customersItem[cidx].stock = "";
        this.customersItem[cidx].number = "";
        this.customersItem[cidx].counterName = "";
        this.customersItem[cidx].operNumber = "";
        // this.SetMaterialModel(this.customersItem[cidx])
        // this.SetDepotStock(this.customersItem[cidx]);
      }
    },

    SetDepotStock(SubItem) {
      let depotId = SubItem.depotId || 0;
      let barCode = SubItem.barCode || "";
      let organId = this.customers.organId || "";
      this.FindStockByDepotAndBarCode(
        depotId,
        barCode,
        organId,
        (depotStock) => {
          if (depotStock != null) {
            SubItem.stock = depotStock.stock;
          }
        }
      );
    },
    SetMaterialModel(SubItem) {
      //let depotId = SubItem.depotId || 0;
      let barCode = SubItem.barCode || "";
      this.GetMaterialByBarCode(barCode, (Material1) => {
        if (Material1 != null && Material1.length != 0) {
          SubItem.model = Material1[0].model;
          SubItem.operNumber = SubItem.operNumber || 1; //1,數量

          SubItem.unitPrice = Material1[0].purchaseDecimal || 0; //"100",單價
          SubItem.allPrice = (SubItem.unitPrice || 0) * SubItem.operNumber; //100,總價
          SubItem.taxRate = SubItem.taxRate || 0; //0,稅率
          SubItem.taxMoney = Math.round(
            ((SubItem.taxMoney || 0) / 100) * SubItem.allPrice
          ); //0,稅價
          SubItem.taxLastMoney = SubItem.allPrice + SubItem.taxMoney; //100,含稅價

          this.CalPayMoney();
        }
      });
    },
    BatchExcelOut() {
      let NumberList = this.checkNumberList;
      let subIdList = this.checkSubIdList;
      //console.log(NumberList)

      if (NumberList == null || NumberList.length == 0) {
        alert("請至少選擇一個單據!");
        return;
      }

      let numberStr = `numbers=` + NumberList.join(",");
      let subIds = `subIds=` + subIdList.join(",");

      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      //let data1 = { number, type, isRecycle, brand }
      //let APIUrl = `/depotHead/export?number=${number}&type=${type}&isRecycle=${isRecycle}&brand=${brand}`;
      let APIUrl = `/depotHead/export/list?${numberStr}&${subIds}`;
      //console.log("APIUrl", APIUrl)
      server
        .get(APIUrl, { responseType: "blob" })
        .then((res) => {
          // console.log("res", res)
          if (res != null && res.data != null) {
            // console.log(res)
            // console.log(123123)
            var fileURL = window.URL.createObjectURL(new Blob([res.data]));
            var fileLink = document.createElement("a");
            fileLink.href = fileURL;
            fileLink.setAttribute(
              "download",
              `批次匯出配送單_${dayjs().format("YYYYMMDD_HHmmss")}.zip`
            );
            document.body.appendChild(fileLink);
            fileLink.click();
          }
          this.IsGetDataing = false;
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    ExcelOut() {
      // 匯出(家電、冷氣)確認書
      // /depotHead/export
      // 帶入參數
      // 配送單單號 String number
      // 匯出類型(1 家電 2 冷氣) int type
      // 舊機是否回收 0 否 1 是 boolean isRecycle
      // 舊機品牌(required = false) String brand

      let number = this.customers.number;
      let type =
        this.customersItem.filter((x) => x.categoryName == "冷氣").length != 0
          ? 1
          : 0;
      let isRecycle = 0; //先帶不回收
      let brand = ""; //先帶不回收
      // console.log(JSON.stringify(this.customers))
      // console.log(JSON.stringify(this.customersItem))

      //console.log(number, type, isRecycle, brand)

      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      //let data1 = { number, type, isRecycle, brand }
      //let APIUrl = `/depotHead/export?number=${number}&type=${type}&isRecycle=${isRecycle}&brand=${brand}`;
      let APIUrl = `/depotHead/export?number=${number}&type=${type}&isRecycle=${isRecycle}&brand=${brand}`;
      //console.log("APIUrl", APIUrl)
      server
        .get(APIUrl, { responseType: "blob" })
        .then((res) => {
          // console.log("res", res)
          if (res != null && res.data != null) {
            // console.log(res)
            // console.log(123123)
            var fileURL = window.URL.createObjectURL(new Blob([res.data]));
            var fileLink = document.createElement("a");
            fileLink.href = fileURL;
            fileLink.setAttribute("download", `匯出${number}.zip`);
            document.body.appendChild(fileLink);
            fileLink.click();
          }
          this.IsGetDataing = false;
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
      // let APIUrl = `/depotHead/export?number=${number}`;
      // server.get(APIUrl)
      //     .then((res) => {

      //         if (res != null && res.data != null && res.status == 200) {
      //             let jshdata = res.data.data;
      //             this.customers = jshdata;
      //             this.customers.date2 = dayjs(this.customers.operTime).format("YYYY-MM-DD");
      //             this.customers.time2 = dayjs(this.customers.operTime).format("HH:mm:ss");
      //             this.customers.mainArrival = dayjs(this.customers.mainArrival).isValid() ? dayjs(this.customers.mainArrival).format("YYYY-MM-DD") : null;
      //             this.customers.extrasArrival = dayjs(this.customers.extrasArrival).isValid() ? dayjs(this.customers.extrasArrival).format("YYYY-MM-DD") : null;
      //             this.customers.agreedDelivery = dayjs(this.customers.agreedDelivery).isValid() ? dayjs(this.customers.agreedDelivery).format("YYYY-MM-DD") : null;
      //             this.customers.delivered = dayjs(this.customers.delivered).isValid() ? dayjs(this.customers.delivered).format("YYYY-MM-DD") : null;

      //             this.filelist = this.customers.fileName.split(",").filter(x => x != '');
      //         }
      //     }).catch(function (error) {
      //         console.log("error", error);
      //     });
    },
    GetDetailByNumber(number) {
      ///jshERP-boot/depotHead/getDetailByNumber?number=CGRK00000000994
      let APIUrl = `/depotHead/getDetailByNumber?number=${number}`;
      server
        .get(APIUrl)
        .then((res) => {
          if (res != null && res.data != null && res.status == 200) {
            let jshdata = res.data.data;

            this.customers = jshdata;
            this.customers.date2 = dayjs(this.customers.operTime).format(
              "YYYY-MM-DD"
            );
            this.customers.time2 = dayjs(this.customers.operTime).format(
              "HH:mm:ss"
            );
            this.customers.mainArrival = dayjs(
              this.customers.mainArrival
            ).isValid()
              ? dayjs(this.customers.mainArrival).format("YYYY-MM-DD")
              : null;
            this.customers.extrasArrival = dayjs(
              this.customers.extrasArrival
            ).isValid()
              ? dayjs(this.customers.extrasArrival).format("YYYY-MM-DD")
              : null;
            this.customers.agreedDelivery = dayjs(
              this.customers.agreedDelivery
            ).isValid()
              ? dayjs(this.customers.agreedDelivery).format("YYYY-MM-DD")
              : null;
            this.customers.delivered = dayjs(this.customers.delivered).isValid()
              ? dayjs(this.customers.delivered).format("YYYY-MM-DD")
              : null;

            console.log("this.customers", this.customers);

            this.filelist = String(this.customers.fileName || "")
              .split(",")
              .filter((x) => x != "");
          }
        })
        .catch(function (error) {
          console.log("error", error);
        });
    },

    GetDetailList(headerId) {
      ///jshERP-boot/depotItem/getDetailList?headerId=289&mpList=%E5%88%B6%E9%80%A0%E5%95%86,%E8%87%AA%E5%AE%9A%E4%B9%891,%E8%87%AA%E5%AE%9A%E4%B9%892,%E8%87%AA%E5%AE%9A%E4%B9%893&linkType=basic&isReadOnly=1
      let APIUrl = `/depotItem/getDetailList?headerId=${headerId}&mpList=3&linkType=basic&isReadOnly=1`;
      server
        .get(APIUrl)
        .then((res) => {
          if (res != null && res.data != null && res.status == 200) {
            let jshdata = res.data.data;
            this.customersItem = jshdata.rows;
            for (let i = 0; i < this.customersItem.length; i++) {
              this.customersItem[i].number = this.customersItem[i].MNumber;
            }
            this.customersItem.pop();
          }
        })
        .catch(function (error) {
          console.log("error", error);
        });
    },

    GetBuilderNumber() {
      this.customers.defaultNumber = 0;
      ///jshERP-boot/sequence/buildNumber
      let APIUrl = `/sequence/buildNumber`;
      server
        .get(APIUrl)
        .then((res) => {
          //{"code":200,"data":{"defaultNumber":"00000000745"}}
          if (res != null && res.data != null && res.status == 200) {
            let jshdata = res.data.data;
            this.customers.defaultNumber = `S${jshdata.defaultNumber}`;
            //console.log('this.customers.defaultNumber', this.customers.defaultNumber)
          }
        })
        .catch(function (error) {
          console.log("error", error);
        });
    },
    GetMaxFileSize() {
      let APIUrl = `/systemConfig/fileSizeLimit`;
      server
        .get(APIUrl)
        .then((res) => {
          if (res != null && res.data != null && res.status == 200) {
            let jshdata = res.data.data;
            this.MaxFileSize = jshdata;
          }
        })
        .catch(function (error) {
          console.log("error", error);
        });
    },

    GetMaterialByBarCode(barCode, callback) {
      ///jshERP-boot/material/getMaterialByBarCode?barCode=33333344&mpList=%E5%88%B6%E9%80%A0%E5%95%86,%E8%87%AA%E5%AE%9A%E4%B9%891,%E8%87%AA%E5%AE%9A%E4%B9%892,%E8%87%AA%E5%AE%9A%E4%B9%893&prefixNo=CGRK
      let APIUrl = `/material/getMaterialByBarCode?barCode=${barCode}&mpList=`;
      server
        .get(APIUrl)
        .then((res) => {
          //{"code":200,"data":{"defaultNumber":"00000000745"}}
          if (res != null && res.data != null && res.status == 200) {
            let jshdata = res.data.data;
            callback(jshdata);
          }
        })
        .catch(function (error) {
          console.log("error", error);
          callback(null);
        });
    },
    FindStockByDepotAndBarCode(depotId, barCode, organId, callback) {
      ////jshERP-boot/depotItem/findStockByDepotAndBarCode?depotId=19&barCode=33333344
      let APIUrl = `/depotItem/findStockByDepotAndBarCode?depotId=${depotId}&barCode=${barCode}&organId=${organId}`;
      server
        .get(APIUrl)
        .then((res) => {
          //{"code":200,"data":{"defaultNumber":"00000000745"}}
          if (res != null && res.data != null && res.status == 200) {
            let jshdata = res.data.data;
            callback(jshdata);
          }
        })
        .catch(function (error) {
          console.log("error", error);
          callback(null);
        });
    },
    // SubCounterList(depotId) {
    //     if (depotId == null || depotId == '' || depotId == 0) return this.counterList;
    //     return this.counterList.filter(x => String(x.depotId) == String(depotId));
    // },

    // GetCounterList() {
    //     let APIUrl = `/depot/counter/getAllList?currentPage=1&pageSize=10000`;
    //     server.get(APIUrl)
    //         .then((res) => {
    //             console.log("res", res)
    //             if (res != null && res.data != null && res.status == 200) {
    //                 let jshdata = res.data.data;
    //                 this.counterList = jshdata.rows;
    //             }
    //         }).catch(function (error) {
    //             console.log("error", error);
    //         });
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
    GetUserList() {
      let APIUrl = `/user/getUserList`;
      server
        .get(APIUrl)
        .then((res) => {
          if (res != null && res.data != null && res.status == 200) {
            let jshdata = res.data;
            this.userlist = jshdata;
          }
        })
        .catch(function (error) {
          console.log("error", error);
        });
    },
    GetAccountList() {
      let APIUrl = `/account/getAccount`;
      server
        .get(APIUrl)
        .then((res) => {
          //console.log("GetAccountList", res, res.code, res.data)
          if (res != null && res.data != null && res.data.code == 200) {
            let jshdata = res.data.data;
            this.accountlist = jshdata.accountList;
          }
        })
        .catch(function (error) {
          console.log("error", error);
        });
    },
    CalPayMoney() {
      if (this.customersItemAllPrice == 0) {
        this.customers.discountLastMone = 0;
        this.customers.changeAmount = 0;
        this.customers.debt = 0;
        return;
      }

      // this.customers.discount=  "12",
      // this.customers.discountMoney=  3.24,
      this.customers.discountLastMoney =
        this.customersItemAllPrice - this.customers.discountMoney;
      //this.customers.otherMoney=  "55"
      this.customers.changeAmount =
        this.customers.discountLastMoney + this.customers.otherMoney;
      this.customers.debt = 0;
    },
    GetDriverReport(headerId) {
      // 新增api -> 取得司機回報歷程功能 get
      // /jshERP-boot/depotHead/getDeliveryReport?headerId=62
      // headerId : 配送單id
      let APIUrl = `/depotHead/getDeliveryReport`;
      let APIParameter = `?headerId=${headerId}`;
      this.driver.reportList = [];
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
            for (let i = 0; i < jshdata.length; i++) {
              this.driver.reportList.push(jshdata[i]);
            }
          }
        })
        .catch(function (error) {
          console.log("error", error);

          return;
        });
    },
    GetDriverInfo(number) {
      // 配送單頁面，新增api -> 配送單狀態、配送狀態 get
      // /jshERP-boot/depotHead/getDeliveryData?number=S20231214235904

      let APIUrl = `/depotHead/getDeliveryData`;
      let APIParameter = `?number=${number}`;

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
            console.log("jshdata", jshdata);
            this.driver.driverId = jshdata.driverId;
            this.driver.carNumber = jshdata.carNumber;
            this.driver.assignDate = dayjs(jshdata.takeDate).format(
              "YYYY-MM-DD"
            );
            this.driver.assignUser = jshdata.assignUser;

            this.driver.filePath = jshdata.filePath;
            this.driver.status = Number(jshdata.status);
            this.driver.deliveryStatusList = jshdata.deliveryStatusList;
            this.driver.filelist = [];
            if (this.driver.filePath != null && this.driver.filePath != "") {
              this.driver.filelist = String(this.driver.filePath).split(",");
            }
          } else {
            alert(res.data.data);
          }
        })
        .catch(function (error) {
          console.log("error", error);

          return;
        });
    },
    GetData() {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      let APIUrl = `/depotHead/list`;

      //{"type":"入库","subType":"采购","roleType":"全部数据","number":"111","materialParam":"222","createTimeRange":["2023-03-01T09:11:47.965Z","2023-04-20T09:11:47.965Z"],"beginTime":"2023-03-01","endTime":"2023-04-20"}
      //"beginTime":"2023-03-01","endTime":"2023-03-02"

      //let queryStr = `{"type":"出庫","number":"${this.number}","materialParam":"${this.materialParam}","beginTime":"${this.beginTime}","endTime":"${this.endTime}","depotId":"${this.depotId}","organId":"${this.organId}"}`;
      let queryStr = `{"type":"出庫","subType":"${this.subType}","number":"${this.number}","MNumber":"${this.mNumber}","materialParam":"${this.materialParam}","organId":"${this.organId}","beginTime":"${this.beginTime}","endTime":"${this.endTime}","depotId":"${this.depotId}","keyword":"${this.queryKeyword}","dStatus":"${this.dStatus}"}`;
      // if (
      //   this.subType !== "" ||
      //   this.number !== "" ||
      //   this.mNumber !== "" ||
      //   this.materialParam !== "" ||
      //   this.organId !== "" ||
      //   this.beginTime !== "" ||
      //   this.endTime !== "" ||
      //   this.depotId !== "" ||
      //   this.queryKeyword !== ""
      // ) {
      //   this.currentPage = 1;
      // }
      console.log("currentPage", this.currentPage);
      let APIParameter = `?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;
      APIParameter += `&search=${encodeURIComponent(queryStr)}`;
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
            this.customersData = JSON.parse(JSON.stringify(jshdata.rows));
            console.log("this.customersData", this.customersData);
            this.totalRows = JSON.parse(JSON.stringify(jshdata.total));
            this.maxPage =
              Math.ceil(this.totalRows / this.pageSize) == 0
                ? 1
                : Math.ceil(this.totalRows / this.pageSize);
          }
          this.IsGetDataing = false;
          // console.log("this.customersData", this.customersData);
          for (let i = 0; i < this.customersData.length; i++) {
            if (this.checkSubIdList.includes(this.customersData[i].subId)) {
              this.customersData[i].chk = true;
            }
          }
          //console.log("datalist:", this.customersData)

          setTimeout(() => {
            if (this.$route.hash && this.$route.hash !== null) {
              const splitArray = this.$route.hash
                .split("#")
                .join("")
                .split("&");
              const number = splitArray[0];
              const id = splitArray[1];
              this.directToDriverTab(number, id);
            }
          }, 100);
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    AddData(data1) {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;

      data1.agreedDelivery = dayjs(data1.agreedDelivery).isValid()
        ? dayjs(data1.agreedDelivery).format("YYYY-MM-DD")
        : null;
      data1.delivered = dayjs(data1.delivered).isValid()
        ? dayjs(data1.delivered).format("YYYY-MM-DD")
        : null;

      let APIUrl = `/depotHead/addDepotHeadAndDetail`;
      server
        .post(APIUrl, data1)
        .then((res) => {
          if (res != null && res.data != null) {
            if (res.data.code == 200) {
              this.showModal = false;
              this.$nextTick(() => {
                this.SubView = 0;
                this.GetData();
              });
            } else {
              alert(res.data.data.message);
              //{"code":8000021,"data":{"message":"客單編號/原始客編重覆建立"}}
            }
          }

          this.IsGetDataing = false;
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    UpdData(data1) {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;

      data1.agreedDelivery = dayjs(data1.agreedDelivery).isValid()
        ? dayjs(data1.agreedDelivery).format("YYYY-MM-DD")
        : null;
      data1.delivered = dayjs(data1.delivered).isValid()
        ? dayjs(data1.delivered).format("YYYY-MM-DD")
        : null;

      let APIUrl = `/depotHead/updateDepotHeadAndDetail`;
      server
        .put(APIUrl, data1)
        .then((res) => {
          if (res != null && res.data != null) {
            if (res.data.code == 200) {
              this.showModal = false;
              this.$nextTick(() => {
                this.SubView = 0;
                this.GetData();
              });
            } else {
              alert(res.data.data.message);
              //{"code":8000021,"data":{"message":"客單編號/原始客編重覆建立"}}
            }
          }
          this.IsGetDataing = false;
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    ExcelIn() {
      let file1 = this.$refs.fileexcelin.files[0];

      let APIUrl = `depotHead/importExcel`;

      if (file1.size > this.MaxFileSize) {
        return;
      }
      const formData = new FormData();
      //formData.append('biz', "biz");
      formData.append("file", file1);
      server
        .post(APIUrl, formData)
        .then((res) => {
          console.log("res", res);
          if (res != null && res.data != null && res.data.code == 200) {
            //let jshdata = res.data;
            let dataMsg = res.data.data;
            console.log("dataMsg", dataMsg);
            //console.log(jshdata.data)
            //callback(jshdata.data)
            // {    "code": 200,
            // "data": "匯入成功, 匯入失敗列數:\nExcel文件第1列->此筆資料重覆匯入(客單編號:20231025, 原始編號:1)\nExcel文件第2列->此筆資料重覆匯入(客單編號:20231025-1, 原始編號:2)\nExcel文件第3列->發單日未填寫\n"}
            alert(common.replaceAll(dataMsg, "'", ""));

            setTimeout(() => {
              this.GetData();
            }, 3000);
          } else if (res != null && res.data != null && res.data.code != 200) {
            console.log("else if file", res.data.data);
            alert(res.data.data);
          }
        })
        .catch(function (error) {
          console.log("error", error);
          alert(error);
          //callback(null)
          return;
        });
    },
    handleFileUpload: function () {
      for (let i = 0; i < this.$refs.file2.files.length; i++) {
        //this.filelist.push(this.$refs.file2.files[i]);
        //console.log("file1", i, this.$refs.file2.files[i].name, this.$refs.file2.files[i])
        let file1 = this.$refs.file2.files[i];
        if (file1.size <= this.MaxFileSize) {
          this.UploadFile1("bill", file1, (uploadPath) => {
            if (uploadPath != null) {
              this.filelist.push(uploadPath);
            }
          });
        }
      }
      this.$refs.file2.value = "";
    },
    UploadFile1(biz, file1, callback) {
      //http://w66.ddns.net:9955/jshERP-boot/systemConfig/upload

      let APIUrl = `/systemConfig/upload`;
      const formData = new FormData();
      formData.append("biz", biz);
      formData.append("file", file1);
      server
        .post(APIUrl, formData)
        .then((res) => {
          if (res != null && res.data != null && res.data.code == 200) {
            let jshdata = res.data;
            callback(jshdata.data);
          }
        })
        .catch(function (error) {
          console.log("error", error);
          callback(null);
          return;
        });
    },
    CheckIsImage(ImageUrl) {
      let filename = ImageUrl;
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
      const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
      if (imageExtensions.includes(extension)) {
        return true;
      }
      return false;
    },
    CheckIsVideo(ImageUrl) {
      let filename = ImageUrl;
      const imageExtensions = [".mp4", ".mov"];
      const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
      if (imageExtensions.includes(extension)) {
        return true;
      }
      return false;
    },
    ShowImage(ImageUrl) {
      let filename = ImageUrl;

      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
      const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
      if (imageExtensions.includes(extension)) {
        this.showImageURL = filename;
        this.showVideoURL = "";
        this.showImageModal = true;
      } else if ([".mp4", ".mov"].includes(extension)) {
        this.showImageURL = "";
        this.showVideoURL = filename;
        this.showImageModal = true;
        const video = this.$refs.videoPlayer;
        if (video) {
          this.$nextTick(() => {
            video.style.width = "100%";
            video.style.height = `auto`;
            video.src = this.showVideoURL;
            video.play();
          });
        }
      } else {
        console.log("else file");
        window.open(filename, "file1");
      }
    },
    GetAccessFile1(UrlPath1) {
      console.log("UrlPath1", UrlPath1);

      let APIUrl = `${
        import.meta.env.VITE_APP_API_URL
      }/systemConfig/static/${UrlPath1}`;
      return APIUrl;
    },
    DeleteFile1(file1) {
      const filteredArray = this.filelist.filter((obj) => !(obj === file1));

      this.filelist = filteredArray;
    },
    DeleteFile2(file1) {
      const filteredArray = this.driver.filelist.filter(
        (obj) => !(obj === file1)
      );

      this.driver.filelist = filteredArray;
    },
    // 批次匯出揀貨單
    handleExportPicking() {
      let NumberList = this.checkNumberList;
      let subIdList = this.checkSubIdList;
      //console.log(NumberList)

      if (NumberList == null || NumberList.length == 0) {
        alert("請至少選擇一個單據!");
        return;
      }

      let numberStr = `numbers=` + NumberList.join(",");
      let subIds = `subIds=` + subIdList.join(",");
      console.log("numberStr", numberStr);
      console.log("subIds", subIds);
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      //let data1 = { number, type, isRecycle, brand }
      //let APIUrl = `/depotHead/export?number=${number}&type=${type}&isRecycle=${isRecycle}&brand=${brand}`;
      let APIUrl = `/depotHead/exportPicking?${numberStr}&${subIds}`;

      //console.log("APIUrl", APIUrl)
      server
        .get(APIUrl, { responseType: "blob" })
        .then((res) => {
          // console.log("Content-Type", res.headers["content-type"]);
          if (res.headers["content-type"] == "application/json;charset=UTF-8") {
            const reader = new FileReader();
            reader.readAsText(res.data, "utf-8");
            reader.onload = () => {
              // console.log("result", reader.result);
              const data = JSON.parse(reader.result);
              // console.log("data", data);
              alert(data.data.message);
            };
          } else {
            // console.log("res", res)
            if (res != null && res.data != null) {
              // console.log(123123)
              var fileURL = window.URL.createObjectURL(
                new Blob([res.data], {
                  type: "application/octet-stream",
                })
              );
              // console.log("fileURL", fileURL);
              var fileLink = document.createElement("a");
              fileLink.href = fileURL;
              fileLink.download = `${dayjs().format(
                "YYYYMMDDHHmmss"
              )}配送單-揀貨總表.xlsx`;
              // fileLink.setAttribute(
              //   "download",
              //   `批次匯出揀貨單_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`
              // );
              document.body.appendChild(fileLink);
              fileLink.click();
            }
          }
          this.IsGetDataing = false;
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    // 查詢記錄
    handleSearchRecode() {
      const headerId = this.customers.id;
      const APIUrl = `/depotHead/getDeliveryAgreedData?headerId=${headerId}`;
      server.get(APIUrl).then((res) => {
        console.log("res", res.data.data);

        this.searchRecode = res.data.data;

        this.openRecodeModel = true;
      });
    },
    // 判斷數量是否大於庫存
    checkCount(item) {
      item.allPrice = item.operNumber * item.unitPrice;
      console.log("item", item);
      if (item.operNumber > item.stock) {
        alert("數量大於庫存，請重新輸入");
        item.operNumber = item.stock;
      }
    },
    downloadAllFiles(fileList) {
      fileList.forEach((url) => {
        // const fileUrl = this.GetAccessFile1(url);
        // console.log("fileUrl", fileUrl);
        this.downloadFile(url);
      });
    },
    // 下載文件的方法
    // 下載文件的方法
    downloadFile(url) {
      fetch(url)
        .then((response) => {
          // 检查响应是否成功
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob(); // 将响应转换为 Blob
        })
        .then((blob) => {
          const fileURL = window.URL.createObjectURL(blob);
          const fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", `${url.split("/").pop()}`); // 获取文件名
          document.body.appendChild(fileLink);
          fileLink.click();
          fileLink.remove(); // 清理 DOM
          window.URL.revokeObjectURL(fileURL); // 释放对象 URL
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    },
    // 直接跳轉至司機派單及回報
    directToDriverTab(number, id) {
      this.EditShow({ number, id });
      this.selectedTab = 1;
    },
    // 點擊勾選
    clickCheckbox(item) {
      if (
        item.chk &&
        !this.checkNumberList.includes(item.number) &&
        !this.checkSubIdList.includes(item.subId)
      ) {
        this.checkNumberList.push(item.number);
        this.checkSubIdList.push(item.subId);
      } else {
        // 取消勾選時，從陣列中移除item
        this.checkNumberList = this.checkNumberList.filter(
          (number) => number !== item.number
        );
        this.checkSubIdList = this.checkSubIdList.filter(
          (subId) => subId !== item.subId
        );
      }
    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader
      :title="title + (SubView == 0 ? '列表' : '明細')"
      :items="items"
    />
    <div class="row my-1" v-show="SubView == 0">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-6">
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <div style="display: flex; align-items: center; gap: 5px">
                      <label for="name">關鍵字搜尋</label>
                      <a-tooltip>
                        <template #title
                          >例如：收件人、電話、手機、地址、客戶、客戶全名、商品名稱、商品規格、商品型號、建單人員</template
                        >
                        <InfoCircleOutlined
                          style="color: #556ee6; margin-bottom: 0.5rem"
                        />
                      </a-tooltip>
                    </div>
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      placeholder="關鍵字"
                      v-model="queryKeyword"
                      @keyup.enter="
                        this.currentPage = 1;
                        GetData();
                      "
                    />
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <div style="display: flex; align-items: center; gap: 5px">
                      <label for="name">單號</label>
                      <a-tooltip>
                        <template #title
                          >例如：單號、客單編號、原始客編</template
                        >
                        <InfoCircleOutlined
                          style="color: #556ee6; margin-bottom: 0.5rem"
                        />
                      </a-tooltip>
                    </div>

                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      placeholder="單號"
                      v-model="number"
                      @keyup.enter="
                        this.currentPage = 1;
                        GetData();
                      "
                    />
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <label for="name">品號</label>
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      placeholder="品號"
                      v-model="mNumber"
                      @keyup.enter="
                        this.currentPage = 1;
                        GetData();
                      "
                    />
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block" v-if="false">
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
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <label for="name">客戶</label>
                    <select
                      class="form-select"
                      v-model="organId"
                      @change="
                        this.currentPage = 1;
                        GetData();
                      "
                    >
                      <option value="">全部客戶</option>
                      <option
                        :value="u1.id"
                        selected
                        v-for="u1 in supplierlist"
                        :key="'organId' + u1.id"
                      >
                        {{ u1.supplier }}
                      </option>
                    </select>
                  </div>
                </div>
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
                  <label for="name">配送類別</label>
                  <select
                    class="form-select"
                    v-model="subType"
                    @change="
                      this.currentPage = 1;
                      GetData();
                    "
                  >
                    <option
                      :value="u1.id"
                      selected
                      v-for="u1 in [
                        { id: '', name: '全部' },
                        { id: '配送單', name: '配送單' },
                        { id: '門市取貨', name: '門市取貨' },
                        { id: '門市取貨派送', name: '門市取貨派送' },
                      ]"
                      :key="'query_subType_id' + u1.id"
                    >
                      {{ u1.name }}
                    </option>
                  </select>
                </div>
                <div class="search-box mb-2 d-inline-block" style="width: 25%">
                  <label for="name">配送狀態</label>
                  <select
                    class="form-select"
                    v-model="dStatus"
                    @change="
                      this.currentPage = 1;
                      GetData();
                    "
                  >
                    <option value="" selected>請選擇</option>
                    <option
                      v-for="status in dStatusOption"
                      :key="status.value"
                      :value="status.value"
                      selected
                    >
                      {{ status.name }}
                    </option>
                  </select>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <label for="name">起始日期</label>
                    <b-form-input
                      id="date"
                      v-model="beginTime"
                      type="date"
                      aria-placeholder="日期"
                    ></b-form-input>
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <label for="name">結束日期</label>
                    <b-form-input
                      id="date"
                      v-model="endTime"
                      type="date"
                      aria-placeholder="日期"
                    ></b-form-input>
                  </div>
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
              <div class="col-sm-6">
                <div class="text-sm-end actions">
                  <button
                    type="button"
                    class="btn btn-rounded mb-2 me-2 add-delivery"
                    @click="EditOne({ id: 0, isPickup: 1 })"
                  >
                    <i class="mdi mdi-plus me-1"></i> 新增配送單
                  </button>
                  <ImportFile
                    :buttonName="'匯入配送單'"
                    :apiLink="'depotHead/importExcel'"
                    @importSuccess="setData"
                    class="import-delivery"
                  />

                  <button
                    type="button"
                    class="btn btn-pickup btn-rounded mb-2 me-2 add-pickup-delivery"
                    @click="EditOne({ id: 0, isPickup: 3 })"
                  >
                    <i class="mdi mdi-plus me-1"></i> 新增門市取貨派送
                  </button>
                  <ImportFile
                    :buttonName="'匯入門市取貨派送'"
                    :apiLink="'depotHead/importPickupExcel'"
                    @importSuccess="setData"
                    class="import-pickup"
                  />
                  <button
                    type="button"
                    class="btn btn-primary btn-rounded mb-2 me-2 add-pickup"
                    @click="EditOne({ id: 0, isPickup: 2 })"
                  >
                    <i class="mdi mdi-plus me-1"></i> 新增門市取貨
                  </button>
                  <!-- <button
                    type="button"
                    class="btn btn-success btn-rounded mb-2 me-2"
                    @click="handleClickUpload"
                  >
                    匯入配送單
                  </button> -->

                  <button
                    type="button"
                    class="btn btn-success btn-rounded btn-batch mb-2 me-2 batch-export"
                    @click="BatchExcelOut"
                  >
                    批次匯出
                  </button>
                  <button
                    type="button"
                    class="btn btn-success btn-rounded btn-export-picking mb-2 me-2 export-picking"
                    @click="handleExportPicking"
                  >
                    匯出揀貨單
                  </button>
                  <input
                    ref="fileexcelin"
                    type="file"
                    class="d-none"
                    accept=".xls,.xlsx"
                    v-on:change="ExcelIn()"
                  />
                </div>
              </div>
              <!-- end col-->
            </div>
            <div class="table-responsive">
              <table class="table table-centered table-nowrap align-middle">
                <thead>
                  <tr>
                    <th width="5px">
                      <input type="checkbox" v-model="chkAll" />
                    </th>
                    <th width="5px">#</th>
                    <th width="10%">客戶</th>
                    <th width="10%">單號</th>
                    <th width="10%">客單編號</th>
                    <th width="10%">原始客編</th>
                    <th width="10%">品號</th>
                    <th width="15%">商品資料</th>
                    <th>倉庫別</th>
                    <th>儲位</th>
                    <th>數量</th>
                    <th>狀態</th>
                    <th>配送狀態</th>
                    <th>配送類別</th>
                    <th>建單人員</th>
                    <th>建立時間</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(SubItem, cidx) in customersData"
                    :key="'customersData' + cidx"
                  >
                    <td>
                      <input
                        type="checkbox"
                        v-model="SubItem.chk"
                        @change="clickCheckbox(SubItem)"
                      />
                    </td>
                    <td>{{ (currentPage - 1) * pageSize + cidx + 1 }}</td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.organName }}
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.number }}
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.customNumber }}
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.sourceNumber }}
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.mNumber }}
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      <div
                        v-for="name1 in String(SubItem.materialsList).split(
                          ','
                        )"
                        :key="'SubItem' + cidx + name1"
                      >
                        {{ name1 }}
                      </div>
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.depotName }}
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.counterName }}
                    </td>

                    <td>{{ SubItem.materialCount }}</td>

                    <td>
                      <div class="btn-group btn-group-sm">
                        <span class="btn btn-success" v-if="SubItem.status == 1"
                          >已審核</span
                        >
                        <span class="btn btn-danger" v-if="SubItem.status == 0"
                          >未審核</span
                        >
                      </div>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <span
                          class="btn"
                          :class="formatdStatusCSS(SubItem.dStatus)"
                        >
                          {{ formatdStatus(SubItem.dStatus) }}
                        </span>
                      </div>
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.subType }}
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.userName }}
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.createTime }}
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <a
                          class="btn btn-info"
                          href="#"
                          @click="EditShow(SubItem)"
                          >查看</a
                        >
                        <a
                          v-if="SubItem.dStatus != 6 && SubItem.dStatus != 7"
                          class="btn btn-secondary"
                          href="#"
                          @click="EditOne(SubItem)"
                          >編輯</a
                        >
                        <a
                          class="btn btn-success"
                          href="#"
                          v-if="SubItem.status == 1 && SubItem.dStatus == 0"
                          @click="EditDriver(SubItem)"
                          >派發司機</a
                        >
                      </div>
                    </td>
                  </tr>
                </tbody>
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
    <b-tabs
      content-class="py-3 text-muted"
      v-if="SubView != 0"
      v-model="selectedTab"
    >
      <b-tab active class="border-0">
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i class="fas fa-home"></i>
          </span>
          <span class="d-none d-sm-inline-block">配送單基本資料</span>
        </template>

        <div
          class="row my-1"
          v-if="SubView == 1 || SubView == 2 || SubView == 3"
        >
          <div class="col-lg-62">
            <div class="card">
              <div class="card-body">
                <div class="card-title mb-4" style="display: flex; gap: 8px">
                  <h5>{{ EditOneTitle }}</h5>
                  <span style="color: #f46a6a">
                    {{
                      this.customers.subType == "門市取貨"
                        ? `(不入庫不扣公司庫存,單純取貨待通知配送)`
                        : this.customers.subType == "門市取貨派送"
                        ? `(1.當天門市取貨當天直接派送 2.門市取貨後待配送時間使用 3.不扣公司庫存)`
                        : ""
                    }}</span
                  >
                </div>

                <b-form>
                  <div class="row py-1">
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <label for="name">客單編號</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        v-model.trim="customers.customNumber"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <label for="name">原始客編</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        v-model.trim="customers.sourceNumber"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                  </div>
                  <div class="row py-1">
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <label for="name">客戶</label>
                      <select
                        class="form-select"
                        v-model="customers.organId"
                        @change="InitEveryRowsProduct"
                        :disabled="this.SubView == 3"
                      >
                        <option
                          :value="u1.id"
                          selected
                          v-for="u1 in supplierlist"
                          :disabled="!u1.enabled"
                          :key="'customers_organId' + u1.id"
                        >
                          {{ u1.idname }}
                        </option>
                      </select>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <label for="name">單號</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        placeholder="單號"
                        readonly
                        v-model="customers.defaultNumber"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <label for="name">日期</label>
                      <input
                        autocomplete="off"
                        type="date"
                        class="form-control"
                        placeholder="日期"
                        v-model="customers.date2"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <label for="name">時間</label>
                      <input
                        autocomplete="off"
                        type="time"
                        class="form-control"
                        placeholder="時間"
                        v-model="customers.time2"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                  </div>
                  <div class="row py-1">
                    <div class="col-sm-12">
                      <div class="table-responsive detail-table">
                        <table
                          class="table table-centered table-bordered table-nowrap align-middle"
                        >
                          <thead>
                            <tr>
                              <th width="5%">#</th>
                              <th width="20%">倉庫</th>
                              <th width="20%">品號</th>
                              <th width="20%">商品</th>
                              <th width="10%">類別</th>
                              <th width="8%">規格</th>
                              <th width="8%">型號</th>
                              <th width="8%">庫存</th>
                              <th width="10%">儲位</th>
                              <th width="15%">數量</th>
                              <th width="15%">備註</th>
                              <th width="10%" v-if="false">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(SubItem, cidx) in customersItem"
                              :key="SubItem.id"
                            >
                              <td>
                                {{ (currentPage - 1) * pageSize + cidx + 1 }}
                              </td>
                              <td>
                                <div v-if="IsPickup1 && this.SubView !== 3">
                                  <select
                                    class="form-select"
                                    v-model="SubItem.depotId"
                                    @change="
                                      SubItem.number = '';
                                      SubItem.name = '';
                                      queryMaterialByRow(SubItem, cidx);
                                    "
                                  >
                                    <option
                                      :value="u1.id"
                                      selected
                                      v-for="u1 in depotList"
                                      :key="'customers_depot_id' + cidx + u1.id"
                                    >
                                      {{ u1.depotName }}
                                    </option>
                                  </select>
                                </div>
                                <div v-else>
                                  {{ customers.subType }}
                                </div>
                              </td>
                              <td>
                                <!-- 品號 -->
                                <div
                                  class="position-relative"
                                  v-if="IsPickup1 && this.SubView !== 3"
                                >
                                  <a-select
                                    v-model:value="SubItem.number"
                                    placeholder="請選擇"
                                    show-search
                                    :filter-option="filterOption"
                                    @keyup="queryMaterialByRow(SubItem, cidx)"
                                    @select="queryMaterialByRow(SubItem, cidx)"
                                  >
                                    <a-select-option
                                      v-for="option in SubItem.queryMaterialList"
                                      :key="option.id"
                                      :value="option.number"
                                      >{{ option.number }}</a-select-option
                                    >
                                  </a-select>
                                  <!-- <input
                                    autocomplete="off"
                                    type="text"
                                    class="form-control"
                                    :list="'datalistOptions' + cidx"
                                    @keyup="queryMaterialByRow(SubItem, cidx)"
                                    v-model="SubItem.number"
                                  />

                                  <datalist :id="'datalistOptions' + cidx">
                                    <option
                                      v-for="(
                                        q1, qdx
                                      ) in SubItem.queryMaterialList"
                                      :value="q1.number"
                                      :key="'customer_name_list' + cidx + qdx"
                                    >
                                      {{ q1.number }}
                                    </option>
                                  </datalist> -->
                                </div>
                                <div v-else>-</div>
                              </td>
                              <td>
                                <div v-if="IsPickup1">
                                  {{ SubItem.name }}
                                </div>
                                <input
                                  autocomplete="off"
                                  type="text"
                                  class="form-control"
                                  v-else-if="this.SubView == 1"
                                  v-model="SubItem.materialName"
                                />
                                <span v-else>{{ SubItem.materialName }}</span>
                              </td>

                              <td>{{ SubItem.categoryName }}</td>
                              <td>{{ SubItem.standard }}</td>
                              <td>{{ SubItem.model }}</td>
                              <td>{{ SubItem.stock }}</td>
                              <td>
                                <input
                                  autocomplete="off"
                                  type="text"
                                  class="form-control"
                                  v-if="IsPickup1"
                                  v-model="SubItem.counterName"
                                />
                              </td>

                              <td>
                                <input
                                  autocomplete="off"
                                  type="number"
                                  class="form-control"
                                  placeholder="數量"
                                  v-model="SubItem.operNumber"
                                  :max="SubItem.stock"
                                  v-if="this.SubView !== 3"
                                />
                                <span v-else>{{ SubItem.operNumber }}</span>
                              </td>

                              <td>
                                <input
                                  autocomplete="off"
                                  type="text"
                                  class="form-control"
                                  placeholder="備註"
                                  v-model="SubItem.remark"
                                  v-if="this.SubView !== 3"
                                />

                                <span v-else>{{ SubItem.remark }}</span>
                              </td>
                              <!-- v-if="SubView == 1 || SubView == 2" -->
                              <td v-if="false">
                                <div class="button-items">
                                  <a
                                    href="#"
                                    class="btn btn-sm btn-danger"
                                    @click="DeleteRow1(SubItem)"
                                    >刪除</a
                                  >
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <!-- v-if="SubView == 1 || SubView == 2" -->
                        <a
                          href="#"
                          class="btn btn-sm btn-success"
                          v-if="false"
                          @click="NewRow1()"
                          >新增一列商品資料</a
                        >
                      </div>
                    </div>
                  </div>
                  <div class="row" v-if="customers.subType == '門市取貨派送'">
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <label for="name">取貨人</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        v-model="customers.storeMan"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <label for="name">門市名稱</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        v-model="customers.storeName"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <label for="name">門市位置</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        v-model="customers.storeAddress"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-3">
                      <label for="name">電話</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        v-model="customers.storePhone"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                  </div>
                  <div class="row py-1">
                    <div class="col-sm-12 col-md-4 col-lg-3 my-1">
                      <label for="name">主商品到貨日</label>
                      <input
                        autocomplete="off"
                        type="date"
                        class="form-control"
                        placeholder="主商品到貨日"
                        v-model="customers.mainArrival"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-3 my-1">
                      <label for="name">贈品到貨日</label>
                      <input
                        autocomplete="off"
                        type="date"
                        class="form-control"
                        placeholder="贈品到貨日"
                        v-model="customers.extrasArrival"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-3 my-1">
                      <label for="name">約配日</label>
                      <input
                        autocomplete="off"
                        type="date"
                        class="form-control"
                        placeholder="約配日"
                        v-model="customers.agreedDelivery"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                    <!-- <div class="col-sm-12 col-md-4 col-lg-3 my-1">
                      <label for="name">配達日</label>
                      <input
                        autocomplete="off"
                        type="date"
                        class="form-control"
                        placeholder="配達日"
                        v-model="customers.delivered"
                      />
                    </div> -->
                  </div>
                  <div class="row py-1">
                    <div class="col-sm-12 col-md-4 col-lg-3 my-1">
                      <label for="name">收件人名稱</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        placeholder="收件人名稱"
                        v-model="customers.receiveName"
                        :class="{
                          'is-invalid':
                            submitted && v$.customers.receiveName.$error,
                        }"
                        :disabled="this.SubView == 3"
                      />
                      <div
                        v-if="submitted && v$.customers.receiveName.$error"
                        class="invalid-feedback"
                      >
                        <span
                          v-if="v$.customers.receiveName.required.$message"
                          >{{
                            v$.customers.receiveName.required.$message
                          }}</span
                        >
                      </div>
                    </div>

                    <div class="col-sm-12 col-md-4 col-lg-3 my-1">
                      <label for="name">手機</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        v-maska="'####-###-###'"
                        placeholder="####-###-###"
                        v-model="customers.cellphone"
                        :class="{
                          'is-invalid':
                            submitted && v$.customers.cellphone.$error,
                        }"
                        :disabled="this.SubView == 3"
                      />
                      <div
                        v-if="submitted && v$.customers.cellphone.$error"
                        class="invalid-feedback"
                      >
                        <span v-if="v$.customers.cellphone.required.$message">{{
                          v$.customers.cellphone.required.$message
                        }}</span>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-3 my-1">
                      <label for="name">地址</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        placeholder="地址"
                        v-model="customers.address"
                        :class="{
                          'is-invalid':
                            submitted && v$.customers.address.$error,
                        }"
                        :disabled="this.SubView == 3"
                      />
                      <div
                        v-if="submitted && v$.customers.address.$error"
                        class="invalid-feedback"
                      >
                        <span v-if="v$.customers.address.required.$message">{{
                          v$.customers.address.required.$message
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="row py-1">
                    <div class="col-sm-12 col-md-6 col-lg-3 my-1">
                      <label for="name">安裝方式</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        v-model="customers.install"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-3 my-1">
                      <label for="name">舊機回收(是/否)</label>
                      <select
                        class="form-select"
                        v-model="customers.recycle"
                        :class="{
                          'is-invalid':
                            submitted && v$.customers.recycle.$error,
                        }"
                        :disabled="this.SubView == 3"
                      >
                        <option value="" selected>&nbsp;</option>
                        <option value="是">是</option>
                        <option value="否">否</option>
                      </select>
                      <div
                        v-if="submitted && v$.customers.recycle.$error"
                        class="invalid-feedback"
                        :class="{
                          'is-invalid':
                            submitted && v$.customers.recycle.$error,
                        }"
                      >
                        <span v-if="v$.customers.recycle.required.$message">{{
                          v$.customers.recycle.required.$message
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="row py-1">
                    <div class="col-sm-12 my-1">
                      <label for="name">備註</label>
                      <input
                        autocomplete="off"
                        type="text"
                        class="form-control"
                        placeholder="備註"
                        v-model="customers.remark"
                        :disabled="this.SubView == 3"
                      />
                    </div>
                  </div>
                  <div class="row py-1">
                    <div
                      class="col-sm-12 my-1"
                      v-if="SubView == 1 || SubView == 2"
                    >
                      <b-button variant="light" class="w-sm">
                        <i
                          class="mdi mdi-upload d-block font-size-16"
                          @click="$refs.file2.click()"
                        ></i>
                        上傳檔案
                      </b-button>
                      <span class="text-danger">
                        最大檔案大小:
                        {{ Math.floor(MaxFileSize / 1024 / 1024) }} MB</span
                      >
                      <input
                        autocomplete="off"
                        ref="file2"
                        type="file"
                        class="d-none"
                        multiple
                        v-on:change="handleFileUpload()"
                      />
                    </div>
                    <div class="col-sm-12 mt-1 my-1">
                      <label for="name" v-if="SubView == 3">上傳檔案</label>
                      <div
                        v-for="(f1, fidx) in filelist"
                        :key="'filelist-' + fidx"
                        style="display: inline-block; word-break: break-all"
                      >
                        <img
                          v-if="CheckIsImage(f1)"
                          :src="f1"
                          @click="ShowImage(f1)"
                          style="max-width: 100px; max-height: 100px"
                        />
                        <img
                          class="logo-bank"
                          v-else-if="CheckIsVideo(f1)"
                          style="max-width: 100px; max-height: 100px"
                          src="/images/playvideo.jpg"
                          @click="ShowImage(f1)"
                        />
                        <a
                          style="
                            word-break: break-all;
                            display: block;
                            max-width: 100px;
                          "
                          v-else
                          href="#"
                          @click="ShowImage(f1)"
                          >{{ f1.split("/").pop() }}</a
                        >
                        <a href="#" class="text-danger" @click="DeleteFile1(f1)"
                          >&nbsp;<i class="bx bx-x"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                </b-form>
              </div>
            </div>
          </div>
        </div>
      </b-tab>
      <b-tab v-if="this.customers.id != 0">
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i class="far fa-user"></i>
          </span>
          <span class="d-none d-sm-inline-block">司機派單及回報</span>
        </template>

        <div class="row py-1">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="row py-1">
                  <div class="col-lg-3">
                    <div class="mb-3">
                      <label class="form-label" for="subject">指派司機</label>
                      <div class="input-group">
                        <span class="input-group-text"
                          ><i class="bx bx-user"></i
                        ></span>
                        <select
                          class="form-select"
                          v-model="driver.driverId"
                          @change="GetDriverCarNumber()"
                        >
                          <option
                            :value="u1.id"
                            selected
                            v-for="u1 in [
                              { id: '', idname: '' },
                              ...driverlist,
                            ]"
                            :key="'driver_driverlist' + u1.id"
                          >
                            {{ u1.idname }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3">
                    <div class="mb-3">
                      <label class="form-label" for="subject">車牌號碼</label>
                      <div class="input-group">
                        <div class="input-group-text">
                          <i class="bx bxs-truck"></i>
                        </div>
                        <input
                          type="text"
                          class="form-control"
                          v-model="driver.carNumber"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div class="mb-3">
                      <label class="form-label" for="productname"
                        >指派日期</label
                      >
                      <div class="input-group">
                        <span class="input-group-text"
                          ><i class="mdi mdi-calendar"></i
                        ></span>
                        <input
                          type="date"
                          class="form-control"
                          v-model="driver.assignDate"
                          data-date-format="yyyy-mm-dd"
                          data-date-container="#datepicker2"
                          data-provide="datepicker"
                        />
                      </div>
                      <!-- input-group -->
                    </div>
                  </div>
                  <div class="col-lg-2">
                    <div class="mb-3">
                      <label class="form-label">指派人員</label>
                      <div class="input-group">
                        <select class="form-select" v-model="driver.assignUser">
                          <option
                            :value="u1.id"
                            selected
                            v-for="u1 in [
                              { id: '', userName: '' },
                              ...userlist,
                            ]"
                            :key="'driver_userlist' + u1.id"
                          >
                            {{ u1.userName }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div
                    class="col-lg-2"
                    style="
                      display: flex;
                      justify-content: flex-start;
                      align-items: center;
                    "
                  >
                    <!-- <label class="form-label" for="message">&nbsp;</label><br />
                    <div class="btn-group">
                      <a
                        href="#"
                        class="btn btn-danger btn-block"
                        v-if="driver.status == 0"
                        @click="AssignDriver()"
                        >快速派發</a
                      >
                      <a
                        href="#"
                        class="btn btn-light btn-block"
                        v-if="driver.status != 0"
                        >已指派</a
                      >
                      <a
                        href="#"
                        class="btn btn-success btn-block"
                        v-if="driver.status != 0 && driver.status != 5"
                        @click="ReAssignDriver()"
                        >重新指派</a
                      >
                    </div> -->
                    <a-tag color="#108ee9" v-if="driver.status != 0"
                      >已指派</a-tag
                    >
                  </div>
                </div>

                <hr />
                <div class="row mb-2">
                  <div class="col-sm-12">
                    <div class="flex-1 overflow-hidden">
                      <h5 class="text-bold mb-1" style="font-weight: bold">
                        <i class="bx bx-info-circle"></i> 配送狀態
                      </h5>
                    </div>
                  </div>
                  <div class="col-sm-12 bg-light pt-3 pb-3">
                    <div class="row py-1">
                      <div class="col-lg-3">
                        <div class="mb-3">
                          <label class="form-label" for="subject">
                            <input
                              class="form-check-input"
                              :checked="driver.status >= 2"
                              type="checkbox"
                              id="formCheck1"
                            />
                            接單</label
                          >
                          <div class="input-group">
                            <span class="input-group-text"
                              ><i class="mdi mdi-calendar"></i
                            ></span>
                            <input
                              type="text"
                              class="form-control"
                              disabled
                              data-date-format="yyyy-mm-dd"
                              :value="GetDriverDay(2)"
                              data-date-container="#datepicker2"
                              data-provide="datepicker"
                            />
                          </div>
                          <!-- input-group -->
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="mb-3">
                          <label class="form-label in-contact" for="subject">
                            <div>
                              <input
                                class="form-check-input"
                                :checked="driver.status >= 3"
                                type="checkbox"
                                id="formCheck1"
                              />
                              聯絡中
                            </div>
                            <button @click="handleSearchRecode">
                              查詢約配紀錄
                            </button>
                          </label>
                          <div class="input-group">
                            <span class="input-group-text"
                              ><i class="mdi mdi-calendar"></i
                            ></span>
                            <input
                              type="text"
                              class="form-control"
                              disabled
                              data-date-format="yyyy-mm-dd"
                              :value="GetDriverDay(3)"
                              data-date-container="#datepicker2"
                              data-provide="datepicker"
                            />
                          </div>
                          <!-- input-group -->
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="mb-3">
                          <label class="form-label" for="productname"
                            ><input
                              class="form-check-input"
                              :checked="driver.status >= 4"
                              type="checkbox"
                              id="formCheck1"
                            />
                            運送中</label
                          >
                          <div class="input-group">
                            <span class="input-group-text"
                              ><i class="mdi mdi-calendar"></i
                            ></span>
                            <input
                              type="text"
                              class="form-control"
                              disabled
                              data-date-format="yyyy-mm-dd"
                              :value="GetDriverDay(4)"
                              data-date-container="#datepicker2"
                              data-provide="datepicker"
                            />
                          </div>
                          <!-- input-group -->
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="mb-3">
                          <label class="form-label"
                            ><input
                              class="form-check-input"
                              :checked="driver.status >= 5"
                              type="checkbox"
                              id="formCheck1"
                            />
                            完成派單</label
                          >
                          <div class="input-group">
                            <span class="input-group-text"
                              ><i class="mdi mdi-calendar"></i
                            ></span>
                            <input
                              type="text"
                              class="form-control"
                              disabled
                              data-date-format="yyyy-mm-dd"
                              :value="GetDriverDay(5)"
                              data-date-container="#datepicker2"
                              data-provide="datepicker"
                            />
                          </div>
                          <!-- input-group -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />
                <div class="row mb-2">
                  <div class="col-sm-12">
                    <div class="flex-1 overflow-hidden">
                      <h5 class="text-bold mb-1" style="font-weight: bold">
                        <i class="bx bxs-message-alt-dots"></i> 司機回報區
                      </h5>
                    </div>
                  </div>
                  <div
                    class="col-sm-12 bg-light pt-3 pb-3"
                    v-for="r1 in driver.reportList"
                    :key="'reportList_' + r1.id"
                  >
                    <div class="row mb-3">
                      <div class="col-2">
                        <div class="input-group">
                          <span class="input-group-text"
                            ><i class="mdi mdi-calendar"></i
                          ></span>
                          <input
                            type="text"
                            class="form-control text-center"
                            readonly
                            :value="formatDate(r1.datetime)"
                            data-date-format="yyyy-mm-dd"
                            data-date-container="#datepicker3"
                            data-provide="datepicker"
                          />
                        </div>
                        <!-- input-group -->
                      </div>
                      <div class="col-2">
                        <div class="input-group">
                          <input
                            class="form-control text-center"
                            type="text"
                            readonly
                            :value="formatTime(r1.datetime)"
                          />
                        </div>
                      </div>
                      <div class="col-8">
                        <textarea
                          id="message"
                          class="form-control mb-2"
                          rows="3"
                          v-model="r1.message"
                          readonly
                        ></textarea>
                        <textarea
                          id="message"
                          class="form-control"
                          rows="3"
                          v-model="r1.feedback"
                        ></textarea>
                        <a
                          href="#"
                          class="btn btn-primary"
                          @click="SendFeedback(r1)"
                          >客服回覆保存</a
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <hr />
                <div class="row mb-2">
                  <div class="col-sm-12">
                    <div class="flex-1 overflow-hidden upload-section mb-3">
                      <h5 class="text-bold" style="font-weight: bold">
                        <i class="bx bx-folder-open"></i> 圖片影片及附件
                      </h5>

                      <a-button
                        type="primary"
                        @click="downloadAllFiles(driver.filelist)"
                        >全部下載</a-button
                      >
                    </div>
                  </div>
                  <div class="col-sm-12 bg-light pt-3 pb-3">
                    <div class="me-2 mb-2 d-inline-block">
                      <div
                        v-for="(f1, fidx) in driver.filelist"
                        :key="'driver-filelist-' + fidx"
                        style="
                          display: inline-block;
                          word-break: break-all;
                          margin: 10px;
                        "
                      >
                        <img
                          v-if="CheckIsImage(f1)"
                          :src="f1"
                          @click="ShowImage(f1)"
                          style="max-width: 100px; max-height: 100px"
                        />
                        <img
                          class="logo-bank"
                          v-else-if="CheckIsVideo(f1)"
                          style="max-width: 100px; max-height: 100px"
                          src="/images/playvideo.jpg"
                          @click="ShowImage(f1)"
                        />
                        <a
                          style="
                            word-break: break-all;
                            display: block;
                            max-width: 100px;
                          "
                          v-else
                          href="#"
                          @click="ShowImage(f1)"
                          >{{ f1.split("/").pop() }}</a
                        >
                        <!-- <a href="#" class="text-danger" @click="DeleteFile2(f1)"
                          >&nbsp;<i class="bx bx-x"></i
                        ></a> -->
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="row mb-2" v-if="false">
                  <div class="col-sm-12">
                    <div class="flex-1 overflow-hidden">
                      <h5 class="text-bold mb-1" style="font-weight: bold">
                        <i class="bx bx-video"></i> 影片上傳專區
                      </h5>
                    </div>
                  </div>
                  <div class="col-sm-12 bg-light pt-3 pb-3">
                    <div class="me-2 mb-2 d-inline-block">
                      <img src="" style="max-width: 100px; max-height: 100px" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-tab>
    </b-tabs>
    <div
      class="loglist"
      v-if="SubView != 0 && LogList.length != 0 && selectedTab == 0"
    >
      <table
        class="table table-centered table-bordered table-nowrap align-middle"
      >
        <tr>
          <th class="text-center" width="50px">#</th>
          <th width="150px">操作時間</th>
          <th width="150px">操作人員</th>
          <th>操作詳情</th>
        </tr>
        <tr v-for="(log1, logidx) in LogList" :key="'LogList' + logidx">
          <td class="text-center">{{ logidx + 1 }}</td>
          <td>{{ log1.createTimeStr }}</td>
          <td>{{ log1.loginName }}({{ log1.userName }})</td>
          <td>{{ log1.content }}</td>
        </tr>
      </table>
    </div>
    <div>
      <div class="button-items">
        <!-- 配送單基本資料 -->
        <a
          href="#"
          class="btn btn-primary"
          @click="handleSubmit"
          v-if="SubView == 1 && selectedTab == 0"
          >新增</a
        >
        <a
          href="#"
          class="btn btn-primary"
          @click="handleSubmit"
          v-if="SubView == 2 && selectedTab == 0"
          >保存</a
        >
        <a
          href="#"
          class="btn btn-success"
          @click="
            customers.status = 1;
            handleSubmit();
          "
          v-if="SubView == 2 && customers.status == 0 && selectedTab == 0"
          >保存並審核</a
        >
        <a
          href="#"
          class="btn btn-warning"
          @click="
            customers.status = 0;
            handleSubmit();
          "
          v-if="
            SubView == 3 &&
            customers.status == 1 &&
            (driver.status == 0 || driver.status == null) &&
            selectedTab == 0
          "
          >修改</a
        >
        <a
          href="#"
          class="btn btn-success"
          @click="ExcelOut"
          v-if="SubView == 3 && selectedTab == 0"
          >匯出</a
        >

        <!-- 司機派單及回報 -->
        <a
          href="#"
          class="btn btn-danger btn-block"
          v-if="driver.status == 0 && selectedTab == 1"
          @click="AssignDriver()"
          >快速派發</a
        >
        <a
          href="#"
          class="btn btn-primary btn-block"
          v-if="
            driver.status != 0 &&
            driver.status != 5 &&
            driver.status != 6 &&
            driver.status != 7 &&
            selectedTab == 1
          "
          @click="ReAssignDriver()"
          >重新指派</a
        >
        <a
          href="#"
          class="btn btn-secondary"
          @click="
            SubView = 0;
            selectedTab = 0;

            GetData();
          "
          v-if="SubView != 0"
          >返回</a
        >
      </div>
    </div>
    <b-modal
      v-model="showImageModal"
      title="顯示圖片"
      title-class="text-black font-18"
      body-class="p-3 my-2"
      hide-footer
    >
      <swiper
        :navigation="true"
        :modules="modules"
        class="swiper"
        :centeredSlides="true"
      >
        <swiper-slide v-for="(file, index) in driver.filelist" :key="index"
          ><img
            v-if="CheckIsImage(file)"
            :src="file"
            style="max-width: 320px; max-height: 50%"
          />
          <img
            class="logo-bank"
            v-else-if="CheckIsVideo(file)"
            style="max-width: 320px; max-height: 50%"
            src="/images/playvideo.jpg"
          />
          <a
            style="word-break: break-all; display: block; max-width: 50%"
            v-else
            href="#"
            >{{ file.split("/").pop() }}</a
          ></swiper-slide
        >
      </swiper>
      <form v-if="false">
        <div class="row text-center">
          <div class="col-12" v-if="showImageURL != ''">
            <img
              :src="showImageURL"
              max-width="100%"
              max-height="100%"
              style="max-width: 100%; max-height: calc(100vh - 100px)"
            />
          </div>
          <div class="col-12" v-show="showVideoURL != ''">
            <video
              ref="videoPlayer"
              playsinline
              controls
              preload="auto"
              autoplay
              loop
              muted
              style="max-width: 100%; max-height: calc(100vh - 100px)"
            >
              <source :src="showVideoURL" type="video/mp4" />
              您的瀏覽器不支援影片格式
            </video>
          </div>
        </div>

        <div class="text-end pt-5 mt-3">
          <b-button variant="light" @click="showImageModal = false"
            >關閉</b-button
          >
        </div>
      </form>
    </b-modal>
    <a-modal
      v-model:open="openRecodeModel"
      title="查詢約配紀錄"
      :footer="false"
      :destroyOnClose="true"
      :maskClosable="true"
    >
      <span class="search-recode-text">{{
        searchRecode.length == 0 ? "查無資料" : ""
      }}</span>
      <div
        class="search-recode-table"
        v-if="searchRecode && searchRecode.length > 0"
      >
        <table class="table">
          <thead>
            <tr>
              <th
                scope="col"
                v-for="(col, index) in recodeColumns"
                :key="index"
              >
                {{ col.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in searchRecode" :key="index">
              <td style="width: 50px">{{ index + 1 }}</td>
              <td>{{ item.datetime }}</td>
              <td>{{ item.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-modal>
    <!-- end row -->
  </Layout>
</template>

<style scoped>
.detail-table > .table {
  width: 100%;
  table-layout: fixed;
  margin-top: 15px;
  overflow-x: auto;
}

.detail-table > .table th,
.detail-table > .table td {
  white-space: normal !important;
}

.table-responsive > .table th,
.table-responsive > .table td {
  padding: 0.5rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* 新增配送單 */
.add-delivery {
  background-color: #2a6189 !important;
  border: 1px solid #2a6189 !important;
  color: #fff !important;
}

/* 新增門市取貨派送 */
.add-pickup-delivery {
  background-color: #559ee6 !important;
  border: 1px solid #559ee6 !important;
  color: #fff !important;
}

/* 新增門市取貨 */
.add-pickup {
  background-color: #e4903b !important;
  border: 1px solid #e4903b !important;
  color: #fff !important;
}

/* 批次匯入 */
.batch-export {
  background-color: #802670 !important;
  border: 1px solid #802670 !important;
  color: #fff !important;
}

/* 匯出揀貨單 */
.export-picking {
  background-color: #46966a !important;
  border: 1px solid #46966a !important;
  color: #fff !important;
}

.upload-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.upload-section h5 {
  margin: 0 !important;
}

.all-download {
  padding: 2px 8px;
  border: 1px solid #000;
  border-radius: 4px;
}

:deep(.ant-select) {
  width: 100%;
}

:deep(.swiper-slide) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
