<template>
  <div class="header">
    <button class="header__toggle-menu-btn" type="button" @click="toggleMenu">
      <!-- mdi-light:format-indent-increase -->
      <Icon icon="mdi-light:format-indent-decrease" class="open-icon" />
    </button>
    <div class="header__menu-tab">
      <button
        class="menu-tab"
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: activeTab === tab.name }"
        @click="switchTab(tab.name)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";

export default defineComponent({
  components: { Icon },
  props: {
    tabs: Array,
  },
  emits: ["handleSwitchTab"],
  setup(_, { emit }) {
    function switchTab(name) {
      emit("handleSwitchTab", name);
    }
    return { switchTab };
  },
});
</script>
<style lang="scss" scoped>
.header {
  background-color: #fff;
  height: 60px;
  border-radius: 12px;
  display: flex;
  padding: 0 8px;
  &__toggle-menu-btn {
    border: transparent;
    background: transparent;
    .open-icon {
      font-size: 22px;
      color: #212121;
    }
  }

  &__menu-tab {
    .menu-tab {
      border: transparent;
      background-color: transparent;
    }
  }
}
</style>