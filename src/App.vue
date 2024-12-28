<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#f77b00',
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>
