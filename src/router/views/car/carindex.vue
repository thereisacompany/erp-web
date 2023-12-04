<template>
  <div>

  </div>
</template>>
<script>

export default {
  mounted() {
    this.$router.push(this.$route.query.redirectFrom || { name: "carhome", });
  },

}
</script>
