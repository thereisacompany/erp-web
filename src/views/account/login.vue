<template>
  <div class="login__wrapper">
    <div class="wrapper">
      <div class="wrapper_login-form">
        <div class="header">
          <img src="@/assets/icons/avatar-7.jpg" style="width: 150px" />
        </div>

        <div class="login-form">
          <h1 style="text-align: center; font-size: 36px">登入</h1>
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
    top: -1%;
  }
  to {
    opacity: 1;
    top: 50%;
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login__wrapper {
  height: 100vh;
  // background: linear-gradient(132deg, #fffcfc, #ffcdad);
  background: linear-gradient(
    -45deg,
    #f79f84,
    #ffd078,
    #8bdefc,
    #7cf4d8,
    #f5f5f5
  );
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  color: #606266;
  // background: #f5f5f5;
  .wrapper {
    background: #fff;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
      rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
      rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
    animation: fadeIn 1s ease-in-out;
    min-width: 450px;
    min-height: 400px;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);

    &_login-form {
      width: 100%;
      min-height: 400px;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;

      h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 2rem;
        color: #333;
        font-weight: bold;
      }

      .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 40px;
        height: 100%;
        width: 40%;
      }

      .login-form {
        padding: 1rem 2rem;
        width: 100%;
        .version {
          text-align: end;
          width: 100%;
          display: block;
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
            border-color: #f7a100;
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
            background: #f7a100;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            transition: background 0.3s, transform 0.3s;
          }

          button:hover {
            background: #f77c00;
          }
        }
      }
    }
  }

  .copyright {
    position: absolute;
    bottom: 20px;
    color: #fff;
  }

  :deep(.ant-input) {
    height: 32px;
    font-size: 16px;
    color: #606266;
    padding: 0 12px;
    background: transparent;
  }

  :deep(.ant-form-item-label label) {
    color: #606266;
  }

  :deep(.ant-input-affix-wrapper:focus),
  :deep(.ant-input-affix-wrapper:hover) {
    border-color: #f7a100;
  }

  :deep(.ant-input-affix-wrapper-focused) {
    border-color: #f7a100;
  }
}
</style>