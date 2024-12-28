<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<template>
  <div class="page-header">
    <h3 class="">{{ title }}</h3>
    <slot name="actions"></slot>
  </div>
</template>

<style lang="scss" scoped>
.page-header {
  width: 100%;
  display: flex;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
}
</style>