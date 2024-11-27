import { defineStore } from 'pinia';
import { getAllCustomerList } from "@/api/companyInfoApi.js";

export const useCompanyInfoStore = defineStore('company-info', {
  state: () => ({
    allCustomerList: [] // 客戶列表
  }),
  getters: {
    getAllCustomerList() {
      return this.allCustomerList
    }
  },
  actions: {
    // 串接所有客戶列表api
    async fetchAllCustomer(params) {
      const result = await getAllCustomerList(params);
      this.allCustomerList = result;
    }
  },
});