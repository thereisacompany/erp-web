import { defineStore } from 'pinia';
import { getAllCustomerList, addCustomer, editCustomer } from "@/api/companyInfoApi.js";

export const useCompanyInfoStore = defineStore('company-info', {
  state: () => ({
    allCustomerList: [], // 客戶列表
    customerTotal: 0, // 客戶列表總數
  }),
  getters: {
    getAllCustomerList() {
      return this.allCustomerList
    },
    getCustomerTotal() {
      return this.customerTotal
    }
  },
  actions: {
    // 客戶列表
    async fetchAllCustomer(params) {
      const result = await getAllCustomerList(params);
      this.allCustomerList = result.rows;
      this.customerTotal = result.total
    },
    // 新增客戶
    async addCustomer(data) {
      const result = await addCustomer(data)
      return result
    },
    // 編輯客戶
    async editCustomer(data) {
      const result = await editCustomer(data)
      return result
    }
  },
});