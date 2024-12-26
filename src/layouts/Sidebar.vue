<template>
  <div class="side-bar">
    <div class="side-bar__logo">
      <img src="@/assets/icons/logo.png" alt="logo" />
    </div>
    <div class="side-bar__menu">
      <ul>
        <li v-for="menu in menuLists" :key="menu">
          <div
            class="menu"
            @click="handleClickOpenSubmenu(menu)"
            :class="isActive(menu) ? 'active' : ''"
          >
            <div class="menu__item">
              <div class="menu__title">
                <i :class="`icon bx ${menu.icon}`"></i>
                <span v-if="isOpen">{{ menu.text }}</span>
              </div>
              <i
                :class="
                  activeKey.includes(menu.id)
                    ? `arrow-icon mdi mdi-chevron-down`
                    : `arrow-icon mdi mdi-chevron-up`
                "
                v-if="menu.children && isOpen"
              ></i>
            </div>
          </div>

          <ul
            class="submenu"
            v-if="menu.children && activeKey.includes(menu.id) && isOpen"
          >
            <li
              class="submenu__title"
              v-for="subMenu in menu.children"
              :key="subMenu"
              :class="subMenu.isActive ? 'active' : ''"
              @click="handleClickMenuItem(subMenu)"
            >
              <span v-if="isOpen">{{ subMenu.text }}</span>
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

export default defineComponent({
  props: {
    type: String,
    activeTab: String,
  },
  setup(props) {
    const menuLists = ref();
    const activeKey = ref([]);
    const isOpen = ref(props.type == "open");
    const isInitialized = ref(true);

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
      if (props.type == "close") {
        isOpen.value = true;
        document.body.classList.remove("vertical-collpsed");
      }
      console.log("activeKey", activeKey.value);
      console.log("menu", menu);
      console.log("children", menu.children);
      if (menu.children == undefined) {
        handleClickMenuItem(menu);
      } else {
        if (!activeKey.value.includes(menu.id)) {
          activeKey.value.push(menu.id);
        } else {
          activeKey.value = activeKey.value.filter((id) => id !== menu.id);
        }
      }

      // menu.haveActive = !menu.haveActive;
      // menu.children.forEach((children) => {
      //   console.log("children", children.isActive);
      //   children.isActive = !children.isActive;
      // });
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
            console.log("menuLists", menuLists.value);
            setData();
          })
          .catch((error) => {
            console.log("error from findMenuByPNumber", error);
            window.location = "/logout";
          });
      }
      // console.log("import.meta.env.NODE_ENV", import.meta.env.NODE_ENV);
      // import.meta.env.
    });

    return {
      menuLists,
      handleClickMenuItem,
      isActive,
      setData,
      handleClickOpenSubmenu,
      activeKey,
      isOpen,
      isInitialized,
    };
  },
});
</script>


<style lang="scss" scoped>
.side-bar {
  width: 220px;
  height: calc(100vh - 24px);
  border-radius: 12px;
  background-color: #212121;
  padding: 15px 20px;

  &__logo {
    img {
      width: 100%;
    }
  }
  &__menu {
    margin-top: 15px;

    .menu.active {
      background-color: #383838;
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

          &:hover {
            background-color: #383838;
            border-radius: 4px;
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
            &:hover {
              background-color: #383838;
              border-radius: 4px;
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
        background-color: #383838;
        border-radius: 4px;
      }
    }
  }
}
</style>


