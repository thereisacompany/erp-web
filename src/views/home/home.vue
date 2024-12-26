<script>
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header.vue";

export default {
  page: {
    title: "HOME",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    PageHeader,
  },
  data() {
    return {
      title: "首頁",
      items: [
        {
          text: "Dashboard",
        },
        {
          text: "首頁",
          active: true,
        },
      ],
    };
  },
};
</script>

<template>
  <PageHeader :title="title" :items="items" />
  <div class="row home-page">
    <div class="title">鉅生物流</div>
  </div>
  <!-- end row -->
</template>

<style scoped>
.home-page .title {
  margin-top: 40px;
  font-size: 46px;
  text-align: center;
}
</style>