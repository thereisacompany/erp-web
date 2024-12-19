import { defineStore } from 'pinia';
import { getAllMemberList, addMember, editMember } from "@/api/companyInfoApi.js";

export const useCompanyInfoStore = defineStore('company-info', {
  state: () => ({
    allCustomerList: [], // 客戶列表
    customerTotal: 0, // 客戶列表總數
  }),
  getters: {
    getAllMemberList() {
      return this.allCustomerList
    },
    getListTotal() {
      return this.customerTotal
    }
  },
  actions: {
    // 客戶列表 or 人事列表
    async fetchAllMember(params) {
      const result = await getAllMemberList(params);
      this.allCustomerList = result.rows;
      this.customerTotal = result.total
    },
    // 新增客戶
    async addMember(data) {
      const result = await addMember(data)
      return result
    },
    // 編輯客戶
    async editMember(data) {
      const result = await editMember(data)
      return result
    },
  },
});