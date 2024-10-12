<template>
  <div class="menu__wrapper">
    <ul>
      <li
        v-for="menu in menuLists"
        :key="menu"
        :class="isActive(menu) ? 'active' : ''"
      >
        <div class="menu" @click="handleClickOpenSubmenu(menu)">
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
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import { server } from "@/api";
// import { menuItems } from "./menu.js";

export default defineComponent({
  props: {
    type: String,
  },
  setup(props) {
    const menuLists = ref();
    const activeMenuId = ref();
    const activeKey = ref([]);
    const isOpen = ref(props.type == "open");
    // 菜單項目跳轉
    function handleClickMenuItem(menu) {
      console.log("menu", menu.url);
      window.location = menu.url;
    }

    // 判斷active狀態
    function isActive(subMenu) {
      let currentRouter = "";
      currentRouter = window.location.pathname;
      if (currentRouter === subMenu.url) activeMenuId.value = subMenu.id;

      if (subMenu.url == "/dashboard/analysis" && currentRouter == "/") {
        return true;
      } else {
        return currentRouter === subMenu.url;
      }
    }

    // 尋找對應的icon
    // function findIcon(url) {
    //   const value = menuItems.find((item) => item.key == url);
    //   return value.icon;
    // }

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
      // findIcon,
      setData,
      handleClickOpenSubmenu,
      activeKey,
      isOpen,
    };
  },
});
</script>
<style lang="scss" scoped>
.menu__wrapper {
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

        &:hover {
          background-color: #3449b1;
        }

        &__item {
          width: 100%;
          padding: 0 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        &__title {
          display: flex;

          .icon {
            margin-right: 8px;
            font-size: 18px;
            color: #fff;
          }

          span {
            font-size: 15px;
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
          padding: 0 0 0 55px;
          margin: 5px 0;
          &:hover {
            background-color: #3449b1;
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
      background-color: #3449b1;
    }
  }
}
</style>
