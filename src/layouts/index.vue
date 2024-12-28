<script>
import { computed, onMounted, ref, watch } from "vue";
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: { Sidebar, Navbar },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isOpen = ref(null);
    // 安全加载 tabs 数据
    let storedTabs;
    try {
      storedTabs = JSON.parse(localStorage.getItem("tabs"));
      if (!Array.isArray(storedTabs)) {
        storedTabs = [];
      }
    } catch {
      storedTabs = [];
    }

    const tabs = ref(storedTabs); // 确保 tabs 是数组
    const activeTab = ref(localStorage.getItem("activeTab") || null);

    // 動態計算緩存的組件
    const cachedComponents = computed(() => tabs.value.map((tab) => tab.name));

    // 開啟新的Tab
    function openTab(name, label = name) {
      if (!tabs.value.some((tab) => tab.name === name)) {
        tabs.value.push({ name, label });
      }
      switchTab(name);
    }

    // 切換Tab
    function switchTab(name) {
      activeTab.value = name;
      router.push({ name });
    }

    // 關閉Tab
    function closeTab(name) {
      const index = tabs.value.findIndex((tab) => tab.name === name);
      if (index !== -1) {
        tabs.value.splice(index, 1);

        if (name === activeTab.value) {
          const nextTab = tabs.value[index] || tabs.value[index - 1];
          if (nextTab) {
            switchTab(nextTab.name);
          } else {
            activeTab.value = null;
            router.push("/"); // 回到默认页
          }
        }
      }
    }

    function handleSwitchTab(name) {
      switchTab(name);
    }

    function handleCloseTab(name) {
      closeTab(name);
    }

    // 切換開關Sidebar
    function handleToggleOpenSidebar() {
      isOpen.value = localStorage.getItem("openSidebar") == "true";
    }

    // 保存 tabs 和 activeTab 到 localStorage
    watch(
      () => tabs.value,
      (newTabs) => localStorage.setItem("tabs", JSON.stringify(newTabs)),
      { deep: true }
    );

    watch(
      () => activeTab.value,
      (newActiveTab) => localStorage.setItem("activeTab", newActiveTab)
    );

    onMounted(() => {
      if (route.name) {
        openTab(route.name, route.meta.label || route.name); // 打开当前路由
      }
    });

    return {
      tabs,
      activeTab,
      cachedComponents,
      openTab,
      closeTab,
      handleSwitchTab,
      handleCloseTab,
      handleToggleOpenSidebar,
      isOpen,
    };
  },
};
</script>

<template>
  <div>
    <div id="layout-wrapper">
      <Sidebar :isOpen="isOpen" :activeTab="activeTab" />
      <Navbar
        :tabs="tabs"
        :activeTab="activeTab"
        @handleSwitchTab="handleSwitchTab"
        @handleCloseTab="handleCloseTab"
        @handleToggleOpenSidebar="handleToggleOpenSidebar"
      />
      <div
        class="wrapper__page-content"
        :style="{
          width: `calc(100% - 36px - ${isOpen ? '220' : '80'}px)`,
          left: `calc(${isOpen ? '220' : '80'}px + 24px)`,
        }"
      >
        <router-view v-slot="{ Component }">
          <div v-if="Component" class="component-layout">
            <keep-alive :include="cachedComponents">
              <component :is="Component" :key="Component.name" />
            </keep-alive>
          </div>
          <div v-else>Component is undefined</div>
        </router-view>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#layout-wrapper {
  display: flex;
  padding: 12px;
  gap: 12px;
  .wrapper {
    &__page-content {
      overflow: auto;
      position: absolute;
      top: 74px;
    }
  }
}

.component-layout {
  width: 100%;
  min-width: 1200px;
  height: calc(100vh - 86px);
  overflow-y: scroll;
  background: #fff;
  border-radius: 8px;
}
</style>
