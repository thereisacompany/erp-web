<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import { required, helpers, minLength, maxLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import { server } from "@/api";


import appConfig from "@/app.config";

/**
 * Customers component
 */
export default {
  page: {
    title: "人事管理",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
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
      customers: {
        id: '',
        supplier: '',
        supplierall: '',
        contacts: '',
        telephone: '',
        phoneNum: '',
        emergencyPhone: '',
        licensPlate: '',
        email: '',
        enabled: '',
        address: '',
        licensePlate: '',
        loginName: '',
        loginPassword: '',
        type: '司機'
      },
      type: '全部類別',
      typelist: ['家電-司機', '家電-助手', '冷氣-師傅', '冷氣-助手', '行政'],
      supplier: '',
      telephone: '',
      phoneNum: '',

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
        required: helpers.withMessage("請填寫名稱", required),
      },
      supplierall: {
        required: helpers.withMessage("請填寫全名", required),
      },
      type: {
        required: helpers.withMessage("請選擇人事類別", required),
      },
      loginName: {
        required: helpers.withMessage("司機類別請輸入登入帳號", required),
      },
      loginPassword: {
        // 使用 `minLength` 规则，但添加 `optional` 选项，以便在 loginPassword 为空时不执行 minLength 验证规则
        minLength: helpers.withMessage("請輸入6-12位密碼", minLength(6), { unless: (value) => value !== '' }),
        maxLength: helpers.withMessage("請輸入6-12位密碼", maxLength(12), { unless: (value) => value !== '' }),
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.GetData();
    })
  },
  methods: {

    /**
     * Modal form submit
     */
    // eslint-disable-next-line no-unused-vars
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid

      if (this.customers.type != '家電-司機' && (this.customers.loginName == '' || this.customers.loginName == null)) {
        this.customers.loginName = 'loginName'
      }
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
      console.log("EditOne", RowItem)


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
        this.customers.loginName = '';
        this.customers.loginPassword = '';
        this.customers.type = '';
      }
      else {

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
        this.customers.loginPassword = '';
        this.customers.type = RowItem.type;
      }



      this.showModal = true;
    },
    GetData() {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      let APIUrl = `/supplier/list`;
      //let APIParameter = encodeURIComponent(`search={"supplier":"","type":"司機","telephone":"","phonenum":""}&column=createTime&order=desc&field=id,,,action,supplier,supplierall,taxid,contacts,telephone,phoneNum,email,sort,enabled&currentPage=1&pageSize=10`);
      let APIParameter = `?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;

      let queryType = '';// 篩選為非客戶類別的人事
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
      server.get(APIUrl + APIParameter)
        .then((res) => {
          //console.log("回傳資料成功 res=", res);
          if (res != null && res.data != null && res.data.code == 200 && res.data.data != null) {
            //回傳資料成功
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
      let APIUrl = `/supplier/add`;
      server.post(APIUrl, data1)
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
      let APIUrl = `/supplier/update`;
      server.put(APIUrl, data1)
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
                  <select class="form-select" v-model="type" @change="GetData()">
                    <option :value="u1" selected v-for="(u1, uidx) in ['全部類別', ...typelist]" :key="'type' + uidx">
                      {{ u1 }}</option>
                  </select>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="搜尋名稱" v-model="supplier"
                      @keyup.enter="GetData()" />
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="手機號碼" v-model="telephone"
                      @keyup.enter="GetData()" />
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="聯繫電話" v-model="phoneNum"
                      @keyup.enter="GetData()" />
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
                    <i class="mdi mdi-plus me-1"></i> 新增人事
                  </button>
                  <b-modal size="xl" v-model="showModal" :title="customers.id == 0 ? '新增人事' : '修改人事'"
                    title-class="text-black font-18" body-class="p-3" hide-footer>
                    <form @submit.prevent="handleSubmit">
                      <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">人事類別</label>
                            <select class="form-select" v-model="customers.type"
                              :class="{ 'is-invalid': submitted && v$.customers.type.$error, }">
                              <option :value="u1" selected v-for="(u1, uidx) in ['', ...typelist]" :key="'type' + uidx">
                                {{ u1 }}</option>
                            </select>
                            <div v-if="submitted && v$.customers.type.$error" class="invalid-feedback">
                              <span v-if="v$.customers.type.required.$message">{{
                                v$.customers.type.required.$message }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="col-sm-12 col-md-4 col-lg-3" v-if="customers.type == '家電-司機'">
                          <div class="mb-3">
                            <label for="name">登入帳號</label>
                            <input id="name" v-model="customers.loginName" type="text" class="form-control"
                              :readonly="this.customers.id != 0"
                              :class="{ 'is-invalid': submitted && v$.customers.loginName.$error, }" />
                            <div v-if="submitted && v$.customers.loginName.$error" class="invalid-feedback">
                              <span v-if="v$.customers.loginName.required.$message">{{
                                v$.customers.loginName.required.$message }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3" v-if="customers.type == '家電-司機'">
                          <div class="mb-3">
                            <label for="loginPassword">登入密碼</label>
                            <input id="loginPassword" v-model="customers.loginPassword" type="password"
                              :placeholder="this.customers.id != 0 ? '密碼不修改可保留空白' : '預設密碼:12345'" class="form-control"
                              :class="{ 'is-invalid': submitted && v$.customers.loginPassword.$error, }" />
                            <div v-if="submitted && v$.customers.loginPassword.$error" class="invalid-feedback">
                              <span v-if="v$.customers.loginPassword.maxLength.$message">{{
                                v$.customers.loginPassword.maxLength.$message }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">名稱</label>
                            <input id="name" v-model="customers.supplier" type="text" class="form-control"
                              :class="{ 'is-invalid': submitted && v$.customers.supplier.$error, }" />
                            <div v-if="submitted && v$.customers.supplier.$error" class="invalid-feedback">
                              <span v-if="v$.customers.supplier.required.$message">{{
                                v$.customers.supplier.required.$message }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">姓名</label>
                            <input id="name" v-model="customers.supplierall" type="text" class="form-control"
                              :class="{ 'is-invalid': submitted && v$.customers.supplierall.$error, }" />
                            <div v-if="submitted && v$.customers.supplierall.$error" class="invalid-feedback">
                              <span v-if="v$.customers.supplierall.required.$message">{{
                                v$.customers.supplierall.required.$message }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">緊急聯繫人</label>
                            <input id="name" v-model="customers.contacts" type="text" class="form-control" />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">緊急聯繫人電話</label>
                            <input id="name" v-model="customers.emergencyPhone" type="text" class="form-control" />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">手機號碼</label>
                            <input id="name" v-model="customers.telephone" type="text" class="form-control" />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">聯繫電話</label>
                            <input id="name" v-model="customers.phoneNum" type="text" class="form-control" />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">電子郵箱</label>
                            <input id="name" v-model="customers.email" type="text" class="form-control" />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">地址</label>
                            <input id="name" v-model="customers.address" type="text" class="form-control" />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-3">
                          <div class="mb-3">
                            <label for="name">車牌號碼</label>
                            <input id="name" v-model="customers.licensePlate" type="text" class="form-control" />
                          </div>
                        </div>
                        <div class="col-sm-12">
                          <div class="mb-3">
                            <label for="name">狀態</label>
                            <div>
                              <div class="btn-group btn-group-sm">
                                <a href="javascript:;" class="btn btn-outline-success"
                                  :class="customers.enabled == true ? 'active' : ''"
                                  @click="customers.enabled = true">啟用</a>
                                <a href="javascript:;" class="btn btn-outline-danger"
                                  :class="customers.enabled == false ? 'active' : ''" @click="customers.enabled = false"
                                  v-if="customers.id > 0">停用</a>
                              </div>
                            </div>

                          </div>
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
                    <th>類別</th>
                    <th>名稱</th>
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
                  <tr v-for="(SubItem, cidx) in customersData" :key="SubItem.id">
                    <td>{{ (currentPage - 1) * pageSize + cidx + 1 }}</td>
                    <td>{{ SubItem.type }}</td>
                    <td>{{ SubItem.supplier }}</td>
                    <td>{{ SubItem.supplierall }}</td>
                    <td>{{ SubItem.loginName }}</td>
                    <td>{{ SubItem.telephone }}</td>

                    <td>{{ SubItem.contacts }}</td>
                    <td>{{ SubItem.emergencyPhone }}</td>
                    <td>{{ SubItem.licensePlate }}</td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <span class="btn btn-outline-success" v-if="SubItem.enabled == true">啟用</span>
                        <span class="btn btn-outline-danger" v-else>停用</span>
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
