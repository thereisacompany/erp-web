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

    // 动态计算需要缓存的组件
    const cachedComponents = computed(() => tabs.value.map((tab) => tab.name));

    // 打开新 Tab
    function openTab(name, label = name) {
      if (!tabs.value.some((tab) => tab.name === name)) {
        tabs.value.push({ name, label });
      }
      switchTab(name);
      console.log("openTab", tabs.value);
    }

    // 切换 Tab
    function switchTab(name) {
      activeTab.value = name;
      router.push({ name });
    }

    // 关闭 Tab
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
      console.log("handleSwitchTab", name);
      switchTab(name);
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

    // 初始化页面
    onMounted(() => {
      console.log("route", route);

      if (route.name) {
        openTab(route.name, route.meta.title || route.name); // 打开当前路由
      }
    });

    return {
      tabs,
      activeTab,
      cachedComponents,
      openTab,
      closeTab,
      handleSwitchTab,
    };
  },
};
</script>

<template>
  <div>
    <div id="layout-wrapper">
      <Sidebar :type="'open'" :activeTab="activeTab" @openNewTab="openNewTab" />
      <div class="wrapper__page-content">
        <Navbar :tabs="tabs" @handleSwitchTab="handleSwitchTab" />
        activeTab/{{ activeTab }} , tabs / {{ tabs }}
        <router-view v-slot="{ Component }">
          <div v-if="Component">
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
      // border: 1px solid red;
      width: calc(100vw - 36px - 220px);
    }
  }
}
</style>
