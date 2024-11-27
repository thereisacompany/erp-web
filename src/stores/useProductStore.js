import { defineStore } from 'pinia';
import { getCategoryList } from "@/api/productApi.js";

export const useProductStore = defineStore('product', {
  state: () => ({
    productCategoryList: [] // 商品類別列表
  }),
  getters: {
    getProductCategoryList() {
      return this.productCategoryList
    }
  },
  actions: {
    // 串接商品類別列表api
    async fetchProductCategory() {
      const result = await getCategoryList();
      console.log('store', result)
      this.productCategoryList = result;
    }
  },
});