<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import { required, helpers, numeric } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import { server } from "@/api";
import common from "@/api/common";

import appConfig from "@/app.config";

/**
 * Customers component
 */
export default {
  page: {
    title: "車輛管理",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      userlist: [],
      customersData: [],
      title: "車輛管理",
      items: [
        {
          text: "人事管理",
          href: "javascript:;",
        },
        {
          text: "車輛管理",
          href: "javascript:;",
        },
        {
          text: "車輛列表",
          active: true,
        },
      ],
      showModal: false,
      submitted: false,
      customers: {
        id: '',
        licensePlateNumber: '',
        brandModel: '',
        driver: '',
        color: '',
        mileage: '',
        engineNumber: '',
        manufacture: '',
        testDate: '',
        insuranceDate: '',
        emissions: '',
        price: '',
        status: '',
        ownership: '',


        takeOver: '',//`take_over` date  '車輛接手日',
        loanDue: '',//`loan_due` date  '貸款到期日',
        contractExpired: '',//`contract_expired` date   '司機合約到期日',
        insuranceDateEnd: '',//`insurance_date_end` date   '車險迄止日',
        renewalDate: '',//`renewal_date` date   '補換照日(行照)',
        licenseValid: '',//`license_valid` date   '行照有效日',
        cargoInsuranceDue: '',//`cargo_insurance_due` date   '貨物險到期日',


      },

      licensePlateNumber: '',
      brandModel: '',
      driver: '',

      driverlist: [],
      IsGetDataing: false,
      pageSize: 50,
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
      licensePlateNumber: {
        required: helpers.withMessage("請填寫車牌號碼", required),
      },
      brandModel: {
        required: helpers.withMessage("請填寫品牌型號", required),
      },

      mileage: {
        numeric: helpers.withMessage("請填寫數字", numeric),
      },
      emissions: {
        numeric: helpers.withMessage("請填寫數字", numeric),
      },
      price: {
        numeric: helpers.withMessage("請填寫數字", numeric),
      },
    },
  },
  mounted() {
    server.GetSupplier2List('家電-司機', (rows) => { this.driverlist = rows })
    this.$nextTick(() => {
      this.GetUserList();//負責人列表
      this.GetData();
    })
  },
  methods: {
    formatPadLeftZero(str, len) {
      if (str == null || str == '') return ''
      return common.PadLeftZero(str, len)
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
        if (this.customers.id == 0) {
          this.AddData(this.customers);
        } else if (this.customers.id > 0) {
          this.UpdData(this.customers);
        }
      }
      this.submitted = false;
    },
    EditOne(RowItem) {

      if (RowItem.id == null || RowItem.id == 0) {
        for (let key in this.customers) {
          this.customers[key] = '';
        }


        this.customers.id = 0;
        this.customers.licensePlateNumber = '';
        this.customers.brandModel = '';
        this.customers.driver = '';
        this.customers.color = '';
        this.customers.mileage = '';
        this.customers.engineNumber = '';
        this.customers.manufacture = '';
        this.customers.testDate = '';
        this.customers.insuranceDate = '';
        this.customers.emissions = '';
        this.customers.price = '';
        this.customers.status = 1;
        this.customers.ownership = 1;

        this.customers.takeOver = '';
        this.customers.loanDue = '';
        this.customers.contractExpired = '';
        this.customers.insuranceDateEnd = '';
        this.customers.renewalDate = '';
        this.customers.licenseValid = '';
        this.customers.cargoInsuranceDue = '';


      }
      else {


        this.customers.id = RowItem.id;
        this.customers.licensePlateNumber = RowItem.licensePlateNumber;
        this.customers.brandModel = RowItem.brandModel;
        this.customers.driver = RowItem.driver;
        this.customers.color = RowItem.color;
        this.customers.mileage = RowItem.mileage;
        this.customers.engineNumber = RowItem.engineNumber;
        this.customers.manufacture = RowItem.manufacture;
        this.customers.testDate = RowItem.testDate;
        this.customers.insuranceDate = RowItem.insuranceDate;
        this.customers.emissions = RowItem.emissions;
        this.customers.price = RowItem.price;
        this.customers.status = RowItem.status;
        this.customers.ownership = RowItem.ownership;


        this.customers.takeOver = RowItem.takeOver;
        this.customers.loanDue = RowItem.loanDue;
        this.customers.contractExpired = RowItem.contractExpired;
        this.customers.insuranceDateEnd = RowItem.insuranceDateEnd;
        this.customers.renewalDate = RowItem.renewalDate;
        this.customers.licenseValid = RowItem.licenseValid;
        this.customers.cargoInsuranceDue = RowItem.cargoInsuranceDue;

      }


      this.showModal = true;
    },
    GetUserList() {

      let APIUrl = `/user/getUserList`;
      server.get(APIUrl)
        .then((res) => {
          if (res != null && res.data != null && res.status == 200) {
            let jshdata = res.data;
            this.userlist = jshdata;
          }
        }).catch(function (error) {
          console.log("error", error);
        });
    },
    GetData() {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      let APIUrl = `/vehicle/list`;
      let APIParameter = `?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;
      let queryStr = `{"licensePlateNumber":"${this.licensePlateNumber}","brandModel":"${this.brandModel}","driver":"${this.driver}"}`;
      APIParameter += `&search=${encodeURIComponent(queryStr)}`;
      server.get(APIUrl + APIParameter)
        .then((res) => {
          if (res != null && res.data != null && res.data.code == 200 && res.data.data != null) {
            let jshdata = res.data.data;
            this.customersData = jshdata.rows;
            this.totalRows = jshdata.total;
            this.maxPage = Math.ceil(this.totalRows / this.pageSize) == 0 ? 1 : Math.ceil(this.totalRows / this.pageSize);
          }
          this.IsGetDataing = false;
        }).catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    AddData(data1) {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      let APIUrl = `/vehicle/add`;
      server.post(APIUrl, data1)
        .then((res) => {

          if (res != null && res.data != null) {
            if (res.data.code == 200) {
              this.showModal = false;
              this.$nextTick(() => { this.GetData() });
            } else {
              alert(res.data.data.message)
            }
          }
          this.IsGetDataing = false;
        }).catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    UpdData(data1) {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      let APIUrl = `/vehicle/update`;
      server.put(APIUrl, data1)
        .then((res) => {

          if (res != null && res.data != null) {
            if (res.data.code == 200) {
              this.showModal = false;
              this.$nextTick(() => { this.GetData() });
            } else {
              alert(res.data.data.message)

            }
          }
          this.IsGetDataing = false;
        }).catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    }
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
                  <div class="position-relative">
                    <input autocomplete="off" type="text" class="form-control" placeholder="車牌號碼"
                      v-model="licensePlateNumber" @keyup.enter="GetData()" />
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input autocomplete="off" type="text" class="form-control" placeholder="品牌型號" v-model="brandModel"
                      @keyup.enter="GetData()" />
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <select class="form-select" v-model="driver" @change="GetData()">
                      <option :value="u1.id" selected v-for="u1 in [{ id: '', idname: '全部司機' }, ...driverlist]"
                        :key="'driver' + u1.id">
                        {{ u1.idname }}</option>
                    </select>
                  </div>
                </div>

                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <b-button variant="primary" @click="GetData()">
                      <i :class="IsGetDataing ? 'bx bx-loader bx-spin font-size-16 align-middle me-2' : ''"></i> 查詢
                    </b-button>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="text-sm-end">
                  <button type="button" class="btn btn-success btn-rounded mb-2 me-2" @click="EditOne({ id: 0 })">
                    <i class="mdi mdi-plus me-1"></i> 新增車輛
                  </button>




                  <b-modal size="xl" v-model="showModal" :title="customers.id == 0 ? '新增車輛' : '修改車輛'"
                    title-class="text-black font-18" body-class="p-3" hide-footer>
                    <form @submit.prevent="handleSubmit">
                      <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="mb-3">
                            <label for="licensePlateNumber">車牌號碼</label>
                            <input autocomplete="off" id="licensePlateNumber" v-model="customers.licensePlateNumber"
                              type="text" class="form-control" placeholder="車牌號碼"
                              :class="{ 'is-invalid': submitted && v$.customers.licensePlateNumber.$error, }" />
                            <div v-if="submitted && v$.customers.licensePlateNumber.$error" class="invalid-feedback">
                              <span v-if="v$.customers.licensePlateNumber.required.$message">{{
      v$.customers.licensePlateNumber.required.$message
    }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="mb-3">
                            <label for="brandModel">品牌型號</label>
                            <input autocomplete="off" id="brandModel" v-model="customers.brandModel" type="text"
                              class="form-control" placeholder="品牌型號"
                              :class="{ 'is-invalid': submitted && v$.customers.brandModel.$error, }" />
                            <div v-if="submitted && v$.customers.brandModel.$error" class="invalid-feedback">
                              <span v-if="v$.customers.brandModel.required.$message">{{
      v$.customers.brandModel.required.$message
    }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="col-sm-12 col-md-4 col-lg-4">

                          <label for="name">司機</label>
                          <select class="form-select" v-model="customers.driver">
                            <option :value="u1.id" selected v-for="u1 in [{ id: '', idname: '' }, ...driverlist]"
                              :key="'customers_driver' + u1.id">
                              {{ u1.idname }}</option>
                          </select>

                        </div>

                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="mb-3">
                            <label for="color">車身顏色</label>
                            <input autocomplete="off" id="color" v-model="customers.color" type="text"
                              class="form-control" placeholder="車身顏色" />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="mb-3">
                            <label for="mileage">里程數(公里)</label>
                            <input autocomplete="off" id="mileage" v-model="customers.mileage" type="text"
                              class="form-control" :class="{ 'is-invalid': submitted && v$.customers.mileage.$error, }"
                              placeholder="里程數(公里)" />
                            <div v-if="submitted && v$.customers.mileage.$error" class="invalid-feedback">
                              <span v-if="v$.customers.mileage.numeric.$message">
                                {{ v$.customers.mileage.numeric.$message }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="mb-3">
                            <label for="engineNumber">引擎號碼</label>
                            <input autocomplete="off" id="engineNumber" v-model="customers.engineNumber" type="text"
                              class="form-control" placeholder="引擎號碼" />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label for="manufacture">出廠日期</label>
                          <input autocomplete="off" type="date" class="form-control" placeholder="出廠日期"
                            v-model="customers.manufacture">
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label for="testDate">驗車日</label>
                          <input autocomplete="off" type="date" class="form-control" placeholder="驗車日"
                            v-model="customers.testDate">
                        </div>
                        <div class="col-sm-12 col-md-2 col-lg-2">
                          <label for="insuranceDate">保險日期</label>
                          <input autocomplete="off" type="date" class="form-control" placeholder="保險日期"
                            v-model="customers.insuranceDate">
                        </div>

                        <div class="col-sm-12 col-md-2 col-lg-2">
                          <label for="insuranceDateEnd">車險迄止日</label>
                          <input autocomplete="off" type="date" class="form-control" placeholder="車險迄止日"
                            v-model="customers.insuranceDateEnd">
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label for="takeOver">車輛接手日</label>
                          <input autocomplete="off" type="date" class="form-control" placeholder="車輛接手日"
                            v-model="customers.takeOver">
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label for="loanDue">貸款到期日</label>
                          <input autocomplete="off" type="date" class="form-control" placeholder="貸款到期日"
                            v-model="customers.loanDue">
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label for="contractExpired">司機合約到期日</label>
                          <input autocomplete="off" type="date" class="form-control" placeholder="司機合約到期日"
                            v-model="customers.contractExpired">
                        </div>

                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label for="renewalDate">補換照日(行照)</label>
                          <input autocomplete="off" type="date" class="form-control" placeholder="補換照日(行照)"
                            v-model="customers.renewalDate">
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label for="licenseValid">行照有效日</label>
                          <input autocomplete="off" type="date" class="form-control" placeholder="行照有效日"
                            v-model="customers.licenseValid">
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label for="cargoInsuranceDue">貨物險到期日</label>
                          <input autocomplete="off" type="date" class="form-control" placeholder="貨物險到期日"
                            v-model="customers.cargoInsuranceDue">
                        </div>

                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="mb-3">
                            <label for="emissions">排放量(c.c.)</label>
                            <input autocomplete="off" id="emissions" v-model="customers.emissions" type="text"
                              class="form-control"
                              :class="{ 'is-invalid': submitted && v$.customers.emissions.$error, }"
                              placeholder="排放量(c.c.)" />
                            <div v-if="submitted && v$.customers.emissions.$error" class="invalid-feedback">
                              <span v-if="v$.customers.emissions.numeric.$message">
                                {{ v$.customers.emissions.numeric.$message }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="mb-3">
                            <label for="price">車價</label>
                            <input autocomplete="off" id="price" v-model="customers.price" type="text"
                              class="form-control" :class="{ 'is-invalid': submitted && v$.customers.price.$error, }"
                              placeholder="車價" />
                            <div v-if="submitted && v$.customers.price.$error" class="invalid-feedback">
                              <span v-if="v$.customers.price.numeric.$message">
                                {{ v$.customers.price.numeric.$message }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label for="status">車輛狀態</label>
                          <select class="form-select" v-model="customers.status">
                            <option value="1">白牌車</option>
                            <option value="2">綠牌車</option>
                          </select>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <label for="ownership">歸屬</label>
                          <select class="form-select" v-model="customers.ownership">
                            <option value="1">公司</option>
                            <option value="2">私人</option>
                            <option value="3">租用</option>
                          </select>
                        </div>

                      </div>

                      <div class="text-end pt-5 mt-3">
                        <b-button variant="light" @click="showModal = false">關閉</b-button>
                        <b-button type="submit" variant="success" class="ms-1">{{ customers.id == 0 ? '新增' : '修改'
                          }}</b-button>
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
                    <th>車牌號碼</th>
                    <th>品牌型號</th>
                    <th>司機</th>
                    <th>車身顏色</th>
                    <th>里程數(公里)</th>
                    <th>引擎號碼</th>
                    <th>出廠日期</th>
                    <th>驗車日</th>
                    <th>保險日期</th>
                    <th>排放量(c.c.)</th>
                    <th>車價</th>
                    <th>車輛狀態</th>
                    <th>歸屬</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(SubItem, cidx) in customersData" :key="SubItem.id">
                    <td>{{ (currentPage - 1) * pageSize + cidx + 1 }}</td>
                    <td>{{ SubItem.licensePlateNumber }}</td>
                    <td>{{ SubItem.brandModel }}</td>
                    <td>{{ formatPadLeftZero(SubItem.driver, 3) }} {{ SubItem.driverName }}</td>
                    <td>{{ SubItem.color }}</td>
                    <td>{{ SubItem.mileage }}</td>
                    <td>{{ SubItem.engineNumber }}</td>
                    <td>{{ SubItem.manufacture }}</td>
                    <td>{{ SubItem.testDate }}</td>
                    <td>{{ SubItem.insuranceDate }}</td>
                    <td>{{ SubItem.emissions }}</td>
                    <td>{{ SubItem.price }}</td>


                    <td>
                      <div class="btn-group btn-group-sm">
                        <span class="btn btn-secondary" v-if="SubItem.status == 1">白牌車</span>
                        <span class="btn btn-success" v-else-if="SubItem.status == 2">綠牌車</span>
                      </div>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <span class="btn btn-success" v-if="SubItem.ownership == 1">公司</span>
                        <span class="btn btn-warning" v-else-if="SubItem.ownership == 2">私人</span>
                        <span class="btn btn-pink" v-else-if="SubItem.ownership == 3">租用</span>
                      </div>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <a class="btn btn-secondary" href="javascript:;" @click="EditOne(SubItem)">編輯</a>
                      </div>

                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <TablePager v-model:currentPage="currentPage" v-model:maxPage="maxPage" :CallGetData="GetData" />
          </div>
        </div>
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>
