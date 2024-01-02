<script>
export default {
  props: {
    maxPage: { type: Number, default: 1, },
    currentPage: { type: Number, default: 1, },
    CallGetData: { type: Function, required: true, },
  },

  methods: {
    SetCurrentPage(val) {
      this.$emit('update:currentPage', val);
    },
    GetData() {
      this.CallGetData();
    },
  },
}
</script>

<template>
  <ul class="pagination pagination-rounded justify-content-center mb-2">
    <li class="page-item" :class="currentPage == 1 ? 'disabled' : ''">
      <a class="page-link" href="javascript:;" aria-label="Previous" @click="SetCurrentPage(1); this.GetData();"
        onclick="event.preventDefault();this.blur()"><i class="mdi mdi-chevron-left"></i></a>
    </li>
    <li class="page-item" v-for="( pg1, pdx ) in  [-3, -2, -1, 0, 1, 2, 3] " :key="'page' + pdx"
      :class="pg1 == 0 ? 'active' : ''" v-show="currentPage + pg1 >= 1 && currentPage + pg1 <= maxPage">
      <a class="page-link" href="javascript:;" @click="SetCurrentPage(currentPage + pg1); this.GetData();"
        onclick="event.preventDefault();this.blur()">{{
          currentPage + pg1 }}</a>
    </li>
    <li class="page-item" :class="currentPage == maxPage ? 'disabled' : ''">
      <a class="page-link" href="javascript:;" aria-label="Next" @click="SetCurrentPage(maxPage); this.GetData();"
        onclick="event.preventDefault();this.blur()"><i class="mdi mdi-chevron-right"></i></a>
    </li>
  </ul>
</template>
