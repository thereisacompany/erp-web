<template>
  <a-spin
    :indicator="indicator"
    tip="Loading..."
    size="large"
    style="margin-top: 100px"
  />
</template>
<script>
import { defineComponent, h } from "vue";
import { LoadingOutlined } from "@ant-design/icons-vue";
import { Spin } from "ant-design-vue";
export default defineComponent({
  components: {
    ASpin: Spin,
  },
  props: {
    loading: Boolean,
  },
  setup() {
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "58px",
      },
      spin: true,
    });

    return {
      indicator,
    };
  },
});
</script>
