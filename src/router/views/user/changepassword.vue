<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import md5 from "md5";
import { server } from "@/api";

import appConfig from "@/app.config";
import { Icon } from "@iconify/vue";

/**
 * Customers component
 */
export default {
  page: {
    title: "修改密碼",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader, Icon },
  data() {
    return {
      customersData: [],
      title: "修改密碼",
      items: [
        {
          text: "帳號管理",
          href: "javascript:;",
        },
        {
          text: "個人資料",
          href: "javascript:;",
        },
        {
          text: "修改密碼",
          active: true,
        },
      ],
      showModal: false,
      submitted: false,
      customers: {
        userId: "",
        oldpassword: "",
        password: "",
        confirmPassword: "",
      },

      name: "",
      serial_no: "",
      remark: "",

      IsGetDataing: false,
      pageSize: 30,
      totalRows: 0,
      currentPage: 1,
      maxPage: 10,
      seeOldPassword: false,
      seeNewPassword: false,
      seeConfirmPassword: false,
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations: {
    customers: {
      oldpassword: {
        required: helpers.withMessage("請輸入舊密碼", required),
      },
      password: {
        required: helpers.withMessage("請輸入新密碼", required),
      },
      confirmPassword: {
        required: helpers.withMessage("請再次確認密碼", required),
      },
    },
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.GetData();
    // })
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      console.log(user.UserID);
      this.customers.userId = user.UserID;
    }
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
        if (this.customers.password != this.customers.confirmPassword) {
          alert("二次確認密碼不相同!");
          return;
        }

        // console.log(md5(String(this.customers.oldpassword)))
        // console.log(md5(String(this.customers.confirmPassword)))
        this.customers.oldpassword = md5(String(this.customers.oldpassword));
        this.customers.password = md5(String(this.customers.password));
        this.UpdData(this.customers);
        this.seeOldPassword = false;
        this.seeNewPassword = false;
        this.seeConfirmPassword = false;
      }
      console.log("OK");

      this.submitted = false;
    },

    UpdData(data1) {
      if (this.IsGetDataing == true) return;
      this.IsGetDataing = true;
      let APIUrl = `/user/updatePwd`;

      server
        .put(APIUrl, data1)
        .then((res) => {
          console.log("回傳資料成功 res=", res);
          if (
            res != null &&
            res.data != null &&
            res.data.code == 200 &&
            res.data.data != null
          ) {
            //回傳資料成功
            this.showModal = false;
            alert("修改密碼成功");
            this.customers.password = "";
            this.customers.oldpassword = "";
            this.customers.confirmPassword = "";
          }
          this.IsGetDataing = false;
        })
        .catch(function (error) {
          console.log("error", error);
          this.IsGetDataing = false;
          return;
        });
    },
    toggleSeePassword(key) {
      if (key == 0) {
        this.seeOldPassword = !this.seeOldPassword;
      } else if (key == 1) {
        this.seeNewPassword = !this.seeNewPassword;
      } else {
        this.seeConfirmPassword = !this.seeConfirmPassword;
      }
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
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <div class="mb-3">
                    <label for="name">舊密碼</label>
                    <input
                      id="name"
                      v-model="customers.oldpassword"
                      :type="seeOldPassword ? 'text' : 'password'"
                      class="form-control"
                      :class="{
                        'is-invalid':
                          submitted && v$.customers.oldpassword.$error,
                      }"
                    />
                    <Icon
                      :icon="
                        seeOldPassword ? 'heroicons-solid:eye' : 'mdi:eye-off'
                      "
                      class="eye-icon"
                      @click="toggleSeePassword(0)"
                    />
                    <div
                      v-if="submitted && v$.customers.oldpassword.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="v$.customers.oldpassword.required.$message">{{
                        v$.customers.oldpassword.required.$message
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <div class="mb-3">
                    <label for="name">新密碼</label>
                    <input
                      id="name"
                      v-model="customers.password"
                      :type="seeNewPassword ? 'text' : 'password'"
                      class="form-control"
                      :class="{
                        'is-invalid': submitted && v$.customers.password.$error,
                      }"
                    />
                    <Icon
                      :icon="
                        seeNewPassword ? 'heroicons-solid:eye' : 'mdi:eye-off'
                      "
                      class="eye-icon"
                      @click="toggleSeePassword(1)"
                    />
                    <div
                      v-if="submitted && v$.customers.password.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="v$.customers.password.required.$message">{{
                        v$.customers.password.required.$message
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <div class="mb-3">
                    <label for="name">確認密碼</label>
                    <input
                      id="name"
                      v-model="customers.confirmPassword"
                      class="form-control"
                      :type="seeConfirmPassword ? 'text' : 'password'"
                      :class="{
                        'is-invalid':
                          submitted && v$.customers.confirmPassword.$error,
                      }"
                    />
                    <Icon
                      :icon="
                        seeConfirmPassword
                          ? 'heroicons-solid:eye'
                          : 'mdi:eye-off'
                      "
                      class="eye-icon"
                      @click="toggleSeePassword(3)"
                    />
                    <div
                      v-if="submitted && v$.customers.confirmPassword.$error"
                      class="invalid-feedback"
                    >
                      <span
                        v-if="v$.customers.confirmPassword.required.$message"
                        >{{
                          v$.customers.confirmPassword.required.$message
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-3 d-grid">
                <b-button type="submit" variant="primary" class="btn-block"
                  >確認</b-button
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>

<style>
.form-control {
  display: flex;
  position: relative;
}

.eye-icon {
  cursor: pointer;
  position: absolute;
  right: 25px;
  top: 58%;
  transform: translateY(-50%);
  font-size: 20px;
}
</style>
