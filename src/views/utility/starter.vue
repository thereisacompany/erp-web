<script>
import Layout from "@/layouts/index.vue";
import PageHeader from "@/components/page-header.vue";
import appConfig from "@/app.config";

/**
 * Starter component
 */
export default {
  page: {
    title: "Starter Page",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Starter Page",
      items: [
        {
          text: "Utility",
          href: "/",
        },
        {
          text: "Starter Page",
          active: true,
        },
      ],
    };
  },
};
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
  </Layout>
</template>