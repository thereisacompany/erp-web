<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import { required, helpers, numeric } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import { server } from "@/api";


import appConfig from "@/app.config";

/**
 * Customers component
 */
export default {
  page: {
    title: "儲位管理",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      userlist: [],
      customersData: [],
      title: "儲位管理",
      items: [
        {
          text: "倉庫管理",
          href: "javascript:;",
        },
        {
          text: "儲位管理",
          href: "javascript:;",
        },
        {
          text: "儲位列表",
          active: true,
        },
      ],
      showModal: false,
      submitted: false,
      customers: {
        id: '',
        depotId: '',
        name: '',
        principal: 0,
        principalName: '',
        space: '',
        remark: '',
        enabled: '',

      },
      depotId: '',
      name: '',
      remark: '',
      depotList: [],
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
      name: {
        required: helpers.withMessage("請填寫儲位名稱", required),
      },
      space: {
        required: helpers.withMessage("請填寫數字", required),
        numeric,
      },
      sort: {
        required: helpers.withMessage("請填寫數字", required),
        numeric,
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.GetUserList();//負責人列表
      this.GetDepotList();//倉庫別
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
        this.customers.depotId = '';
        this.customers.name = "";
        this.customers.principalName = "";
        this.customers.principal = "";
        this.customers.remark = "";
        this.customers.sort = "";
        this.customers.enabled = true;

        this.customers.space = '';
      }
      else {
        this.customers.id = RowItem.id;
        this.customers.depotId = RowItem.depotId;
        this.customers.name = RowItem.name;
        this.customers.address = RowItem.address;
        this.customers.principalName = RowItem.principalName;
        this.customers.principal = RowItem.principal;
        this.customers.sort = RowItem.sort;
        this.customers.enabled = RowItem.enabled;
        this.customers.space = RowItem.space;
      }


      this.showModal = true;
    },
    formatUserName(userid) {
      if (this.userlist == null) return userid;

      let F1List = this.userlist.filter(x => String(x.id) == String(userid));
      if (F1List.length != 0) return F1List[0].userName;
      return userid

    },
    formatDepotIDName(depotId) {
      if (this.depotList == null) return depotId;

      let F1List = this.depotList.filter(x => String(x.id) == String(depotId));
      if (F1List.length != 0) return F1List[0].depotName;
      return depotId
    },
    GetDepotList() {
      ///jshERP-boot/depot/findDepotByCurrentUser  
      let APIUrl = `/depot/findDepotByCurrentUser`;
      server.get(APIUrl)
        .then((res) => {
          console.log("res", res)
          if (res != null && res.data != null && res.status == 200) {
            let jshdata = res.data.data;
            this.depotList = jshdata;
          }
        }).catch(function (error) {
          console.log("error", error);
        });
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
      let APIUrl = `/depot/counter/getAllList`;
      //let APIParameter = `?currentPage=${this.currentPage}&pageSize=${this.pageSize}&depotId=${this.depotId}`;
      let APIParameter = `?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;
      let queryStr = `{"depotId":"${this.depotId}","name":"${this.name}","remark":"${this.remark}"}`;
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
      let APIUrl = `/depot/counter/add`;
      server.post(APIUrl, data1)
        .then((res) => {
          if (res != null && res.data != null && res.data.code == 200 && res.data.data != null) {
            this.showModal = false;
            this.$nextTick(() => this.GetData());
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
      let APIUrl = `/depot/counter/update`;
      server.put(APIUrl, data1)
        .then((res) => {
          if (res != null && res.data != null && res.data.code == 200 && res.data.data != null) {
            this.showModal = false;
            this.$nextTick(() => this.GetData());
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
                  <label for="name">倉庫別</label>
                  <select class="form-select" v-model="depotId" @change="GetData()">
                    <option :value="u1.id" selected v-for="u1 in [{ id: '', depotName: '全部' }, ...depotList]"
                      :key="'query_depot_id' + u1.id">
                      {{ u1.depotName }}</option>
                  </select>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="名稱" v-model="name" @keyup.enter="GetData()" />
                  </div>
                </div>
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="備註" v-model="remark"
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
                    <i class="mdi mdi-plus me-1"></i> 新增儲位
                  </button>
                  <b-modal v-model="showModal" :title="customers.id == 0 ? '新增儲位' : '修改儲位'"
                    title-class="text-black font-18" body-class="p-3" hide-footer>
                    <form @submit.prevent="handleSubmit">
                      <div class="row">




                        <div class="col-12">
                          <div class="mb-3">
                            <label for="name">倉庫別</label>
                            <select class="form-select" v-model="customers.depotId" @change="GetData()">
                              <option :value="u1.id" selected
                                v-for="u1 in [{ id: '', depotName: '謮選擇倉庫' }, ...depotList]"
                                :key="'query_customers_depot_id' + u1.id">
                                {{ u1.depotName }}</option>
                            </select>
                          </div>
                        </div>


                        <div class="col-12">
                          <div class="mb-3">
                            <label for="name">儲位名稱</label>
                            <input id="name" v-model="customers.name" type="text" class="form-control"
                              placeholder="儲位名稱" :class="{ 'is-invalid': submitted && v$.customers.name.$error, }" />
                            <div v-if="submitted && v$.customers.name.$error" class="invalid-feedback">
                              <span v-if="v$.customers.name.required.$message">{{ v$.customers.name.required.$message
                                }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="col-12">
                          <div class="mb-3">
                            <label for="name">空間大小</label>
                            <input id="name" v-model="customers.space" type="text" class="form-control"
                              placeholder="空間大小" :class="{ 'is-invalid': submitted && v$.customers.space.$error, }" />
                            <div v-if="submitted && v$.customers.space.$error" class="invalid-feedback">
                              <span v-if="v$.customers.space.required.$message">{{ v$.customers.space.required.$message
                                }}</span>
                            </div>

                          </div>
                        </div>
                        <div class="col-12">
                          <div class="mb-3">
                            <label for="name">負責人</label>
                            <select class="form-select" v-model="customers.principal">
                              <option :value="u1.id" selected v-for="u1 in userlist" :key="'principal' + u1.id">
                                {{ u1.userName }}</option>
                            </select>
                          </div>
                        </div>


                        <div class="col-12">
                          <div class="mb-3">
                            <label for="name">備註</label>
                            <input id="name" v-model="customers.remark" type="text" class="form-control"
                              placeholder="備註" />
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="mb-3">
                            <label for="name">順序</label>
                            <input id="name" v-model="customers.sort" type="text" class="form-control" placeholder="順序"
                              :class="{ 'is-invalid': submitted && v$.customers.sort.$error, }" />
                            <div v-if="submitted && v$.customers.sort.$error" class="invalid-feedback">
                              <span v-if="v$.customers.sort.required.$message">{{ v$.customers.sort.required.$message
                                }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
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
                    <th>倉庫別</th>
                    <th>儲位名稱</th>
                    <th>空間大小</th>
                    <th>負責人</th>
                    <th>備註</th>
                    <th>順序</th>
                    <th>狀態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(SubItem, cidx) in customersData" :key="SubItem.id">
                    <td>{{ (currentPage - 1) * pageSize + cidx + 1 }}</td>
                    <td>{{ formatDepotIDName(SubItem.depotId) }}</td>
                    <td>{{ SubItem.name }}</td>
                    <td>{{ SubItem.space }}</td>
                    <td>{{ formatUserName(SubItem.principal) }}</td>
                    <td>{{ SubItem.remark }}</td>
                    <td>{{ SubItem.sort }}</td>

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
