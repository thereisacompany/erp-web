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
  <!-- start page title -->
  <div class="row">
    <div class="col-12">
      <div
        class="page-title-box d-flex align-items-center justify-content-between"
      >
        <h1 class="mb-0 font-size-24">{{ title }}</h1>

        <div class="page-title-right" v-if="items.length > 0">
          <b-breadcrumb :items="items" class="m-0"></b-breadcrumb>
        </div>
        <div v-else>
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
  <!-- end page title -->
</template>
