<script>
import Layout from "@/layouts/index.vue";
import PageHeader from "@/components/page-header.vue";

import { required, helpers, minLength, maxLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import { server } from "@/api";
import common from "@/api/common";

import appConfig from "@/app.config";
import ImportFile from "@/components/importFile.vue";
/**
 * Customers component
 */
export default {
  page: {
    title: "人事管理",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader, ImportFile },
  data() {
    return {
      MaxFileSize: 1000,
      customersData: [],
      title: "人事管理",
      items: [
        {
          text: "人事管理",
          href: "javascript:;",
        },
        {
          text: "人事管理",
          href: "javascript:;",
        },
        {
          text: "人事列表",
          active: true,
        },
      ],
      showModal: false,
      submitted: false,
      showImageModal: false,
      showImageURL: "",
      VehicleList: [],
      customers: {
        id: "",
        supplier: "",
        supplierall: "",
        contacts: "",
        telephone: "",
        phoneNum: "",
        emergencyPhone: "",
        licensPlate: "",
        email: "",
        enabled: "",
        address: "",
        licensePlate: "",
        loginName: "",
        loginPassword: "",
        type: "司機",
        groupInsuranceStart: "", // date  '團保加保日',
        groupInsuranceEnd: "", // date  '團保退保日',
        laborHealthInsuranceStart: "", // date  '勞健保加保日',
        laborHealthInsuranceEnd: "", // date  '勞健保退保日',
        onboarding: "", // date  '入職日',
        resign: "", // date  '離職日',
        idNumber: "", // varchar(10)  '身分證字號',
        birthday: "", // date  '出生年月日',
        license: "", // varchar(255)  '駕照',
      },
      type: "全部類別",
      typelist: ["家電-司機", "家電-助手", "冷氣-師傅", "冷氣-助手", "行政"],
      supplier: "",
      telephone: "",
      phoneNum: "",
      filelist: [],
      IsGetDataing: false,
      pageSize: 30,
      totalRows: 0,
      currentPage: 1,
      maxPage: 10,
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations: {
    customers: {
      supplier: {
        required: helpers.withMessage("請填寫姓名", required),
      },

      type: {
        required: helpers.withMessage("請選擇人事類別", required),
      },

      loginPassword: {
        // 使用 `minLength` 规则，但添加 `optional` 选项，以便在 loginPassword 为空时不执行 minLength 验证规则
        minLength: helpers.withMessage("請輸入6-12位密碼", minLength(6), {
          unless: (value) => value !== "",
        }),
        maxLength: helpers.withMessage("請輸入6-12位密碼", maxLength(12), {
          unless: (value) => value !== "",
        }),
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setData();
    });
  },
  methods: {
    setData() {
      console.log("setData");
      this.GetMaxFileSize();
      this.GetVehiclelist();
      this.GetData();
    },
    formatPadLeftZero(str, len) {
      if (str == null || str == "") return "";
      return common.PadLeftZero(str, len);
    },
    GetVehiclelist() {
      let APIUrl = `/vehicle/list`;
      let APIParameter = `?currentPage=1&pageSize=1000`;
      let queryStr = `{"licensePlateNumber":"","brandModel":"","driver":""}`;
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
            let list2 = jshdata.rows;
            list2.sort((a, b) => {
              // First, sort by driverName being empty
              if (!a.driverName && b.driverName) {
                return -1; // a should come before b
              } else if (a.driverName && !b.driverName) {
                return 1; // b should come before a
              }

              // If both have empty driverName or both have non-empty driverName, sort by licensePlateNumber
              return a.licensePlateNumber.localeCompare(b.licensePlateNumber);
            });

            this.VehicleList = [];
            for (let i = 0; i < list2.length; i++) {
              let driverName = "";
              if (list2[i].driverName != null && list2[i].driverName != "")
                driverName =
                  " / " +
                  this.formatPadLeftZero(list2[i].driver, 3) +
                  " " +
                  list2[i].driverName;
              this.VehicleList.push({
                licensePlateNumber: list2[i].licensePlateNumber,
                driverName,
              });
            }
          }
        })
        .catch(function (error) {
          console.log("error", error);
          return;
        });
    },
    /**
     * Modal form submit
     */
    // eslint-disable-next-line no-unused-vars
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      //console.log(this.customers.type, this.customers.loginName + 'aaa')
      // if (this.customers.type == '家電-司機') {
      //   if (this.customers.loginName == '') {
      //     alert("司機請填寫登入帳號和密碼!")
      //     return;
      //   }

      //   if (this.customers.id == 0 && this.customers.loginPassword == '') {
      //     alert("請輸入登入密碼!")
      //     return;
      //   }
      // }
      this.v$.$touch();
      if (this.v$.$invalid) {
        return;
      } else {
        this.customers.license = this.filelist.join(",");

        if (this.customers.id == 0) {
          this.AddData(this.customers);
        } else if (this.customers.id > 0) {
          this.UpdData(this.customers);
        }
      }

      this.submitted = false;
    },
    EditOne(RowItem) {
      console.log("EditOne", RowItem);

      if (RowItem.id == null || RowItem.id == 0) {
        this.customers.id = 0;
        this.customers.supplier = "";
        this.customers.supplierall = "";
        this.customers.contacts = "";
        this.customers.telephone = "";
        this.customers.phoneNum = "";
        this.customers.email = "";
        this.customers.enabled = true;
        this.customers.address = "";
        this.customers.licensePlate = "";
        this.customers.emergencyPhone = "";
        this.customers.licensPlate = "";
        this.customers.loginName = "";
        this.customers.loginPassword = "";
        this.customers.type = "";
        this.customers.groupInsuranceStart = "";
        this.customers.groupInsuranceEnd = "";
        this.customers.laborHealthInsuranceStart = "";
        this.customers.laborHealthInsuranceEnd = "";
        this.customers.onboarding = "";
        this.customers.resign = "";
        this.customers.idNumber = "";
        this.customers.birthday = "";
        this.customers.license = "";
        this.filelist = [];
      } else {
        this.customers.id = RowItem.id;
        this.customers.supplier = RowItem.supplier;
        this.customers.supplierall = RowItem.supplierall;
        this.customers.contacts = RowItem.contacts;
        this.customers.telephone = RowItem.telephone;
        this.customers.phoneNum = RowItem.phoneNum;
        this.customers.email = RowItem.email;
        this.customers.enabled = RowItem.enabled;
        this.customers.address = RowItem.address;
        this.customers.licensePlate = RowItem.licensePlate;
        this.customers.emergencyPhone = RowItem.emergencyPhone;
        this.customers.licensPlate = RowItem.licensPlate;

        this.customers.loginName = RowItem.loginName;
        this.customers.loginPassword = "";
        this.customers.type = RowItem.type;

        this.customers.groupInsuranceStart = RowItem.groupInsuranceStart; //: '',// date  '團保加保日',
        this.customers.groupInsuranceEnd = RowItem.groupInsuranceEnd; //: '',// date  '團保退保日',
        this.customers.laborHealthInsuranceStart =
          RowItem.laborHealthInsuranceStart; //: '',// date  '勞健保加保日',
        this.customers.laborHealthInsuranceEnd =
          RowItem.laborHealthInsuranceEnd; //: '',// date  '勞健保退保日',
        this.customers.onboarding = RowItem.onboarding; //: '',// date  '入職日',
        this.customers.resign = RowItem.resign; //: '',// date  '離職日',
        this.customers.idNumber = RowItem.idNumber; //: '',// varchar(10)  '身分證字號',
        this.customers.birthday = RowItem.birthday; //: '',// date  '出生年月日',
        this.customers.license = RowItem.license; //: '',// varchar(255)  '駕照',

        this.filelist = String(this.customers.license || "")
          .split(",")
          .filter((x) => x != "");
      }

      this.showModal = true;
    },
    GetData() {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      let APIUrl = `/supplier/list`;
      //let APIParameter = encodeURIComponent(`search={"supplier":"","type":"司機","telephone":"","phonenum":""}&column=createTime&order=desc&field=id,,,action,supplier,supplierall,taxid,contacts,telephone,phoneNum,email,sort,enabled&currentPage=1&pageSize=10`);
      let APIParameter = `?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;

      let queryType = ""; // 篩選為非客戶類別的人事
      // 客戶
      // 家電-司機
      // 家電-助手
      // 冷氣-師傅
      // 冷氣-助手
      // 行政
      if (this.typelist.indexOf(this.type) != -1) {
        queryType = `"type":"${this.type}"`;
      } else {
        queryType = `"filter":"1"`;
      }

      let queryStr = `{${queryType},"supplier":"${this.supplier}","telephone":"${this.telephone}","phonenum":"${this.phoneNum}"}`;
      APIParameter += `&search=${encodeURIComponent(queryStr)}`;
      server
        .get(APIUrl + APIParameter)
        .then((res) => {
          //console.log("回傳資料成功 res=", res);
          if (
            res != null &&
            res.data != null &&
            res.data.code == 200 &&
            res.data.data != null
          ) {
            //回傳資料成功
            let jshdata = res.data.data;
            this.customersData = jshdata.rows;
            this.totalRows = jshdata.total;
            this.maxPage =
              Math.ceil(this.totalRows / this.pageSize) == 0
                ? 1
                : Math.ceil(this.totalRows / this.pageSize);
          }
          this.IsGetDataing = false;
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
      let APIUrl = `/supplier/add`;
      server
        .post(APIUrl, data1)
        .then((res) => {
          //console.log("回傳資料成功 res=", res);
          // if (res != null && res.data != null && res.data.code == 200 && res.data.data != null) {
          //   //回傳資料成功
          //   this.showModal = false;
          //   this.$nextTick(() => this.GetData());
          // }
          if (res != null && res.data != null) {
            if (res.data.code == 200) {
              this.showModal = false;
              this.$nextTick(() => {
                this.GetData();
              });
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
    UpdData(data1) {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      let APIUrl = `/supplier/update`;
      server
        .put(APIUrl, data1)
        .then((res) => {
          //console.log("回傳資料成功 res=", res);
          // if (res != null && res.data != null && res.data.code == 200 && res.data.data != null) {
          //   //回傳資料成功
          //   this.showModal = false;
          //   this.$nextTick(() => this.GetData());
          // }
          if (res != null && res.data != null) {
            if (res.data.code == 200) {
              this.showModal = false;
              this.$nextTick(() => {
                this.GetData();
              });
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
    handleFileUpload: function () {
      console.log("aaa", this.$refs.file2.files.length);
      for (let i = 0; i < this.$refs.file2.files.length; i++) {
        //this.filelist.push(this.$refs.file2.files[i]);
        console.log(
          "file1",
          i,
          this.$refs.file2.files[i].name,
          this.$refs.file2.files[i]
        );
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
    ShowImage(ImageUrl) {
      let filename = ImageUrl;

      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
      const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
      if (imageExtensions.includes(extension)) {
        this.showImageURL = filename;
        this.showImageModal = true;
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
    DeleteFile2(file1) {
      const filteredArray = this.driver.filelist.filter(
        (obj) => !(obj === file1)
      );

      this.driver.filelist = filteredArray;
    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-8">
                <div class="search-box me-2 mb-2 d-inline-block">
                  <select
                    class="form-select"
                    v-model="type"
                    @change="
                      this.currentPage = 1;
                      GetData();
                    "
                  >
                    <option
                      :value="u1"
                      selected
                      v-for="(u1, uidx) in ['全部類別', ...typelist]"
                      :key="'type' + uidx"
                    >
                      {{ u1 }}
                    </option>
                  </select>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      placeholder="搜尋姓名"
                      v-model="supplier"
                      @keyup.enter="
                        this.currentPage = 1;
                        GetData();
                      "
                    />
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      placeholder="手機號碼"
                      v-model="telephone"
                      @keyup.enter="
                        this.currentPage = 1;
                        GetData();
                      "
                    />
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input
                      autocomplete="off"
                      type="text"
                      class="form-control"
                      placeholder="聯繫電話"
                      v-model="phoneNum"
                      @keyup.enter="
                        this.currentPage = 1;
                        GetData();
                      "
                    />
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
                      ></i>
                      查詢
                    </b-button>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div
                  class="text-sm-end d-flex align-items-center justify-content-end"
                >
                  <ImportFile
                    :buttonName="'匯入人事列表'"
                    :apiLink="'/supplier/importMember'"
                    @importSuccess="setData"
                  />
                  <button
                    type="button"
                    class="btn btn-success btn-rounded mb-2 me-2"
                    @click="EditOne({ id: 0 })"
                  >
                    <i class="mdi mdi-plus me-1"></i> 新增人事
                  </button>
                  <b-modal
                    size="xl"
                    v-model="showModal"
                    :title="customers.id == 0 ? '新增人事' : '修改人事'"
                    title-class="text-black font-18"
                    body-class="p-3"
                    hide-footer
                  >
                    <form @submit.prevent="handleSubmit">
                      <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">人事類別</label>
                            <select
                              class="form-select"
                              v-model="customers.type"
                              :class="{
                                'is-invalid':
                                  submitted && v$.customers.type.$error,
                              }"
                            >
                              <option
                                :value="u1"
                                selected
                                v-for="(u1, uidx) in ['', ...typelist]"
                                :key="'type' + uidx"
                              >
                                {{ u1 }}
                              </option>
                            </select>
                            <div
                              v-if="submitted && v$.customers.type.$error"
                              class="invalid-feedback"
                            >
                              <span
                                v-if="v$.customers.type.required.$message"
                                >{{ v$.customers.type.required.$message }}</span
                              >
                            </div>
                          </div>
                        </div>

                        <div
                          class="col-sm-12 col-md-4 col-lg-3"
                          v-if="
                            customers.type == '家電-司機' ||
                            customers.type == '冷氣-師傅'
                          "
                        >
                          <div class="mb-3">
                            <label for="name">登入帳號</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.loginName"
                              type="text"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div
                          class="col-sm-12 col-md-4 col-lg-3"
                          v-if="
                            customers.type == '家電-司機' ||
                            customers.type == '冷氣-師傅'
                          "
                        >
                          <div class="mb-3">
                            <label for="loginPassword">登入密碼</label>
                            <input
                              autocomplete="off"
                              id="loginPassword"
                              v-model="customers.loginPassword"
                              type="password"
                              :placeholder="
                                this.customers.id != 0
                                  ? '密碼不修改可保留空白'
                                  : ''
                              "
                              class="form-control"
                              :class="{
                                'is-invalid':
                                  submitted &&
                                  v$.customers.loginPassword.$error,
                              }"
                            />
                            <div
                              v-if="
                                submitted && v$.customers.loginPassword.$error
                              "
                              class="invalid-feedback"
                            >
                              <span
                                v-if="
                                  v$.customers.loginPassword.maxLength.$message
                                "
                                >{{
                                  v$.customers.loginPassword.maxLength.$message
                                }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">姓名</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.supplier"
                              type="text"
                              class="form-control"
                              :class="{
                                'is-invalid':
                                  submitted && v$.customers.supplier.$error,
                              }"
                            />
                            <div
                              v-if="submitted && v$.customers.supplier.$error"
                              class="invalid-feedback"
                            >
                              <span
                                v-if="v$.customers.supplier.required.$message"
                                >{{
                                  v$.customers.supplier.required.$message
                                }}</span
                              >
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">身分證字號</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.idNumber"
                              type="text"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">出生年月日</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.birthday"
                              type="date"
                              class="form-control"
                            />
                          </div>
                        </div>

                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">緊急聯繫人</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.contacts"
                              type="text"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">緊急聯繫人電話</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.emergencyPhone"
                              type="text"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">手機號碼</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.telephone"
                              type="text"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">聯繫電話</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.phoneNum"
                              type="text"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">電子郵箱</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.email"
                              type="text"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">地址</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.address"
                              type="text"
                              class="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">團保加保日</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.groupInsuranceStart"
                              type="date"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">團保退保日</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.groupInsuranceEnd"
                              type="date"
                              class="form-control"
                            />
                          </div>
                        </div>

                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">勞健保加保日</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.laborHealthInsuranceStart"
                              type="date"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">勞健保退保日</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.laborHealthInsuranceEnd"
                              type="date"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">入職日</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.onboarding"
                              type="date"
                              class="form-control"
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">離職日</label>
                            <input
                              autocomplete="off"
                              id="name"
                              v-model="customers.resign"
                              type="date"
                              class="form-control"
                            />
                          </div>
                        </div>

                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">車牌號碼</label>
                            <select
                              class="form-select"
                              v-model="customers.licensePlate"
                            >
                              <option
                                v-for="(lp1, lpidx) in [
                                  { licensePlateNumber: '', driverName: '' },
                                  ...VehicleList,
                                ]"
                                :value="lp1.licensePlateNumber"
                                :key="'VehicleList' + lpidx"
                              >
                                {{ lp1.licensePlateNumber }}
                                {{ lp1.driverName }}
                              </option>
                            </select>
                          </div>
                        </div>

                        <div class="col-sm-12">
                          <div class="mb-3">
                            <label for="name">狀態</label>
                            <div>
                              <div class="btn-group btn-group-sm">
                                <a
                                  href="javascript:;"
                                  class="btn btn-outline-success"
                                  :class="
                                    customers.enabled == true ? 'active' : ''
                                  "
                                  @click="customers.enabled = true"
                                  >啟用</a
                                >
                                <a
                                  href="javascript:;"
                                  class="btn btn-outline-danger"
                                  :class="
                                    customers.enabled == false ? 'active' : ''
                                  "
                                  @click="customers.enabled = false"
                                  v-if="customers.id > 0"
                                  >停用</a
                                >
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="col-sm-12">
                          <b-button variant="light" class="w-sm">
                            <i
                              class="mdi mdi-upload d-block font-size-16"
                              @click="$refs.file2.click()"
                            ></i>
                            駕照上傳
                          </b-button>
                          <span class="text-danger">
                            最大檔案大小:
                            {{ Math.floor(MaxFileSize / 1024 / 1024) }} MB</span
                          >
                          <input
                            ref="file2"
                            type="file"
                            class="d-none"
                            multiple
                            v-on:change="handleFileUpload()"
                          />
                        </div>
                        <div class="col-sm-12 mt-1">
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

                      <div class="text-end pt-5 mt-3">
                        <b-button variant="light" @click="showModal = false"
                          >關閉</b-button
                        >
                        <b-button
                          type="submit"
                          variant="success"
                          class="ms-1"
                          >{{ customers.id == 0 ? "新增" : "修改" }}</b-button
                        >
                      </div>
                    </form>
                  </b-modal>
                </div>
              </div>
              <!-- end col-->
            </div>
            <div class="table-responsive">
              <table class="table table-centered table-nowrap align-middle">
                <thead>
                  <tr>
                    <th width="5px">#</th>
                    <th>類別</th>
                    <th>姓名</th>

                    <th>登入帳號</th>
                    <th>手機號碼</th>

                    <th>緊急聯繫人</th>
                    <th>緊急聯繫人電話</th>
                    <th>車牌號碼</th>
                    <th>狀態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(SubItem, cidx) in customersData"
                    :key="SubItem.id"
                  >
                    <td>{{ (currentPage - 1) * pageSize + cidx + 1 }}</td>
                    <td>{{ SubItem.type }}</td>
                    <td>{{ SubItem.supplier }}</td>
                    <td>{{ SubItem.loginName }}</td>
                    <td>{{ SubItem.telephone }}</td>

                    <td>{{ SubItem.contacts }}</td>
                    <td>{{ SubItem.emergencyPhone }}</td>
                    <td>{{ SubItem.licensePlate }}</td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <span
                          class="btn btn-outline-success"
                          v-if="SubItem.enabled == true"
                          >啟用</span
                        >
                        <span class="btn btn-outline-danger" v-else>停用</span>
                      </div>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
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
            <img
              :src="showImageURL"
              max-width="100%"
              max-height="100%"
              style="max-width: 100%"
            />
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
