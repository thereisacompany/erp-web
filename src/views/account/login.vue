<template>
  <div class="login__wrapper">
    <div class="wrapper">
      <div class="wrapper_login-form">
        <div class="header">
          <img src="@/assets/images/logo.png" />
        </div>

        <div class="login-form">
          <span class="version">v{{ version }}</span>
          <a-form
            :model="formState"
            layout="vertical"
            name="normal_login"
            class="form"
          >
            <a-form-item
              label="帳號"
              name="loginName"
              :rules="[{ required: true, message: '請填寫登入帳號!' }]"
            >
              <a-input v-model:value="formState.loginName">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              label="密碼"
              name="password"
              :rules="[{ required: true, message: '請填寫登入密碼!' }]"
            >
              <a-input-password v-model:value="formState.password">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-checkbox
              class="remember-me"
              v-model:checked="rememberMe"
              @change="handleClickRemember"
              >記住帳號</a-checkbox
            >
            <button type="submit" @click="handleUserLogin">登入</button>
          </a-form>
          <!-- <form>
            <div class="input-group">
              <label for="loginName">帳號</label>
              <input
                type="text"
                id="loginName"
                name="loginName"
                placeholder="請輸入帳號"
                required
              />
            </div>
            <div class="input-group">
              <label for="password">密碼</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="請輸入密碼"
                required
              />
            </div>
            <a-checkbox class="remember-me" v-model:checked="rememberMe"
              >記住帳號</a-checkbox
            >
            <button type="submit">登入</button>
          </form> -->
        </div>
      </div>
    </div>
    <div class="copyright">
      <span> © {{ new Date().getFullYear() }} 鉅生物流有限公司 ERP </span>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { version } from "../../../package.json";
import { Checkbox, Form, FormItem } from "ant-design-vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { userLogin } from "@/api/systemApi.js";
import md5 from "md5";

export default defineComponent({
  components: {
    ACheckbox: Checkbox,
    AForm: Form,
    AFormItem: FormItem,
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const rememberMe = ref(false);
    const formState = reactive({
      loginName: "",
      password: "",
    });

    // 登入
    async function handleUserLogin() {
      const data = {
        loginName: formState.loginName,
        password: md5(String(formState.password)),
      };

      const result = await userLogin(data);
      if (result) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            UserID: result.user.id,
            token: result.token,
            loginName: result.user.loginName,
            roleName: result.roleName,
          })
        );

        localStorage.setItem(
          "user_authList",
          JSON.stringify(result.user.authList)
        );

        window.location = "/";
      }
    }

    //  記住帳號
    function handleClickRemember() {
      if (rememberMe.value) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({
            loginName: formState.loginName,
          })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }
    }

    onMounted(() => {
      // 移除local儲存舊的user資料
      localStorage.removeItem("user");
      localStorage.removeItem("user_authList");

      // 判斷是否有勾選記住帳號
      if (localStorage.getItem("rememberedUser")) {
        const rememberedUser = JSON.parse(
          localStorage.getItem("rememberedUser")
        );
        formState.loginName = rememberedUser.loginName;
        rememberMe.value = true;
      }
    });

    return {
      version,
      rememberMe,
      formState,
      handleClickRemember,
      handleUserLogin,
    };
  },
});
</script>
<style lang="scss" scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.login__wrapper {
  height: 100vh;
  background: linear-gradient(132deg, #fffcfc, #9fb4f8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  color: #606266;

  .wrapper {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 8px 15px rgb(0 0 0 / 45%);
    animation: fadeIn 0.5s ease-in-out;
    min-width: 500px;
    min-height: 500px;
    margin-top: 8%;

    &_login-form {
      width: 100%;
      min-height: 500px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 2rem;
        color: #333;
        font-weight: bold;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #556ee6;
        height: 120px;
        border-radius: 10px 10px 0 0;
      }

      .login-form {
        padding: 1rem 2rem;

        .version {
          text-align: end;
          width: 100%;
          display: block;
          margin-bottom: 10px;
        }

        form {
          .input-group {
            margin-bottom: 1rem;
          }

          .input-group label {
            display: block;
            margin-bottom: 0.5rem;
          }

          .input-group input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 5px !important;
            transition: border 0.3s;
          }

          .input-group input:focus {
            border-color: #4458b8;
            outline: none;
          }

          .remember-me {
            margin-bottom: 1rem;
            color: #606266;
          }

          button {
            width: 100%;
            padding: 0.5rem;
            border: none;
            border-radius: 5px;
            background: #556ee6;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            transition: background 0.3s, transform 0.3s;
          }

          button:hover {
            background: #4458b8;
          }
        }
      }
    }
  }

  .copyright {
    position: absolute;
    bottom: 20px;
    animation: fadeIn 1s ease-in-out;
    color: #606266;
  }

  :deep(.ant-input) {
    height: 32px;
    font-size: 16px;
    color: #606266;
  }

  :deep(.ant-form-item-label label) {
    color: #606266;
  }
}
</style>