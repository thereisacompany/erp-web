<template>
  <div
    class="navbar"
    :style="{
      left: `calc( ${openStatus ? '220' : '80'}px + 24px)`,
      width: `calc( 100% - (${openStatus ? '220' : '80'}px + 36px))`,
    }"
  >
    <div class="navbar-content">
      <button
        class="navbar__toggle-menu-btn"
        type="button"
        @click="openStatus = !openStatus"
      >
        <Icon
          :icon="
            openStatus
              ? 'ic:round-format-indent-decrease'
              : 'ic:round-format-indent-increase'
          "
          class="open-icon"
        />
      </button>
      <div class="navbar__menu-tab">
        <button
          class="menu-tab"
          v-for="tab in tabs"
          :key="tab.name"
          :class="{ active: activeTab === tab.name }"
          @click="switchTab(tab.name)"
        >
          <span class="menu-tab__name">
            {{ tab.label }}
          </span>
          <Icon
            icon="material-symbols:close-rounded"
            class="menu-tab__icon"
            @click.stop="handleClose(tab.name)"
          />
        </button>
      </div>
    </div>
    <div class="navbar-content">
      <a-dropdown class="user-dropdown">
        <a class="" @click.prevent>
          <img
            class="user-avatar"
            src="@/assets/images/users/avatar-1.jpg"
            alt="Header Avatar"
          />
          <Icon icon="icon-park-outline:down" style="font-size: 22px" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="/user/changepassword">
                <Icon icon="mdi:password-outline" style="font-size: 20px" />
                <span>修改密碼</span></a
              >
            </a-menu-item>
            <a-menu-item>
              <a href="/logout">
                <Icon icon="ic:round-logout" style="font-size: 20px" />
                <span>登出</span></a
              >
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, watch, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { Dropdown, Menu, MenuItem } from "ant-design-vue";

export default defineComponent({
  components: {
    Icon,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: MenuItem,
  },
  props: {
    tabs: Array,
    activeTab: String,
  },
  emits: ["handleSwitchTab", "handleCloseTab", "handleToggleOpenSidebar"],
  setup(_, { emit }) {
    const openStatus = ref(true);
    function switchTab(name) {
      emit("handleSwitchTab", name);
    }

    function handleClose(name) {
      emit("handleCloseTab", name);
    }

    watch(
      () => openStatus.value,
      () => {
        localStorage.setItem("openSidebar", openStatus.value);
        emit("handleToggleOpenSidebar");
      }
    );

    onMounted(() => {
      openStatus.value = localStorage.getItem("openSidebar") == "true";
      emit("handleToggleOpenSidebar");
    });

    return { switchTab, handleClose, openStatus };
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

.navbar {
  background-color: #fff;
  height: 50px;
  border-radius: 8px;
  display: flex;
  padding: 0 12px;
  position: fixed;
  top: 12px;

  &-content {
    display: flex;

    .user-dropdown {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #383838;
    }
  }

  &__toggle-menu-btn {
    border: transparent;
    background: transparent;
    .open-icon {
      font-size: 22px;
      color: #383838;
    }
  }

  &__menu-tab {
    display: flex;

    .menu-tab {
      display: flex;
      align-items: center;
      gap: 8px;
      border: transparent;
      border-radius: 4px;
      background-color: #f5f5f5;
      margin: 10px 5px;
      padding: 0 8px;
      transition: transform 0.3s ease, background-color 0.3s ease;

      &.active,
      &:hover {
        background-color: #f77b00;
        transform: scale(1.05);

        .menu-tab__name,
        .menu-tab__icon {
          font-size: 15px;
          color: #fff;
        }
      }
      &__name,
      &__icon {
        font-size: 15px;
        color: #636363;
      }
    }
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #f77b00;
    padding: 2px;
  }
}
</style>