<template>
  <router-view v-slot="{ Component }">
    <div v-if="Component">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </div>
  </router-view>
</template>
