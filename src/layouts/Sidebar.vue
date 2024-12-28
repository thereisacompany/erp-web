<template>
  <div class="side-bar" :class="openSidebar ? 'open' : ''">
    <div class="side-bar__logo">
      <img
        v-if="openSidebar"
        class="logo__open"
        src="@/assets/icons/logo.png"
        alt="logo"
      />
      <img
        v-else
        class="logo__close"
        src="@/assets/icons/jslbear.png"
        alt="logo"
      />
    </div>
    <div class="side-bar__menu">
      <ul>
        <li v-for="menu in menuLists" :key="menu">
          <div
            v-if="openSidebar"
            class="menu"
            @click="handleClickOpenSubmenu(menu)"
            :class="isActive(menu) ? 'active' : ''"
          >
            <div class="menu__item">
              <div class="menu__title">
                <i :class="`icon bx ${menu.icon}`"></i>
                <span>{{ menu.text }}</span>
              </div>

              <i
                :class="
                  activeKey.includes(menu.id)
                    ? `arrow-icon mdi mdi-chevron-down`
                    : `arrow-icon mdi mdi-chevron-up`
                "
                v-if="menu.children && openSidebar"
              ></i>
            </div>
          </div>

          <a-popover placement="right" v-else>
            <template #content>
              <ul class="popover-submenu" v-if="menu.children">
                <li
                  class="popover-submenu__title"
                  v-for="subMenu in menu.children"
                  :key="subMenu"
                  :class="subMenu.isActive ? 'active' : ''"
                  @click="handleClickMenuItem(subMenu)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-linejoin="round"
                      stroke-width="4"
                      d="m20 12l12 12l-12 12z"
                    />
                  </svg>
                  <span>{{ subMenu.text }}</span>
                </li>
              </ul>
              <div
                v-else
                class="popover__title"
                :class="isActive(menu) ? 'active' : ''"
                @click="handleClickOpenSubmenu(menu)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="m20 12l12 12l-12 12z"
                  />
                </svg>
                <span> {{ menu.text }}</span>
              </div>
            </template>
            <div class="menu">
              <div class="menu__item">
                <div class="menu__title">
                  <i :class="`icon bx ${menu.icon}`"></i>
                </div>
              </div>
            </div>
          </a-popover>

          <ul
            class="submenu"
            v-if="menu.children && activeKey.includes(menu.id) && openSidebar"
          >
            <li
              class="submenu__title"
              v-for="subMenu in menu.children"
              :key="subMenu"
              :class="subMenu.isActive ? 'active' : ''"
              @click="handleClickMenuItem(subMenu)"
            >
              <span v-if="openSidebar">{{ subMenu.text }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import { server } from "@/api";
import { Popover } from "ant-design-vue";
import { Icon } from "@iconify/vue";

export default defineComponent({
  props: {
    isOpen: Boolean,
    activeTab: String,
    APopover: Popover,
    Icon,
  },
  setup(props) {
    const menuLists = ref();
    const activeKey = ref([]);
    const isInitialized = ref(true);
    const openSidebar = ref(false);
    // 菜單項目跳轉
    function handleClickMenuItem(menu) {
      window.location = menu.url;
    }

    // 判斷active狀態
    function isActive(subMenu) {
      let currentRouter = "";
      currentRouter = window.location.pathname;
      if (subMenu.url == "/dashboard/analysis" && currentRouter == "/") {
        return true;
      } else {
        return currentRouter === subMenu.url;
      }
    }

    // 點擊開啟submenu
    function handleClickOpenSubmenu(menu) {
      if (!props.isOpen) {
        document.body.classList.remove("vertical-collpsed");
      }
      if (menu.children == undefined) {
        handleClickMenuItem(menu);
      } else {
        if (!activeKey.value.includes(menu.id)) {
          activeKey.value.push(menu.id);
        } else {
          activeKey.value = activeKey.value.filter((id) => id !== menu.id);
        }
      }
    }

    // 初始化
    function setData() {
      menuLists.value.forEach((menu) => {
        if (menu.children && menu.children.length > 0) {
          menu.children.forEach((children) => {
            children["isActive"] = isActive(children);
          });

          menu["haveActive"] = menu.children.some(
            (item) => item.isActive === true
          );

          if (menu.haveActive) activeKey.value.push(menu.id);
        }
      });
    }

    watch(
      () => props.activeTab,
      () => {
        setTimeout(() => {
          setData();
        }, 300);
      }
    );

    watch(
      () => props.isOpen,
      () => {
        openSidebar.value = props.isOpen;
      }
    );

    onMounted(() => {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const userId = user.UserID;
        const url = `/function/findMenuByPNumber`;
        const params = {
          pNumber: 0,
          userId: userId,
        };
        server
          .post(url, params)
          .then((res) => {
            menuLists.value = res.data;
            setData();
          })
          .catch((error) => {
            console.log("error from findMenuByPNumber", error);
            window.location = "/logout";
          });
      }
      openSidebar.value = localStorage.getItem("openSidebar");
    });

    return {
      menuLists,
      handleClickMenuItem,
      isActive,
      setData,
      handleClickOpenSubmenu,
      activeKey,
      isInitialized,
      openSidebar,
    };
  },
});
</script>


<style lang="scss" scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.side-bar {
  position: fixed;
  width: 80px;
  min-height: calc(100vh - 24px);
  height: calc(100% - 24px);
  border-radius: 8px;
  background-color: #3b3b3b;
  padding: 15px 20px;

  .logo__open {
    width: 100%;
    padding: 0 4px;
  }

  .logo__close {
    width: 43px;
  }

  &__menu {
    margin-top: 15px;
    border-radius: 4px;
    .menu.active {
      background-color: #f77b00;
      border-radius: 4px;
    }

    ul {
      margin: 0;
      padding: 0;
      li {
        height: 100%;
        color: #fff;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        cursor: pointer;

        .menu {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 40px;
          margin: 5px 0;
          padding: 8px;
          transition: transform 0.3s ease, background-color 0.3s ease;
          border-radius: 4px;

          &:hover {
            background-color: #f77b00;
            border-radius: 4px;
            transform: scale(1.05);
          }

          &__item {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          &__title {
            display: flex;
            gap: 4px;

            .icon {
              margin-right: 8px;
              font-size: 24px;
              color: #fff;
            }

            span {
              font-size: 16px;
              color: #fff;
            }
          }
        }

        .arrow-icon {
          font-size: 22px;
          color: #fff;
        }

        .submenu {
          margin: 0;
          width: 100%;

          li {
            justify-content: center;
            height: 40px;
            width: 100%;
            padding: 0 0 0 45px;
            margin: 5px 0;
            transition: transform 0.3s ease, background-color 0.3s ease;
            border-radius: 4px;

            &:hover {
              background-color: #f77b00;
              border-radius: 4px;
              transform: scale(1.05);
            }

            span {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              font-size: 15px;
            }
          }
        }
      }

      li.active {
        background-color: #f77b00;
        border-radius: 4px;
        transform: scale(1.05);
      }
    }
  }
}

.open {
  width: 220px;
  // .side-bar__menu {
  //   ul li {
  //     .menu {
  //       &__title span {
  //       }
  //     }
  //   }
  // }
}
</style>


