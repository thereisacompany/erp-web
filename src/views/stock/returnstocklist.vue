<script>
import Layout from "@/layouts/index.vue";
import PageHeader from "@/components/page-header.vue";
import dayjs from "dayjs";

import useVuelidate from "@vuelidate/core";

import { server } from "@/api";
import common from "@/api/common";

import appConfig from "@/app.config";
import { Select, SelectOption } from "ant-design-vue";

/**
 * Customers component
 */
export default {
  page: {
    title: "退貨單",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    ASelect: Select,
    ASelectOption: SelectOption,
  },
  data() {
    return {
      selectedTab: 0,
      chkAll: true,
      SubView: 0,

      materialParam: "",
      queryKeyword: "",
      depotId: "",
      number: "",
      mNumber: "",
      subType: "退貨",
      beginTime: "",
      endTime: "",
      MaxFileSize: 0,
      userlist: [],
      accountlist: [],
      organId: "",
      supplierlist: [],

      depotList: [],
      // counterList: [],
      filelist: [],
      customersData: [],
      customersItem: [],
      customersItem_selectindex: -1,
      materialsList: [],
      title: "退貨單",
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
          text: "退貨單",
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
        subType: "退貨", //"采购"
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
      },

      name: "",
      remark: "",

      LogList: [],

      IsGetDataing: false,
      pageSize: 50,
      totalRows: 0,
      currentPage: 1,
      maxPage: 10,
    };
  },
  computed: {
    IsPickup1() {
      if (this.customers.subType == "退貨") return true;
      return false;
    },
    EditOneTitle() {
      let SubTitle =
        this.SubView == 1 ? "新增" : this.SubView == 2 ? "修改" : "查看";
      SubTitle = SubTitle + this.customers.subType + "單";
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

  mounted() {
    this.$nextTick(() => {
      this.GetUserList(); //負責人列表
      //this.GetAccountList();//結算人帳號列表
      //this.GetSupplierList();
      server.GetSupplierList((rows) => {
        this.supplierlist = rows;
      });

      this.GetDepotList(); //倉庫別
      // this.GetCounterList();//儲位別
      this.GetMaxFileSize();
      this.GetData();
    });
  },

  watch: {
    chkAll: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          for (let i = 0; i < this.customersData.length; i++) {
            this.customersData[i].chk = newVal;
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
      this.v$.$touch();
      if (this.v$.$invalid) {
        return;
      } else {
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
            return;
          }
          this.UpdData({
            info: JSON.stringify(aObj),
            rows: JSON.stringify(bObj),
          });
        }
      }
      this.submitted = false;
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

    EditOne(RowItem) {
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
          this.customers.subType = "退貨";
        }
        this.GetBuilderNumber();
        this.filelist = [];
        this.customers.id = 0;
        this.customersItem = [];
        this.customers.date2 = dayjs().format("YYYY-MM-DD");
        this.customers.time2 = dayjs().format("HH:mm:ss");

        this.NewRow1();
        this.LogList = [];
        return;
      }
      if (RowItem.id != 0) {
        this.SubView = 2;

        this.GetDetailByNumber(RowItem.number);
        this.GetDetailList(RowItem.id);
        server.GetLog({ content: RowItem.number }, (rows) => {
          this.LogList = rows;
        });
        return;
      }
    },
    EditShow(RowItem) {
      this.SubView = 3;
      this.GetDetailByNumber(RowItem.number);
      this.GetDetailList(RowItem.id);

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
      let NumberList = this.customersData
        .filter((x) => x.chk == true)
        .map((y) => y.number);
      let subIdList = this.customersData
        .filter((x) => x.chk == true)
        .map((y) => y.subId);
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
              `批次匯出退貨單_${dayjs().format("YYYYMMDD_HHmmss")}.zip`
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

    GetData() {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      let APIUrl = `/depotHead/list`;
      let APIParameter = `?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;
      //{"type":"入库","subType":"采购","roleType":"全部数据","number":"111","materialParam":"222","createTimeRange":["2023-03-01T09:11:47.965Z","2023-04-20T09:11:47.965Z"],"beginTime":"2023-03-01","endTime":"2023-04-20"}
      //"beginTime":"2023-03-01","endTime":"2023-03-02"

      //let queryStr = `{"type":"出庫","number":"${this.number}","materialParam":"${this.materialParam}","beginTime":"${this.beginTime}","endTime":"${this.endTime}","depotId":"${this.depotId}","organId":"${this.organId}"}`;
      let queryStr = `{"type":"出庫","subType":"${this.subType}","number":"${this.number}","MNumber":"${this.mNumber}","materialParam":"${this.materialParam}","organId":"${this.organId}","beginTime":"${this.beginTime}","endTime":"${this.endTime}","depotId":"${this.depotId}","keyword":"${this.queryKeyword}"}`;

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
            this.totalRows = JSON.parse(JSON.stringify(jshdata.total));
            this.maxPage =
              Math.ceil(this.totalRows / this.pageSize) == 0
                ? 1
                : Math.ceil(this.totalRows / this.pageSize);
          }
          this.IsGetDataing = false;
          for (let i = 0; i < this.customersData.length; i++) {
            this.customersData[i].chk = this.chkAll;
          }
          //console.log("datalist:", this.customersData)
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
        window.open(filename, "file1");
      }
    },
    GetAccessFile1(UrlPath1) {
      ///systemConfig/static/

      let APIUrl = `${
        import.meta.env.VITE_APP_API_URL
      }/systemConfig/static/${UrlPath1}`;
      return APIUrl;
    },
    DeleteFile1(file1) {
      const filteredArray = this.filelist.filter((obj) => !(obj === file1));

      this.filelist = filteredArray;
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
    <div class="row" v-show="SubView == 0">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-8">
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <label for="name">關鍵字搜尋</label>
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
                    <label for="name">退貨單號</label>
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      placeholder="退貨單號"
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
              <div class="col-sm-4">
                <div class="text-sm-end">
                  <button
                    type="button"
                    class="btn btn-success btn-rounded mb-2 me-2"
                    @click="EditOne({ id: 0, isPickup: 1 })"
                  >
                    <i class="mdi mdi-plus me-1"></i> 新增退貨單
                  </button>

                  <button
                    type="button"
                    class="btn btn-success btn-rounded mb-2 me-2"
                    @click="BatchExcelOut"
                  >
                    批次匯出
                  </button>
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

                    <th width="10%">品號</th>
                    <th width="15%">商品資料</th>
                    <th>倉庫別</th>
                    <th>儲位</th>
                    <th>數量</th>
                    <th>狀態</th>

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
                    <td><input type="checkbox" v-model="SubItem.chk" /></td>
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

                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.userName }}
                    </td>
                    <td
                      style="white-space: break-spaces; word-break: break-all"
                    >
                      {{ SubItem.operTimeStr }}
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <a
                          class="btn btn-info"
                          href="javascript:;"
                          @click="EditShow(SubItem)"
                          >查看</a
                        >
                        <a
                          class="btn btn-secondary"
                          href="javascript:;"
                          @click="EditOne(SubItem)"
                          >編輯</a
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

    <div class="row" v-if="SubView == 1 || SubView == 2 || SubView == 3">
      <div class="col-lg-62">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">{{ EditOneTitle }}</h4>
            <b-form>
              <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-3">
                  <label for="name">客戶</label>
                  <select
                    class="form-select"
                    v-model="customers.organId"
                    @change="InitEveryRowsProduct"
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
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <div class="table-responsive">
                    <table
                      class="table table-centered table-bordered table-nowrap align-middle"
                    >
                      <thead>
                        <tr>
                          <th width="1%">#</th>
                          <th width="10%">倉庫</th>
                          <th width="10%">品號</th>
                          <th width="15%">商品</th>
                          <th width="5%">類別</th>
                          <th width="5%">規格</th>
                          <th width="5%">型號</th>
                          <th width="5%">庫存</th>
                          <th width="10%">儲位</th>
                          <th width="5%">數量</th>
                          <th width="10%">備註</th>
                          <th width="1%">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(SubItem, cidx) in customersItem"
                          :key="SubItem.id"
                        >
                          <td>{{ (currentPage - 1) * pageSize + cidx + 1 }}</td>
                          <td>
                            <div v-if="IsPickup1">
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
                            <div class="position-relative" v-if="IsPickup1">
                              <a-select
                                :disabled="
                                  (SubView == 2 && !SubItem.isNewAdd) ||
                                  SubView == 3
                                "
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
                                  v-for="(q1, qdx) in SubItem.queryMaterialList"
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
                            <div v-if="IsPickup1">{{ SubItem.name }}</div>
                            <input
                              autocomplete="off"
                              v-else
                              type="text"
                              class="form-control"
                              v-model="SubItem.materialName"
                            />
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
                              type="text"
                              class="form-control"
                              placeholder="數量"
                              @change="
                                SubItem.allPrice =
                                  SubItem.operNumber * SubItem.unitPrice
                              "
                              v-model="SubItem.operNumber"
                            />
                          </td>

                          <td>
                            <input
                              autocomplete="off"
                              type="text"
                              class="form-control"
                              placeholder="備註"
                              v-model="SubItem.remark"
                            />
                          </td>

                          <td>
                            <div class="button-items">
                              <a
                                href="javascript:;"
                                class="btn btn-sm btn-danger"
                                v-if="SubView == 1 || SubView == 2"
                                @click="DeleteRow1(SubItem)"
                                >刪除</a
                              >
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <a
                      href="javascript:;"
                      class="btn btn-sm btn-success"
                      v-if="SubView == 1 || SubView == 2"
                      @click="NewRow1()"
                      >新增一列商品資料</a
                    >
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12">
                  <label for="name">備註</label>
                  <input
                    autocomplete="off"
                    type="text"
                    class="form-control"
                    placeholder="備註"
                    v-model="customers.remark"
                  />
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-sm-12" v-if="SubView == 1 || SubView == 2">
                  <b-button
                    variant="light"
                    class="w-sm"
                    @click="$refs.file2.click()"
                  >
                    <i class="mdi mdi-upload d-block font-size-16"></i>
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
                <div class="col-sm-12 mt-1">
                  <label v-if="filelist.length == 0 && SubView != 1" for="name"
                    >上傳檔案</label
                  >
                  <div v-if="filelist.length == 0 && SubView != 1">
                    目前無檔案
                  </div>
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
                      href="javascript:;"
                      @click="ShowImage(f1)"
                      >{{ f1.split("/").pop() }}</a
                    >
                    <a
                      href="javascript:;"
                      class="text-danger"
                      @click="DeleteFile1(f1)"
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
    <div class="loglist" v-if="SubView != 0 && LogList.length != 0">
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
        <a
          href="javascript:;"
          class="btn btn-primary"
          @click="handleSubmit"
          v-if="SubView == 1"
          >新增</a
        >
        <a
          href="javascript:;"
          class="btn btn-primary"
          @click="handleSubmit"
          v-if="SubView == 2"
          >保存</a
        >
        <a
          href="javascript:;"
          class="btn btn-success"
          @click="
            customers.status = 1;
            handleSubmit();
          "
          v-if="SubView == 2"
          >保存並審核</a
        >
        <a
          href="javascript:;"
          class="btn btn-warning"
          @click="
            customers.status = 0;
            handleSubmit();
          "
          v-if="SubView == 3 && customers.status == 1"
          >修改</a
        >
        <a
          href="javascript:;"
          class="btn btn-success"
          @click="ExcelOut"
          v-if="SubView == 3"
          >匯出</a
        >
        <a
          href="javascript:;"
          class="btn btn-secondary"
          @click="
            SubView = 0;
            GetData();
          "
          v-if="SubView != 0"
          >返回</a
        >
      </div>
    </div>
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

    <!-- end row -->
  </Layout>
</template>
<style scoped>
:deep(.ant-select) {
  width: 100%;
}
</style>
