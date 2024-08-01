<template>
  <div class="menu__wrapper">
    <ul>
      <li
        v-for="menu in menuLists"
        :key="menu"
        :class="isActive(menu)"
        @click="handleClickMenuItem(menu)"
      >
        <div class="menu">
          <div class="menu__title">
            <!--  :style="{transform: rotate(180deg);}" -->
            <i :class="`icon bx ${findIcon(menu.url)}`"></i
            ><span>{{ menu.text }}/{{ menu.haveActive }}</span>
          </div>
          <i :class="`arrow-icon mdi mdi-chevron-up`" v-if="menu.children"></i>
        </div>

        <ul class="submenu" v-if="menu.children">
          <li
            class="submenu__title"
            v-for="subMenu in menu.children"
            :key="subMenu"
            @click="handleClickMenuItem(subMenu)"
          >
            {{ subMenu.text }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import { server } from "@/api";
import { menuItems } from "./menu.js";

export default defineComponent({
  setup() {
    const menuLists = ref();
    const activeMenuId = ref();
    // 菜單項目跳轉
    function handleClickMenuItem(menu) {
      window.location = menu.url;
    }

    // 判斷active狀態
    function isActive(subMenu) {
      const currentRouter = window.location.pathname.split("/dev")[1];
      if (currentRouter === subMenu.url) {
        activeMenuId.value = subMenu.id;
        return true;
      } else {
        return false;
      }
    }

    // 尋找對應的icon
    function findIcon(url) {
      const value = menuItems.find((item) => item.key == url);
      return value.icon;
    }

    function setData() {
      console.log("setData", menuLists.value);
      menuLists.value.forEach((menu) => {
        if (menu.children && menu.children.length > 0) {
          menu.children.forEach((children) => {
            children["isActive"] = isActive(children);
            menu["haveActive"] = isActive(children);
          });
        }
      });

      //activeMenuId.value
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
        server.post(url, params).then((res) => {
          menuLists.value = res.data;
          setData();
        });
      }
    });

    return {
      menuLists,
      handleClickMenuItem,
      isActive,
      findIcon,
      setData,
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
      margin: 5px 0;
      padding: 8px 8px 8px 28px;
      height: 100%;
      color: #fff;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 0 30px;
      cursor: pointer;

      &:hover {
        background-color: #3449b1;
      }

      .menu {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 40px;

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

          padding: 0;
          height: 40px;
          width: 100%;
        }
      }
    }

    li.active {
      background-color: #3449b1;
    }
  }
}
</style>
